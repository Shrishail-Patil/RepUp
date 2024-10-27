"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [workoutPlan, setWorkoutPlan] = useState({})
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activeDays: 3,
    hasEquipment: false,
    goal: '',
    goalWeight: '',
    injuries: '',
    fitnessLevel: '',
    workoutSplit: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, activeDays: value[0] }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasEquipment: checked }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const {gender,age, height, weight, activeDays, hasEquipment, goal, goalWeight, injuries, fitnessLevel, workoutSplit} = formData

    try {
      // First, make the API call to get the workout plan
      const workoutResponse = await fetch('/api/getworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(formData),
        body: `Generate a personalized 90-day workout plan based on my profile:

I am a ${age} year old ${gender}, ${height}cm tall, weighing ${weight}kg. I have ${hasEquipment ? "access to a fully equipped gym" : "no gym equipment"}. I can workout ${activeDays} days per week. My goal is ${goal} with a target weight of ${goalWeight}kg. My fitness level is ${fitnessLevel}. ${injuries ? `I have the following medical conditions/injuries to consider: ${injuries}` : ""} I prefer a ${workoutSplit} workout split.

Requirements:
1. Provide a markdown-formatted workout plan
2. Base all recommendations on recent fitness research
3. Adjust exercises for my fitness level and equipment access
4. Include specific weights/intensities
5.The plan should be perfect and easily understandable.give the plan in markdown format and dont use tables(mandatory).


Please output a workout plan following this exact format and tailored to my fitness level and weight loss goal. Make sure it incorporates the latest research on fat loss, strength training, and progression for beginners aiming for a 90-day transformation.
        `
      })

      if (!workoutResponse.ok) {
        throw new Error('Failed to fetch workout plan')
      }

      const workoutData = await workoutResponse.json()
      setWorkoutPlan(workoutData.message?.content || workoutData.choices?.[0]?.message?.content || 'No workout plan generated')

      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated and workout plan generated.",
      })

      // Optionally store the workout plan in localStorage or state management
      localStorage.setItem('workoutPlan', "plan generated")
      console.log(workoutPlan)

      console.log(JSON.stringify(workoutPlan, null, 2))
      
      
      // Redirect to home page after submission
      router.push('/components/auth/home')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "There was a problem generating your workout plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-purple-800 mb-6">Complete Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={handleSelectChange('gender')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  required
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                <Input
                  id="goalWeight"
                  name="goalWeight"
                  type="number"
                  value={formData.goalWeight}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label>Active Days per Week</Label>
              <Slider
                min={1}
                max={7}
                step={1}
                value={[formData.activeDays]}
                onValueChange={handleSliderChange}
                className="mt-2"
              />
              <div className="text-center mt-1">{formData.activeDays} days</div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasEquipment"
                checked={formData.hasEquipment}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="hasEquipment">I have access to gym equipment</Label>
            </div>

            <div>
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select onValueChange={handleSelectChange('goal')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Weight Loss</SelectItem>
                  <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                  <SelectItem value="toning">Body Toning</SelectItem>
                  <SelectItem value="endurance">Improve Endurance</SelectItem>
                  <SelectItem value="strength">Increase Strength</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
              <Select onValueChange={handleSelectChange('fitnessLevel')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workoutSplit">Preferred Workout Split</Label>
              <Select onValueChange={handleSelectChange('workoutSplit')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred split" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullBody">Full Body</SelectItem>
                  <SelectItem value="upperLower">Upper/Lower</SelectItem>
                  <SelectItem value="pushPullLegs">Push/Pull/Legs</SelectItem>
                  <SelectItem value="bodyPart">Body Part Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="injuries">Injuries or Limitations</Label>
              <Textarea
                id="injuries"
                name="injuries"
                placeholder="Describe any injuries or physical limitations"
                value={formData.injuries}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </div>
      </div>
    </div>
  )
}