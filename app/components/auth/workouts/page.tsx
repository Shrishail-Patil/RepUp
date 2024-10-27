"use client";

import { Fragment } from "react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, ChevronDown, ChevronUp, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: number;
  date: string;
  name: string;
  duration: string;
  exercises: Exercise[];
}

// Mock data for previous workouts
const previousWorkouts: Workout[] = [
  {
    id: 1,
    date: "2024-02-20",
    name: "Full Body Workout",
    duration: "60 min",
    exercises: [
      { name: "Squats", sets: 3, reps: 10, weight: 100 },
      { name: "Bench Press", sets: 3, reps: 8, weight: 150 },
      { name: "Deadlifts", sets: 3, reps: 5, weight: 200 },
    ],
  },
  {
    id: 2,
    date: "2024-02-18",
    name: "Upper Body Focus",
    duration: "45 min",
    exercises: [
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
      { name: "Shoulder Press", sets: 3, reps: 10, weight: 80 },
      { name: "Bicep Curls", sets: 3, reps: 12, weight: 30 },
    ],
  },
];

export default function WorkoutTrackingPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(previousWorkouts);
  const [newWorkout, setNewWorkout] = useState<Workout>({
    id: 0,
    date: "",
    name: "",
    duration: "",
    exercises: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = () => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: 0, reps: 0, weight: 0 }],
    }));
  };

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string
  ) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === index
          ? { ...ex, [field]: field === "name" ? value : Number(value) }
          : ex
      ),
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkout = () => {
    if (
      newWorkout.name &&
      newWorkout.duration &&
      newWorkout.exercises.length > 0
    ) {
      const workout = {
        ...newWorkout,
        id: workouts.length + 1,
        date: new Date().toISOString().split("T")[0],
      };
      setWorkouts([workout, ...workouts]);
      setNewWorkout({ id: 0, date: "", name: "", duration: "", exercises: [] });
      setIsDialogOpen(false);
      toast({
        title: "Workout Added",
        description: "Your workout has been successfully added.",
      });
    }
  };

  const toggleWorkoutExpansion = (id: number) => {
    setExpandedWorkout(expandedWorkout === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/components/auth/home"
          className="text-purple-700 hover:text-purple-900 flex items-center"
        >
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-purple-800">Workout Tracker</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Workouts</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Workout
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Workout</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newWorkout.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (min)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={newWorkout.duration}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Exercises</Label>
                    {newWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center gap-2 mt-2">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) =>
                            handleExerciseChange(index, "name", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets || ""}
                          onChange={(e) =>
                            handleExerciseChange(index, "sets", e.target.value)
                          }
                          className="w-20"
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps || ""}
                          onChange={(e) =>
                            handleExerciseChange(index, "reps", e.target.value)
                          }
                          className="w-20"
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={exercise.weight || ""}
                          onChange={(e) =>
                            handleExerciseChange(
                              index,
                              "weight",
                              e.target.value
                            )
                          }
                          className="w-24"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={handleAddExercise} className="mt-2">
                      <Plus className="mr-2 h-4 w-4" /> Add Exercise
                    </Button>
                  </div>
                </div>
                <Button onClick={handleAddWorkout}>Add Workout</Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Workout Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <Fragment key={workout.id}>
                    {" "}
                    {/* Next.js automatically imports Fragment */}
                    <TableRow
                      className="cursor-pointer"
                      onClick={() => toggleWorkoutExpansion(workout.id)}
                    >
                      <TableCell>{workout.date}</TableCell>
                      <TableCell>{workout.name}</TableCell>
                      <TableCell>{workout.duration}</TableCell>
                      <TableCell>{workout.exercises.length}</TableCell>
                      <TableCell>
                        {expandedWorkout === workout.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedWorkout === workout.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
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
                              {workout.exercises.map((exercise, index) => (
                                <TableRow
                                  key={`${workout.id}-exercise-${index}`}
                                >
                                  <TableCell>{exercise.name}</TableCell>
                                  <TableCell>{exercise.sets}</TableCell>
                                  <TableCell>{exercise.reps}</TableCell>
                                  <TableCell>{exercise.weight}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
