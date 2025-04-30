'use client';

import type { FC } from 'react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, PlusCircle, Search, ListFilter, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Badge } from '@/components/ui/badge'; // Import Badge


// Placeholder data - replace with actual data fetching
const studentsData = [
    { id: 'stu-1', name: 'Alice Smith', email: 'alice.s@example.com', class: 'Mathematics 101', status: 'Active' },
    { id: 'stu-2', name: 'Bob Johnson', email: 'bob.j@example.com', class: 'Physics 201', status: 'Active' },
    { id: 'stu-3', name: 'Charlie Brown', email: 'charlie.b@example.com', class: 'Mathematics 101', status: 'Inactive' },
    { id: 'stu-4', name: 'Diana Prince', email: 'diana.p@example.com', class: 'History 10A', status: 'Active' },
    { id: 'stu-5', name: 'Ethan Hunt', email: 'ethan.h@example.com', class: 'Physics 201', status: 'Active' },
];

const classesData = [
    { id: 'cls-1', name: 'Mathematics 101' },
    { id: 'cls-2', name: 'Physics 201' },
    { id: 'cls-3', name: 'History 10A' },
];


const StudentsPage: FC = () => {
    const { user, loading } = useAuth(); // Use auth hook
    const [students, setStudents] = React.useState(studentsData);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterClass, setFilterClass] = React.useState<string>("all"); // Default to 'all'
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [editingStudent, setEditingStudent] = React.useState<typeof studentsData[0] | null>(null);
     const [isSubmitting, setIsSubmitting] = React.useState(false); // For form submissions

    const handleEditClick = (student: typeof studentsData[0]) => {
        setEditingStudent(student);
        setIsEditDialogOpen(true);
    };

    // Add student form handling (simplified) - Admin only
    const handleAddStudent = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
         if (user?.role !== 'Admin') return; // Prevent non-admins
         setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const newStudent = {
            id: `stu-${Date.now()}`, // Simple ID generation
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            // Find class name from selected ID for display consistency (assuming value is ID)
            class: classesData.find(c => c.id === formData.get('class'))?.name ?? 'Unknown',
            status: 'Active', // Default status
        };
         // Simulate API call
        setTimeout(() => {
             console.log("Adding student:", newStudent);
            setStudents([...students, newStudent]);
             setIsSubmitting(false);
             setIsAddDialogOpen(false);
             // Reset form if needed (can be done by closing dialog or explicitly)
        }, 500);
    };

    // Edit student form handling (simplified) - Admin only
    const handleEditStudent = (event: React.FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         if (!editingStudent || user?.role !== 'Admin') return;
         setIsSubmitting(true);

         const formData = new FormData(event.currentTarget);
         const updatedStudent = {
             ...editingStudent,
             name: formData.get('name') as string,
             email: formData.get('email') as string,
             // Find class name from selected ID for display consistency
             class: classesData.find(c => c.id === formData.get('class'))?.name ?? editingStudent.class,
             status: formData.get('status') as string, // Allow status update
         };

          // Simulate API call
        setTimeout(() => {
             console.log("Updating student:", updatedStudent);
            setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
             setIsSubmitting(false);
             setIsEditDialogOpen(false);
             setEditingStudent(null);
         }, 500);
    };


    const handleDeleteStudent = (studentId: string) => {
         if (user?.role !== 'Admin') return;
        // Add confirmation dialog here in a real app
         if (window.confirm(`Are you sure you want to delete student ${studentId}?`)) {
             // Simulate API call
             setTimeout(() => {
                 console.log("Deleting student:", studentId);
                setStudents(students.filter(student => student.id !== studentId));
             }, 300);
        }
    };

    const filteredStudents = students.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = student.email.toLowerCase().includes(searchTerm.toLowerCase());
        // Class match uses class *name* for filtering now
        const classMatch = filterClass === "all" || student.class === classesData.find(c => c.id === filterClass)?.name;
        return (nameMatch || emailMatch) && classMatch;
    });

     if (loading) {
         return (
            <div className="container mx-auto py-6 space-y-6">
                <Skeleton className="h-8 w-64 mb-4" />
                 <Skeleton className="h-12 w-full mb-4" /> {/* Header/Button area */}
                 <Skeleton className="h-96 rounded-lg" /> {/* Table area */}
            </div>
        );
     }

      // Redirect or show message if user role is not Admin or Teacher
     if (user?.role === 'Student') {
        return (
            <div className="container mx-auto py-6 text-center">
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-semibold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view the student management page.</p>
             </div>
         );
     }


    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Student Management</h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'Admin' ? 'Add, edit, or delete student records.' : 'View student records.'}
                    </p>
                </div>
                {/* Add Student Button - Admin Only */}
                {user?.role === 'Admin' && (
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Student</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new student.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddStudent} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" name="name" className="col-span-3" required disabled={isSubmitting}/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input id="email" name="email" type="email" className="col-span-3" required disabled={isSubmitting}/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="class" className="text-right">Class</Label>
                                    <Select name="class" required disabled={isSubmitting}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classesData.map((cls) => (
                                                // Submit class ID for easier backend processing
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Adding...' : 'Add Student'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                 {/* Edit Student Dialog - Admin Only */}
                 {user?.role === 'Admin' && (
                    <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setEditingStudent(null); }}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                                <DialogDescription>
                                    Update the student's details.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditStudent} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                                    <Input id="edit-name" name="name" defaultValue={editingStudent?.name} className="col-span-3" required disabled={isSubmitting}/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-email" className="text-right">Email</Label>
                                    <Input id="edit-email" name="email" type="email" defaultValue={editingStudent?.email} className="col-span-3" required disabled={isSubmitting}/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-class" className="text-right">Class</Label>
                                    <Select name="class" defaultValue={classesData.find(c => c.name === editingStudent?.class)?.id} required disabled={isSubmitting}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classesData.map((cls) => (
                                                // Submit class ID
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-status" className="text-right">Status</Label>
                                    <Select name="status" defaultValue={editingStudent?.status} required disabled={isSubmitting}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                         {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                 )}

            </div>


            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Student List</CardTitle>
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4">
                        <div className="relative flex-1 grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or email..."
                                className="w-full rounded-lg bg-background pl-8" // md:w-[200px] lg:w-[336px]" removed fixed widths
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <Select onValueChange={setFilterClass} value={filterClass}>
                             <SelectTrigger className="w-full sm:w-auto h-9 gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <SelectValue placeholder="Filter by Class" />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classesData.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}> {/* Filter by ID */}
                                        {cls.name}
                                    </SelectItem>
                                ))}
                             </SelectContent>
                         </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="max-h-[60vh] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Status</TableHead>
                                    {/* Actions only for Admin */}
                                    {user?.role === 'Admin' && <TableHead className="text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell>
                                             <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className={student.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        {/* Actions Column - Admin Only */}
                                        {user?.role === 'Admin' && (
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(student)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleDeleteStudent(student.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )) : (
                                     <TableRow>
                                        <TableCell colSpan={user?.role === 'Admin' ? 5 : 4} className="text-center h-24 text-muted-foreground">
                                            No students found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentsPage;
