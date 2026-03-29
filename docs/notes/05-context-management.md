# Context Management & Reliability (15% of Exam)

## 1. Tool Context Pruning

When tools return verbose output, prune it on the application side before passing it back to the model.

### Why Prune

- Verbose tool responses consume context window space
- Irrelevant details distract the model from the actual task
- Cost increases with context size

### How to Prune

```python
def prune_tool_response(raw_output, relevant_fields):
    """Filter tool output to only include relevant information."""
    parsed = json.loads(raw_output)
    return {k: v for k, v in parsed.items() if k in relevant_fields}

# Example: database query returns 50 columns, but we only need 3
raw = tool.execute("SELECT * FROM orders WHERE id = 123")
pruned = prune_tool_response(raw, ["order_id", "status", "total"])
```

### Application-Side Filtering

The application (not the model) decides what to filter. This is done in the tool execution layer, before results are sent back to the model as `tool_result` messages.

---

## 2. Long Session Compression

### Strategy

- **Summarize resolved turns**: conversations about issues that have been fixed can be compressed to a brief summary
- **Keep verbatim for active issues**: anything the model is still working on should remain in full detail

### Example

```
# Before compression (20 turns about 3 issues):

Turn 1-5: Debugging auth bug (RESOLVED)
Turn 6-10: Refactoring database layer (RESOLVED)
Turn 11-20: Implementing new API endpoint (IN PROGRESS)

# After compression:

[Summary] Fixed auth bug by updating JWT validation in auth.ts.
[Summary] Refactored database layer to use connection pooling.
Turn 11-20: [Full detail preserved for active work]
```

### Compact Command

In Claude Code, the Compact command triggers conversation summarization. It reduces context length while preserving key information about the current task.

---

## 3. Resuming Async Sessions

When resuming a session after an interruption:

1. **Filter out `tool_result` messages**: stale tool results may no longer be accurate
2. **Force re-fetch**: have the model re-execute tools to get current data
3. **Provide a summary** of where things left off

### Why Filter tool_result Messages

- File contents may have changed since the tool was run
- Database state may have evolved
- External APIs may return different results
- Stale data leads to incorrect decisions

---

## 4. Scratchpad Pattern

For extended sessions, maintain a structured file that the agent reads and writes to preserve key findings.

### Structure

```markdown
# Session Scratchpad

## Architecture Understanding
- Monorepo with 3 packages: api, web, shared
- Database: PostgreSQL with Prisma ORM
- Auth: JWT-based, tokens stored in httpOnly cookies

## Key Findings
- Bug in orders/route.ts: missing null check on line 47
- Performance issue: N+1 query in getOrdersWithItems()
- Security: API key exposed in client-side bundle

## Current Task
Implementing fix for the N+1 query problem

## Completed
- [x] Mapped the full codebase structure
- [x] Identified all critical bugs
- [x] Fixed auth token expiry bug

## Next Steps
- [ ] Fix N+1 query with eager loading
- [ ] Add input validation to POST /orders
- [ ] Write integration tests
```

### Why Use a Scratchpad

- Context compression may lose important details
- The scratchpad persists on disk, surviving any context manipulation
- The agent can re-read the scratchpad after a Compact or resume
- Acts as external memory for the agent

---

## 5. Directed Codebase Exploration

### Strategy

1. **Start broad**: use Glob and Grep to understand project structure
2. **Dynamically generate subtasks**: based on what the exploration reveals
3. **Narrow progressively**: drill into specific files and functions

### Example Flow

```
Step 1: Glob("**/*.ts") → understand file layout
Step 2: Read("package.json") → understand dependencies
Step 3: Grep("export.*function") → find public API surface
Step 4: Read specific files based on findings
Step 5: Generate targeted analysis tasks
```

This is better than randomly reading files because each step informs the next.

---

## 6. Graceful Tool Failure

### Rules

1. **Use `isError` flag**: always return a structured error response
2. **Never throw exceptions**: the model cannot interpret stack traces
3. **Never return empty strings**: indistinguishable from "no data"

### Error Response Structure

```json
{
  "isError": true,
  "errorCategory": "transient",
  "isRetryable": true,
  "message": "Database connection timed out after 5000ms"
}
```

### Success with Empty Results

```json
{
  "isError": false,
  "results": [],
  "message": "No customers found matching query 'xyz123'"
}
```

The model can distinguish "the search worked but found nothing" from "the search failed."

---

## 7. Human-in-the-Loop Calibration

### Field-Level Confidence

Instead of a single confidence score per item, provide confidence per field:

```json
{
  "name": {"value": "John Smith", "confidence": 0.99},
  "email": {"value": "john@example.com", "confidence": 0.95},
  "phone": {"value": "+1-555-0123", "confidence": 0.72},
  "address": {"value": "123 Main St", "confidence": 0.45}
}
```

### Validate Across Segments

Do not just check aggregate accuracy. Validate across different segments:

- Different input types (short vs long documents)
- Different languages or formats
- Edge cases (missing fields, unusual formats)

A model might have 95% aggregate accuracy but only 60% accuracy on a specific segment.

---

## 8. Escalation Patterns

### Honor Immediate Requests

If a customer says "I want to speak to a manager," escalate immediately. Do not try to resolve first.

### Gather Context for Complex Issues

For complex escalations, gather context before handing off:

1. Identify the customer (ID, account details)
2. Understand the root cause
3. Document what has been attempted
4. Prepare a structured summary

### Structured Summary Payload

```json
{
  "customer_id": "C-12345",
  "root_cause": "Duplicate charge on order #98765",
  "amount": 49.99,
  "currency": "USD",
  "recommended_action": "Full refund",
  "attempted_resolutions": [
    "Verified order status: shipped",
    "Confirmed duplicate charge in payment system"
  ],
  "conversation_summary": "Customer noticed two $49.99 charges..."
}
```

---

## 9. API Statelessness

### Core Principle

The Claude API is **stateless**. The server does not remember previous requests. Every API call must include the **entire conversation history**.

### Implementation

```python
# You maintain the conversation history
messages = []

# Turn 1
messages.append({"role": "user", "content": "Hello"})
response = client.messages.create(messages=messages, ...)
messages.append({"role": "assistant", "content": response.content})

# Turn 2: must include ALL previous messages
messages.append({"role": "user", "content": "What did I just say?"})
response = client.messages.create(messages=messages, ...)  # includes turn 1
```

### Multi-Turn Conversation Management

- Maintain a list of messages on the client side
- Append each user message and assistant response
- Send the full list with every API call
- Prune old messages when approaching context limits

---

## 10. Prompt Caching

### What It Does

Prompt caching reuses computational work from previous requests that share the same prefix. Instead of re-processing the entire prompt, the API recognizes cached portions and skips redundant computation.

### TTL (Time to Live)

| Platform | Cache TTL |
|---|---|
| Anthropic API | 1 hour |
| Amazon Bedrock | 5 minutes |

### Cache Breakpoints

- **Minimum 1024 tokens** for a cache breakpoint to be effective
- Up to **4 breakpoints** per request
- Cache is **invalidated by content changes**: if any token before the breakpoint changes, the cache is invalid

### Processing Order

When the API processes a request with tools, the order is:

1. **Tools** (tool definitions)
2. **System prompt**
3. **Messages** (conversation history)

This order matters for caching: tools and system prompt are processed first, so they benefit most from caching (they tend to be stable across requests).

### Caching Strategy

Place stable content early in the request:

```
[Tool definitions]       ← Rarely change, great cache candidates
[System prompt]          ← Usually stable
[Early conversation]     ← Stable once added
[Recent messages]        ← Change every turn, not cached
```

---

## 11. Response Streaming

### SSE (Server-Sent Events)

The API streams responses as SSE events:

```
event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": " world"}}

event: message_stop
data: {"type": "message_stop"}
```

### Key Event Types

| Event | Purpose |
|---|---|
| `message_start` | Response metadata |
| `content_block_start` | New content block begins |
| `content_block_delta` | Incremental text chunk |
| `content_block_stop` | Content block complete |
| `message_stop` | Full response complete |

### content_block_delta

This is the event that delivers actual text content. Each delta contains a small text chunk. Concatenating all deltas in order produces the full response.

---

## 12. Citations

### Types

| Citation Type | Source Format | Location Format |
|---|---|---|
| **Page locations** | PDF documents | Page number + bounding box |
| **Char locations** | Plain text | Start and end character offsets |

### Purpose

Citations enable **source verification**: the user can trace any claim back to the exact location in the source document.

### Usage

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "base64", ...}},
            {"type": "text", "text": "Summarize the key findings with citations"}
        ]
    }]
)
# Response includes citation objects pointing to specific locations
```

---

## 13. Context Window

The context window is the **total information capacity** of a single API call. It includes:

- System prompt
- Tool definitions
- All messages (user, assistant, tool_result)
- The model's response

### Varies by Model

Different models have different context window sizes. Larger windows allow more conversation history but cost more.

### Managing Context

When approaching the limit:

1. Summarize old turns (compression)
2. Remove resolved conversation threads
3. Use the scratchpad pattern for persistent memory
4. Start a new session for unrelated tasks

---

## 14. RAG Pipeline (Retrieval-Augmented Generation)

### Full Pipeline

```
Query → Embedding → Vector Search → Retrieved Chunks → Prompt Assembly → LLM → Response
```

### Steps

1. **Chunking**: split documents into smaller pieces
2. **Embedding**: convert chunks to numerical vectors
3. **Vector storage**: store embeddings in a vector database
4. **Similarity search**: find chunks most similar to the query
5. **Prompt assembly**: combine retrieved chunks with the user's question
6. **LLM generation**: the model answers using the retrieved context

---

## 15. Chunking Strategies

### Size-Based Chunking

Split by fixed token/character count with overlap:

```
Document: [........................................]
Chunk 1:  [===========]
Chunk 2:       [===========]     (overlap)
Chunk 3:            [===========]
```

- **Overlap** ensures that information at chunk boundaries is not lost
- Simple to implement
- May split mid-sentence or mid-paragraph

### Structure-Based Chunking

Split by document structure (headings, paragraphs, sections):

```
# Section 1        → Chunk 1
Paragraph text...

# Section 2        → Chunk 2
Paragraph text...

## Subsection 2.1  → Chunk 3
Paragraph text...
```

- Preserves semantic coherence within chunks
- Chunk sizes vary
- Requires document structure parsing

### Semantic-Based Chunking

Split by meaning, grouping related content:

- Uses embeddings to detect topic boundaries
- Groups semantically similar sentences together
- Most sophisticated, best retrieval quality
- Most expensive to compute

---

## 16. Embeddings

### What They Are

Numerical vectors (arrays of floating-point numbers) that represent the semantic meaning of text. Texts with similar meaning have similar vectors.

### Example

```
"The cat sat on the mat"  → [0.23, -0.41, 0.87, ...]  (1536 dimensions)
"A feline rested on a rug" → [0.21, -0.39, 0.85, ...]  (similar vector)
"The stock market crashed" → [-0.62, 0.13, -0.44, ...]  (very different vector)
```

### Cosine Similarity / Distance

Measures how similar two vectors are:

- **Cosine similarity**: 1.0 = identical, 0.0 = unrelated, -1.0 = opposite
- **Cosine distance**: 1 - cosine_similarity (0.0 = identical, 2.0 = opposite)

Used for vector search: find chunks whose embedding vectors are most similar to the query embedding.

---

## 17. Hybrid Search

Combines vector search with traditional lexical search for better retrieval.

### Components

| Method | Strength | Weakness |
|---|---|---|
| **Vector search** | Semantic similarity (understands meaning) | Misses exact keyword matches |
| **BM25 lexical search** | Exact keyword matching | No semantic understanding |

### Reciprocal Rank Fusion (RRF)

Merges results from both search methods:

```
Score(doc) = Σ 1 / (k + rank_i(doc))
```

Where `rank_i(doc)` is the document's rank in search method `i`, and `k` is a constant (typically 60).

Documents that rank highly in both methods get the highest combined score.

---

## 18. Reranking

After initial retrieval, use an LLM to reorder results by relevance.

### Pipeline with Reranking

```
Query → Initial Retrieval (fast, broad) → Top 50 candidates
      → Reranker (LLM, slow, precise) → Top 5 most relevant
      → Prompt Assembly → LLM → Response
```

### Why Rerank

- Initial retrieval is fast but approximate
- The reranker considers the full context of query + document
- Dramatically improves precision of the final results
- Worth the extra cost for quality-critical applications

---

## 19. Contextual Retrieval

### Problem

Standard chunks lose document context. A chunk saying "Revenue increased 15%" is meaningless without knowing which company or time period.

### Solution

Add document-level context to each chunk **before** embedding:

```
Original chunk:
"Revenue increased 15% year-over-year."

Contextualized chunk:
"[From Acme Corp 2024 Q3 Earnings Report, Section: Financial Highlights]
Revenue increased 15% year-over-year."
```

### Benefits

- Each chunk is self-contained with its context
- Embeddings capture the full meaning
- Retrieval is more accurate
- The model understands what each chunk refers to

---

## 20. Data Evolution Rule

### Amended Fields

When data changes over time, capture multiple values with source and effective date:

```json
{
  "customer_name": {
    "current_value": "Jane Smith",
    "history": [
      {
        "value": "Jane Doe",
        "source": "original_registration",
        "effective_date": "2020-01-15"
      },
      {
        "value": "Jane Smith",
        "source": "name_change_request_#4521",
        "effective_date": "2023-06-01"
      }
    ]
  }
}
```

### Why This Matters

- Audit trails require knowing what the value was at any point in time
- Source attribution enables verification
- Effective dates enable temporal queries ("what was the value on date X?")
- Prevents data loss when values are updated

---

## 21. Summary of Key Reliability Patterns

| Pattern | Purpose | Implementation |
|---|---|---|
| Tool context pruning | Reduce noise in context | Application-side filtering |
| Session compression | Manage long conversations | Summarize resolved, keep active |
| Scratchpad | Persistent external memory | Structured markdown file |
| Graceful tool failure | Reliable error handling | Structured error responses |
| Field-level confidence | Granular quality assessment | Per-field confidence scores |
| Structured escalation | Clean handoffs | JSON payload with key fields |
| Prompt caching | Cost and latency reduction | Stable content first, breakpoints |
| Contextual retrieval | Better RAG accuracy | Add context before embedding |
| Hybrid search | Better retrieval coverage | Vector + BM25 + RRF |
| Reranking | Precision improvement | LLM post-processing of results |
