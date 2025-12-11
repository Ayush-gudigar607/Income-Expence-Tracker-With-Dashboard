import React, { useEffect, useState } from 'react'
import {LuPlus} from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart.jsx'
import { prepareIncomeBarChartData } from '../../utils/helper.js';



const IncomeOverview = ({transactions,onAddIncome}) => {
    const [charData, setCharData] = useState([])

    useEffect(()=>
    {
        // console.log('IncomeOverview transactions:', transactions);
        const result=prepareIncomeBarChartData(transactions);
        // console.log('prepareIncomeBarChartData result:', result);
        setCharData(result);

        return ()=>
        {
        }
    }, [transactions])
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <div className=''>
                <h5 className='text-lg'>Income Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>Track Your time and analyze your income trends.</p>
                
            </div>

            <button className='add-btn' onClick={onAddIncome}>
                <LuPlus className='text-lg'/> Add Income
            </button>
        </div>
        <div className='mt-10'>
             {charData && charData.length > 0 ? (
                <CustomBarChart data={charData}/>
             ) : (
                <div className="text-center py-8 text-gray-500">No income data available for chart.</div>
             )}
        </div>
    </div>
  )
}

export default IncomeOverview