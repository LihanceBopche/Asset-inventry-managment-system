const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/racks', locationController.getRacks);
router.get('/columns/:rackId', locationController.getColumnsByRack);
router.get('/parts/:colId', locationController.getPartsByColumn);

module.exports = router;
