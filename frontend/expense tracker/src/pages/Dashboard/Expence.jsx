import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import ExpenseOverview from "../../components/Expense/ExpenseOverview.jsx";
import ExpenseList from "../../components/Expense/ExpenseList.jsx";
import Modal from "../../components/Modal.jsx";
import AddExpenseForm from "../../components/Expense/AddExpenseForm.jsx";
import DeleteAlert from "../../components/DeleteAlert.jsx";
import { toast } from "react-hot-toast";

const Expence = () => {
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Get all expense details
  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
      toast.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Expense category cannot be empty.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount greater than zero.");
      return;
    }

    if (!date) {
      toast.error("Please select a valid date.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount: Number(amount),
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully!");
      fetchExpenseData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully!");
      fetchExpenseData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  // Handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ExpenseData.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Expense data downloaded successfully!");
    } catch (error) {
      console.error("Error downloading expense data:", error);
      toast.error("Failed to download expense data.");
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  return (
    <DashboardLayout activeMenu="Expence">
      <div className="my-5 mx-auto text-center fontsize-lg">
        <div className="grid grid-col-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            loading={loading}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => {
              deleteExpense(openDeleteAlert.data);
              setOpenDeleteAlert({ show: false, data: null });
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expence;