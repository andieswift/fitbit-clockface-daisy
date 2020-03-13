import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from "power";
import userActivity from "user-activity";
import { HeartRateSensor } from "heart-rate";


// SELECTORS
const timeLabel = document.getElementById("timeLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const dateLabel = document.getElementById("dateLabel");
const dayLabel = document.getElementById("dayLabel");

//TIME
clock.granularity = "minutes";
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let day = today.getDay();
  let date = today.getDate();
  let month = today.getMonth();

  let dispDay = getDayName(day);
  let dispMonth = getMonthName(month);

  dateLabel.text = `${date} ${dispMonth}`;
  dayLabel.text = dispDay;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  timeLabel.text = `${hours}:${mins}`;
}

//BATTERY
let batteryValue = battery.chargeLevel;
batteryLabel.text = `${batteryValue}%`;

//STEPS
let stepsValue = (userActivity.today.adjusted["steps"] || 0);
stepsLabel.text = stepsValue;

//HEARTRATE
const hrm = new HeartRateSensor();

hrm.onreading = function () {
  heartRateLabel.text = `${hrm.heartRate}`
}
hrm.start();

//TODAY


function getDayName(day) {
  let days = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];
  return days[day];
}

function getMonthName(month) {
  let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[month];
}
