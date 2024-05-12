import axios from "axios";

export const getMilestones = async ({ courseId }: { courseId: string }) => {
  const milestones = await axios.get(`/api/courses/${courseId}/milestones`);
  return milestones.data;
};
