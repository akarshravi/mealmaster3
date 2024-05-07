import {
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  TimelineRounded,
  FastfoodRounded,
  RestaurantMenuRounded,
} from "@mui/icons-material";

export const counts = [
  {
    name: "Calories Burned",
    icon: (
      <LocalFireDepartmentRounded sx={{ color: "inherit", fontSize: "26px" }} />
    ),
    desc: "Total calories burned today",
    key: "totalCaloriesBurnt",
    unit: "kcal",
    color: "#eb9e34",
    lightColor: "#FDF4EA",
  },
  {
    name: "Workouts",
    icon: <FitnessCenterRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total no of workouts for today",
    key: "totalWorkouts",
    unit: "",
    color: "#41C1A6",
    lightColor: "#E8F6F3",
  },
  {
    name: "Average  Calories Burned",
    icon: <TimelineRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Average Calories Burned on each workout",
    key: "avgCaloriesBurntPerWorkout",
    unit: "kcal",
    color: "#FF9AD5",
    lightColor: "#FEF3F9",
  },
];




export const Mealcounts = [
  {
    name: "Calories Gained",
    icon: (
      <FastfoodRounded sx={{ color: "inherit", fontSize: "26px" }} />
    ),
    desc: "Total calories Gained today",
    key: "totalCaloriesGained",
    unit: "kcal",
    color: "#eb9e34",
    lightColor: "#FDF4EA",
  },
  {
    name: "Meals",
    icon: <RestaurantMenuRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total no of meals for today",
    key: "totalMeals",
    unit: "",
    color: "#41C1A6",
    lightColor: "#E8F6F3",
  },
  {
    name: "Average  Calories Gained",
    icon: <TimelineRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Average Calories Gained on each meal",
    key: "avgCaloriesGainedPerMeal",
    unit: "kcal",
  
    color: "#FF9AD5",
    lightColor: "#FEF3F9",
  },
];

