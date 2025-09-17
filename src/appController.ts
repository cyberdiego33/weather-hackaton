// import { renderWeather } from "./views/weatherView.js";
import { GetWeatherResponse } from "./weatherModel.js";
import { CurrentView } from "./views/CurrentWView.js";
import { DailyView } from "./views/DailyView.js";
import { HourlyView } from "./views/HourlyView.js";
import { Urls } from "./types.js";
import { spinner, ErrorHandler } from "./events/inputController.js";
import { UnitsEvents } from "./events/unitsController.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////
// APIs
// const bigDataUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

////////////////////////////////////////////////////////////////////////////////
// Helper function

//////////////////////////////////////////////////////////////////////////////

// 1. Get users location from browser
// 2. Load the lat and lang to get more data on country
// 3. Use city to get weather data
// 4. display data in UI
// 5. take input and repeat

// 1. Get current location
const getCurrentLocation = function (): void {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } else {
    ErrorHandler("Counldn't get your location");
  }
};
// Error Handler if location is !gotten
const errorFunction = function (error: GeolocationPositionError): void {
  ErrorHandler("Coundn't fetch Location");
};

// Success callback if location is gotten
const successFunction = function (position: GeolocationPosition): void {
  const { latitude, longitude } = position.coords;
  console.log(latitude, longitude);

  // Send lat & lon to start app
  starterApp({ latitude, longitude });
};

type coordsType = { latitude: number; longitude: number };

// Reusable for starting the app
export const starterApp = async function (coords: coordsType): Promise<void> {
  const { latitude, longitude } = coords;

  // Use lat & lon to create api urls
  // prettier-ignore
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
&current_weather=true
&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,windspeed_10m,weathercode
&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,weathercode
&timezone=auto`;

  const bigDataUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  const urls: Urls = { forecastUrl, bigDataUrl };
  spinner("on");
  try {
    // Calling GetWeatherFun to return state data
    const AppState = await GetWeatherResponse(urls);

    // Sending the current data into Current view
    CurrentView.setData(AppState.currentData);

    // Rendering the current view
    CurrentView.renderAll();

    // Displaying the daily forecast
    DailyView.DisplayDailyForcast(AppState.DailyData);

    // Displaying the Hourly data
    HourlyView.DisplayHourlyData(
      AppState.DailyHoursData,
      AppState.DailyData.weekDays
    );

    UnitsEvents();
  } catch (error) {
    window.location.href = "../src/error.html";
  } finally {
    spinner("off");
  }
};

const init = function (): void {
  getCurrentLocation();
};

init();
