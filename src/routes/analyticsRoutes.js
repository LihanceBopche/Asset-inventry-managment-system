const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');

router.get('/descriptive', AnalyticsController.getDepartmentDescriptive);
router.get('/idle-resources', AnalyticsController.getIdleResources);
router.get('/expiring-assets', AnalyticsController.getExpiringAssets);
router.get('/kpis', AnalyticsController.getDashboardKPIs);
router.get('/filter', AnalyticsController.getFilteredAssets);
router.post('/prescriptive-check', AnalyticsController.checkPrescriptiveAllocation);

module.exports = router;
