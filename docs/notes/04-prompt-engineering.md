# Prompt Engineering & Structured Output (20% of Exam)

## 1. Explicit Criteria Over Vague Instructions

### Bad: Vague

> "Check that comments are accurate"

This is ambiguous. What counts as "accurate"? The model will apply inconsistent judgment.

### Good: Explicit

> "Flag any comment where the described behavior contradicts the actual code logic. Specifically check: return values, error conditions, parameter descriptions, and side effects."

### Why This Matters

- Explicit criteria produce consistent results across invocations
- Vague instructions lead to high false positive rates
- **High false positive rates undermine trust** in the accurate categories (if the model cries wolf too often, users ignore all flags)

---

## 2. Few-Shot Examples

Few-shot examples are concrete input-output pairs included in the prompt to guide the model's behavior.

### Purposes

1. **Consistent formatting**: ensure output matches a specific structure
2. **Ambiguous case handling**: show the model how to handle edge cases
3. **Generalization**: demonstrate the pattern so the model applies it to novel inputs

### Reducing Hallucination

Include examples that show correct handling of null/missing data:

```xml
<example>
  <input>Customer: John Smith, Email: null, Phone: +1-555-0123</input>
  <output>
    {
      "name": "John Smith",
      "email": null,
      "phone": "+15550123",
      "status": "partial_record"
    }
  </output>
</example>

<example>
  <input>Customer: , Email: , Phone: </input>
  <output>
    {
      "name": null,
      "email": null,
      "phone": null,
      "status": "empty_record"
    }
  </output>
</example>
```

By showing explicit null-handling examples, you prevent the model from inventing data to fill gaps.

### Standardized Formats

Few-shot examples enforce standardized output formats more reliably than instructions alone:

```xml
<example>
  <input>Date: March 15th, 2024</input>
  <output>2024-03-15</output>
</example>

<example>
  <input>Date: 15/03/2024</input>
  <output>2024-03-15</output>
</example>
```

---

## 3. tool_use with JSON Schemas

### What Schemas Solve

- **Eliminates syntax errors**: output is guaranteed valid JSON matching the schema
- Does **NOT** eliminate semantic errors: the model may still put wrong values in correct fields

### Schema Example

```python
tools = [{
    "name": "classify_ticket",
    "description": "Classify a support ticket by category and priority",
    "input_schema": {
        "type": "object",
        "properties": {
            "category": {
                "type": "string",
                "enum": ["billing", "technical", "account", "other"]
            },
            "priority": {
                "type": "string",
                "enum": ["low", "medium", "high", "critical"]
            },
            "summary": {
                "type": "string",
                "description": "One-sentence summary of the issue"
            }
        },
        "required": ["category", "priority", "summary"]
    }
}]
```

### tool_choice Options (Recap)

| Value | Model Behavior |
|---|---|
| `"auto"` | May or may not use a tool |
| `"any"` | Must call at least one tool |
| `{"type": "tool", "name": "..."}` | Must call the specified tool |

---

## 4. Schema Design Patterns

### Optional (Nullable) Fields

Use nullable fields for data that may not be present:

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "email": {"type": ["string", "null"]},
    "phone": {"type": ["string", "null"]}
  },
  "required": ["name", "email", "phone"]
}
```

All fields are required in the response, but `email` and `phone` can be `null`. This forces the model to explicitly acknowledge missing data instead of hallucinating values.

### Resilient Catch-All Pattern (Extensible Enums)

**Good**: Include "other" with a detail field:

```json
{
  "category": {
    "type": "string",
    "enum": ["billing", "technical", "account", "other"]
  },
  "category_detail": {
    "type": ["string", "null"],
    "description": "If category is 'other', provide a brief description"
  }
}
```

**Bad (Fragile Expansion Anti-Pattern)**: Adding every possible value:

```json
{
  "category": {
    "type": "string",
    "enum": ["billing", "technical", "account", "shipping", "returns", "warranty", "loyalty", "gift_cards", ...]
  }
}
```

The fragile pattern breaks every time a new category appears. The catch-all pattern gracefully handles novel inputs.

### Schema Redundancy for Validation

Include calculated fields alongside stated fields for cross-validation:

```json
{
  "stated_total": {
    "type": "number",
    "description": "The total as stated in the document"
  },
  "calculated_total": {
    "type": "number",
    "description": "The total calculated by summing line items"
  },
  "totals_match": {
    "type": "boolean",
    "description": "Whether stated_total equals calculated_total"
  }
}
```

This enables downstream validation: if `totals_match` is false, the extraction may have errors.

### detected_pattern Field

Include a field for the model to explain its reasoning for systematic analysis:

```json
{
  "classification": "false_positive",
  "detected_pattern": "Comment references legacy behavior that was true before refactor in commit abc123",
  "confidence": 0.85
}
```

The `detected_pattern` field enables systematic false positive analysis across runs.

---

## 5. Retry-with-Error-Feedback

### When It Works

Effective for **format errors**: the model produced output in the wrong format, and the error message tells it exactly what was wrong.

```
Error: Expected ISO-8601 date format (YYYY-MM-DD), got "March 15, 2024"
Please retry with the correct format.
```

### When It Fails

Ineffective for **missing information**: if the source data does not contain the needed information, no amount of retrying will produce it.

```
Error: "customer_email" field is null
Please retry and provide the email.
```

If the email was not in the source document, retrying just wastes tokens or, worse, causes the model to hallucinate a value.

---

## 6. Message Batches API

### Key Properties

| Property | Value |
|---|---|
| **Cost savings** | 50% discount compared to standard API |
| **Processing window** | 24 hours (results available within this time) |
| **Multi-turn tool calling** | Not supported (single-turn only) |
| **Identification** | Each request needs a `custom_id` for matching results |

### When to Use

- Large-scale batch processing (thousands of documents)
- Non-time-sensitive tasks
- Cost optimization is a priority
- Tasks that do not require multi-turn interaction

### Batch Frequency Calculation

Given an SLA constraint (e.g., "results within 24 hours"), calculate how frequently to submit batches:

- If new data arrives continuously: submit batches at intervals that ensure all items are processed within 24 hours
- If data arrives in bursts: batch the entire burst and submit once

---

## 7. Review Patterns

### Self-Review Limitations

The session that generated the output retains its reasoning context. This creates bias:

- The model "knows" what it intended, so it reads correctness into ambiguous output
- It is less likely to catch its own systematic errors
- The retained context makes the model overconfident

### Multi-Pass Review

**Per-file local passes**: review each file independently for file-specific issues (syntax, logic, style, security).

**Cross-file integration pass**: review relationships between files for systemic issues (API contract mismatches, inconsistent types, data flow problems).

### Independent Review Instances

Use a **separate session or subagent** for review instead of self-review. The independent reviewer has no prior context about the intent, so it evaluates the output purely on its merits.

### Confidence-Based Routing

Route items to human review based on model confidence:

```json
{
  "result": "approved",
  "confidence": 0.62,
  "route_to_human": true,
  "reason": "Confidence below 0.80 threshold"
}
```

- High confidence (>0.95): auto-approve
- Medium confidence (0.80-0.95): spot-check
- Low confidence (<0.80): mandatory human review

---

## 8. Temperature

| Value | Behavior | Use Case |
|---|---|---|
| `0` | Deterministic (most likely tokens) | Classification, extraction, code generation |
| `0.5` | Balanced | General-purpose tasks |
| `1` | Creative (more random sampling) | Creative writing, brainstorming |

**Exam tip**: For structured output and classification tasks, use temperature 0. For creative tasks, use higher temperatures.

---

## 9. Response Prefilling + Stop Sequences

### Prefilling

Pre-populate the assistant's response to force a specific format:

```python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "Extract the date from: 'Meeting on March 15'"},
        {"role": "assistant", "content": "{\"date\": \""}
    ],
    stop_sequences=["\"}"]
)
# Response will be just: 2024-03-15
```

### Stop Sequences

Stop generation when a specific string is encountered. Useful for:

- Extracting specific values without trailing text
- Forcing concise responses
- Delimiting structured output

---

## 10. Extended Thinking

### How It Works

- Separate reasoning phase before the main response
- The model "thinks" step by step in a dedicated thinking block
- Minimum **1024 tokens** for the thinking budget
- Thinking content is visible in the API response but can be hidden from users

### When to Use

- **Complex multi-step reasoning** where intermediate steps matter
- **Math and logic** problems requiring explicit calculation
- **Ambiguous inputs** where the model needs to consider multiple interpretations

### Decision Framework

Use **eval-driven decision making**: run the task with and without extended thinking, measure quality, use thinking only when it measurably improves results.

---

## 11. System Prompts

### Purpose

- **Role assignment**: "You are a senior code reviewer specializing in security"
- **Behavior control**: "Always respond in JSON format"
- **Context setting**: "You are reviewing a Python 3.11 codebase using FastAPI"

### Best Practices

- Be clear and direct: use action verbs ("Flag", "Extract", "Classify")
- First line matters most: lead with the most important instruction
- Be specific about what to do AND what not to do

---

## 12. Being Specific: Type A and Type B Guidelines

### Type A: Attribute Guidelines

Define the **qualities** of a good output:

- "The summary should be under 100 words"
- "Use active voice"
- "Include specific numbers, not vague qualifiers"

### Type B: Step-by-Step Guidelines

Define the **process** to follow:

1. "First, identify all function signatures"
2. "Then, check each function for missing type annotations"
3. "Finally, report functions with missing annotations"

**Best practice**: combine both types. Type A defines what "good" looks like; Type B defines how to get there.

---

## 13. XML Tags for Content Structure

XML tags organize complex prompts clearly:

```xml
<instructions>
Classify the following customer message into a category.
</instructions>

<categories>
- billing: Payment, charges, refunds, invoices
- technical: Bugs, errors, feature requests, integrations
- account: Login, permissions, profile, settings
</categories>

<message>
{{customer_message}}
</message>

<output_format>
Respond with a JSON object: {"category": "...", "confidence": 0.0-1.0}
</output_format>
```

Benefits:

- Clear visual separation of prompt components
- Easy to reference specific sections
- Model understands the structure unambiguously

---

## 14. Prompt Evaluation Workflow

### The Cycle

1. **Draft**: write the initial prompt
2. **Dataset**: assemble test inputs with known-correct outputs
3. **Execute**: run the prompt against all test inputs
4. **Grade**: evaluate outputs against expected results
5. **Iterate**: refine the prompt based on grading results

### Grading Methods

**Code-based grading**: programmatic validation

- Syntax validation (is the JSON valid?)
- Schema conformance (does it match the expected structure?)
- Exact match on specific fields
- Regex patterns for format checking

**Model-based grading**: LLM evaluates quality

- Semantic correctness (is the answer factually right?)
- Tone and style assessment
- Completeness evaluation
- Comparison against reference answers

**Best practice**: use both. Code-based for format and structure; model-based for content quality.

---

## 15. AI Fluency: The 4 Ds

### Delegation

Knowing which tasks to assign to AI and how to scope them effectively.

- Break large tasks into smaller, well-defined subtasks
- Provide clear success criteria
- Know when a task is too ambiguous for AI

### Description

Ability to clearly describe what you want in natural language.

- Explicit criteria over vague instructions
- Concrete examples over abstract descriptions
- Specify both what to do and what to avoid

### Discernment

Ability to evaluate AI output quality and catch errors.

- Recognize hallucinations
- Spot logical errors in generated code
- Identify when the model is confidently wrong

### Diligence

Systematic follow-through on verification and iteration.

- Always verify AI output before using it
- Iterate on prompts when results are not satisfactory
- Maintain testing and evaluation practices

---

## 16. Human-AI Interaction Modes

| Mode | Human Role | AI Role | Example |
|---|---|---|---|
| **Automation** | Sets up, then hands off | Executes independently | Batch document processing |
| **Augmentation** | Drives the process | Assists and enhances | Code completion, suggestion |
| **Agency** | Sets goals | Plans and executes with autonomy | Agentic coding, autonomous research |

### Key Differences

- **Automation**: AI runs without human interaction after setup. Human trusts the pipeline.
- **Augmentation**: human is always in the loop, AI provides suggestions. Human makes final decisions.
- **Agency**: AI has significant autonomy but operates within guardrails. Human sets boundaries and reviews outcomes.
