'use client';

import type { FC } from 'react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Info, Edit } from 'lucide-react';
import { format } from 'date-fns'; // Import format function

// Placeholder data - in real app, fetch detailed profile info
const getStudentProfileDetails = (userId: string) => {
    console.log(`Fetching profile details for student: ${userId}`);
    // Simulate API call
     return {
        enrollmentDate: new Date(2023, 8, 1), // Example enrollment date
        major: 'Computer Science', // Example major
        currentClasses: ['Mathematics 101', 'Physics 201', 'Introduction to Algorithms'],
        emergencyContact: {
            name: 'Jane Doe',
            phone: '555-123-4567',
            relationship: 'Mother',
        },
    };
};


const ProfilePage: FC = () => {
    const { user, loading } = useAuth();
    const [profileDetails, setProfileDetails] = React.useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = React.useState(true);

    React.useEffect(() => {
        if (user && user.role === 'Student') {
            setIsLoadingDetails(true);
            // Simulate fetching additional profile details
            setTimeout(() => {
                const details = getStudentProfileDetails(user.id);
                setProfileDetails(details);
                setIsLoadingDetails(false);
            }, 500);
        } else if (!loading && user?.role !== 'Student') {
             setIsLoadingDetails(false); // No details to load for non-students on this page
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                 <Skeleton className="h-8 w-48 mb-6" />
                 <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                             <Skeleton className="h-20 w-20 rounded-full" />
                             <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-56" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </CardHeader>
                     <CardContent className="space-y-4">
                         <Skeleton className="h-6 w-32" />
                         <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-6 w-32" />
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                 </Card>
            </div>
        );
    }

    // Redirect or show message if not a student
     if (user?.role !== 'Student') {
         return (
             <div className="container mx-auto py-6 text-center">
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-semibold">Profile Not Applicable</h1>
                <p className="text-muted-foreground">This profile view is intended for students.</p>
            </div>
         );
     }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <h1 className="text-3xl font-bold text-primary">My Profile</h1>

            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center sm:text-left">
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                             <Badge variant="outline" className="mt-1">{user.role}</Badge>
                        </div>
                         <Button variant="outline" size="sm" disabled> {/* Disable edit for now */}
                            <Edit className="mr-2 h-4 w-4"/> Edit Profile
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {isLoadingDetails ? (
                         <div className="space-y-4">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-8 w-full" />
                             <Skeleton className="h-5 w-1/4" />
                             <Skeleton className="h-8 w-full" />
                             <Skeleton className="h-5 w-1/4" />
                             <Skeleton className="h-16 w-full" />
                         </div>
                    ) : profileDetails ? (
                        <>
                             <div>
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Enrollment Date</Label>
                                <p>{profileDetails.enrollmentDate ? format(profileDetails.enrollmentDate, 'PPP') : 'N/A'}</p>
                             </div>
                             <div>
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Declared Major</Label>
                                <p>{profileDetails.major || 'Undeclared'}</p>
                             </div>
                             <div>
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">Currently Enrolled Classes</Label>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                     {profileDetails.currentClasses?.length > 0 ? (
                                        profileDetails.currentClasses.map((cls: string, index: number) => <li key={index}>{cls}</li>)
                                    ) : (
                                        <li className="text-muted-foreground italic">No classes enrolled.</li>
                                    )}
                                </ul>
                             </div>
                             <Card className="bg-secondary p-4">
                                <CardTitle className="text-lg mb-2">Emergency Contact</CardTitle>
                                 {profileDetails.emergencyContact ? (
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Name:</strong> {profileDetails.emergencyContact.name}</p>
                                        <p><strong>Phone:</strong> {profileDetails.emergencyContact.phone}</p>
                                        <p><strong>Relationship:</strong> {profileDetails.emergencyContact.relationship}</p>
                                     </div>
                                 ) : (
                                     <p className="text-muted-foreground">No emergency contact information available.</p>
                                 )}
                             </Card>
                        </>
                    ) : (
                        <p className="text-muted-foreground">Could not load profile details.</p>
                    )}
                 </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
