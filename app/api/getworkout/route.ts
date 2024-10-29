import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";
import { createSupabaseServer } from "@/lib/supabase/server"; // Adjust the import based on your project structure

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        console.log("Incoming request body:", body); // Log the incoming request body

        const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
        const response = await together.chat.completions.create({
            messages: [{"role": "user", "content": body}],
            model: "meta-llama/Llama-Vision-Free",
        });

        console.log("AI response:", response); // Log the AI response

        if (response.choices && response.choices[0] && response.choices[0].message) {
            const content = response.choices[0].message.content;
            // const final = content?.replaceAll('/n', '').replaceAll('/', '');
            const final = content
            console.log("Final content:", final); // Log the final content

            // Extract UID from cookies
            const cookies = request.cookies;
            const uid = cookies.get('uid')?.value; // Adjust based on how you set the cookie
            console.log("Cookies found:", uid);

            // Initialize Supabase client
            const supabase = createSupabaseServer(); // Pass the request object
            console.log("Supabase client initialized");

            // Log the data to be inserted
            console.log("Inserting data into Supabase:", { uid, workout_data: final });

            // Store the final variable along with the UID in Supabase
            const { data, error } = await supabase
                .from('workouts') // Ensure this is the correct table name
                .insert([
                    {
                        // uid: (await supabase.auth.getUser()).data.user?.id || null, // Attach the user's UID with null fallback
                        uid : uid, // Attach the user's UID with null fallback
                        workout_data: final, // Store the final variable
                    },
                ]);

            if (error) {
                console.error("Error inserting data:", error); // Log the error
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            return NextResponse.json({ content: final });
        } else {
            return NextResponse.json({ error: 'No valid response from the model' }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Error:", error.message); // Log the error
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
