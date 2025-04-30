"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle, Paperclip } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/types/auth"; // Import UserRole type

// --- Placeholder Data & Fetching Simulation ---
// In a real app, this data would likely come from props or a context/store
// fetched based on the user's role and potentially ID in the parent component (Dashboard).

const allRecentAbsences = [
  { id: '1', studentId: 'stu-1', studentName: 'Alice Smith', date: new Date(2024, 6, 21), reason: 'Doctor appointment', status: 'Pending', hasAttachment: true },
  { id: '2', studentId: 'stu-2', studentName: 'Bob Johnson', date: new Date(2024, 6, 20), reason: 'Family emergency', status: 'Approved', hasAttachment: false },
  { id: '3', studentId: 'stu-3', studentName: 'Charlie Brown', date: new Date(2024, 6, 19), reason: 'Feeling unwell', status: 'Rejected', hasAttachment: true },
  { id: '4', studentId: 'stu-1', studentName: 'Alice Smith', date: new Date(2024, 6, 18), reason: 'Team competition', status: 'Pending', hasAttachment: false },
  { id: '5', studentId: 'stu-5', studentName: 'Ethan Hunt', date: new Date(2024, 7, 1), reason: 'College visit.', status: 'Approved', hasAttachment: false },
];

interface RecentAbsencesTableProps {
    userRole: UserRole;
    userId?: string; // Optional: only relevant for students
}

export function RecentAbsencesTable({ userRole, userId }: RecentAbsencesTableProps) {
    const [recentAbsences, setRecentAbsences] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        // Simulate fetching data based on role
        setTimeout(() => {
            let filteredData;
            if (userRole === 'Student' && userId) {
                filteredData = allRecentAbsences.filter(a => a.studentId === userId);
            } else { // Admin/Teacher see all (or maybe just pending for dashboard?) - showing all for now
                // Optionally filter for pending only for Admin/Teacher dashboard view:
                // filteredData = allRecentAbsences.filter(a => a.status === 'Pending');
                filteredData = allRecentAbsences; // Show all recent for now
            }
             setRecentAbsences(filteredData.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)); // Show top 5 most recent
             setLoading(false);
        }, 300); // Simulate delay
    }, [userRole, userId]);


    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
        case 'pending':
            return <Badge variant="secondary">Pending</Badge>;
        case 'approved':
            return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
        case 'rejected':
            return <Badge variant="destructive">Rejected</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
        }
    };

     // Simulate actions (in a real app, these would trigger API calls and potentially dialogs)
     const handleApprove = (id: string) => alert(`Simulating APPROVE action for ID: ${id}`);
     const handleReject = (id: string) => alert(`Simulating REJECT action for ID: ${id}`);
     const handleViewDetails = (id: string) => alert(`Simulating VIEW DETAILS action for ID: ${id}`);


    if (loading) {
        return <div className="h-[300px] w-full flex items-center justify-center"><p>Loading recent absences...</p></div>;
    }

  return (
    <ScrollArea className="h-[300px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Show Student Name only for Teacher/Admin */}
            {(userRole === 'Admin' || userRole === 'Teacher') && <TableHead>Student</TableHead>}
            <TableHead>Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            {/* Show Actions only for Teacher/Admin */}
            {(userRole === 'Admin' || userRole === 'Teacher') && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentAbsences.length > 0 ? recentAbsences.map((absence) => (
            <TableRow key={absence.id}>
              {(userRole === 'Admin' || userRole === 'Teacher') && <TableCell className="font-medium">{absence.studentName}</TableCell>}
              <TableCell>{format(absence.date, "MMM d, yyyy")}</TableCell>
              <TableCell className="max-w-[150px] truncate">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <span className="cursor-default">{absence.reason}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{absence.reason}</p>
                    </TooltipContent>
                  </Tooltip>
                  {absence.hasAttachment && (
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <Paperclip className="inline-block ml-1 h-4 w-4 text-muted-foreground cursor-pointer"/>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>Attachment included</p>
                          </TooltipContent>
                      </Tooltip>
                  )}
                </TooltipProvider>
              </TableCell>
              <TableCell>{getStatusBadge(absence.status)}</TableCell>
              {/* Show actions column only for Admin/Teacher */}
              {(userRole === 'Admin' || userRole === 'Teacher') && (
                <TableCell className="text-right space-x-1">
                  <TooltipProvider>
                      {/* View Details Action */}
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewDetails(absence.id)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>View Details</p>
                          </TooltipContent>
                      </Tooltip>
                      {/* Approve/Reject only if Pending */}
                      {absence.status === 'Pending' && (
                          <>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={() => handleApprove(absence.id)}>
                                          <CheckCircle className="h-4 w-4" />
                                          <span className="sr-only">Approve</span>
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>Approve</p>
                                  </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/90" onClick={() => handleReject(absence.id)}>
                                          <XCircle className="h-4 w-4" />
                                          <span className="sr-only">Reject</span>
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>Reject</p>
                                  </TooltipContent>
                              </Tooltip>
                          </>
                      )}
                  </TooltipProvider>
                </TableCell>
              )}
            </TableRow>
          )) : (
             <TableRow>
                <TableCell colSpan={(userRole === 'Admin' || userRole === 'Teacher') ? 5 : 4} className="h-24 text-center text-muted-foreground">
                    No recent absence submissions found.
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
