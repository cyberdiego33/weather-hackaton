// import { renderWeather } from "./views/weatherView.js";
import { GetWeatherResponse } from "./weatherModel.js";
import { DisplayCurrentData } from "./views/CurrentWView.js";
import { DisplayDailyForcast } from "./views/DailyView.js";
import { DisplayHourlyData } from "./views/HourlyView.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////
// APIs
// const bigDataUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

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
    alert("Couldn't get your location");
  }
};

// Error Handler if location is !gotten
const errorFunction = function (error: GeolocationPositionError): void {
  alert("Strange Location");
};

// Success callback if location is gotten
const successFunction = function (position: GeolocationPosition): void {
  const { latitude, longitude } = position.coords;
  console.log(latitude, longitude);

  // Use lat & lon to create api urls
  // prettier-ignore
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto
  `;

  const bigDataUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  // Send Urls to start app
  starterApp({ forecastUrl, bigDataUrl });
};

type Urls = {
  forecastUrl: string;
  bigDataUrl: string;
};

const starterApp = async function (urls: Urls): Promise<void> {
  try {
    // Calling GetWeatherFun to return state data
    const AppState = await GetWeatherResponse(urls);

    // Displaying the current data
    DisplayCurrentData(AppState.currentData);

    // Displaying the daily forecast
    DisplayDailyForcast(AppState.DailyData);

    // Displaying the Hourly data
    DisplayHourlyData(AppState.HourlyData);
  } catch (error) {
    console.error(`Error from startApp ${error}`);
  }
};

const init = function (): void {
  getCurrentLocation();
};

init();
