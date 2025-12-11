import React, {useState} from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout.jsx'
import { UseUserAuth } from '../../hooks/UseUserAuth.jsx'
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPath.js';
import { useEffect } from 'react';
import {LuHandCoins,LuWalletMinimal} from 'react-icons/lu'
import {IoCard} from 'react-icons/io5'
import InfoCard from '../../components/Cards/InfoCard.jsx';
import { addThousandSeparators } from '../../utils/helper.js';
import RecentTransactions from '../../components/Dashboard/RecentTransactions.jsx';
import { useNavigate } from 'react-router-dom';
import FinalOverview from '../../components/Dashboard/FinalOverview.jsx';
import ExpenceTransactions from '../../components/Dashboard/ExpenceTransactions.jsx';
import Last30DaysExpences from '../../components/Dashboard/Last30DaysExpences.jsx';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart.jsx';
import RecentIncome from '../../components/Dashboard/RecentIncome.jsx';

const Home = () => {
 UseUserAuth();

 const navigate = useNavigate();

 const [dashboardData, setDashboardData] = useState(null);
 const [loading, setLoading] = useState(false);

 const fetchDashboardData = async () => {
   setLoading(true);
   try {
    const responce=await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

    if(responce.data)
    {
      setDashboardData(responce.data);
    }
   } catch (error) {
    console.error("Error fetching dashboard data:", error);
   }
   finally
   {
    setLoading(false);
   }
 }

 useEffect(() => {
  
 fetchDashboardData();
   return () => {
     
   }
 }, [])
 
  return (
    <DashboardLayout activeMenu="Dashboard">

       <div className='my-5 mx-auto '>
        <div className='grid grid-col-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoCard />}
            label="Total Balance"
            value={addThousandSeparators((dashboardData?.totalIncome || 0) - (dashboardData?.totalExpence || 0))}
            color="bg-blue-500"
            />

             <InfoCard
            icon={<LuHandCoins/>}
            label="Total Income"
            value={addThousandSeparators(dashboardData?.totalIncome || 0)}
            color="bg-green-500"
            />

             <InfoCard
            icon={<LuWalletMinimal/>}
            label="Total Expenses"
            value={addThousandSeparators(dashboardData?.totalExpence || 0)}
            color="bg-red-500"
            />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions transactions={dashboardData?.recenttransaction}
          onSeeMore={()=>navigate("/expence")}
          />

          <FinalOverview totalBalance={(dashboardData?.totalIncome || 0) - (dashboardData?.totalExpence || 0)}
          totalIncome={dashboardData?.totalIncome || 0}
          totalExpence={dashboardData?.totalExpence || 0}
          />

          <ExpenceTransactions transactions={dashboardData?.recenttransaction || []} onSeeMore={()=>navigate("/expence")}/>
          <Last30DaysExpences transactions={dashboardData?.last30DaysExpenses || []} />

<RecentIncomeWithChart 
data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
  totalIncome={dashboardData?.totalIncome || 0}
  />

  <RecentIncome 
  transactions={dashboardData?.last60DaysIncome?.transactions || [] }
  onSeeMore={()=>navigate("/income")}
  />

        </div>
       </div>
    </DashboardLayout>
  )
}

export default Home