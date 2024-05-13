import { auth } from "@clerk/nextjs/server";
import React from "react";
import { DataTable } from "./teacher/courses/_components/data-table";
import { redirect } from "next/navigation";
import { columns } from "./teacher/courses/_components/columns";
import Course from "@/models/Course";
import { connectDB } from "@/lib/db";

export default async function Dashboard() {
  await connectDB();
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await Course.find({ }).sort({ createdAt: -1 });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
