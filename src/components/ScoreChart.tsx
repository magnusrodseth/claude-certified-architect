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
import { useTheme } from "../hooks/useTheme";

interface Props {
  history: QuizHistory[];
}

export function ScoreChart({ history }: Props) {
  const { colors, theme } = useTheme();

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

  const gradientId = `scoreGradient-${theme}`;

  return (
    <div className="score-chart">
      <h3>Score Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.accent} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: colors.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              fontSize: 12,
              color: colors.text,
            }}
            formatter={(value) => [`${value}%`, "Score"]}
          />
          <ReferenceLine
            y={72}
            stroke={colors.muted}
            strokeDasharray="4 4"
            label={{
              value: "Pass: 72%",
              position: "right",
              fill: colors.muted,
              fontSize: 10,
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={colors.accent}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={payload.score >= 72 ? colors.pass : colors.fail}
                  stroke={colors.bg}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6, stroke: colors.accent, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
