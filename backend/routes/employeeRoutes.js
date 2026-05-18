const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all employee routes
router.use(protect);

router.get('/search', searchEmployees);

router
  .route('/')
  .get(getEmployees)
  .post(createEmployee);

router
  .route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
