var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// WeatherState and Data holder
// I want the state have three objects
// 1. Current data
// 2. Daily forecast
// 3. Hourly forecast
/*
drizzle
fog
overcast
partly cloudly
rain
snow
storm
sunny
 */
const AppState = {
    currentData: {
        cityName: null,
        currentTime: null,
        weatherCode: null,
        metric: {
            temperature: null,
            feelsLike: null,
            humidity: null,
            wind: null,
            precipitation: null,
        },
        imperial: {
            temperature: null,
            feelsLike: null,
            humidity: null,
            wind: null,
            precipitation: null,
        },
    },
    DailyData: {
        dateArray: null,
        weatherCodeArray: [],
        metric: {
            maxTemp: [],
            minTemp: [],
        },
        imperial: {
            maxTemp: [],
            minTemp: [],
        },
        weekDays: [],
    },
    DailyHoursData: {
        Monday: {
            timeLgArray: [],
            feelslgArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
            weatherCodeArray: [],
        },
        Tuesday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
        Wednesday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
        Thursday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
        Friday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
        Saturday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
        Sunday: {
            timeLgArray: [],
            feelslgArray: [],
            weatherCodeArray: [],
            tempsObject: {
                imperial: [],
                metric: [],
            },
        },
    },
};
// Current Data = I want to get this types temperature, currentTime, feels_like, humidity, wind, precipitation
// Daily forecast = I want to get Day, max_temparature, min_temparature
// Hourly forecast = I want to get the an obj of 7 days each now containing timeArray, TempArray, apparentTemArray
//////////////////////////////////////////////////////////////////////////////
// Helper Functions
function getFormattedDate(dateValue, language, optionObj) {
    const data = new Date(dateValue);
    const options = optionObj;
    return new Intl.DateTimeFormat(language, options).format(data);
}
const GetTheWeekday = function (dateString) {
    const dateObject = new Date(dateString);
    // Use toLocaleString to get the weekday name
    const weekdayName = dateObject.toLocaleString("en-US", { weekday: "long" });
    return weekdayName; // Output: Thursday
};
// weatherMapper.ts
export function getWeatherDescription(code) {
    if (code === 0)
        return "sunny";
    if ([1].includes(code))
        return "partly-cloudy";
    if ([2].includes(code))
        return "partly-cloudy";
    if ([3].includes(code))
        return "overcast";
    if ([45, 48].includes(code))
        return "fog";
    if ([51, 53, 55, 56, 57].includes(code))
        return "drizzle";
    if ([61, 63, 65, 66, 67].includes(code))
        return "rain";
    if ([71, 73, 75, 77].includes(code))
        return "snow";
    if ([80, 81, 82].includes(code))
        return "rain";
    if ([95, 96, 99].includes(code))
        return "storm";
    return "overcast";
}
function convertToImp(celsius) {
    return (celsius * 9) / 5 + 32;
}
////////////////////////////////////////////////////////
// Abstractions
const SetCurrentData = function (data, cityName) {
    const { time, weathercode } = data.current_weather;
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
    AppState.currentData.weatherCode = getWeatherDescription(weathercode);
};
// for Current Data = Getting temperature, feels_like, humidity, wind, precipitation
const getMetricsData = function (data) {
    var _a, _b, _c;
    const { temperature, time, windspeed: wind } = data.current_weather;
    const index = data.hourly.time.indexOf(time.slice(0, -2) + "00");
    const feelsLike = (_a = data.hourly.apparent_temperature[index]) !== null && _a !== void 0 ? _a : null;
    const humidity = (_b = data.hourly.relative_humidity_2m[index]) !== null && _b !== void 0 ? _b : null;
    const precipitation = (_c = data.hourly.precipitation[index]) !== null && _c !== void 0 ? _c : null;
    return {
        temperature,
        feelsLike,
        humidity,
        wind,
        precipitation,
    };
};
// Taking Metrics and turning it into Imperials
const getImperialData = function (data) {
    const temperature = data.temperature !== null ? (data.temperature * 9) / 5 + 32 : null;
    const feelsLike = data.feelsLike !== null ? (data.feelsLike * 9) / 5 + 32 : null;
    const humidity = data.humidity; // stays the same
    const wind = data.wind !== null ? data.wind * 2.237 : null;
    const precipitation = data.precipitation !== null ? data.precipitation / 25.4 : null;
    return {
        temperature,
        feelsLike,
        humidity,
        wind,
        precipitation,
    };
};
// for Daily forecast = Day Array, max_temparature Array, min_temparature Array
const DailyForecast = function (data) {
    const { time, temperature_2m_max: maxTemp, temperature_2m_min: minTemp, weathercode, } = data.daily;
    const dateArray = time.map((el) => getFormattedDate(el, "en-US", { weekday: "short" }));
    const weekDays = time.map((el) => getFormattedDate(el, "en-US", { weekday: "long" }));
    const impMinTemp = minTemp.map((el) => convertToImp(el));
    const impMaxTemp = maxTemp.map((el) => convertToImp(el));
    const metric = {
        maxTemp,
        minTemp,
    };
    const imperial = {
        maxTemp: impMaxTemp,
        minTemp: impMinTemp,
    };
    const weatherCodeArray = weathercode.map((el) => getWeatherDescription(el));
    // console.log("Daily forecast data", dateArray, maxTemp, minTemp);
    return { dateArray, weatherCodeArray, metric, imperial, weekDays };
};
// for destructuring the large hourly data into DailyHoursData
const SelectDailyData = function (data) {
    const { hourly } = data;
    // console.log("hourly data", hourly);
    const { time: timeArray, apparent_temperature: feelsiconArray, temperature_2m: tempArray, weathercode: weathercodeArray, } = hourly;
    timeArray.forEach((dateString, index) => {
        const day = GetTheWeekday(dateString);
        if (AppState.DailyHoursData[day]) {
            AppState.DailyHoursData[day].timeLgArray.push(dateString);
            AppState.DailyHoursData[day].feelslgArray.push(feelsiconArray[index]);
            AppState.DailyHoursData[day].tempsObject.metric.push(tempArray[index]);
            AppState.DailyHoursData[day].tempsObject.imperial.push(convertToImp(tempArray[index]));
            AppState.DailyHoursData[day].weatherCodeArray.push(getWeatherDescription(weathercodeArray[index]));
        }
    });
    // console.log(timeArray, feelsiconArray, tempArray);
};
const SliceHourlyData = function (time, data) {
    const weekdaysKeyArray = Object.keys(data);
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
        // Slicing them by 12
        let slicedDate = data[day].timeLgArray.slice(indexStart, indexEnd);
        let slicedFeels = data[day].feelslgArray.slice(indexStart, indexEnd);
        let slicedMetTemps = data[day].tempsObject.metric.slice(indexStart, indexEnd);
        let sliceImpTemps = data[day].tempsObject.imperial.slice(indexStart, indexEnd);
        let slicedWeatCode = data[day].weatherCodeArray.slice(indexStart, indexEnd);
        // Updating the state
        AppState.DailyHoursData[day].timeLgArray = slicedDate;
        AppState.DailyHoursData[day].feelslgArray = slicedFeels;
        AppState.DailyHoursData[day].tempsObject.metric = slicedMetTemps;
        AppState.DailyHoursData[day].tempsObject.imperial = sliceImpTemps;
        AppState.DailyHoursData[day].weatherCodeArray = slicedWeatCode;
        // console.log("Slice hours", currentHourISO, indexStart, indexEnd);
    });
};
const DestructureWeather = function (data, cityName) {
    console.log(data);
    // Adding Data to AppState for the current weather data
    SetCurrentData(data, cityName);
    // Getting the default Metrics Data
    const metricData = getMetricsData(data);
    AppState.currentData.metric = metricData;
    // Using Metrics data to get imperial
    AppState.currentData.imperial = getImperialData(metricData);
    // Adding Data to AppState for the daily min/max temp
    AppState.DailyData = DailyForecast(data);
    // to Filter Data according to dates
    SelectDailyData(data);
    SliceHourlyData(data.current_weather.time, AppState.DailyHoursData);
    // console.log(AppState);
    return AppState;
};
//////////////////////////////////////////////////////////////////////////////////////////////
// Main controller
export const GetWeatherResponse = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ forecastUrl, bigDataUrl, }) {
        try {
            // getting city name
            const CityCountry = yield GetCountryBigData(bigDataUrl);
            console.log(CityCountry);
            // getting weather
            const getWeatherObj = yield OpenMeteoFunc(forecastUrl);
            // sending for destructuring
            return DestructureWeather(getWeatherObj, CityCountry);
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
};
// Getting Api Weather data from OpenMeteo
const OpenMeteoFunc = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error("Failed to fetch response");
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.log("Error coming from Open Meteo Api");
            throw new Error(`OpenMeteo: ${error}`);
        }
    });
};
const GetCountryBigData = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error("Failed to fetch response");
            const data = yield response.json();
            // console.log(data);
            const { city, countryName, countryCode } = data;
            let cityCountry = `${city}, ${countryName}`;
            if (cityCountry.length > 20)
                cityCountry = `${city}, ${countryCode}`;
            return cityCountry;
        }
        catch (error) {
            console.log("Error coming from Big Data Api");
            throw new Error(`bigData ${error}`);
        }
    });
};
//# sourceMappingURL=weatherModel.js.map