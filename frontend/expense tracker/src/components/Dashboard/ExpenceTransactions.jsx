import React from 'react'
import { LuArrowRight } from 'react-icons/lu';
import momment from 'moment'
import TransactionInfoCard from '../Cards/TransactionInfoCard.jsx';

const ExpenceTransactions = ({transactions,onSeeMore}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between '>

            <h5 className='text-lg font-medium' > Expanses</h5>
            <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className="text-base"/> </button>
        </div>

        <div className='mt-6'>
            {transactions?.slice(0,5)?.map((expense) => (
                <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={momment(expense.date).format("DD MMM, YYYY")}
                amount={expense.amount}
                type="expense"
                hideDeleteBtn
                />
                
            ))}
        </div>
    </div>
  )
}

export default ExpenceTransactions