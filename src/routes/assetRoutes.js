const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', authorize('Admin', 'Manager'), assetController.createAsset);
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAsset);
router.put('/:id', authorize('Admin', 'Manager'), assetController.updateAsset);
router.delete('/:id', authorize('Admin'), assetController.deleteAsset);

module.exports = router;
