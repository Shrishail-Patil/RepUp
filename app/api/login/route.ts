// app/api/login/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            email: !email ? "Email is required" : null,
            password: !password ? "Password is required" : null,
          }
        },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check if the user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // User is already logged in, redirect to home page
      return NextResponse.redirect('/home'); // Adjust the path as needed
    }

    // Attempt to sign in
    const { data: { session: newSession }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Handle specific authentication errors
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { 
            error: "Invalid email or password",
            message: "Please check your credentials and try again"
          },
          { status: 401 }
        );
      }

      // Handle other authentication errors
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // If authentication successful, fetch user profile
    if (newSession) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', newSession.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Return success response with session and profile data
      return NextResponse.json({
        message: "Login successful",
        session: newSession,
        profile: profile || null
      });
    }

    return NextResponse.json(
      { error: "Login failed" },
      { status: 401 }
    );

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
