import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Absence from '@/models/Absence'; // You need to create this model if not present

export async function GET() {
  try {
    await connectDB();
    const absences = await Absence.find()
      .populate('student', 'name') // assuming you store student as ObjectId
      .sort({ date: -1 });
    return NextResponse.json(absences);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch absences' }, { status: 500 });
  }
}
