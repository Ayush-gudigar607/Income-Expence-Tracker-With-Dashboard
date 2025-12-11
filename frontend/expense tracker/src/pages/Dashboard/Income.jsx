import  React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { data } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import IncomeOverview from "../../components/Income/IncomeOverview.jsx";
import Modal from "../../components/Modal.jsx";
import AddIncomeForm from "../../components/Income/AddIncomeForm.jsx";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList.jsx";
import DeleteAlert from "../../components/DeleteAlert.jsx";

const Income = () => {
  
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  //Get all incoming details
  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      
      if (response.data) {
        setIncomeData(Array.isArray(response.data) ? response.data : (response.data.incomes || []));
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
      toast.error("Failed to load income data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Handle Add Income
  const handleAddIncome = async (income) => {
    const {source, amount, date, icon} = income;

       //Validation Checks
    if(!source.trim())
    {
      toast.error("Income source cannot be empty.");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount)<=0)
    {
      toast.error("Please enter a valid amount greater than zero.");
      return;
    }
    if(!date) 
    {
      toast.error("Please select a valid date.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount: Number(amount),
        date,
        icon,
      });

      setOpenAddIncomeModal(false);
      toast.success("Income added successfully!");
      fetchIncomeData();
    
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income. Please try again.");
    }

 
    

  };

  //Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({show:false,data:null});
      toast.success("Income deleted successfully!");
      fetchIncomeData();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income. Please try again.");
    }

  };

  //handle dowload income details
 const handleDowloadIncomeDetails = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.INCOME.DOWNLOAD_INCOME,
      { responseType: 'arraybuffer' }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "IncomeData.xlsx";
    link.click();

    window.URL.revokeObjectURL(url);
    toast.success("Income data downloaded successfully!");
  } catch (error) {
    console.error("Error downloading income data:", error);
    toast.error("Failed to download income data.");
  }
};


  useEffect(() => {
    fetchIncomeData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto text-center fontsize-lg">
        <div className="grid grid-col-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

  <IncomeList 
    transactions={incomeData}
    loading={loading}
    onDelete={(id) => {setOpenDeleteAlert({show:true,data:id})}}
    onDownload={handleDowloadIncomeDetails}
  />
  
</div>
        {/* Income page content goes here */}

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={()=>setOpenDeleteAlert({show:false,data:null})}
        title="Delete Income"
      >
        <DeleteAlert
        content="Are you sure you want to delete this income source?"
        onDelete={()=>{
          deleteIncome(openDeleteAlert.data);
          setOpenDeleteAlert({show:false,data:null});
        }}
        />

        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
