import { DailyForecastType } from "../types";

// Helper Function
const formatTemp = function (value: number | null): string {
  return value !== null ? `${Math.floor(value)}` : "--";
};
///////////////////////////////////////////////////////////
export const DisplayDailyForcast = function (dailyDataObj: DailyForecastType) {
  const forecastGrid = document.querySelector<HTMLElement>("#forecast-grid");

  if (!forecastGrid) return;
  const DailyForecast = document.querySelectorAll(".DailyForecast");

  forecastGrid.innerHTML = "";

  DailyForecast.forEach((node, i) => {
    // const weekDay = node.querySelector(".weekDay");
    // const maxTemp = node.querySelector(".maxTemp");
    // const minTemp = node.querySelector(".minTemp");

    const day = dailyDataObj.dateArray?.[i] ?? "";
    const max = dailyDataObj.maxTemp?.[i] ?? null;
    const min = dailyDataObj.minTemp?.[i] ?? null;

    const dayStr = `<div
                        class="DailyForecast p-2 bg-[var(--Neutral-700)] space-y-3 rounded-md border border-[var(--Neutral-600)]"
                      >
                        <p class="weekDay text-center">${day}</p>
                        <img
                          class="DailyFeelsIcon size-10 mx-auto"
                          src="./assets/images/icon-rain.webp"
                          alt="icon-rain"
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

    // if (weekDay) weekDay.textContent = day;
    // if (maxTemp) {
    //   if (typeof max === "number") {
    //     maxTemp.textContent = String(Math.ceil(max));
    //   } else {
    //     maxTemp.textContent = "_"; // fallback if no number available
    //   }
    // }
    // if (minTemp) {
    //   if (typeof min === "number") {
    //     minTemp.textContent = String(Math.ceil(min));
    //   } else {
    //     minTemp.textContent = "_"; // fallback if no number available
    //   }
    // }

    // console.log(`Div ${i}:`, [weekDay, day], [maxTemp, max], [minTemp, min]);
  });
};
