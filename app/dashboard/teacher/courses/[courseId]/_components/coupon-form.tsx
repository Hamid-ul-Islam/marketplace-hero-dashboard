"use client";
import {  PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CouponTable } from "./CouponTable";
import { couponColumns } from "./couponColumns";
import CouponEditForm from "./coupon-edit-form";

interface CouponFormProps {
  initialData: any;
  courseId: string;
}


export default function CouponForm({ initialData, courseId }: CouponFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleUpdate = () => setIsUpdating((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      <div className="font-medium flex items-center justify-between">
        Course Coupon
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create a Coupon
            </>
          )}
        </Button>
      </div>
      {/* /* TODO add table of initialData */}
      {!isEditing && <CouponTable columns={couponColumns} data={initialData} />}
      {isEditing && (
        <CouponEditForm
          initialData={initialData}
          courseId={courseId}
          toggleEdit={toggleEdit}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}

export { CouponForm };
