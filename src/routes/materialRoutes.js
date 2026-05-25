const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Admin', 'Manager'), materialController.createMaterial);
router.get('/', materialController.getAllMaterials);
router.get('/export-excel', materialController.exportMaterialsToExcel);
router.post('/issue', authorize('Admin', 'Manager'), materialController.issueMaterial);
router.post('/:id/refill', authorize('Admin', 'Manager'), materialController.refillMaterial);
router.put('/:id', authorize('Admin', 'Manager'), materialController.updateMaterial);
router.delete('/:id', authorize('Admin', 'Manager'), materialController.deleteMaterial);
router.get('/logs', materialController.getLogs);

module.exports = router;
