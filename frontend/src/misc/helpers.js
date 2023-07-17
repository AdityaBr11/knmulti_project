import { DAILY_WORKING_HOURS } from './constants';

export const dateFormatter = (unFormattedDate) => {
  const date = new Date(unFormattedDate);
  const formattedDate = `${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getFullYear()}`;
  return formattedDate;
};

export const fileToDataURI = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    //TODO: add condition check for no file and reject message
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

//checks if this is employee's first login of the day
//returns present timesheet if yes, false otherwise
//date : new Date()
export const checkIsEmployeePresent = (id, date, list) => {
  const empData = list.filter((emp) => emp?.employee === id);
  for (let index = 0; index < empData.length; index++) {
    const element = empData[index];
    if (
      date.toLocaleDateString() === new Date(element?.date).toLocaleDateString()
    ) {
      return element;
    }
  }
  return false;
};

// Date.prototype.getWeek = (dowOffset) => {
//   dowOffset = typeof dowOffset == 'number' ? dowOffset : 0; //default dowOffset to zero
//   var newYear = new Date(this.getFullYear(), 0, 1);
//   var day = newYear.getDay() - dowOffset; //the day of week the year begins on
//   day = day >= 0 ? day : day + 7;
//   var daynum =
//     Math.floor(
//       (this.getTime() -
//         newYear.getTime() -
//         (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
//         86400000
//     ) + 1;
//   var weeknum;
//   //if the year starts before the middle of a week
//   if (day < 4) {
//     weeknum = Math.floor((daynum + day - 1) / 7) + 1;
//     if (weeknum > 52) {
//       nYear = new Date(this.getFullYear() + 1, 0, 1);
//       nDay = nYear.getDay() - dowOffset;
//       nDay = nDay >= 0 ? nDay : nDay + 7;
//       /*if the next year starts before the middle of
//               the week, it is week #1 of that year*/
//       weeknum = nDay < 4 ? 1 : 53;
//     }
//   } else {
//     weeknum = Math.floor((daynum + day - 1) / 7);
//   }
//   return weeknum;
// };

export const timeDifference = (start, stop) => {
  const milliseconds = stop - start;
  const seconds = milliseconds / 1000;
  const hours = seconds / 3600;
  return hours;
};

// export const totalTimeThisWeek = (id, week, list) => {
//   const empData = list.filter((emp) => emp?.employee === id);
//   for (let index = 0; index < empData.length; index++) {
//     const element = empData[index];
//     if (date.getWeek() === new Date(element?.date).getWeek()) {
//       return element;
//     }
//   }
//   return false;
// };

export const totalTimeThisMonth = (id, month, list) => {
  const empData = list.filter((emp) => emp?.employee === id);
  let sum = 0;
  for (let index = 0; index < empData.length; index++) {
    const element = empData[index];
    if (new Date(element?.date).getMonth() === month) sum += element?.hours;
  }
  return sum;
};

export const totalNumberOfOvertimes = (id, list) => {
  const empData = list.filter((emp) => emp?.employee === id);
  let count = 0;
  for (let index = 0; index < empData.length; index++) {
    const element = empData[index];
    if (element?.hours > 9) count++;
  }
  return count;
};

export const filterAttendance = (list, queries) => {
  const { date, month, year } = queries;
  // console.log(queries,list,'listlist');
  if (date) {
    return list.filter(
      (element) =>
        new Date(element?.date).toLocaleDateString() ===
        date.toLocaleDateString()
    );
  }
  if (month) {
    if (year) {
      console.log('inside here...');
      return list.filter(
        (element) =>
          new Date(element?.date).getMonth() === month.value &&
          new Date(element?.date).getFullYear() === year.value
      );
    }
    return list.filter(
      (element) => new Date(element?.date).getMonth() === month.value
    );
  }
  return [];
};
export const filterAttendance1 = (list, start,end) => {
  // const { date, month, year } = queries;
  var count=0;
  var startdate=start.split('-');
  var enddate=end.split('-');
  
  const date =startdate[2];
  const month =startdate[1];
  const year =startdate[0];
  const dateend =enddate[2];
  const monthend =enddate[1];
  const yearend =enddate[0];
  console.log(monthend,month ,year,'listlist');
  
  // console.log(month,monthend,'sssssss')
  if(month ==monthend){
    for(let i = date; i < dateend ; i++) {
      var date1 =`${monthend}/${i}/${yearend}`;
      list.filter(
            (element) =>{
              if(new Date(element?.date).toLocaleDateString() ===
              new Date(date1).toLocaleDateString()){
                count += 1;
                }
            });
      // console.log(date1,'sssssss');
    }
  }else{
    return 'monthisnotsame'
  }
  // console.log(count,'sssssss1414');
  
  return count;
};

export const dateDiff = (first, second) => {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  // console.log(first,second,'dateDiff');
  return Math.round((second - first) / (1000 * 60 * 60 * 24));

};


export const employeesPresentOnDate = (list, date = new Date()) => {
  return list.filter(
    (timesheet) =>
      new Date(timesheet?.date).toLocaleDateString() ===
      date.toLocaleDateString()
  );
};

//I changed this daysInMonth helper func. from original as per requirement,24/07/2022
export const daysInMonth = (month, year) => {
  if(month === new Date().getMonth() && year === new Date().getFullYear()){
    return new Date().getDate()
  }else{return new Date(year, month + 1, 0).getDate()}
};

//format:"12 : 40 :12"
export const timeSplitter = (timeString) => {
  const arr = timeString.split(':');
  const hours = parseInt(arr[0]);
  const minutes = parseInt(arr[1]);
  const seconds = parseInt(arr[2]);
  return { hours, minutes, seconds };
};

//EXPERIMENTAL
export const dateTimeSplitterWrapper = (timeString = '', date = new Date()) => {
  let dateObj = new Date(date);
  let year,
    month,
    dateNum,
    hours = null,
    minutes = null,
    seconds = null,
    millis;

  year = dateObj.getFullYear();
  month = dateObj.getMonth();
  dateNum = dateObj.getDate();
  millis = dateObj.getMilliseconds();
  if (timeString) {
    hours = timeSplitter(timeString).hours;
    minutes = timeSplitter(timeString).minutes;
    seconds = timeSplitter(timeString).seconds;
  }
  return new Date(year, month, dateNum, hours, minutes, seconds);
};

export const localeDateStringToDateObj = (string) => {
  const arr = String(string).split('/');
  return new Date(arr[2], arr[1] - 1, arr[0]);
};

export const calculateOvertimeHoursThisMonth = (
  id,
  list,
  month = new Date().getMonth()
) => {
  let arr = list.filter(
    (ts) =>
      ts.employee === id &&
      new Date(ts.date).getMonth() === month &&
      ts.hours > DAILY_WORKING_HOURS
  );
  let total = 0;
  for (let index = 0; index < arr.length; index++) {
    const element = array[index];
    total += DAILY_WORKING_HOURS - element?.hours;
  }
  return total;
};
