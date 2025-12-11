import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../Charts/CustomTooltip.jsx';
import CustomLegend from '../Charts/CustomLegend.jsx';
const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>

        <Tooltip content={CustomTooltip} />
        <Legend  content={CustomLegend}/>

        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fontSize="14px"
              fill="#666"
            >
              {label}
            </text>

            <text
              x="50%"
              y="50%"
              dy={10}
              textAnchor="middle"
              fontSize="24px"
              fill="#333"
              fontWeight="600"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
