export const BASE_URL="http://localhost:5000/api/v1";

//utils/apiPath.js
export const API_PATHS={
    AUTH:{
        LOGIN:"/auth/login",
        REGISTER:"/auth/register",
        GET_USER_INFO:"/auth/getUser"
    },
    DASHBOARD:{
        GET_DATA:"/dashboard",
    },
    INCOME:{
        ADD_INCOME:"/income/add",
        GET_ALL_INCOME:"/income/get",
        DELETE_INCOME:(incomeId)=>`/income/${incomeId}`,
        DOWNLOAD_INCOME:"/income/downloadExcel"
    },
    EXPENSE:{
        ADD_EXPENSE:"/expence/add",
        GET_ALL_EXPENSE:"/expence/get",
        DELETE_EXPENSE:(expenseId)=>`/expence/${expenseId}`,
        DOWNLOAD_EXPENSE:"/expence/downloadExcel"
    },
    IMAGE:{
        UPLOAD_IMAGE:"/auth/upload-image"
    }
}