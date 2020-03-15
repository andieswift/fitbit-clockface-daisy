import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from "power";
import userActivity from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";


// SELECTORS
const timeLabel = document.getElementById("timeLabel");
const batteryLabel = document.getElementById("batteryLabel");
const stepsLabel = document.getElementById("stepsLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const dateLabel = document.getElementById("dateLabel");
const dayLabel = document.getElementById("dayLabel");
const batteryFill = document.getElementById("battery-color");

//CHOOSING BACKGROUND POSITION ACCORDING TO DEVICE
if (device.screen.width === 300) {
  img.x = -5;
  img.y = -5;
  img.width = 315;
  img.height = 315;
  img.href = 'daisy-versa.jpg';
} else {
  img.href = 'daisy-ionic.jpg';
}

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

  //BATTERY
  let batteryValue = battery.chargeLevel;
  batteryLabel.text = `${batteryValue}%`;
  let color = chooseBatteryColor(batteryValue);


  //STEPS
  let stepsValue = (userActivity.today.adjusted["steps"] || 0);
  stepsLabel.text = stepsValue;
}


//CHANGE BATTERY COLOR
function chooseBatteryColor(percentage) {
  if (percentage >= 50) {
    batteryFill.style.fill = '#6dc74a';
  } else if (percentage >= 25) {
    batteryFill.style.fill = '#f7f25e';
  } else {
    batteryFill.style.fill = '#fc4e54';
  }

  percentage = .01 * percentage;
  batteryFill.width = percentage * 24;
}

if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    heartRateLabel.text = `${hrm.heartRate}`;
  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}

//TODAY


function getDayName(day) {
  let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[day];
}

function getMonthName(month) {
  let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[month];
}
