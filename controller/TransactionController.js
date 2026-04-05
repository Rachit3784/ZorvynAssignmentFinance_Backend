import Transaction from "../model/TransactionSchema.js";

export const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, description } = req.body;
        
        const newTx = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            category,
            description
        });

        res.status(201).json({ success: true, message: "Transaction created successfully", transaction: newTx });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating transaction", error: error.message });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, search } = req.query;
        let filter = { isDeleted: { $ne: true } };

        // If not admin, maybe restrict to their own data? But assignment says:
        // Analyst: "Can view records and access insights". Admin: "Can manage". Viewer: "Only view dashboards".
        // Let's assume Analyst and Admin can view all records for dashboard purposes. 
        // Viewer can't see the full record list directly? Wait, "Viewer: Can only view dashboard data" means they only see aggregate.
        // Wait, "Viewer should not be able to create or modify records". Maybe they can see records?
        // Let's just return all not-deleted for now, role guard will control access.

        if (type) filter.type = type;
        if (category) filter.category = category;
        
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTx = await Transaction.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedTx) return res.status(404).json({ success: false, message: "Transaction not found" });

        res.status(200).json({ success: true, message: "Transaction updated", transaction: updatedTx });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating transaction", error: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const tx = await Transaction.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            { new: true }
        );

        if (!tx) return res.status(404).json({ success: false, message: "Transaction not found" });

        res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting transaction", error: error.message });
    }
};
