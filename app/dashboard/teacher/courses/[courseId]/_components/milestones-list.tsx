"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface MilestonesListProps {
  items: any;
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const MilestonesList = ({
  items,
  onReorder,
  onEdit,
}: MilestonesListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [milestones, setMilestones] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setMilestones(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(milestones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedMilestones = items.slice(startIndex, endIndex + 1);

    setMilestones(items);

    const bulkUpdateData = updatedMilestones.map((milestone: any) => ({
      id: milestone._id,
      position: items.findIndex((item: any) => item._id === milestone._id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="milestones">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {milestones.map((milestone: any, index: number) => (
              <Draggable
                key={milestone._id}
                draggableId={milestone._id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm
                                            ${
                                              milestone.isPublished &&
                                              "bg-blue-100 border-blue-200 text-blue-700"
                                            }
                                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300
                                            dark:${
                                              milestone.isPublished &&
                                              "bg-blue-800 border-blue-600 text-blue-300"
                                            }
                                        `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={`px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition
                                                ${
                                                  milestone.isPublished &&
                                                  "border-r-blue-200 hover:bg-blue-200"
                                                }
                                                dark:border-r-slate-800 dark:hover:bg-slate-700
                                                dark:${
                                                  milestone.isPublished &&
                                                  "border-r-blue-600 hover:bg-blue-800"
                                                }
                                            `}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {milestone.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {milestone.isFree && <Badge>Free</Badge>} */}
                      <Badge
                        className={`bg-gray-500
                                                ${
                                                  milestone.isPublished &&
                                                  "bg-sky-700"
                                                }
                                                dark:bg-slate-500
                                                dark:${
                                                  milestone.isPublished &&
                                                  "bg-sky-700"
                                                }
                                                `}
                      >
                        {milestone.isPublished ? "Published" : "Unpublished"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(milestone._id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
