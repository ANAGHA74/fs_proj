// src/hooks/use-auth.ts
"use client";

import { useState, useEffect } from 'react';
import type { UserRole } from '@/types/auth'; // Assuming types/auth.ts exists or will be created

// In a real app, this would involve context, fetching user data, checking tokens, etc.
// For simulation purposes, we'll use localStorage to persist the role across refreshes.

const defaultUser = {
    id: 'user-placeholder',
    name: 'Placeholder User',
    email: 'placeholder@example.com',
    role: 'Admin' as UserRole, // Default to Admin for easy testing initially
    avatar: 'https://picsum.photos/100', // Placeholder avatar
};

export function useAuth() {
  const [user, setUser] = useState<typeof defaultUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data and role
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    const roleToUse = storedRole || defaultUser.role; // Use stored role or default

    // Update user based on role (simple simulation)
    let simulatedUser = { ...defaultUser, role: roleToUse };
    if (roleToUse === 'Teacher') {
      simulatedUser.name = 'Teacher User';
      simulatedUser.email = 'teacher@example.com';
    } else if (roleToUse === 'Student') {
      simulatedUser.name = 'Student User';
      simulatedUser.email = 'student@example.com';
    } else {
         simulatedUser.name = 'Admin User';
         simulatedUser.email = 'admin@attendease.com';
    }


    setUser(simulatedUser);
    setLoading(false);
  }, []);

  const setRole = (role: UserRole) => {
    localStorage.setItem('userRole', role);
    // Update user state immediately for responsiveness
     let simulatedUser = { ...defaultUser, role: role };
     if (role === 'Teacher') {
        simulatedUser.name = 'Teacher User';
        simulatedUser.email = 'teacher@example.com';
     } else if (role === 'Student') {
        simulatedUser.name = 'Student User';
        simulatedUser.email = 'student@example.com';
     } else {
        simulatedUser.name = 'Admin User';
        simulatedUser.email = 'admin@attendease.com';
     }
    setUser(simulatedUser);
     // Optionally force a reload or use router to re-render dependent components cleanly
     // window.location.reload(); // Or router.refresh() if using Next.js App Router effectively
  };

  // Simulate login - in real app, this would set tokens, user data, etc.
   const login = (email: string) => {
     // Determine role based on email for simulation
     let role: UserRole = 'Student'; // Default to student
     if (email.startsWith('admin')) {
         role = 'Admin';
     } else if (email.startsWith('teacher')) {
         role = 'Teacher';
     }
     setRole(role);
     return role; // Return the role for redirection logic
   };

   // Simulate logout
   const logout = () => {
        localStorage.removeItem('userRole');
        setUser(null); // Clear user state
        // In a real app: clear tokens, redirect, etc.
   };


  return { user, loading, setRole, login, logout };
}
