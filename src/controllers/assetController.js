const Asset = require('../models/Asset');

exports.createAsset = async (req, res) => {
    try {
        const assetId = await Asset.create(req.body);
        const io = req.app.get('io');
        if (io) io.emit('asset_updated');
        res.status(201).json({ message: 'Asset created successfully', assetId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating asset', error: error.message });
    }
};

exports.getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.getAll();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error: error.message });
    }
};

exports.getAsset = async (req, res) => {
    try {
        const asset = await Asset.getById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching asset', error: error.message });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        await Asset.update(req.params.id, req.body);
        const io = req.app.get('io');
        if (io) io.emit('asset_updated');
        res.json({ message: 'Asset updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating asset', error: error.message });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        await Asset.delete(req.params.id);
        const io = req.app.get('io');
        if (io) io.emit('asset_updated');
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting asset', error: error.message });
    }
};
