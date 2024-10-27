"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dumbbell, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../supabaseClient'

// Mock data for the charts
const weightData = [
  { date: '2024-01-01', weight: 180 },
  { date: '2024-01-08', weight: 178 },
  { date: '2024-01-15', weight: 176 },
  { date: '2024-01-22', weight: 175 },
  { date: '2024-01-29', weight: 173 },
  { date: '2024-02-05', weight: 172 },
]

const strengthData = [
  { date: '2024-01-01', benchPress: 150, squat: 200, deadlift: 250 },
  { date: '2024-01-15', benchPress: 155, squat: 210, deadlift: 260 },
  { date: '2024-01-29', benchPress: 160, squat: 220, deadlift: 270 },
  { date: '2024-02-12', benchPress: 165, squat: 230, deadlift: 280 },
]

export default function HomePage() {
  const [showWeightChart, setShowWeightChart] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if not logged in
        router.push('/components/quickAuth');
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error logging out:', error.message);
        return;
    }

    // Remove the uid cookie
    document.cookie = 'uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/components/auth;';

    // Redirect to login or home page
    router.push('/components/quickAuth'); // Adjust the path as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/components/auth/home" className="text-2xl font-bold text-purple-700">RepUp</Link>
        <nav>
          <Button variant="ghost">Profile</Button>
          <Button variant="ghost">Settings</Button>
          <Link href='/components/quickAuth'> <Button variant="outline" onClick={handleLogout}>Log Out</Button> </Link>
          
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Welcome back, User!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Link href='/components/auth/markdown-workout-plan'>
              <Button className="w-full">
                <Dumbbell className="mr-2 h-4 w-4" /> Workout Plan
              </Button>
                </Link>
              <Link href='/components/auth/workouts'>
              <Button className="w-full" >
                <ClipboardList className="mr-2 h-4 w-4" /> Track Workout
              </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">8 lbs</p>
              <p className="text-sm text-gray-600">Weight lost in the last 30 days</p>
              <p className="mt-4 text-2xl font-bold text-purple-600">15%</p>
              <p className="text-sm text-gray-600">Strength increase in the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progress Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Button
                variant={showWeightChart ? "default" : "outline"}
                onClick={() => setShowWeightChart(true)}
                className="mr-2"
              >
                Weight
              </Button>
              <Button
                variant={!showWeightChart ? "default" : "outline"}
                onClick={() => setShowWeightChart(false)}
              >
                Strength
              </Button>
            </div>
            {showWeightChart ? (
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" name="Weight (lbs)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <ChartContainer
                config={{
                  benchPress: {
                    label: "Bench Press",
                    color: "hsl(var(--chart-1))",
                  },
                  squat: {
                    label: "Squat",
                    color: "hsl(var(--chart-2))",
                  },
                  deadlift: {
                    label: "Deadlift",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="benchPress" stroke="var(--color-benchPress)" name="Bench Press (lbs)" />
                    <Line type="monotone" dataKey="squat" stroke="var(--color-squat)" name="Squat (lbs)" />
                    <Line type="monotone" dataKey="deadlift" stroke="var(--color-deadlift)" name="Deadlift (lbs)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Full Body Workout</span>
                <span className="text-gray-600">2024-02-15</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Upper Body Focus</span>
                <span className="text-gray-600">2024-02-13</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Leg Day</span>
                <span className="text-gray-600">2024-02-11</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        © 2024 RepUp. All rights reserved.
      </footer>
    </div>
  )
}
