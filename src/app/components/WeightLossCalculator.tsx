'use client'

import React, { useState, useEffect } from "react";
import { acme, angkor, audiowide, cinzel, honk } from "./fonts";
import Header from "./Header";

interface Results {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dailyCalorieDeficit: number;
  sleepHours: number;
  waterIntake: number;
  mealFrequency: number;
  workoutFrequency: number;
  exerciseSchedule: ExerciseDay[];
  mealPlan: MealPlan[];
}

interface ExerciseDay {
  day: string;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

interface MealPlan {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const WeightLossCalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [desiredLoss, setDesiredLoss] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [results, setResults] = useState<Results | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [visible, setVisibile] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  const calculateNutrition = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    const durationNum = parseInt(duration);
    const desiredLossNum = parseFloat(desiredLoss);

    if (
      isNaN(weightNum) ||
      isNaN(heightNum) ||
      isNaN(ageNum) ||
      isNaN(durationNum) ||
      isNaN(desiredLossNum)
    ) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Apply activity factor
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const tdee = bmr * activityFactors[activityLevel];

    const totalCaloriesDeficit = desiredLossNum * 7700; // 7700 calories per kg of fat
    const dailyCalorieDeficit = totalCaloriesDeficit / (durationNum * 7);

    // Ensure the deficit isn't too extreme (max 25% of TDEE)
    const maxDeficit = tdee * 0.25;
    const safeDeficit = Math.min(dailyCalorieDeficit, maxDeficit);

    const weightLossCalories = Math.round(tdee - safeDeficit);

    // Calculate macronutrients
    const proteinGrams = Math.round(weightNum * 2.2); // 2.2g per kg of body weight
    const fatGrams = Math.round((weightLossCalories * 0.25) / 9); // 25% of calories from fat
    const carbGrams = Math.round(
      (weightLossCalories - (proteinGrams * 4 + fatGrams * 9)) / 4
    );

    const exerciseSchedule: ExerciseDay[] = [
      {
        day: "Monday",
        exercises: [
          { name: "Push-ups", sets: 3, reps: 12, rest: 60 },
          { name: "Squats", sets: 3, reps: 15, rest: 60 },
          { name: "Plank", sets: 3, reps: 30, rest: 45 },
        ],
      },
      {
        day: "Wednesday",
        exercises: [
          { name: "Lunges", sets: 3, reps: 10, rest: 60 },
          { name: "Dumbbell Rows", sets: 3, reps: 12, rest: 60 },
          { name: "Bicycle Crunches", sets: 3, reps: 20, rest: 45 },
        ],
      },
      {
        day: "Friday",
        exercises: [
          { name: "Burpees", sets: 3, reps: 10, rest: 60 },
          { name: "Mountain Climbers", sets: 3, reps: 20, rest: 45 },
          { name: "Russian Twists", sets: 3, reps: 15, rest: 45 },
        ],
      },
    ];

    const mealFrequency = 4; // You can adjust this based on user preference
    const mealPlan: MealPlan[] = [];

    // Calculate macros for each meal
    const caloriesPerMeal = Math.round(weightLossCalories / mealFrequency);
    const proteinPerMeal = Math.round(proteinGrams / mealFrequency);
    const carbsPerMeal = Math.round(carbGrams / mealFrequency);
    const fatPerMeal = Math.round(fatGrams / mealFrequency);

    // Create meal plan
    for (let i = 0; i < mealFrequency; i++) {
      let mealName = "";
      switch (i) {
        case 0:
          mealName = "Breakfast";
          break;
        case 1:
          mealName = "Lunch";
          break;
        case 2:
          mealName = "Dinner";
          break;
        default:
          mealName = `Snack ${i - 2}`;
      }

      mealPlan.push({
        name: mealName,
        calories: caloriesPerMeal,
        protein: proteinPerMeal,
        carbs: carbsPerMeal,
        fat: fatPerMeal,
      });
    }

    // Adjust post-workout meal
    const postWorkoutMealIndex = 2; // Assuming dinner is post-workout
    mealPlan[postWorkoutMealIndex].protein += 5; // Add 5g extra protein
    mealPlan[postWorkoutMealIndex].carbs += 10; // Add 10g extra carbs

    // Adjust other meals to maintain total daily intake
    for (let i = 0; i < mealFrequency; i++) {
      if (i !== postWorkoutMealIndex) {
        mealPlan[i].protein -= Math.round(5 / (mealFrequency - 1));
        mealPlan[i].carbs -= Math.round(10 / (mealFrequency - 1));
      }
    }

    setResults({
      calories: weightLossCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      dailyCalorieDeficit: Math.round(safeDeficit),
      sleepHours: 8,
      waterIntake: Math.round(weightNum * 0.033 * 10) / 10,
      mealFrequency: mealFrequency,
      workoutFrequency: 3,
      exerciseSchedule: exerciseSchedule,
      mealPlan: mealPlan,
    });
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("male");
    setActivityLevel("moderate");
    setDesiredLoss("");
    setDuration("");
    setResults(null);
  };

  if (!mounted) return null;

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-6xl mx-auto transition-colors duration-300">
      <h1 className={`text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white ${honk.className}`}>Slim Bites</h1>
      <Header/>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calculator Column */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Height (cm):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Activity Level:</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="veryActive">Very Active</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Desired Loss (kg):</label>
              <input
                type="number"
                value={desiredLoss}
                onChange={(e) => setDesiredLoss(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className={`block text-gray-700 dark:text-gray-300 mb-2 ${audiowide.className}`}>Duration (weeks):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded text-black dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={calculateNutrition}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-600 rounded transition-colors duration-300"
          >
            Calculate
          </button>
          <button
            onClick={resetForm}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-600 rounded transition-colors duration-300"
          >
            Reset
          </button>
          {/* Results Column */}
        <div className="">
          {results && (
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded animate-fade-in">
              <h2 className={`text-xl font-semibold text-center mb-2 text-green-600 dark:text-green-400 ${angkor.className}`}>Daily Plan</h2>
              <div className='grid grid-cols-2 gap-2'>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Calories = <span className={`text-blue-400 ${cinzel.className}`}>{results.calories}</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Protein = <span className={`text-blue-400 ${cinzel.className}`}>{results.protein}g</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Carbs = <span className={`text-blue-400 ${cinzel.className}`}>{results.carbs}g</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Fat = <span className={`text-blue-400 ${cinzel.className}`}>{results.fat}g</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Calorie Deficit = <span className={`text-blue-400 ${cinzel.className}`}>{results.dailyCalorieDeficit}</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Sleep = <span className={`text-blue-400 ${cinzel.className}`}>{results.sleepHours} hours</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Water Intake = <span className={`text-blue-400 ${cinzel.className}`}>{results.waterIntake} liters</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Meal Frequency = <span className={`text-blue-400 ${cinzel.className}`}>{results.mealFrequency} meals/day</span></p>
                <p className={`text-gray-700 dark:text-gray-300 ${acme.className}`}>Workouts = <span className={`text-blue-400 ${cinzel.className}`}>{results.workoutFrequency} times/week</span></p>
              </div>
              
              <h3 className={`text-xl font-semibold mt-4 mb-2 text-center text-green-600 dark:text-green-400 ${angkor.className}`}>Meal Plan</h3>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-gray-700 dark:text-gray-300">
                    <th className="text-left">Meal</th>
                    <th className={` ${acme.className} `}>Calories</th>
                    <th className={` ${acme.className} `}>Protein (g)</th>
                    <th className={` ${acme.className} `}>Carbs (g)</th>
                    <th className={` ${acme.className} `}>Fat (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.mealPlan.map((meal, index) => (
                    <tr key={index} className="text-gray-600 dark:text-gray-400">
                      <td className={` ${acme.className}`}>{meal.name}</td>
                      <td className={` text-center ${cinzel.className} text-blue-400 `}>{meal.calories}</td>
                      <td className={` text-center ${cinzel.className} text-blue-400 `}>{meal.protein}</td>
                      <td className={` text-center ${cinzel.className} text-blue-400 `}>{meal.carbs}</td>
                      <td className={` text-center ${cinzel.className} text-blue-400 `}>{meal.fat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <p className={`text-sm text-center text-gray-600 dark:text-gray-400 ${acme.className}`}>
                Note: Post-workout meal (usually dinner) has slightly higher protein and carbs to aid recovery.
              </p>

              <h3 className={`text-lg font-semibold mt-4 mb-2 text-center text-green-600 dark:text-green-400 ${angkor.className}`}>Exercise Schedule</h3>
              {results.exerciseSchedule.map((day, index) => (
                <div key={index} className="mb-4">
                  <h4 className={`text-md font-semibold text-gray-700 dark:text-red-400 ${acme.className}`}>{day.day}</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-700 dark:text-gray-400">
                        <th className="text-left">Exercise</th>
                        <th className="">Sets</th>
                        <th className="">Reps</th>
                        <th className="">Rest (sec)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((exercise, exIndex) => (
                        <tr key={exIndex} className="text-gray-600 dark:text-gray-400">
                          <td className={` ${acme.className}`}>{exercise.name}</td>
                          <td className={` text-center ${cinzel.className} text-blue-400`}>{exercise.sets}</td>
                          <td className={` text-center ${cinzel.className} text-blue-400`}>{exercise.reps}</td>
                          <td className={` text-center ${cinzel.className} text-blue-400`}>{exercise.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className={`mt-2 text-sm text-center text-gray-600 dark:text-gray-400 ${acme.className}`}>
                    Remember to drink water between exercises: 200-300ml every 15-20 minutes.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

      </div>
    </div>
  );
};

export default WeightLossCalculator;