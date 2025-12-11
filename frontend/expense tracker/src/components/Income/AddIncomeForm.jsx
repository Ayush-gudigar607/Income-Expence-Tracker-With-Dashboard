import React, { useState } from 'react'
import Input from '../inputes/Input.jsx';
import EmojiPickerPopup from '../EmojiPickerPopup.jsx';


const AddIncomeForm = ({ onAddIncome }) => {
const [income, setIncome] = useState(
    {
        source:"",
        amount:"",
        date:"",
        icon:""
    }
);

const handleChange=(key,value)=>setIncome({...income,[key]:value});


return (
    <div>

        <EmojiPickerPopup 
        icon={income.icon}
        onSelect={(selectedIcon)=>handleChange("icon", selectedIcon)}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          onAddIncome(income);
          setIncome({ source: "", amount: "", date: "", icon: "" });
        }}
      >
        <Input
          type="text"
          placeholder="Freelance,Salary etc"
          label="Income Source"
          value={income.source}
          onChange={e => handleChange("source", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount"
          label="Amount"
          value={income.amount}
          onChange={e => handleChange("amount", e.target.value)}
        />
        <Input
          type="date"
          label="Date"
          placeholder='Date'
          value={income.date}
          onChange={e => handleChange("date", e.target.value)}
        />
      <div className='flex justify-end mt-6 '>
 <button type="button" className="btn-primary mt-4 w-full" onClick={()=>onAddIncome(income)}>
            Add Income
          </button>
      </div>
        
      </form>
    </div>
  );
};

export default AddIncomeForm