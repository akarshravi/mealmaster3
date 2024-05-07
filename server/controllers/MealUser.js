import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Meal from "../models/Meal.js";
dotenv.config();

export const getUserMealDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesGained = await Meal.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesGained: { $sum: "$caloriesGained" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalMeals = await Meal.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesGainedPerMeal =
      totalCaloriesGained.length > 0
        ? totalCaloriesGained[0].totalCaloriesGained / totalMeals
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Meal.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesGained: { $sum: "$caloriesGained" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesGained,
      label: category._id,
    }));

    const weeks = [];
    const caloriesGained = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekMealData = await Meal.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesGained: { $sum: "$caloriesGained" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesGained.push(
        weekMealData[0]?.totalCaloriesGained ? weekMealData[0]?.totalCaloriesGained : 0
      );
    }

    return res.status(200).json({
      totalCaloriesGained:
        totalCaloriesGained.length > 0
          ? totalCaloriesGained[0].totalCaloriesGained
          : 0,
      totalMeals: totalMeals,
      avgCaloriesGainedPerMeal: avgCaloriesGainedPerMeal,
      totalWeeksCaloriesGained: {
        weeks: weeks,
        caloriesGained: caloriesGained,
      },
      pieChartData: pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

export const getMealsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysMeals = await Meal.find({
      userId: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    const totalCaloriesGained = todaysMeals.reduce(
      (total, meal) => total + meal.caloriesGained,
      0
    );

    return res.status(200).json({ todaysMeals, totalCaloriesGained });
  } catch (err) {
    next(err);
  }
};

export const addMeal = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { MealString } = req.body;
      console.log(req.body);
      console.log(MealString);
      if (!MealString) {
        return next(createError(400, "Meal string is missing"));
      }
      
      // Split workoutString into lines
      const eachMeal = MealString.split(";").map((line) => line.trim());
      
      // Check if any workouts start with "#" to indicate categories
      const categories = eachMeal.filter((line) => line.startsWith("#"));
      if (categories.length === 0) {
        return next(createError(400, "No categories found in meal string"));
      }
  
      const parsedMeals = [];
      let currentCategory = "";
      let count = 0;
  
      // Loop through each line to parse workout details
      await eachMeal.forEach((line) => {
        count++;
        if (line.startsWith("#")) {
          const parts = line?.split("\n").map((part) => part.trim());
          if (parts.length < 3) {
            return next(
              createError(400, `Meal string is missing for ${count}th Meal`)
            );
          }
  
          // Update current category
          currentCategory = parts[0].substring(1).trim();
          // Extract workout details
          const mealDetails = parseMealLine(parts);
          if (mealDetails == null) {
            return next(createError(400, "Please enter meal in proper format "));
          }
  
          if (mealDetails) {
            // Add category to workout details
            mealDetails.category = currentCategory;
            parsedMeals.push(mealDetails);
          }
        } else {
          return next(
            createError(400, `Meal string is missing for ${count}th meal`)
          );
        }
      });
      // Calculate calories gained for each meal
      await parsedMeals.forEach(async (meal) => {
        await Meal.create({ ...meal, user: userId });
      });

      return res.status(201).json({
        message: "Meals added successfully",
        meals: parsedMeals,
      });
    } catch (err) {
      next(err);
    }
  };
  
  
  // Function to parse workout details from a line
  const parseMealLine = (parts) => {
    const details = {};
    if (parts.length >= 3) {
      details.MealName = parts[1].substring(1).trim();
      details.description = parts[2].substring(1).trim();
      details.caloriesGained = parseFloat(parts[3].split("kcal")[0].substring(1).trim());
      console.log(details);
      return details;
    }
    return null;
  };
  
  