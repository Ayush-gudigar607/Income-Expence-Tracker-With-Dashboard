import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart.jsx';
const COLOURS=["#875CF5","#FA2C37","#FF6900"];


const FinalOverview = ({totalBalance,totalIncome,totalExpence}) => {

    const balanceData=[
        {name:"Total Balance",amount:totalBalance},
        {name:"Total Income",amount:totalIncome},
        {name:"Total Expense",amount:totalExpence}
    ];

  return <div className='card'>
    <div className='flex items-center justify-between'>
        <h5 className='text-lg '>Final Overview</h5>
    </div>

    <CustomPieChart 
    data={balanceData}
    label="Total  Balance"
    totalAmount={`$${totalBalance}`}
    colors={COLOURS}
    showTextAnchor
/>
  </div>
}

export default FinalOverview