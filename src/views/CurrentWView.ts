import { currentDataType } from "../types.js";
// I need to select the city name, current date, temparature, feels_like, humidity, wind, precipitation

export const DisplayCurrentData = function (
  currentAppData: currentDataType
): void {
  const CityName = document.querySelector("#CityName")?.textContent;
  const CurrentDate = document.querySelector("#CurrentDate")?.textContent;
  const CurrentTemp = document.querySelector("#CurrentTemp")?.textContent;
  const CurrentFeels = document.querySelector("#CurrentFeels")?.textContent;
  const CurrentHumidity =
    document.querySelector("#CurrentHumidity")?.textContent;
  const CurrentWind = document.querySelector("#CurrentWind")?.textContent;
  const CurrentPrecipitation = document.querySelector(
    "#CurrentPrecipitation"
  )?.textContent;

  const elementsArray = [
    CityName,
    CurrentDate,
    CurrentTemp,
    CurrentFeels,
    CurrentHumidity,
    CurrentWind,
    CurrentPrecipitation,
  ];
  // console.log(Object.values(currentAppData));
};
