import { time } from "console";
import {
  WeatherResp,
  statetype,
  Urls,
  DailyForecastType,
  MetricsDataType,
  imperialDataType,
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
    metricData: {
      temperature: null,
      feelsLike: null,
      humidity: null,
      wind: null,
      precipitation: null,
    },
    imperialData: {
      temperature: null,
      feelsLike: null,
      humidity: null,
      wind: null,
      precipitation: null,
    },
  },
  DailyData: {
    dateArray: null,
    maxTemp: [],
    minTemp: [],
    weekDays: [],
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

function getFormattedDate(dateValue: string, language: string, optionObj: {}) {
  const data = new Date(dateValue);
  const options: Intl.DateTimeFormatOptions = optionObj;

  return new Intl.DateTimeFormat(language, options).format(data);
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

// Abstractions

const SetCurrentData = function (data: WeatherResp, cityName: string): void {
  const { time } = data.current_weather;

  // getFormattedDate(time)
  const currentTime = getFormattedDate(time, navigator.language, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // console.log(currentTime);

  AppState.currentData.cityName = cityName;
  AppState.currentData.currentTime = currentTime;
};

// for Current Data = Getting temperature, feels_like, humidity, wind, precipitation
const getMetricsData = function (data: WeatherResp): MetricsDataType {
  const { temperature, time, windspeed: wind } = data.current_weather;

  const index = data.hourly.time.indexOf(time.slice(0, -2) + "00");

  const feelsLike = data.hourly.apparent_temperature[index] ?? null;
  const humidity = data.hourly.relative_humidity_2m[index] ?? null;
  const precipitation = data.hourly.precipitation[index] ?? null;

  return {
    temperature,
    feelsLike,
    humidity,
    wind,
    precipitation,
  };
};

// Taking Metrics and turning it into Imperials
const getImperialData = function (data: MetricsDataType): imperialDataType {
  const temperature =
    data.temperature !== null ? (data.temperature * 9) / 5 + 32 : null;
  const feelsLike =
    data.feelsLike !== null ? (data.feelsLike * 9) / 5 + 32 : null;
  const humidity = data.humidity; // stays the same
  const wind = data.wind !== null ? data.wind * 2.237 : null;
  const precipitation =
    data.precipitation !== null ? data.precipitation / 25.4 : null;
  return {
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
    getFormattedDate(el, "en-US", { weekday: "short" })
  );

  const weekDays = time.map((el) =>
    getFormattedDate(el, "en-US", { weekday: "long" })
  );
  // console.log("Daily forecast data", dateArray, maxTemp, minTemp);
  return { dateArray, maxTemp, minTemp, weekDays };
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

const SliceHourlyData = function (time: string, data: DailyHoursDataType) {
  const weekdaysKeyArray = Object.keys(data) as (keyof DailyHoursDataType)[];

  // Taking only the date - hour and adding the mins "00"
  const currentHourISO = new Date(time).toISOString().slice(11, 13) + ":00";
  // e.g. "2025-09-11T15:00"

  // Loop through the weekdays
  weekdaysKeyArray.forEach((day) => {
    const dates = data[day].timeLgArray; // Using the Monday.Time array

    // to compare currentIso and find index
    let indexStart = dates.findIndex((d) => d.endsWith(currentHourISO));
    let indexEnd = indexStart + 12;

    if (indexEnd > dates.length) {
      indexStart = dates.length - 12; // shift back so you still get 8 items
      indexEnd = dates.length;
    }

    // Slicing them by 7
    let slicedDate = data[day].timeLgArray.slice(indexStart, indexEnd);
    let slicedFeels = data[day].feelslgArray.slice(indexStart, indexEnd);
    let slicedTemps = data[day].tempLgArray.slice(indexStart, indexEnd);

    // Updating the state
    AppState.DailyHoursData[day].timeLgArray = slicedDate;
    AppState.DailyHoursData[day].feelslgArray = slicedFeels;
    AppState.DailyHoursData[day].tempLgArray = slicedTemps;

    // console.log("Slice hours", currentHourISO, indexStart, indexEnd);
  });
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
  SetCurrentData(data, cityName);

  // Getting the default Metrics Data
  const metricData = getMetricsData(data);
  AppState.currentData.metricData = metricData;

  // Using Metrics data to get imperial
  AppState.currentData.imperialData = getImperialData(metricData);

  // Adding Data to AppState for the daily min/max temp
  AppState.DailyData = DailyForecast(data);

  // Getting hourly forecast
  AppState.HourlyData = HourlyForecast(data);

  // to Filter Data according to dates
  SelectDailyData(data);

  SliceHourlyData(data.current_weather.time, AppState.DailyHoursData);
  console.log(AppState);

  return AppState;
};

//////////////////////////////////////////////////////////////////////////////////////////////
// Main controller

export const GetWeatherResponse = async function ({
  forecastUrl,
  bigDataUrl,
}: Urls): Promise<statetype> {
  try {
    // getting city name
    const CityCountry = await GetCountryBigData(bigDataUrl);
    console.log(CityCountry);

    // getting weather
    const getWeatherObj = await OpenMeteoFunc(forecastUrl);

    // sending for destructuring
    return DestructureWeather(getWeatherObj, CityCountry);
  } catch (error) {
    throw new Error(`${error}`);
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
    console.log("Error coming from Open Meteo Api");
    throw new Error(`OpenMeteo: ${error}`);
  }
};

// Getting Api City data from BigData
type cityCountry = string;
const GetCountryBigData = async function (url: string): Promise<cityCountry> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch response");

    const data = await response.json();
    // console.log(data);
    const { city, countryName, countryCode } = data;
    let cityCountry: string = `${city}, ${countryName}`;

    if (cityCountry.length > 20) cityCountry = `${city}, ${countryCode}`;

    return cityCountry;
  } catch (error) {
    console.log("Error coming from Big Data Api");
    throw new Error(`bigData ${error}`);
  }
};
