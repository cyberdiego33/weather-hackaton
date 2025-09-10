import { DailyForecastType } from "../types";
export const DisplayDailyForcast = function (dailyDataObj: DailyForecastType) {
  console.log(dailyDataObj);
  const DailyForecast = document.querySelectorAll(".DailyForecast");

  DailyForecast.forEach((el, i) => {
    const minTemp = el.querySelector(".minTemp");
    const maxTemp = el.querySelector(".maxTemp");

    console.log(`Div ${i}:`, minTemp, maxTemp);
  });
};
