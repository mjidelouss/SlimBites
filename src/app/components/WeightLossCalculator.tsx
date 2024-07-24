"use client";

import React, { useState, useEffect } from 'react';
import { acme, angkor, audiowide, cinzel, honk } from './fonts';
import Header from './Header';

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
}

const WeightLossCalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [desiredLoss, setDesiredLoss] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [results, setResults] = useState<Results | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  const calculateNutrition = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    const durationNum = parseInt(duration);
    const desiredLossNum = parseFloat(desiredLoss);
    
    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum) || isNaN(durationNum) || isNaN(desiredLossNum)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Apply activity factor
    const activityFactors: {[key: string]: number} = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
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
    const carbGrams = Math.round((weightLossCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

    setResults({
      calories: weightLossCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      dailyCalorieDeficit: Math.round(safeDeficit),
      sleepHours: 8,
      waterIntake: Math.round(weightNum * 0.033 * 10) / 10, // 33ml per kg of body weight, rounded to 1 decimal
      mealFrequency: 4,
      workoutFrequency: 5
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
    <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors duration-300">
      <h1 className={`text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white ${honk.className}`}>Slim Bites</h1>
      <Header/>
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
      {results && (
        <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded animate-fade-in">
          <h2 className={`text-xl font-semibold text-center mb-2 text-gray-800 dark:text-white ${angkor.className}`}>Daily Plan:</h2>
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
        </div>
      )}
    </div>
  );
};

export default WeightLossCalculator;