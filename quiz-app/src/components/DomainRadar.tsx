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
  const cx = 50;
  const cy = 50;
  const r = 35;
  const n = LABELS.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, value: number) => {
    const angle = startAngle + i * angleStep;
    const dist = (value / 100) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  const values = LABELS.map(({ key }) => {
    const ds = domainStats[key];
    return ds.total > 0 ? Math.round((ds.mastered / ds.total) * 100) : 0;
  });

  // Grid rings
  const rings = [25, 50, 75, 100];
  const gridPaths = rings.map((pct) => {
    const pts = Array.from({ length: n }, (_, i) => getPoint(i, pct));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  });

  // Axes
  const axes = Array.from({ length: n }, (_, i) => getPoint(i, 100));

  // Data polygon
  const dataPts = values.map((v, i) => getPoint(i, v));
  const dataPath =
    dataPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  // Label positions
  const labelPts = LABELS.map((_, i) => {
    const angle = startAngle + i * angleStep;
    const dist = r + 10;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  });

  return (
    <div className="domain-radar">
      <h3>Domain Mastery Radar</h3>
      <svg viewBox="0 0 100 100">
        {/* Grid */}
        {gridPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#333" strokeWidth="0.3" />
        ))}

        {/* Axes */}
        {axes.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#333"
            strokeWidth="0.2"
          />
        ))}

        {/* Data area */}
        <path d={dataPath} fill="rgba(217, 119, 87, 0.2)" stroke="var(--accent)" strokeWidth="0.6" />

        {/* Data points */}
        {dataPts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.2"
            fill="var(--accent)"
          >
            <title>{LABELS[i].short}: {values[i]}%</title>
          </circle>
        ))}

        {/* Labels */}
        {labelPts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-muted)"
            fontSize="3"
          >
            {LABELS[i].short}
          </text>
        ))}
      </svg>
    </div>
  );
}
