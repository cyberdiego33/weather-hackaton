import { DailyForecastType } from "../types";
export const DisplayDailyForcast = function (dailyDataObj: DailyForecastType) {
  // console.log(dailyDataObj);
  const DailyForecast = document.querySelectorAll(".DailyForecast");

  DailyForecast.forEach((node, i) => {
    const weekDay = node.querySelector(".weekDay");
    const maxTemp = node.querySelector(".maxTemp");
    const minTemp = node.querySelector(".minTemp");

    const day = dailyDataObj.dateArray?.[i] ?? "";
    const max = dailyDataObj.maxTemp?.[i];
    const min = dailyDataObj.minTemp?.[i];

    if (weekDay) weekDay.textContent = day;
    if (maxTemp) {
      if (typeof max === "number") {
        maxTemp.textContent = String(Math.ceil(max));
      } else {
        maxTemp.textContent = "_"; // fallback if no number available
      }
    }
    if (minTemp) {
      if (typeof min === "number") {
        minTemp.textContent = String(Math.ceil(min));
      } else {
        minTemp.textContent = "_"; // fallback if no number available
      }
    }

    // console.log(`Div ${i}:`, [weekDay, day], [maxTemp, max], [minTemp, min]);
  });
};
