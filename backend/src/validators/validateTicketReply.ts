import { ITicketReply } from "../db/schema/tickets";

const validateTicketReply = (replies: ITicketReply) => {
  if (!replies) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!replies.reply) errors.push({ message: "Reply is required" });
  // if (!replies.user) errors.push({ message: "User is required" });
  return errors;
};

export default validateTicketReply;
