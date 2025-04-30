
'use client';

import type { FC } from 'react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Download, ListFilter, Search, Check, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton


// Placeholder data - replace with actual data fetching logic
const classes = [
    { id: 'cls-1', name: 'Mathematics 101' },
    { id: 'cls-2', name: 'Physics 201' },
    { id: 'cls-3', name: 'History 10A' },
];

// Simulate fetching students for a class (Teacher/Admin view)
const getStudentsForClass = (classId: string) => {
     console.log(`Fetching students for class: ${classId}`); // Simulate API call
     // In real app, fetch based on classId
     return [
        { id: 'stu-1', name: 'Alice Smith', isPresent: true },
        { id: 'stu-2', name: 'Bob Johnson', isPresent: true },
        { id: 'stu-3', name: 'Charlie Brown', isPresent: false },
        { id: 'stu-4', name: 'Diana Prince', isPresent: true },
        { id: 'stu-5', name: 'Ethan Hunt', isPresent: true },
        { id: 'stu-6', name: 'Fiona Glenanne', isPresent: false },
        { id: 'stu-7', name: 'George Constanza', isPresent: true },
     ];
};

// Simulate fetching a student's attendance record (Student view)
const getStudentAttendanceRecord = (studentId: string, classId: string | null, date: Date) => {
     console.log(`Fetching attendance for student ${studentId}, class ${classId}, date ${format(date, 'yyyy-MM-dd')}`);
     // In real app, fetch based on studentId, classId, and date range/specific date
     // Return a list of attendance records for the student for the selected period/class
     // Example for a single date:
      if (classId === 'cls-1' && format(date, 'yyyy-MM-dd') === '2024-07-24') return { status: 'Present' };
      if (classId === 'cls-1' && format(date, 'yyyy-MM-dd') === '2024-07-23') return { status: 'Absent', reason: 'Doctor visit' };
      if (classId === 'cls-2' && format(date, 'yyyy-MM-dd') === '2024-07-24') return { status: 'Present' };
      // Simulate data for a range (e.g., last 7 days)
       const records = [];
       const today = new Date();
       for (let i = 0; i < 7; i++) {
         const loopDate = new Date(today);
         loopDate.setDate(today.getDate() - i);
         const dayOfWeek = loopDate.getDay(); // 0 = Sun, 6 = Sat
         if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

         let status: 'Present' | 'Absent' | 'Pending' = Math.random() > 0.2 ? 'Present' : 'Absent';
         let reason = status === 'Absent' ? (Math.random() > 0.5 ? 'Sick' : 'Family event') : undefined;
          if (status === 'Absent' && Math.random() > 0.7) {
              status = 'Pending'; // Simulate pending explanation
              reason = 'Explanation submitted';
          }

          // Only add if matches selected class or if no class is selected (overall view)
          const randomClassId = classes[Math.floor(Math.random() * classes.length)].id;
          if (!classId || classId === randomClassId) { // Check if classId is null (meaning 'all') or matches
             records.push({
                date: loopDate,
                className: classes.find(c => c.id === randomClassId)?.name ?? 'Unknown Class',
                status: status,
                reason: reason
             });
           }
       }
       return records.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort descending

    // return null; // No record found
};


const AttendancePage: FC = () => {
    const { user, loading } = useAuth();
    // Use 'all' to represent no specific class selection, especially for students
    const [selectedClass, setSelectedClass] = React.useState<string | null>(user?.role === 'Student' ? 'all' : null);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [studentAttendance, setStudentAttendance] = React.useState<Array<{ id: string; name: string; isPresent: boolean }>>([]); // Teacher/Admin state
    const [studentRecords, setStudentRecords] = React.useState<Array<{ date: Date; className: string; status: string; reason?: string }>>([]); // Student state
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterStatus, setFilterStatus] = React.useState<"all" | "present" | "absent">("all");
    const [isFetchingStudents, setIsFetchingStudents] = React.useState(false);
     const [isFetchingRecords, setIsFetchingRecords] = React.useState(false);


    // Effect to fetch students when class/date changes (for Teacher/Admin)
     React.useEffect(() => {
        if (user?.role === 'Teacher' || user?.role === 'Admin') {
             if (selectedClass && selectedClass !== 'all' && selectedDate) { // Ensure a specific class is selected
                 setIsFetchingStudents(true);
                 // Simulate API call
                setTimeout(() => {
                    const fetchedStudents = getStudentsForClass(selectedClass);
                    // In a real app, fetch attendance status for the selected date too
                    // For simulation, we use the default `isPresent` from getStudentsForClass
                     setStudentAttendance(fetchedStudents);
                     setIsFetchingStudents(false);
                 }, 300);
            } else {
                setStudentAttendance([]); // Clear if no class/date or 'all' selected
            }
        }
     }, [selectedClass, selectedDate, user?.role]);

     // Effect to fetch student's own records (for Student)
      React.useEffect(() => {
        if (user?.role === 'Student' && selectedDate) {
            setIsFetchingRecords(true);
             // Simulate API call
            setTimeout(() => {
                 // Fetch records for the student, optionally filtered by class and selected date/range
                 // Pass null if 'all' is selected, otherwise pass the class ID
                const classFilter = selectedClass === 'all' ? null : selectedClass;
                const records = getStudentAttendanceRecord(user.id, classFilter, selectedDate);
                 setStudentRecords(Array.isArray(records) ? records : (records ? [ { date: selectedDate, className: classes.find(c => c.id === selectedClass)?.name ?? 'N/A', ...records }] : []));
                 setIsFetchingRecords(false);
            }, 300);
        }
      }, [selectedClass, selectedDate, user?.role, user?.id]);


    // --- Teacher/Admin Specific Handlers ---
    const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
        setStudentAttendance(prev =>
            prev.map(student =>
                student.id === studentId ? { ...student, isPresent } : student
            )
        );
    };

    const markAllPresent = () => {
         setStudentAttendance(prev => prev.map(student => ({ ...student, isPresent: true })));
    }

     const markAllAbsent = () => {
         setStudentAttendance(prev => prev.map(student => ({ ...student, isPresent: false })));
    }

    const filteredStudents = studentAttendance.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = filterStatus === 'all' || (filterStatus === 'present' && student.isPresent) || (filterStatus === 'absent' && !student.isPresent);
        return nameMatch && statusMatch;
    });

    const presentCount = filteredStudents.filter(s => s.isPresent).length;
    const absentCount = filteredStudents.length - presentCount;

    const handleSaveAttendance = () => {
        // Placeholder for saving attendance data
        console.log("Saving attendance:", studentAttendance);
         alert("Attendance saved (simulated).");
    };

    const handleExport = () => {
        // Placeholder for CSV export
        console.log("Exporting attendance for class:", selectedClass, "on", selectedDate);
         alert("CSV export started (simulated).");
    }

     // --- Student Specific ---
     const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><Check className="mr-1 h-3 w-3" />Present</Badge>;
            case 'absent':
                return <Badge variant="destructive"><X className="mr-1 h-3 w-3" />Absent</Badge>;
             case 'pending':
                return <Badge variant="secondary">Pending Explanation</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // --- Loading State ---
     if (loading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <Skeleton className="h-8 w-64 mb-4" />
                 <Skeleton className="h-40 rounded-lg" />
                 <Skeleton className="h-64 rounded-lg" />
            </div>
        );
     }


    return (
        <div className="container mx-auto py-6 space-y-6">
             {user?.role === 'Student' ? (
                 <h1 className="text-3xl font-bold text-primary">My Attendance Record</h1>
             ) : (
                 <h1 className="text-3xl font-bold text-primary">Attendance Management</h1>
             )}


            {/* Class and Date Selection - Common for All Roles */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Select {user?.role === 'Student' ? 'View Options' : 'Class and Date'}</CardTitle>
                    <CardDescription>
                        {user?.role === 'Student'
                            ? 'Select a class and date to view your attendance record.'
                            : 'Choose the class and date to record or view attendance.'
                         }
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Class Selector - Optional for Student, Required for Teacher/Admin */}
                    {/* Use 'all' as value for the "All Classes" option */}
                    <Select onValueChange={setSelectedClass} value={selectedClass ?? (user?.role === 'Student' ? 'all' : '')}>
                         <SelectTrigger className="w-full md:w-[280px]">
                            <SelectValue placeholder={user?.role === 'Student' ? "All Classes" : "Select a class"} />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Use "all" as the value, not "" */}
                            {user?.role === 'Student' && <SelectItem value="all">All Classes</SelectItem>}
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                     {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-full md:w-[280px] justify-start text-left font-normal"
                            // Teacher/Admin must select class first, cannot be 'all'
                             disabled={(user?.role === 'Teacher' || user?.role === 'Admin') && (!selectedClass || selectedClass === 'all')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                             {/* Student can view 'All Dates' or a specific date */}
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            {/* {user?.role === 'Student' && !selectedDate && <span>All Dates (Last 7 Days)</span>} */}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                             initialFocus
                             // Teacher/Admin must select a specific class first
                              disabled={(user?.role === 'Teacher' || user?.role === 'Admin') && (!selectedClass || selectedClass === 'all')}
                        />
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>

            {/* --- Teacher/Admin View: Mark Attendance --- */}
             {(user?.role === 'Teacher' || user?.role === 'Admin') && selectedClass && selectedClass !== 'all' && selectedDate && (
                <Card className="shadow-sm">
                    <CardHeader>
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Mark Attendance</CardTitle>
                                <CardDescription>
                                    Class: {classes.find(c => c.id === selectedClass)?.name} | Date: {format(selectedDate, "PPP")}
                                </CardDescription>
                                <div className="flex gap-2 mt-2">
                                     <Badge variant="secondary">Total: {isFetchingStudents ? '...' : filteredStudents.length}</Badge>
                                     <Badge variant="default" className="bg-green-500">Present: {isFetchingStudents ? '...' : presentCount}</Badge>
                                     <Badge variant="destructive">Absent: {isFetchingStudents ? '...' : absentCount}</Badge>
                                </div>
                            </div>
                             <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={markAllPresent} disabled={isFetchingStudents}>Mark All Present</Button>
                                <Button variant="outline" size="sm" onClick={markAllAbsent} disabled={isFetchingStudents}>Mark All Absent</Button>
                                <Button variant="default" size="sm" onClick={handleExport} disabled={isFetchingStudents}>
                                    <Download className="mr-2 h-4 w-4" /> Export CSV
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="relative w-full md:w-1/3">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                type="search"
                                placeholder="Search students..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Filter
                                    </span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "all"}
                                    onCheckedChange={() => setFilterStatus("all")}
                                >
                                    All
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "present"}
                                    onCheckedChange={() => setFilterStatus("present")}
                                >
                                    Present
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={filterStatus === "absent"}
                                    onCheckedChange={() => setFilterStatus("absent")}
                                >
                                    Absent
                                </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <ScrollArea className="max-h-[60vh] w-full">
                             {isFetchingStudents ? (
                                <div className="space-y-2 p-4">
                                     <Skeleton className="h-10 w-full" />
                                     <Skeleton className="h-10 w-full" />
                                     <Skeleton className="h-10 w-full" />
                                     <Skeleton className="h-10 w-full" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Present?</TableHead>
                                            <TableHead>Student Name</TableHead>
                                            {/* Add more headers if needed, e.g., Student ID */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        id={`attendance-${student.id}`}
                                                        checked={student.isPresent}
                                                        onCheckedChange={(checked) => handleAttendanceChange(student.id, !!checked)}
                                                        aria-labelledby={`student-name-${student.id}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Label htmlFor={`attendance-${student.id}`} id={`student-name-${student.id}`} className="font-medium cursor-pointer">
                                                        {student.name}
                                                    </Label>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                                                    No students found matching your criteria.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                             )}
                        </ScrollArea>
                         <div className="mt-6 flex justify-end">
                            <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveAttendance} disabled={isFetchingStudents}>Save Attendance</Button>
                         </div>
                    </CardContent>
                </Card>
            )}

            {/* --- Student View: Attendance Records --- */}
            {user?.role === 'Student' && (
                 <Card className="shadow-sm">
                     <CardHeader>
                        <CardTitle>My Records</CardTitle>
                        <CardDescription>
                            Showing attendance for {selectedClass && selectedClass !== 'all' ? classes.find(c=> c.id === selectedClass)?.name : 'all classes'}
                            {selectedDate ? ` on ${format(selectedDate, "PPP")}` : ' (Last 7 Days)'}.
                         </CardDescription>
                         {/* Add Filters if needed (e.g., date range) */}
                     </CardHeader>
                     <CardContent>
                         <ScrollArea className="max-h-[60vh] w-full">
                             {isFetchingRecords ? (
                                <div className="space-y-2 p-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                             ) : (
                                 <Table>
                                     <TableHeader>
                                         <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Reason/Note</TableHead>
                                         </TableRow>
                                     </TableHeader>
                                     <TableBody>
                                         {studentRecords.length > 0 ? studentRecords.map((record, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{format(record.date, "MMM d, yyyy (EEE)")}</TableCell>
                                                <TableCell>{record.className}</TableCell>
                                                <TableCell>{getStatusBadge(record.status)}</TableCell>
                                                 <TableCell className="text-muted-foreground italic">{record.reason ?? 'N/A'}</TableCell>
                                            </TableRow>
                                         )) : (
                                             <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                                    No attendance records found for the selected criteria.
                                                 </TableCell>
                                             </TableRow>
                                         )}
                                     </TableBody>
                                 </Table>
                             )}
                        </ScrollArea>
                     </CardContent>
                 </Card>
             )}
        </div>
    );
};

export default AttendancePage;


    