import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Try to infer x/y keys if provided data uses different field names
const inferKeys = (sample = {}) => {
  const xCandidates = ["category", "name", "date", "label"];
  const yCandidates = ["amount", "value", "total"];
  const xKey = xCandidates.find((k) => k in sample) || "category";
  const yKey = yCandidates.find((k) => k in sample) || "amount";
  return { xKey, yKey };
};

const CustomLineChart = ({
  data = [],
  color = "#4F46E5",
  strokeWidth = 3,
  xKey: xKeyProp,
  yKey: yKeyProp,
}) => {
  const { xKey, yKey } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { xKey: xKeyProp || "category", yKey: yKeyProp || "amount" };
    }
    const preferredX = xKeyProp || undefined;
    const preferredY = yKeyProp || undefined;
    if (preferredX && preferredY && preferredX in data[0] && preferredY in data[0]) {
      return { xKey: preferredX, yKey: preferredY };
    }
    return inferKeys(data[0]);
  }, [data, xKeyProp, yKeyProp]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={strokeWidth}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
