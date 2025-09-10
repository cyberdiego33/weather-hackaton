import { HourlyForecastType } from "../types.js";

export const DisplayHourlyData = function (
  HourlyData: HourlyForecastType
): void {
  console.log(HourlyData);
  const HourlyForecast = document.querySelectorAll(".HourlyForecast");

  HourlyForecast.forEach((el, i) => {
    const hour = el.querySelector(".hour");
    const temp = el.querySelector(".temp");

    console.log(`Hourly Forecast ${i}`, hour, temp);
  });

  DropdownDateView();
};

const DropdownDateView = function (): void {
  const DropdownDate = document.querySelectorAll(".DropdownDate");

  DropdownDate.forEach((el, i) => {
    console.log(`Day`, el.textContent);
  });
};
