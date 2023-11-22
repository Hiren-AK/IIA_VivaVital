//userroutes.js
// ES6 Module Syntax
import express from 'express';
import { registerUser, loginUser, insertDemographics, editDemographics, getDemographics, getRecipes } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demographics', insertDemographics);
router.post('/editdemographics', editDemographics);
router.post('/getdemo', getDemographics);
router.get('/recipes', getRecipes); // New route for fetching recipes


export default router;
