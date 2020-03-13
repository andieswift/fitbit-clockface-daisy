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

//TIME
clock.granularity = "minutes";
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
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
