import express from 'express';
import { 
  createSpecification, 
  deleteSpecification, 
  updateSpecification, 
  getSpecification, 
  getAllSpecifications,
  deleteParameter,
  updateParameter,
  addParameter,
  getParameter
} from '../controllers/specificationController.js';

const router = express.Router();

// Route to create a specification (POST)
router.post('/createSpecification', createSpecification);

// Route to get a single specification by ID (GET)
router.get('/getSpecification/:id', getSpecification); // Added `:id` for fetching by ID

// Route to update a specification by ID (PUT)
router.put('/updateSpecification/:id', updateSpecification); // Added `:id` for updating by ID

// Route to delete a specification by ID (DELETE)
router.delete('/deleteSpecification/:id', deleteSpecification); // Added `:id` for deleting by ID

// Route to get all specifications (GET)
router.get('/getAllSpecifications', getAllSpecifications); // Pluralized route
router.get("/getParameter/:id",getParameter)
router.post("/addParameter/:id",addParameter)
router.delete('/deleteParameter/:id', deleteParameter);
router.put('/updateParameter/:id', updateParameter);

export default router;
