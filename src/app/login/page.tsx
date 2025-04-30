"use client";

import type { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import * as React from 'react';


// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { login, user, loading } = useAuth(); // Use the auth hook
  const [isSubmitting, setIsSubmitting] = React.useState(false);

   // Removed the useEffect that automatically redirected logged-in users
   // React.useEffect(() => {
   //  if (!loading && user) {
   //      router.replace('/dashboard'); // Use replace to avoid adding login to history
   //  }
   //  }, [user, loading, router]);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsSubmitting(true);
    console.log("Login attempt:", data);

    // Simulate API call / auth logic
    setTimeout(() => {
        try {
            // Simulate login based on email (adjust logic as needed)
            // Example credentials:
            // admin@example.com -> Admin
            // teacher@example.com -> Teacher
            // student@example.com -> Student
            // any other @example.com -> Student

             if (!data.email.endsWith('@example.com')) {
                 throw new Error("Invalid domain. Please use an @example.com email.");
            }

            // Use the login function from useAuth
            const userRole = login(data.email);

            toast({
                title: "Login Successful",
                description: `Logged in as ${userRole}. Redirecting...`,
            });

            // Redirect to the dashboard page after setting the role
             router.push('/dashboard');


        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Invalid credentials or server error.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, 500); // Simulate network latency
  };

  // Show loading state or prevent rendering if user is already logged in and redirecting - Modified to always show login form
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-secondary">
                {/* Optional: Add a loading spinner here */}
                <p>Loading...</p>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
             <KeyRound className="w-8 h-8" /> AttendEase
          </CardTitle>
          <CardDescription>Login to manage attendance</CardDescription>
           <div className="text-xs text-muted-foreground pt-2">
                <p>Hint: Use emails like:</p>
                <ul className="list-disc list-inside">
                    <li>admin@example.com (Admin)</li>
                    <li>teacher@example.com (Teacher)</li>
                    <li>student@example.com (Student)</li>
                </ul>
                 <p>(Password: any 6+ characters)</p>
            </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                 {isSubmitting ? 'Logging in...' : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </>
                )}
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            {/* Placeholder for Register/Forgot Password links if needed */}
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="underline text-primary hover:text-primary/80">
                Register
              </Link>
              {' '} (Registration is simulated)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
