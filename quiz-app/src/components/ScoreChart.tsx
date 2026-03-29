import type { QuizHistory } from "../types";

interface Props {
  history: QuizHistory[];
}

export function ScoreChart({ history }: Props) {
  if (history.length < 2) {
    return (
      <div className="score-chart">
        <h3>Score Trend</h3>
        <div className="chart-placeholder">
          Complete {2 - history.length} more {history.length === 1 ? "quiz" : "quizzes"} to see your score trend over time
        </div>
      </div>
    );
  }

  const recent = history.slice(-20);
  const points = recent.map((h, i) => ({
    x: i,
    y: Math.round((h.correct / h.total) * 100),
    date: new Date(h.date).toLocaleDateString(),
    mode: h.mode,
  }));

  const w = 100;
  const h = 40;
  const padX = 2;
  const padY = 4;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const maxX = points.length - 1;

  const toSvg = (i: number, y: number) => ({
    x: padX + (maxX > 0 ? (i / maxX) * innerW : innerW / 2),
    y: padY + innerH - (y / 100) * innerH,
  });

  const passY = toSvg(0, 72).y;

  const pathPoints = points.map((p, i) => {
    const { x, y } = toSvg(i, p.y);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  });
  const linePath = pathPoints.join(" ");

  const areaPath =
    linePath +
    ` L${toSvg(maxX, 0).x},${padY + innerH} L${toSvg(0, 0).x},${padY + innerH} Z`;

  return (
    <div className="score-chart">
      <h3>Score Trend</h3>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {/* Pass line */}
        <line
          x1={padX}
          y1={passY}
          x2={w - padX}
          y2={passY}
          stroke="#444"
          strokeWidth="0.3"
          strokeDasharray="1,1"
        />
        <text
          x={w - padX}
          y={passY - 0.8}
          textAnchor="end"
          fill="#555"
          fontSize="2.5"
        >
          72%
        </text>

        {/* Area fill */}
        <path d={areaPath} fill="rgba(217, 119, 87, 0.1)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {points.map((p, i) => {
          const { x, y } = toSvg(i, p.y);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.8"
              fill={p.y >= 72 ? "var(--green)" : "var(--red)"}
            >
              <title>
                {p.date} ({p.mode}): {p.y}%
              </title>
            </circle>
          );
        })}
      </svg>
      <div className="chart-labels">
        <span>{points[0].date}</span>
        <span>{points[points.length - 1].date}</span>
      </div>
    </div>
  );
}
