"use client";

import { Fragment } from "react";
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
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function WorkoutTrackingPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
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

  // Fetch workouts from Supabase
  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts-user')
        .select('*, exercises(*)'); // Fetch workouts with related exercises

      if (error) {
        console.error('Error fetching workouts:', error);
      } else {
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, []);

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

  const handleAddWorkout = async () => {
    if (
      newWorkout.name &&
      newWorkout.duration &&
      newWorkout.exercises.length > 0
    ) {
      // Format the date to "DD MMM YY"
      const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).replace(/ /g, ' '); // Ensure single space between words
      console.log(formattedDate)

      const { data, error } = await supabase
        .from('workouts-user')
        .insert({
          date: formattedDate, // Use the formatted date
          name: newWorkout.name,
          duration: newWorkout.duration,
        })
        .select();

      if (error) {
        console.error('Error adding workout:', error);
      } else {
        const workoutId = data[0].id; // Get the newly created workout ID

        // Insert exercises
        const exercisesToInsert = newWorkout.exercises.map(exercise => ({
          workout_id: workoutId,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }));

        const { error: exerciseError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);

        if (exerciseError) {
          console.error('Error adding exercises:', exerciseError);
        } else {
          // Reset newWorkout state and close dialog
          setNewWorkout({ id: 0, date: "", name: "", duration: "", exercises: [] });
          setIsDialogOpen(false);
          toast({
            title: "Workout Added",
            description: "Your workout has been successfully added.",
          });
        }
      }
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
