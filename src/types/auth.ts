// src/types/auth.ts
export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string; // Optional avatar URL
}
