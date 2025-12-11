import React from 'react'
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard.jsx';
import momment from 'moment';

const IncomeList = ({transactions,onDelete,onDownload}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between '>
            <h5 className='text-lg'>Income Sources</h5>
            <button className='card-btn' onClick={onDownload}>
                <LuDownload className='text-base'/> Download
            </button>
        </div>
        <div className='grid grid-col-1 md:grid-colos-2' >
            {transactions.map((income)=>(
                <TransactionInfoCard
                    key={income._id}
                    title={income.source}
                    icon={income.icon}
                    date={momment(income.date).format("DD MMM, YYYY")}
                    amount={income.amount}
                    type="Income"
                    onDelete={()=>onDelete(income._id)}
                />
            ))}
        </div>
    </div>
  )
}

export default IncomeList