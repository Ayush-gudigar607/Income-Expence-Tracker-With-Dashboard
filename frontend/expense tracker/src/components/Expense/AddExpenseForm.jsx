import React, { useState } from 'react'
import Input from '../inputes/Input.jsx';
import EmojiPickerPopup from '../EmojiPickerPopup.jsx';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "💸"
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div>
      <EmojiPickerPopup 
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <form
        onSubmit={e => {
          e.preventDefault();
          onAddExpense(expense);
          setExpense({ category: "", amount: "", date: "", icon: "💸" });
        }}
      >
        <Input
          type="text"
          placeholder="Food, Transport, Shopping etc"
          label="Expense Category"
          value={expense.category}
          onChange={e => handleChange("category", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount"
          label="Amount"
          value={expense.amount}
          onChange={e => handleChange("amount", e.target.value)}
        />
        <Input
          type="date"
          label="Date"
          placeholder='Date'
          value={expense.date}
          onChange={e => handleChange("date", e.target.value)}
        />
        <div className='flex justify-end mt-6'>
          <button type="button" className="btn-primary mt-4 w-full" onClick={() => onAddExpense(expense)}>
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm
