import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, Brain, Zap } from 'lucide-react'

export default function LandingPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-700">RepUp</Link>
        {/* <nav>
          <Button asChild variant="ghost" className="mr-2">
            <Link href="/components/auth/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/components/auth/signup">Sign Up</Link>
          </Button>
        </nav> */}
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-6">
          Transform Your Fitness Journey with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Personalized workout plans tailored to your goals, schedule, and preferences. Powered by cutting-edge AI technology.
        </p>
        <Button asChild size="lg" className="text-lg">
          <Link href="/components/quickAuth">
            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
          </Link>
        </Button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Dumbbell className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Customized Workouts</h2>
            <p className="text-gray-600">Tailored exercise plans that adapt to your progress and preferences.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Brain className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">AI-Powered</h2>
            <p className="text-gray-600">Leverage machine learning for optimal fitness results and continuous improvement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Zap className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
            <h2 className="text-xl font-semibold mb-2">Efficient Progress</h2>
            <p className="text-gray-600">Achieve your fitness goals faster with scientifically-backed workout strategies.</p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
        © 2024 RepUp. All rights reserved.
      </footer>
    </div>
  )
}