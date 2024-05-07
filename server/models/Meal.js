import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    MealName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
        type: String,
        required: true,
      },
    caloriesGained: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meal", MealSchema);
