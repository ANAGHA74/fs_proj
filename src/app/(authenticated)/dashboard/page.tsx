"use client"; // Required because we use hooks

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarCheck, Users, UserCheck, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { AttendanceChart } from '@/components/attendance-chart';
import { RecentAbsencesTable } from '@/components/recent-absences-table';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Placeholder data - replace with actual data fetching logic based on role
const getDashboardStats = (role: 'Admin' | 'Teacher' | 'Student') => {
    // Simulate fetching data relevant to the role
     if (role === 'Student') {
        return {
            totalClasses: 5,
            attendanceRate: 92.5, // Percentage
            recentAbsences: 2,
            pendingRequests: 1, // Student's pending requests
        };
    } else { // Admin/Teacher view (can be further differentiated if needed)
         return {
            totalStudents: 150,
            presentToday: 142,
            absentToday: 8,
            pendingAbsenceRequests: 3, // System-wide pending requests
        };
    }
};

const DashboardPage: FC = () => {
    const { user, loading } = useAuth();

     if (loading || !user) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <Skeleton className="h-8 w-48 mb-6" />
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                    <Skeleton className="h-32 rounded-lg" />
                 </div>
                 <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 rounded-lg" />
                    <Skeleton className="h-64 rounded-lg" />
                 </div>
            </div>
        );
    }

    const stats = getDashboardStats(user.role);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.name}! ({user.role})</p>

            {/* Stats Cards - Adjusted based on role */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 {/* Admin/Teacher Stats */}
                {(user.role === 'Admin' || user.role === 'Teacher') && 'totalStudents' in stats && (
                    <>
                         <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                                <p className="text-xs text-muted-foreground">Managed</p>
                            </CardContent>
                         </Card>
                         <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                                <UserCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.presentToday}</div>
                                 <p className="text-xs text-muted-foreground">
                                    {stats.totalStudents > 0 ? ((stats.presentToday / stats.totalStudents) * 100).toFixed(1) + '% attendance' : 'N/A'}
                                </p>
                            </CardContent>
                        </Card>
                         <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{stats.absentToday}</div>
                                <p className="text-xs text-muted-foreground">Needs follow-up</p>
                            </CardContent>
                        </Card>
                         <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Absence Requests</CardTitle>
                                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingAbsenceRequests}</div>
                                <p className="text-xs text-muted-foreground">Require approval</p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Student Stats */}
                 {user.role === 'Student' && 'attendanceRate' in stats && (
                    <>
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Attendance Rate</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                                <p className="text-xs text-muted-foreground">Overall average</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Recent Absences</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.recentAbsences}</div>
                                <p className="text-xs text-muted-foreground">In the last 30 days</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Pending Requests</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                                <p className="text-xs text-muted-foreground">Awaiting review</p>
                            </CardContent>
                        </Card>
                         <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                                <p className="text-xs text-muted-foreground">Currently active</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Charts and Tables - Conditionally render or adapt */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                 {/* Attendance Chart - Show for Admin/Teacher */}
                 {(user.role === 'Admin' || user.role === 'Teacher') && (
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Weekly Attendance Overview</CardTitle>
                            <CardDescription>Class attendance trends for the past 7 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AttendanceChart /> {/* Needs adaptation if showing student-specific data */}
                        </CardContent>
                    </Card>
                 )}

                 {/* Recent Absences - Show for All, but filter/adapt data */}
                 <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>{user.role === 'Student' ? 'My Recent Absence Explanations' : 'Recent Absence Explanations'}</CardTitle>
                        <CardDescription>
                            {user.role === 'Student' ? 'Status of your submitted explanations.' : 'Latest submissions needing review.'}
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Pass user role or ID to filter data */}
                        <RecentAbsencesTable userRole={user.role} userId={user.id} />
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
