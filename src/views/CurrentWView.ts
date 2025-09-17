import {
  currentDataType,
  imperialDataType,
  MetricsDataType,
} from "../types.js";
import { currentUnit } from "../events/unitsController.js";

// Helper Function
const formatTemp = function (value: number | null): string {
  return value !== null ? `${Math.floor(value)}` : "--";
};

export const CurrentView = {
  cityName: null as string | null,
  currentTime: null as string | null,
  currentTemp: null as string | null,
  weathercode: null as string | null,
  MetricsData: null as MetricsDataType | null,
  imperialData: null as imperialDataType | null,

  DataObj: null as currentDataType | null,

  setData(currentAppData: currentDataType) {
    this.DataObj = currentAppData;

    this.cityName = currentAppData.cityName;
    this.currentTime = currentAppData.currentTime;
    this.weathercode = currentAppData.weatherCode;
    this.MetricsData = currentAppData.metric;
    this.imperialData = currentAppData.imperial;
    this.currentTemp = formatTemp(
      currentAppData[currentUnit.temperature].temperature
    );
  },
  updateTemp() {
    const temp =
      currentUnit.temperature === "metric"
        ? this.MetricsData?.temperature
        : this.imperialData?.temperature;
    const CurrentTemp = document.querySelector<HTMLElement>("#CurrentTemp");
    if (CurrentTemp) CurrentTemp.textContent = formatTemp(temp ?? null);
  },
  updateFeels() {
    const feelsLike = this.DataObj?.metric.feelsLike ?? null;
    const CurrentFeels = document.querySelector<HTMLElement>("#CurrentFeels");
    const CurrentFeelsUnit =
      document.querySelector<HTMLElement>("#CurrentFeelsUnit");
    if (CurrentFeels) CurrentFeels.textContent = formatTemp(feelsLike);
    if (CurrentFeelsUnit) CurrentFeelsUnit.textContent = "°";
  },
  updateHumidity() {
    const humidity = this.DataObj?.metric.humidity ?? null;
    const CurrentHumidity =
      document.querySelector<HTMLElement>("#CurrentHumidity");
    const CurrentHumidityUnit = document.querySelector<HTMLElement>(
      "#CurrentHumidityUnit"
    );
    if (CurrentHumidity) CurrentHumidity.textContent = formatTemp(humidity);
    if (CurrentHumidityUnit) CurrentHumidityUnit.textContent = "%";
  },
  updateWind() {
    const wind =
      currentUnit.wind === "metric"
        ? this.MetricsData?.wind
        : this.imperialData?.wind;
    const windUnit = currentUnit.wind === "metric" ? "km/h" : "mph";
    const CurrentWind = document.querySelector<HTMLElement>("#CurrentWind");
    const CurrentWindUnit =
      document.querySelector<HTMLElement>("#CurrentWindUnit");

    if (CurrentWind) CurrentWind.textContent = formatTemp(wind ?? null);
    if (CurrentWindUnit) CurrentWindUnit.textContent = windUnit;
  },
  updatePrecipitation() {
    const precipitation =
      currentUnit.precipitation === "metric"
        ? this.MetricsData?.precipitation
        : this.imperialData?.precipitation;
    const precipitationUnit =
      currentUnit.precipitation === "metric" ? "mm" : "in";
    const CurrentPrecipitation = document.querySelector<HTMLElement>(
      "#CurrentPrecipitation"
    );
    const CurrentPrecipitationUnit = document.querySelector<HTMLElement>(
      "#CurrentPrecipitationUnit"
    );

    if (CurrentPrecipitation)
      CurrentPrecipitation.textContent = formatTemp(precipitation ?? null);
    if (CurrentPrecipitationUnit)
      CurrentPrecipitationUnit.textContent = precipitationUnit;
  },

  renderAll() {
    const heroStr = `<div
                        id="today-image"
                        class="flex flex-col sm:flex-row justify-center h-full sm:justify-between sm:items-center gap-4 px-4 rounded-lg"
                      >
                        <div class="text-center sm:text-left">
                          <p id="CityName" class="font-semibold text-2xl md:text-4xl">
                            ${this.cityName}
                          </p>
                          <p id="CurrentDate" class="text-[var(--Neutral-200)]">
                            ${this.currentTime}
                          </p>
                        </div>
                        <div class="flex items-center w-fit mx-auto sm:mx-0 gap-4">
                          <div class="max-w-[60px] max-h-[60px]">
                            <img
                              class="size-20 object-center object-cover"
                              src="./assets/images/icon-${this.weathercode}.webp"
                              alt="icon-${this.weathercode}"
                            />
                          </div>
                          <p class="font-semibold text-6xl">
                            <span id="CurrentTemp">${this.currentTemp}</span>°
                          </p>
                        </div>
                      </div>`;

    const HeroContainer = document.querySelector<HTMLElement>("#HeroContainer");

    if (HeroContainer) {
      HeroContainer.innerHTML = "";
      HeroContainer.innerHTML = heroStr;
    }
    this.updateFeels();
    this.updateHumidity();
    this.updateWind();
    this.updatePrecipitation();
  },
};
