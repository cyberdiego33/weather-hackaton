import { currentUnitType } from "../types.js";
import { CurrentView } from "../views/CurrentWView.js";
import { DailyView } from "../views/DailyView.js";
import { HourlyView } from "../views/HourlyView.js";

// Global Options
// Switch Imperial, Temperature, WindSpeed, Precipitation
export const currentUnit: currentUnitType = {
  imperialMode: false,
  temperature: "metric",
  wind: "metric",
  precipitation: "metric",
};

////////////////////////////////////////////////////////////////
// Helper Function
const callBack = function (
  parentEl: HTMLElement,
  e: Event
): "metric" | "imperial" | null {
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
  return dataAt as "metric" | "imperial";
};

export const UnitsEvents = function (): void {
  const unitsDropDown = document.querySelector<HTMLElement>("#unitsDropDown")!;
  const UnitOptions = document.querySelector<HTMLElement>("#UnitOptions")!;

  // toggle dropdown on parent click
  unitsDropDown.addEventListener("click", () => {
    UnitOptions.classList.toggle("hidden");
  });

  // prevent clicks inside dropdown from closing it
  UnitOptions.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  ImperialEvent();
  TemperatureEvent();
  WindspeedEvent();
  PrecipitationEvent();
};

const ImperialEvent = function (): void {
  const ImperialDiv = document.querySelector<HTMLElement>("#ImperialDiv");
  if (!ImperialDiv) return;

  ImperialDiv.addEventListener("click", (e) => {
    const isImperial = ImperialDiv.classList.toggle("bg-[var(--Neutral-700)]");
    const clickedImg = ImperialDiv.querySelector("img");
    clickedImg?.classList.toggle("hidden");

    // console.log(isImperial);
    if (isImperial) {
      currentUnit.imperialMode = true;
      currentUnit.temperature = "imperial";
      currentUnit.wind = "imperial";
      currentUnit.precipitation = "imperial";

      CurrentView.updatePrecipitation();
      CurrentView.updateWind();
      changeTemp();
    } else {
      currentUnit.imperialMode = false;
      currentUnit.temperature = "metric";
      currentUnit.wind = "metric";
      currentUnit.precipitation = "metric";

      CurrentView.updatePrecipitation();
      CurrentView.updateWind();
      changeTemp();
    }
    // console.log(currentUnit.imperialMode);
    // console.log(currentUnit.wind);
    // console.log(currentUnit.precipitation);

    // Now update ALL groups at once
    const groups = document.querySelectorAll<HTMLElement>(".unit-group");

    groups.forEach((group) => {
      const options = group.querySelectorAll<HTMLElement>(".option");

      options.forEach((option) => {
        const dataAt = option.dataset.option;

        // Decide which option is "imperial" vs "metric"
        const isImperialOption = dataAt === "imperial";

        const img = option.querySelector("img");

        if (isImperial && isImperialOption) {
          img?.classList.remove("hidden");
          option.classList.add("bg-[var(--Neutral-700)]");
        } else if (!isImperial && !isImperialOption) {
          img?.classList.remove("hidden");
          option.classList.add("bg-[var(--Neutral-700)]");
        } else {
          img?.classList.add("hidden");
          option.classList.remove("bg-[var(--Neutral-700)]");
        }
      });
    });
  });
};

const changeTemp = function () {
  CurrentView.updateTemp();
  DailyView.updateDailyTemps();
  HourlyView.updateHourlyViews();
};

// Temperature Event Listener
const TemperatureEvent = function (): void {
  const TemperatureDiv = document.querySelector<HTMLElement>("#TemperatureDiv");
  if (!TemperatureDiv) return;

  TemperatureDiv.addEventListener("click", (e) => {
    const dataAt = callBack(TemperatureDiv, e);

    if (dataAt && dataAt !== currentUnit.temperature) {
      currentUnit.temperature = dataAt;
      changeTemp();
    }
  });
};

// WindSpeed Event Listener
const WindspeedEvent = function (): void {
  const WindspeedDiv = document.querySelector<HTMLElement>("#WindspeedDiv");
  if (!WindspeedDiv) return;

  WindspeedDiv.addEventListener("click", (e) => {
    const dataAt = callBack(WindspeedDiv, e);
    console.log(dataAt, currentUnit.wind);
    if (dataAt && dataAt !== currentUnit.wind) {
      currentUnit.wind = dataAt;
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
      currentUnit.precipitation = dataAt;
      CurrentView.updatePrecipitation();
    }
  });
};
