import { ICreditNote } from "../db/schema/creditNote";

const validateCreditNotes = (creditNote: ICreditNote) => {
  if (!creditNote) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!creditNote.customer) errors.push({ message: "Customer and its details are required" });
  if (creditNote.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  if (creditNote.creditNote === null) errors.push({message: "Please provide a Credit Note#"});
  if (creditNote.creditDate === null) errors.push({message: "Please provide the Credit Date"});
  return errors;
};

export default validateCreditNotes;