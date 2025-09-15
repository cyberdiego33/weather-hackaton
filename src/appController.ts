// import { renderWeather } from "./views/weatherView.js";
import { GetWeatherResponse } from "./weatherModel.js";
import { CurrentView } from "./views/CurrentWView.js";
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

  // Send lat & lon to start app
  starterApp({ latitude, longitude });
};

type Urls = {
  forecastUrl: string;
  bigDataUrl: string;
};

type coordsType = { latitude: number; longitude: number };

// Reusable for starting the app
const starterApp = async function (coords: coordsType): Promise<void> {
  const { latitude, longitude } = coords;

  // Use lat & lon to create api urls
  // prettier-ignore
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto
  `;

  const bigDataUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  const urls: Urls = { forecastUrl, bigDataUrl };
  try {
    // Calling GetWeatherFun to return state data
    const AppState = await GetWeatherResponse(urls);

    // Sending the current data into Current view
    CurrentView.setData(AppState.currentData);

    // Rendering the current view
    CurrentView.renderAll();

    // Displaying the daily forecast
    DisplayDailyForcast(AppState.DailyData);

    // Displaying the Hourly data
    DisplayHourlyData(AppState.DailyHoursData, AppState.DailyData.weekDays);
  } catch (error) {
    console.error(`Error from startApp ${error}`);
  }
};

///////////////////////////////////////////////////////////////////////////////////////
// User input event handler
const FormDiv = document.querySelector<HTMLElement>("form");
if (FormDiv instanceof HTMLElement) {
  FormDiv.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputCity = FormDiv.querySelector("input");

    if (!(inputCity instanceof HTMLElement)) return;

    const city = inputCity.value;

    if (!city) alert("nothing");

    const coords = await SearchCity(city);

    if (coords) {
      // Call your startApp here
      starterApp(coords);
    }

    inputCity.value = "";
    inputCity.blur();
  });
}

type GeoResponse = {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
  }[];
};

// Reusable function to get lat/lon from a city name
const SearchCity = async (
  city: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1`
    );
    if (!res.ok) throw new Error("Network response failed");

    const data: GeoResponse = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("City not found");
      return null;
    }

    const firstResult = data.results[0];
    if (!firstResult) return null; // safeguard

    const { latitude, longitude } = firstResult;
    return { latitude, longitude };
  } catch (err) {
    console.error("Error fetching city:", err);
    return null;
  }
};

const init = function (): void {
  getCurrentLocation();
};

init();
