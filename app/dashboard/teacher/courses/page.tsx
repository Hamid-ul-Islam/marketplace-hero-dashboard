import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

const CoursesPage = async () => {
    await connectDB();

    const userId = auth();

    if (!userId) {
        return redirect("/");
    }

    // Remove the getToken property from the userId object.
    const { getToken, ...userIdWithoutToken } = userId;

    // get all course in descending order
    const courses = await Course.find({ userId: userIdWithoutToken }).sort({ createdAt: -1 });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;