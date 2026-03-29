import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import type { Domain } from "../types";

interface DomainStat {
  total: number;
  seen: number;
  mastered: number;
  weak: number;
}

interface Props {
  domainStats: Record<Domain, DomainStat>;
}

const LABELS: { key: Domain; short: string }[] = [
  { key: "agentic-architecture", short: "Agentic" },
  { key: "tool-design-mcp", short: "Tools/MCP" },
  { key: "claude-code-config", short: "Claude Code" },
  { key: "prompt-engineering", short: "Prompts" },
  { key: "context-management", short: "Context" },
];

export function DomainRadar({ domainStats }: Props) {
  const data = LABELS.map(({ key, short }) => {
    const ds = domainStats[key];
    return {
      domain: short,
      mastery: ds.total > 0 ? Math.round((ds.mastered / ds.total) * 100) : 0,
      seen: ds.total > 0 ? Math.round((ds.seen / ds.total) * 100) : 0,
    };
  });

  return (
    <div className="domain-radar">
      <h3>Domain Mastery Radar</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#333" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: "#a8a29e", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "#242424",
              border: "1px solid #333",
              borderRadius: 8,
              fontSize: 12,
              color: "#f5f5f4",
            }}
            formatter={(value, name) => [
              `${value}%`,
              name === "mastery" ? "Mastered" : "Seen",
            ]}
          />
          <Radar
            name="seen"
            dataKey="seen"
            stroke="#555"
            fill="#444"
            fillOpacity={0.3}
          />
          <Radar
            name="mastery"
            dataKey="mastery"
            stroke="#d97757"
            fill="#d97757"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
