import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { prepareExpenseBarChartData } from '../../utils/helper.js';
import CustomLineChart from '../Charts/CustomLineChart.jsx';

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const result = prepareExpenseBarChartData({ transactions });
    setChartData(result);
  }, [transactions])

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <div>
          <h5 className='text-lg'>Expense Overview</h5>
          <p className='text-xs text-gray-400 mt-0.5'>Track your expenses and analyze spending patterns.</p>
        </div>

        <button className='add-btn' onClick={onAddExpense}>
          <LuPlus className='text-lg' /> Add Expense
        </button>
      </div>
      <div className='mt-10'>
        {chartData && chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <div className="text-center py-8 text-gray-500">No expense data available for chart.</div>
        )}
      </div>
    </div>
  )
}

export default ExpenseOverview
