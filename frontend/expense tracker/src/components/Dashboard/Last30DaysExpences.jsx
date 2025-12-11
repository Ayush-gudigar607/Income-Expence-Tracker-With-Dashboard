import React, { useEffect, useState } from "react";
import { prepareExpenseBarChartData } from "../../utils/helper.js";
import CustomBarChart from "../Charts/CustomBarChart.jsx";

const Last30DaysExpences = ({ transactions = [] }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      {/* ✅ SAFE DATA PASSING */}
      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpences;
