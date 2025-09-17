import { DailyForecastType } from "../types";
import { currentUnit } from "../events/unitsController.js";

// Helper Function
const formatTemp = function (value: number | null): string {
  return value !== null ? `${Math.floor(value)}` : "--";
};
///////////////////////////////////////////////////////////
export const DailyView = {
  DailyData: null as DailyForecastType | null,
  DisplayDailyForcast(dailyDataObj: DailyForecastType) {
    this.DailyData = dailyDataObj;
    const unit = currentUnit.temperature;
    const forecastGrid = document.querySelector<HTMLElement>("#forecast-grid");

    if (!forecastGrid) return;
    const DailyForecast = document.querySelectorAll(".DailyForecast");

    forecastGrid.innerHTML = "";

    DailyForecast.forEach((node, i) => {
      const day = dailyDataObj.dateArray?.[i] ?? "";
      const weathercode = dailyDataObj.weatherCodeArray?.[i] ?? null;
      const max = dailyDataObj[unit].maxTemp?.[i] ?? null;
      const min = dailyDataObj[unit].minTemp?.[i] ?? null;

      const dayStr = `<div
                        class="DailyForecast p-2 bg-[var(--Neutral-700)] space-y-3 rounded-md border border-[var(--Neutral-600)]"
                      >
                        <p class="weekDay text-center">${day}</p>
                        <img
                          class="DailyFeelsIcon size-10 mx-auto"
                          src="./assets/images/icon-${weathercode}.webp"
                          alt="icon-${weathercode}"
                        />
                        <div class="flex justify-between">
                          <small><span class="maxTemp">${formatTemp(
                            max
                          )}</span>°</small>
                          <small><span class="minTemp">${formatTemp(
                            min
                          )}</span>°</small>
                        </div>
                      </div>`;

      forecastGrid.insertAdjacentHTML("beforeend", dayStr);
    });
  },
  updateDailyTemps() {
    if (!this.DailyData) return;

    const DailyForecast = document.querySelectorAll(".DailyForecast");

    DailyForecast.forEach((day, i) => {
      const maxTempEl = day.querySelector(".maxTemp")!;
      const minTempEl = day.querySelector(".minTemp")!;

      // Always read from currentUnit.temperature
      const unit = currentUnit.temperature;
      const max = this.DailyData![unit].maxTemp?.[i] ?? null;
      const min = this.DailyData![unit].minTemp?.[i] ?? null;

      maxTempEl.textContent = formatTemp(max);
      minTempEl.textContent = formatTemp(min);
    });
  },
};
