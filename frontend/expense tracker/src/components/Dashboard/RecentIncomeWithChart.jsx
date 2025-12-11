import { useEffect, useState } from 'react';
import CustomPieChart from '../Charts/CustomPieChart.jsx';


const RecentIncomeWithChart = ({data,totalIncome}) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData=()=>
    {
        const dataArr=data?.map((item)=>({
            name:item?.source,
            amount:item?.amount
        }));
        setChartData(dataArr);
    }

    useEffect(()=>{
        prepareChartData(); 
        return ()=>
        {}
    },[data])

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];


  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg font-medium'>Last 60 Days Income</h5>
        </div>

        <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        showTextAnchor
        colors={COLORS}
        />
    </div>
  )
}

export default RecentIncomeWithChart