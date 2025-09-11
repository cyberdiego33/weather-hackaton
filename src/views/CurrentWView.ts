import { currentDataType } from "../types.js";
// I need to select the city name, current date, temparature, feels_like, humidity, wind, precipitation

export const DisplayCurrentData = function (
  currentAppData: currentDataType
): void {
  const CityName = document.querySelector("#CityName");
  const CurrentDate = document.querySelector("#CurrentDate");
  const CurrentTemp = document.querySelector("#CurrentTemp");
  const CurrentFeels = document.querySelector("#CurrentFeels");
  const CurrentHumidity = document.querySelector("#CurrentHumidity");
  const CurrentWind = document.querySelector("#CurrentWind")!;
  const CurrentPrecipitation = document.querySelector("#CurrentPrecipitation");

  const elementsArray = [
    CityName,
    CurrentDate,
    CurrentTemp,
    CurrentFeels,
    CurrentHumidity,
    CurrentWind,
    CurrentPrecipitation,
  ];

  elementsArray.forEach((el, i) => {
    if (el) {
      const value = Object.values(currentAppData)[i];
      el.textContent = value !== null ? String(value) : "";
    }
  });
};
