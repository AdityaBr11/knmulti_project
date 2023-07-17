import React from 'react'

const Convert12To24 = (time12h ) => {
    const [time, modifier] = time12h.split(" ");
 
    let [hours, minutes] = time.split(":");
   
    if (hours === "12") {
      hours = "00";
    }
   
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
   
    return `${hours}:${minutes}`;
}

export default Convert12To24