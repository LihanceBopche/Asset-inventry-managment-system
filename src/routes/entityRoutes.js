const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Department Routes
router.get('/departments', entityController.getDepartments);
router.post('/departments', authorize('Admin'), entityController.createDepartment);
router.put('/departments/:id', authorize('Admin'), entityController.updateDepartment);
router.delete('/departments/:id', authorize('Admin'), entityController.deleteDepartment);

// Employee Routes
router.get('/employees', entityController.getEmployees);
router.post('/employees', authorize('Admin'), entityController.createEmployee);
router.put('/employees/:id', authorize('Admin'), entityController.updateEmployee);
router.delete('/employees/:id', authorize('Admin'), entityController.deleteEmployee);

module.exports = router;
