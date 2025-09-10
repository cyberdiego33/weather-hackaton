import { time } from "console";
import {
  WeatherResp,
  statetype,
  Urls,
  DailyForecastType,
  currentDataType,
  HourlyForecastType,
  optionsDate,
} from "./types.js";

// WeatherState and Data holder
// I want the state have three objects
// 1. Current data
// 2. Daily forecast
// 3. Hourly forecast

// (
//       "Current Weather Selected",
//       CityName,
//       CurrentDate,
//       CurrentTemp,
//       CurrentFeels,
//       CurrentHumidity,
//       CurrentWind,
//       CurrentPrecipitation
//     );

const AppState: statetype = {
  currentData: {
    cityName: null,
    currentTime: null,
    temperature: null,
    feelsLike: null,
    humidity: null,
    wind: null,
    precipitation: null,
  },
  DailyData: {
    dateArray: null,
    maxTemp: null,
    minTemp: null,
  },
  HourlyData: {
    timeArray: null,
    apparentTempArray: null,
    tempArray: null,
  },
};

// Current Data = I want to get this types temperature, currentTime, feels_like, humidity, wind, precipitation
// Daily forecast = I want to get Day, max_temparature, min_temparature
// Hourly forecast = I want to get the next 8 hours and their temparature and also apparent_temp

//////////////////////////////////////////////////////////////////////////////
// Helper Functions

/*function getFormattedDate(currentDate : Date) {
  // const now = new Date();
  const options = {
    weekday: "long", // Tuesday
    year: "numeric", // 2025
    month: "long", // August
    day: "numeric", // 20
  };

  return new Intl.DateTimeFormat("en-US", options).format(currentDate);
}*/

function getFeelsLikeCondition(
  temp: number,
  apparentTemp: number,
  precipitation: number,
  humidity: number
): string {
  // If there’s precipitation, decide rain/drizzle/snow
  if (precipitation > 10) return "Thunderstorm";
  if (precipitation > 2) return "Rain";
  if (precipitation > 0) return "Drizzle";

  // If temp < 0 or apparentTemp < 0
  if (temp < 0 || apparentTemp < 0) return "Snow";

  // If very humid
  if (humidity > 85) return "Overcast Cloud";

  // If moderate humidity
  if (humidity > 60) return "Broken Cloud";

  // Otherwise, clear
  return "Clear Sky";
}

// for Current Data = Getting temperature, currentTime, feels_like, humidity, wind, precipitation
const getCurrentData = function (
  data: WeatherResp,
  cityName: string
): currentDataType {
  const {
    temperature,
    time: currentTime,
    windspeed: wind,
  } = data.current_weather;

  // console.log(currentTime);
  const index = data.hourly.time.indexOf(currentTime.slice(0, -2) + "00");
  // console.log(index);

  const apparentTemp = data.hourly.apparent_temperature[index] ?? null;
  const humidity = data.hourly.relative_humidity_2m[index] ?? null;
  const precipitation = data.hourly.precipitation[index] ?? null;
  const feelsLike = getFeelsLikeCondition(
    temperature,
    apparentTemp!,
    precipitation ?? 0,
    humidity!
  );

  return {
    cityName,
    currentTime,
    temperature,
    feelsLike,
    humidity,
    wind,
    precipitation,
  };
};

// for Daily forecast = Day Array, max_temparature Array, min_temparature Array
const DailyForecast = function (data: WeatherResp): DailyForecastType {
  const {
    time: dateArray,
    temperature_2m_max: maxTemp,
    temperature_2m_min: minTemp,
  } = data.daily;
  // console.log("Daily forecast data", dateArray, maxTemp, minTemp);
  return { dateArray, maxTemp, minTemp };
};

// for Hourly forecast = hours Array(8), temparature Array(8) and apparent_temp Array(8)
const HourlyForecast = function (data: WeatherResp): HourlyForecastType {
  const setHour = data.current_weather.time.slice(0, -2) + "00";
  let starting = data.hourly.time.findIndex((t) => t === setHour);

  if (starting === -1) starting = 0;

  return {
    timeArray: data.hourly.time.slice(starting, starting + 8),
    apparentTempArray: data.hourly.apparent_temperature.slice(
      starting,
      starting + 8
    ),
    tempArray: data.hourly.temperature_2m.slice(starting, starting + 8),
  };
};

const DestructureWeather = function (
  data: WeatherResp,
  cityName: string
): statetype {
  console.log(data);
  // Adding Data to AppState for the current weather data
  AppState.currentData = getCurrentData(data, cityName);

  // Adding Data to AppState for the daily min/max temp
  AppState.DailyData = DailyForecast(data);

  // Getting hourly forecast
  AppState.HourlyData = HourlyForecast(data);
  console.log(AppState);

  return AppState;
};

//////////////////////////////////////////////////////////////////////////////////////////////

export const GetWeatherResponse = async function ({
  forecastUrl,
  bigDataUrl,
}: Urls): Promise<statetype> {
  try {
    // getting city name
    const CityCountry = await GetCountryBigData(bigDataUrl);
    console.log(CityCountry);

    // getting weather
    // console.log(forecastUrl);
    const getWeatherObj = await OpenMeteoFunc(forecastUrl);

    // sending for destructuring
    return DestructureWeather(getWeatherObj, CityCountry);
  } catch (error) {
    throw new Error(`Error from getweather: ${error}`);
  }
};

// Getting Api Weather data from OpenMeteo
const OpenMeteoFunc = async function (url: string): Promise<WeatherResp> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch response");

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`OpenMeteo: ${error}`);
  }
};

// Getting Api City data from BigData
type cityCountry = string;
const GetCountryBigData = async function (url: string): Promise<cityCountry> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      alert("Failed to fetch response");
      throw new Error("Failed to fetch response");
    }

    const { city, countryName } = await response.json();
    const cityCountry: string = `${city}, ${countryName}`;

    return cityCountry;
  } catch (error) {
    throw new Error(`bigData ${error}`);
  }
};
