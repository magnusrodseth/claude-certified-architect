export interface Question {
  id: string;
  domain: Domain;
  scenario?: Scenario;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export type Domain =
  | "agentic-architecture"
  | "tool-design-mcp"
  | "claude-code-config"
  | "prompt-engineering"
  | "context-management";

export type Scenario =
  | "customer-support"
  | "code-generation"
  | "multi-agent-research"
  | "developer-productivity"
  | "ci-cd"
  | "structured-data";

export const DOMAIN_LABELS: Record<Domain, string> = {
  "agentic-architecture": "Domain 1: Agentic Architecture & Orchestration",
  "tool-design-mcp": "Domain 2: Tool Design & MCP Integration",
  "claude-code-config": "Domain 3: Claude Code Configuration & Workflows",
  "prompt-engineering": "Domain 4: Prompt Engineering & Structured Output",
  "context-management": "Domain 5: Context Management & Reliability",
};

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  "agentic-architecture": 27,
  "tool-design-mcp": 18,
  "claude-code-config": 20,
  "prompt-engineering": 20,
  "context-management": 15,
};

export const SCENARIO_LABELS: Record<Scenario, string> = {
  "customer-support": "Customer Support Resolution Agent",
  "code-generation": "Code Generation with Claude Code",
  "multi-agent-research": "Multi-Agent Research System",
  "developer-productivity": "Developer Productivity with Claude",
  "ci-cd": "Claude Code for CI/CD",
  "structured-data": "Structured Data Extraction",
};

export interface ShuffledQuestion extends Question {
  shuffledOptions: [string, string, string, string];
  shuffledCorrectIndex: number;
  shuffleMap: number[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number | null>;
  flagged: Set<string>;
  mode: "domain" | "scenario" | "exam" | "review" | "all";
  selectedDomain?: Domain;
  selectedScenario?: Scenario;
  startedAt?: number;
  completedAt?: number;
}

export interface QuizHistory {
  date: number;
  mode: string;
  total: number;
  correct: number;
  domainScores: Record<Domain, { total: number; correct: number }>;
}
