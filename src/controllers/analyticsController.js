const Asset = require('../models/Asset');

class AnalyticsController {
    static async getDepartmentDescriptive(req, res) {
        try {
            const AssetModel = Asset.getModel();
            const pipeline = [
                { $match: { status: 'Active', department: { $exists: true, $ne: null } } },
                { $group: { _id: "$department", totalAssets: { $sum: 1 }, totalInvestment: { $sum: "$purchasePrice" } } },
                { $project: { department: "$_id", totalAssets: 1, totalInvestment: 1, _id: 0 } },
                { $sort: { totalInvestment: -1 } }
            ];
            const results = await AssetModel.aggregate(pipeline);
            res.json({ success: true, data: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async getIdleResources(req, res) {
        try {
            const AssetModel = Asset.getModel();
            const pipeline = [
                { $match: { status: { $in: ['Idle', 'In-Store'] }, asset_type: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: "$asset_type",
                        idleCount: { $sum: 1 },
                        assets: { $push: { id: "$id", pc_name: "$pc_name", model_name: "$model_name", department: "$department" } }
                    }
                },
                { $project: { assetType: "$_id", idleCount: 1, assets: 1, _id: 0 } },
                { $sort: { idleCount: -1 } }
            ];
            const results = await AssetModel.aggregate(pipeline);
            res.json({ success: true, data: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async getExpiringAssets(req, res) {
        try {
            const AssetModel = Asset.getModel();
            const today = new Date();
            const lookAheadDate = new Date();
            lookAheadDate.setDate(today.getDate() + 30);

            const pipeline = [
                { $match: { purchaseDate: { $exists: true, $ne: null }, warrantyPeriod: { $exists: true, $ne: null } } },
                { $addFields: { expiryDate: { $dateAdd: { startDate: "$purchaseDate", unit: "month", amount: "$warrantyPeriod" } } } },
                { $match: { expiryDate: { $gte: today, $lte: lookAheadDate } } },
                { $project: { id: 1, pc_name: 1, asset_type: 1, purchaseDate: 1, warrantyPeriod: 1, expiryDate: 1, department: 1, status: 1 } },
                { $sort: { expiryDate: 1 } }
            ];
            const results = await AssetModel.aggregate(pipeline);
            res.json({ success: true, data: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async getDashboardKPIs(req, res) {
        try {
            const AssetModel = Asset.getModel();
            const totalInvestmentResult = await AssetModel.aggregate([{ $group: { _id: null, totalValue: { $sum: "$purchasePrice" } } }]);
            const totalInvestment = totalInvestmentResult.length > 0 ? totalInvestmentResult[0].totalValue : 0;

            const countsResult = await AssetModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
            let statusCounts = { Active: 0, "In-Store": 0, "In-Repair": 0, Repair: 0, Scrap: 0 };
            countsResult.forEach(c => {
                if (statusCounts[c._id] !== undefined) statusCounts[c._id] = c.count;
            });

            const today = new Date();
            const lookAheadDate = new Date();
            lookAheadDate.setDate(today.getDate() + 30);
            const expiringCountResult = await AssetModel.aggregate([
                { $match: { purchaseDate: { $exists: true, $ne: null }, warrantyPeriod: { $exists: true, $ne: null } } },
                { $addFields: { expiryDate: { $dateAdd: { startDate: "$purchaseDate", unit: "month", amount: "$warrantyPeriod" } } } },
                { $match: { expiryDate: { $gte: today, $lte: lookAheadDate } } },
                { $count: "pendingExpiry" }
            ]);
            const pendingExpiryCount = expiringCountResult.length > 0 ? expiringCountResult[0].pendingExpiry : 0;

            const deptExpenditures = await AssetModel.aggregate([
                { $match: { department: { $exists: true, $ne: null } } },
                { $group: { _id: "$department", totalCost: { $sum: "$purchasePrice" } } },
                { $project: { department: "$_id", totalCost: 1, _id: 0 } }
            ]);

            res.json({
                success: true,
                data: {
                    totalInvestment,
                    activeAssets: statusCounts.Active || 0,
                    idleAssets: statusCounts["In-Store"] || 0,
                    pendingExpiryCount,
                    statusCounts,
                    deptExpenditures
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async getFilteredAssets(req, res) {
        try {
            const { status, department, search = '' } = req.query;
            const AssetModel = Asset.getModel();
            let query = {};

            if (status) query.status = status;
            if (department) query.department = department;
            if (search) {
                query.$or = [
                    { pc_name: new RegExp(search, 'i') },
                    { model_name: new RegExp(search, 'i') },
                    { serial_no: new RegExp(search, 'i') }
                ];
            }

            const results = await AssetModel.find(query).lean();
            res.json({ success: true, count: results.length, data: results });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async checkPrescriptiveAllocation(req, res) {
        try {
            const { requestedModel } = req.body;
            if (!requestedModel) return res.status(400).json({ success: false, message: "Model name required" });

            const AssetModel = Asset.getModel();
            const idleMatches = await AssetModel.find({
                status: { $in: ['Idle', 'In-Store'] },
                $or: [
                    { model_name: new RegExp(requestedModel, 'i') },
                    { asset_type: new RegExp(requestedModel, 'i') }
                ]
            }).lean();

            if (idleMatches.length > 0) {
                res.json({
                    success: true, recommendation: 'CROSS_TRANSFER',
                    message: "Identical/Similar idle inventory available. Recommend internal transfer.",
                    data: idleMatches
                });
            } else {
                res.json({ success: true, recommendation: 'PURCHASE_ORDER', message: "No idle inventory found. Proceed with PO." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}
module.exports = AnalyticsController;
