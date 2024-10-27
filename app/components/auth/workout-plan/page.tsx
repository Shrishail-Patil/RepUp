"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  name: string;
  duration: string;
  days: WorkoutDay[];
}

// Simulated function to fetch workout plan from database
const fetchWorkoutPlan = (): Promise<WorkoutPlan> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
                {
                name: "90-Day Weight Loss Transformation Plan",
        duration: "90 days",
        days: [
        {
        day: "Monday - Full-Body Workout",
        exercises: [
        { name: "Squats", sets: 3, reps: 12, weight: 70 },
        { name: "Push-ups", sets: 3, reps: 12, weight: 0 },
        { name: "Lunges", sets: 3, reps: 12, weight: 40 },
        { name: "Planks", sets: 3, reps: 30, weight: 0 },
        { name: "Dumbbell Rows", sets: 3, reps: 12, weight: 25 },
        { name: "Bicep Curls", sets: 3, reps: 12, weight: 15 },
        { name: "Tricep Dips (bodyweight)", sets: 3, reps: 12, weight: 0 },
        ]
        },
        {
        day: "Tuesday - Upper Body Workout",
        exercises: [
        { name: "Incline Dumbbell Press", sets: 3, reps: 12, weight: 30 },
        { name: "Chest Flys", sets: 3, reps: 12, weight: 15 },
        { name: "Lat Pulldowns", sets: 3, reps: 12, weight: 25 },
        { name: "Seated Row (cable)", sets: 3, reps: 12, weight: 20 },
        { name: "Shoulder Press (dumbbell)", sets: 3, reps: 12, weight: 15 },
        { name: "Lateral Raises", sets: 3, reps: 12, weight: 10 },
        ]
        },
        {
        day: "Wednesday - Lower Body Workout",
        exercises: [
        { name: "Deadlifts", sets: 3, reps: 12, weight: 55 },
        { name: "Leg Press", sets: 3, reps: 12, weight: 100 },
        { name: "Calf Raises", sets: 3, reps: 12, weight: 20 },
        { name: "Glute Bridges", sets: 3, reps: 12, weight: 0 },
        { name: "Step-Ups", sets: 3, reps: 12, weight: 20 },
        ]
        },
        {
        day: "Thursday - Core Workout",
        exercises: [
        { name: "Russian Twists", sets: 3, reps: 12, weight: 10 },
        { name: "Bicycle Crunches", sets: 3, reps: 12, weight: 0 },
        { name: "Leg Raises", sets: 3, reps: 12, weight: 0 },
        { name: "Plank Jumps", sets: 3, reps: 12, weight: 0 },
        { name: "Side Planks", sets: 3, reps: 30, weight: 0 },
        ]
        },
        {
        day: "Friday - Full-Body Workout",
        exercises: [
        { name: "Burpees", sets: 3, reps: 12, weight: 0 },
        { name: "Mountain Climbers", sets: 3, reps: 30, weight: 0 },
        { name: "Dumbbell Squats", sets: 3, reps: 12, weight: 40 },
        { name: "Push-up Variations (e.g. decline, incline)", sets: 3, reps: 12, weight: 0 },
        { name: "Dumbbell Rows", sets: 3, reps: 12, weight: 25 },
        { name: "Bicep Curls", sets: 3, reps: 12, weight: 15 },
        { name: "Tricep Dips (bodyweight)", sets: 3, reps: 12, weight: 0 },
        ]
        },
        ]
              }
      );
    }, 1000); // Simulate network delay
  });
};

export default function WorkoutPlanPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkoutPlan().then((plan) => {
      setWorkoutPlan(plan);
      setLoading(false);
    });
  }, []);

  const downloadPDF = () => {
    if (!workoutPlan) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(workoutPlan.name, 14, 22);
    doc.setFontSize(12);
    doc.text(`Duration: ${workoutPlan.duration}`, 14, 32);

    let yOffset = 40;
    workoutPlan.days.forEach((day, index) => {
      doc.setFontSize(14);
      doc.text(day.day, 14, yOffset);
      yOffset += 10;

      const tableData = day.exercises.map((exercise) => [
        exercise.name,
        exercise.sets.toString(),
        exercise.reps.toString(),
        exercise.weight.toString(),
      ]);

      doc.autoTable({
        startY: yOffset,
        head: [["Exercise", "Sets", "Reps", "Weight (lbs)"]],
        body: tableData,
      });

      yOffset = (doc as any).lastAutoTable.finalY + 20;

      if (index < workoutPlan.days.length - 1 && yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save("workout-plan.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/components/auth/home"
          className="text-purple-700 hover:text-purple-900 flex items-center"
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-purple-800">Workout Plan</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        {workoutPlan && (
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{workoutPlan.name}</CardTitle>
              <Button onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Duration: {workoutPlan.duration}</p>
              {workoutPlan.days.map((day, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{day.day}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercise</TableHead>
                        <TableHead>Sets</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead>Weight (lbs)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <TableRow key={exerciseIndex}>
                          <TableCell>{exercise.name}</TableCell>
                          <TableCell>{exercise.sets}</TableCell>
                          <TableCell>{exercise.reps}</TableCell>
                          <TableCell>{exercise.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
