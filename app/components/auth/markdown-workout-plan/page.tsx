"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import { supabase } from "@/supabaseClient";
import { parseCookies } from 'nookies';
import ReactMarkdown from 'react-markdown';

export default function MarkdownWorkoutPlanPage() {
  const [loading, setLoading] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const cookies = parseCookies();
  const userId = cookies.uid;

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      if (!userId) {
        console.log('No user ID found in cookies. User might not be logged in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('workouts')
        .select('workout_data')
        .eq('uid', userId)
        .single();

      console.log('Fetched data:', data);

      if (error) {
        console.error('Error fetching workout plan:', error);
        setWorkoutPlan(null);
      } else {
        setWorkoutPlan(data.workout_data);
      }
      setLoading(false);
    };

    fetchWorkoutPlan();
  }, [userId]);

  const downloadPDF = () => {
    if (!workoutPlan) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Workout Plan", 14, 22);
    doc.setFontSize(12);
    
    // Split the workoutPlan into lines to avoid overflow
    const lines = doc.splitTextToSize(workoutPlan, 180); // Adjust width as needed
    let y = 32; // Starting y position for text

    // Loop through the lines and add them to the PDF
    lines.forEach((line:any) => {
      if (y > 280) { // Check if the y position exceeds the page height
        doc.addPage(); // Add a new page
        y = 10; // Reset y position for the new page
      }
      doc.text(line, 14, y); // Add the line to the PDF
      y += 10; // Move down for the next line
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
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-purple-800">Markdown Workout Plan</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        {workoutPlan ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Workout Plan</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ReactMarkdown
                components={{
                  // Customize table styling
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        {children}
                      </table>
                    </div>
                  ),
                  // Style table headers
                  th: ({ children }) => (
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  // Style table cells
                  td: ({ children }) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {children}
                    </td>
                  ),
                  // Style headings
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-2">{children}</h3>
                  ),
                  // Style lists
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4">{children}</ul>
                  ),
                }}
              >
                {workoutPlan}
              </ReactMarkdown>
              <Button onClick={downloadPDF} className="mt-8">
                Download as PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p>No workout plan found for this user.</p>
        )}
      </main>
    </div>
  );
}
