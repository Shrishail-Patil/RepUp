'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabaseClient'

export default function QuickAuthPage() {
  const router = useRouter();

  // Function to check if email exists in users table
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle(); // Using maybeSingle() instead of single() to avoid errors

      if (error) {
        console.error('Error checking email:', error);
        return false;
      }

      return data !== null;
    } catch (error) {
      console.error('Error in checkEmailExists:', error);
      return false;
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);

      if (event === 'SIGNED_IN' && session) {
        // User is signed in, redirect to profile page
        const emailExists = await checkEmailExists(session.user.email!);
        
        // Set cookie with UID
        document.cookie = `uid=${session.user.id}; path=/;`;
        if (emailExists) {
          console.log('User already exists in database');
          router.push('/components/auth/home')
        
        } else {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ email: session.user.email }]);

          router.push('/components/auth/profile');

        // Check if email exists and handle accordingly
        
        // Email doesn't exist, insert into users table
          

          if (insertError) {
            console.error('Error inserting email into users table:', insertError);
          } else {
            console.log('Successfully added new user to database');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router]);

  const handleGoogleAuth = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-700">Welcome to RepUp</h2>
            <p className="text-gray-600">Quickly log in or sign up with your Google account.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleGoogleAuth} className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white">
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
      <Button asChild variant="ghost" className="mt-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}