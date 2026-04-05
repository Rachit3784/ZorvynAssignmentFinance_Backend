import Transaction from "../model/TransactionSchema.js";

export const getSummary = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            { 
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        result.forEach(item => {
            if (item._id === 'income') totalIncome += item.totalAmount;
            if (item._id === 'expense') totalExpense += item.totalAmount;
        });

        res.status(200).json({
            success: true,
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching summary", error: error.message });
    }
};

export const getCategoryBreakdown = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { isDeleted: { $ne: true }, type: 'expense' } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        const categories = result.map(item => ({
            name: item._id || 'Others',
            value: item.totalAmount
        }));

        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching category breakdown", error: error.message });
    }
};

export const getMonthlyTrend = async (req, res) => {
    try {
        // Last 6 months trend
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const result = await Transaction.aggregate([
            { $match: { isDeleted: { $ne: true }, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { 
                        month: { $month: "$createdAt" }, 
                        year: { $year: "$createdAt" } 
                    },
                    income: { 
                        $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } 
                    },
                    expense: { 
                        $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } 
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const trend = result.map(item => ({
            name: `${months[item._id.month - 1]} ${item._id.year}`,
            income: item.income,
            expense: item.expense
        }));

        res.status(200).json({ success: true, trend });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching monthly trend", error: error.message });
    }
};

export const getRecentTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name');

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recent transactions", error: error.message });
    }
};
