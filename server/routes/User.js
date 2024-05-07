import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
} from "../controllers/User.js";
import {
  addMeal,
  getUserMealDashboard,
  getMealsByDate,
} from "../controllers/MealUser.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/MealDashboard", verifyToken, getUserMealDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
router.get("/meal", verifyToken, getMealsByDate);
router.post("/meal", verifyToken, addMeal);

export default router;
