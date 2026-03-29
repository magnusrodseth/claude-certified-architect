import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
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
          Complete {2 - history.length} more{" "}
          {history.length === 1 ? "quiz" : "quizzes"} to see your score trend
        </div>
      </div>
    );
  }

  const data = history.slice(-20).map((h) => ({
    date: new Date(h.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: Math.round((h.correct / h.total) * 100),
    mode: h.mode,
  }));

  return (
    <div className="score-chart">
      <h3>Score Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97757" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d97757" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#a8a29e", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#a8a29e", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "#242424",
              border: "1px solid #333",
              borderRadius: 8,
              fontSize: 12,
              color: "#f5f5f4",
            }}
            formatter={(value) => [`${value}%`, "Score"]}
          />
          <ReferenceLine
            y={72}
            stroke="#555"
            strokeDasharray="4 4"
            label={{
              value: "Pass: 72%",
              position: "right",
              fill: "#555",
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#d97757"
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.score >= 72 ? "#4ade80" : "#f87171"}
                  stroke="#1a1a1a"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6, stroke: "#d97757", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
