export const validateEmail=(email)=>
{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials=(fullName)=>
{
    if(!fullName) return "";
     const words=fullName.split(" ");
     let initials="";

     for(let i=0;i<Math.min(words.length,2);i++)
     {
        initials+=words[i].charAt(0).toUpperCase();
     }

     return initials;
}

export const addThousandSeparators=(num)=>
{
if(num==null || num==undefined) return "";

const [integerPart,fractionPart]=num.toString().split(".");
const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,",");

return fractionPart ? `${formattedInteger}.${fractionPart}` : formattedInteger;
}

export const prepareExpenseBarChartData=(data={})=>
{
    // data is an object with { total, transactions: [] }
    const transactions = data?.transactions || [];
    
    // Group by category and sum amounts
    const categoryMap = {};
    transactions.forEach(item => {
        if (categoryMap[item.category]) {
            categoryMap[item.category] += item.amount;
        } else {
            categoryMap[item.category] = item.amount;
        }
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(categoryMap).map(category => ({
        category: category,
        amount: categoryMap[category]
    }));
    
    return chartData;
}

export const prepareIncomeBarChartData=(data=[])=> 
{
    // Ensure data is an array
    if (!Array.isArray(data)) {
        console.log('prepareIncomeBarChartData: data is not an array', data);
        return [];
    }

    console.log('prepareIncomeBarChartData: processing', data);

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const chartData = sortedData.map(item => ({
        category: item.source || 'Unknown Source',
        amount: item.amount
    }));
    
    console.log('prepareIncomeBarChartData: chartData', chartData);
    return chartData;
}