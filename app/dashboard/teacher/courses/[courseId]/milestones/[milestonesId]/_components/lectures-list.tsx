"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip } from "lucide-react";
import { LectureEditForm } from "./lecture-edit-form";

interface LecturesListProps {
  item: {
    _id: string;
    title: string;
    videoId: string;
    position: number;
    isPublished: boolean;
  }[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  courseId: string;
  milestoneId: string;
}

export const LecturessList = ({
  item,
  onReorder,
  courseId,
  milestoneId,
}: LecturesListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lectures, setLectures] = useState(item);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLectures(item);
  }, [item]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(lectures);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedMilestones = items.slice(startIndex, endIndex + 1);

    setLectures(items);

    const bulkUpdateData = updatedMilestones.map((milestone) => ({
      id: milestone._id,
      position: items.findIndex((item) => item._id === milestone._id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lectures">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lectures.map((lecture, index) => (
              <Draggable
                key={lecture._id}
                draggableId={lecture._id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`flex items-center gap-x-2 bg-gray-200 border-gray-200 border text-gray-700 rounded-md mb-4 text-sm
                                            ${
                                              lecture.isPublished &&
                                              "bg-blue-100 border-blue-200 text-blue-700"
                                            }
                                            dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300
                                            dark:${
                                              lecture.isPublished &&
                                              "bg-blue-800 border-blue-600 text-blue-300"
                                            }
                                        `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={`px-2 py-3 border-r border-r-gray-200 hover:bg-gray-300 rounded-l-md transition
                                                ${
                                                  lecture.isPublished &&
                                                  "border-r-blue-200 hover:bg-blue-200"
                                                }
                                                dark:border-r-slate-800 dark:hover:bg-slate-700
                                                dark:${
                                                  lecture.isPublished &&
                                                  "border-r-blue-600 hover:bg-blue-800"
                                                }
                                            `}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <LectureEditForm
                      initialData={lecture}
                      courseId={courseId}
                      milestoneId={milestoneId}
                    />
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
