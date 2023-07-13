interface Activity {
  activityType: string;
  description: string;
  link: string;
  dateTime: Date;
}
const validateActivities = (activitiy: Activity) => {
  const errors: Array<{ message: string }> = [];
  if (!activitiy.activityType) errors.push({ message: "No activity Provided" });
  if (!activitiy.description)
    errors.push({ message: "Description is not given" });
  if (!activitiy.link) errors.push({ message: "Link is not provided" });
  if (!activitiy.dateTime) errors.push({ message: "something went Worng" });
  return errors;
};
export default validateActivities;
