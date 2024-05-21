"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import CouponEditForm from "./coupon-edit-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

function DeleteCouponComponent({
  courseId,
  id,
}: {
  courseId: string;
  id: string;
}) {
  const router = useRouter();
  const onDeleteCoupon = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}/coupon?couponId=${id}`);
      toast.success("Coupon deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <ConfirmModal onConfirm={onDeleteCoupon}>
      <Trash className="w-6 h-6 cursor-pointer bg-red-100 rounded-md p-1 text-red-600" />
    </ConfirmModal>
  );
}

// 6:47:00 in Build a Course & LMS Platform:
// https://youtu.be/Big_aFLmekI?t=24446
export const couponColumns: ColumnDef<any>[] = [
  {
    accessorKey: "couponCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "discountValue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPercentage = row.original.discountType === "percentage";
      const discount = parseFloat(row.getValue("discountValue") || "0");
      const formatted = isPercentage
        ? `${discount}%`
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BDT",
          }).format(discount);
      return <div>{formatted}</div>;
    },
  },

  {
    accessorKey: "expirationDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const hasValidity = new Date(row.getValue("expirationDate")) > new Date();
      const hasUsageLimit = row.original.usageLimit > row.original.usageCount;

      return (
        <Badge
          className={cn(
            "bg-red-100 text-red-600 hover:text-red-400 hover:bg-red-100",
            hasValidity &&
              hasUsageLimit &&
              "bg-green-100 text-green-600 hover:text-green-400 hover:bg-green-100 "
          )}
        >
          {hasValidity && !hasUsageLimit && "Limit Exceeded"}
          {hasValidity && hasUsageLimit && "Valid"}
          {!hasValidity && "Expired"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const initialData = row.original;
      const { _id, courseId } = row.original;

      return (
        <div className="flex  items-center">
          <DeleteCouponComponent id={_id} courseId={courseId} />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-slate-500 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
              <CouponEditForm
                initialData={initialData}
                courseId={courseId}
                toggleEdit={() => {}}
                isEditing={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
];
