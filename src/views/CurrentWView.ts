import {
  currentDataType,
  imperialDataType,
  MetricsDataType,
} from "../types.js";
// I need to select the city name, current date, temparature, feels_like, humidity, wind, precipitation

type currentUnitType = {
  imperialMode: boolean;
  temperature: "metric" | "imperial";
  wind: "metric" | "imperial";
  precipitation: "metric" | "imperial";
};

// Global Options
// Switch Imperial, Temperature, WindSpeed, Precipitation
const currentUnit: currentUnitType = {
  imperialMode: false,
  temperature: "metric",
  wind: "metric",
  precipitation: "metric",
};

// Helper Function
const callBack = function (parentEl: HTMLElement, e: Event): string | null {
  // guard clause: make sure it's really an HTMLElement
  if (!(e.target instanceof HTMLElement)) return null;
  const target = e.target.closest<HTMLElement>(".option");

  // now TS knows target is an HTMLElement
  if (!target) return null;

  const dataAt = target.dataset.option ?? null;

  // safe zone ✅
  const allOptions = parentEl.querySelectorAll<HTMLElement>(".option");

  allOptions.forEach((option) => {
    if (option === target) {
      const clickedImg = option.querySelector("img");
      clickedImg?.classList.remove("hidden");
      option.classList.add("bg-[var(--Neutral-700)]");
    }
    if (option !== target) {
      const clickedImg = option.querySelector("img");
      clickedImg?.classList.add("hidden");
      option.classList.remove("bg-[var(--Neutral-700)]");
    }
  });

  // console.log("returning: ", dataAt);
  return dataAt;
};

const formatTemp = function (value: number | null): string {
  return value !== null ? `${Math.floor(value)}` : "--";
};

export const CurrentView = {
  cityName: null as string | null,
  currentTime: null as string | null,
  currentTemp: null as number | null,
  dataset: null as MetricsDataType | imperialDataType | null,
  MetricsData: null as MetricsDataType | null,
  imperialData: null as imperialDataType | null,

  setData(currentAppData: currentDataType) {
    this.cityName = currentAppData.cityName;
    this.currentTime = currentAppData.currentTime;
    this.dataset = currentUnit.imperialMode
      ? currentAppData.imperialData
      : currentAppData.metricData;
    this.MetricsData = currentAppData.metricData;
    this.imperialData = currentAppData.imperialData;
    this.currentTemp = this.dataset.temperature;
  },

  updateCity() {
    const CityName = document.querySelector<HTMLElement>("#CityName");
    if (CityName) CityName.textContent = this.cityName;
    if (!CityName) console.log("No city name found", this.cityName);
  },
  updateDate() {
    const CurrentDate = document.querySelector<HTMLElement>("#CurrentDate");
    if (CurrentDate) CurrentDate.textContent = this.currentTime;
    if (!CurrentDate) console.log("No city name found", this.currentTime);
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
    const feelsLike = this.dataset?.feelsLike ?? null;
    const CurrentFeels = document.querySelector<HTMLElement>("#CurrentFeels");
    if (CurrentFeels) CurrentFeels.textContent = formatTemp(feelsLike);
  },
  updateHumidity() {
    const humidity = this.dataset?.feelsLike ?? null;
    const CurrentHumidity =
      document.querySelector<HTMLElement>("#CurrentHumidity");
    if (CurrentHumidity) CurrentHumidity.textContent = formatTemp(humidity);
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
    console.log("Rendering all");
    this.updateCity();
    this.updateDate();
    this.updateTemp();
    this.updateFeels();
    this.updateHumidity();
    this.updateWind();
    this.updatePrecipitation();
  },
};

///////////////////////////////////////////////////////////////////////

const UnitsEvents = function (): void {
  const unitsDropDown = document.querySelector<HTMLElement>("#unitsDropDown")!;
  unitsDropDown.onclick = () => {
    const UnitOptions = document.querySelector("#UnitOptions");

    UnitOptions?.classList.toggle("hidden");
  };

  ImperialEvent();
  TemperatureEvent();
  WindspeedEvent();
  PrecipitationEvent();
};

// Event Listeners for Options

// Imperial Event Listener
const ImperialEvent = function (): void {
  const ImperialDiv = document.querySelector<HTMLElement>("#ImperialDiv");

  if (!ImperialDiv) return;

  ImperialDiv.addEventListener("click", (e) => {
    // console.log("Imperial click");

    currentUnit.imperialMode =
      currentUnit.imperialMode === false ? true : false;
    if (!currentUnit.imperialMode) {
      currentUnit.precipitation = "metric";
      currentUnit.temperature = "metric";
      currentUnit.wind = "metric";
    }
    if (currentUnit.imperialMode) {
      currentUnit.precipitation = "imperial";
      currentUnit.temperature = "imperial";
      currentUnit.wind = "imperial";
    }

    const clickedImg = ImperialDiv.querySelector("img");
    clickedImg?.classList.toggle("hidden");
    ImperialDiv.classList.toggle("bg-[var(--Neutral-700)]");

    CurrentView.updateTemp();
    CurrentView.updateWind();
    CurrentView.updatePrecipitation();
  });
};

// Temperature Event Listener
const TemperatureEvent = function (): void {
  const TemperatureDiv = document.querySelector<HTMLElement>("#TemperatureDiv");
  if (!TemperatureDiv) return;

  TemperatureDiv.addEventListener("click", (e) => {
    const dataAt = callBack(TemperatureDiv, e);

    if (dataAt && dataAt !== currentUnit.temperature) {
      currentUnit.temperature = dataAt as "metric" | "imperial";
      CurrentView.updateTemp();
    }
  });
};

// WindSpeed Event Listener
const WindspeedEvent = function (): void {
  const WindspeedDiv = document.querySelector<HTMLElement>("#WindspeedDiv");
  if (!WindspeedDiv) return;

  WindspeedDiv.addEventListener("click", (e) => {
    const dataAt = callBack(WindspeedDiv, e);

    // console.log("windsp", dataAt);
    if (dataAt && dataAt !== currentUnit.wind) {
      currentUnit.wind = dataAt as "metric" | "imperial";
      CurrentView.updateWind();
    }
  });
};

// Precipitation Event Listener
const PrecipitationEvent = function (): void {
  const PrecipitationDiv =
    document.querySelector<HTMLElement>("#PrecipitationDiv");
  if (!PrecipitationDiv) return;

  PrecipitationDiv.addEventListener("click", (e) => {
    const dataAt = callBack(PrecipitationDiv, e);

    if (dataAt && dataAt !== currentUnit.precipitation) {
      currentUnit.precipitation = dataAt as "metric" | "imperial";
      CurrentView.updatePrecipitation();
    }
  });
};

UnitsEvents();

// Refactoring time

// Issues are
// 1. Listening for events on unit changes
// 2. there's a general switch to change the units
// 3. How to connect the changes to the data that needs it
// 4. Listening to changes on single units and changing it specific data
