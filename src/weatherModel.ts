import { time } from "console";
import {
  WeatherResp,
  statetype,
  Urls,
  DailyForecastType,
  currentDataType,
  HourlyForecastType,
  WeekdayType,
  DailyHoursDataType,
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
    maxTemp: [],
    minTemp: [],
  },
  HourlyData: {
    timeArray: [],
    apparentTempArray: [],
    tempArray: [],
  },
  DailyHoursData: {
    Monday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Tuesday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Wednesday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Thursday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Friday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Saturday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
    Sunday: {
      timeLgArray: [],
      feelslgArray: [],
      tempLgArray: [],
    },
  },
};

// Current Data = I want to get this types temperature, currentTime, feels_like, humidity, wind, precipitation
// Daily forecast = I want to get Day, max_temparature, min_temparature
// Hourly forecast = I want to get the an obj of 7 days each now containing timeArray, TempArray, apparentTemArray

//////////////////////////////////////////////////////////////////////////////
// Helper Functions

function getFormattedDate(dateValue: string, optionObj: {}) {
  const data = new Date(dateValue);
  const options: Intl.DateTimeFormatOptions = optionObj;

  return new Intl.DateTimeFormat("en-US", options).format(data);
}

const GetTheWeekday = function (dateString: string): WeekdayType {
  const dateObject = new Date(dateString);

  // Use toLocaleString to get the weekday name
  const weekdayName = dateObject.toLocaleString("en-US", { weekday: "long" });

  return weekdayName as WeekdayType; // Output: Thursday
};

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
    time,
    windspeed: wind,
    weathercode: feelsLike,
  } = data.current_weather;

  const index = data.hourly.time.indexOf(time.slice(0, -2) + "00");
  // console.log(index);

  const apparentTemp = data.hourly.apparent_temperature[index] ?? null;
  const humidity = data.hourly.relative_humidity_2m[index] ?? null;
  const precipitation = data.hourly.precipitation[index] ?? null;

  // getFormattedDate(time)
  const currentTime = getFormattedDate(time, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // console.log(currentTime);

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
    time,
    temperature_2m_max: maxTemp,
    temperature_2m_min: minTemp,
  } = data.daily;

  const dateArray = time.map((el) =>
    getFormattedDate(el, { weekday: "short" })
  );
  // console.log("Daily forecast data", dateArray, maxTemp, minTemp);
  return { dateArray, maxTemp, minTemp };
};

// for destructuring the large hourly data into DailyHoursData
const SelectDailyData = function (data: WeatherResp) {
  const { hourly } = data;
  // console.log("hourly data");

  const {
    time: timeArray,
    apparent_temperature: feelsiconArray,
    temperature_2m: tempArray,
  } = hourly;

  timeArray.forEach((dateString, index) => {
    const day = GetTheWeekday(dateString);
    if (AppState.DailyHoursData[day]) {
      AppState.DailyHoursData[day].timeLgArray.push(dateString);
      AppState.DailyHoursData[day].feelslgArray.push(feelsiconArray[index]!);
      AppState.DailyHoursData[day].tempLgArray.push(tempArray[index]!);
    }
  });

  // console.log(timeArray, feelsiconArray, tempArray);
};

const SliceHourlyData = function (data: DailyHoursDataType) {
  const weekdaysKeyArray = Object.keys(data);

  // slice each weekday down to 8 from the current hour
  const now = new Date();
  const currentHourISO = now.toISOString().slice(0, 13) + ":00";
  // e.g. "2025-09-11T15:00"

  weekdaysKeyArray.forEach((el, i) => {});
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

  // to Filter Data according to dates
  SelectDailyData(data);

  SliceHourlyData(AppState.DailyHoursData);
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

/*
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, and overcast |
| 45, 48 | Fog and depositing rime fog |
| 51, 53, 55 | Drizzle: Light, moderate, and dense intensity |
| 56, 57 | Freezing Drizzle: Light and dense intensity |
| 61, 63, 65 | Rain: Slight, moderate, and heavy intensity |
| 66, 67 | Freezing Rain: Light and heavy intensity |
| 71, 73, 75 | Snow fall: Slight, moderate, and heavy intensity |
| 77 | Snow grains |
| 80, 81, 82 | Rain showers: Slight, moderate, and violent |
| 85, 86 | Snow showers slight and heavy |
| 95 | Thunderstorm: Slight or moderate |
| 96, 99 | Thunderstorm with slight and heavy hail
*/
