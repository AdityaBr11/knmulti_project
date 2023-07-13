import moment from "moment";

export const calculateNextTime = (startDate: Date, repeatNumber: any, repeatUnit : any) => {
  let a = moment(startDate).add(repeatNumber, repeatUnit).hours(0).minutes(0).seconds(0);
  let nextTime = moment(a).format().split("T")[0];
  return nextTime;
}