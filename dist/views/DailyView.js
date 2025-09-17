import { currentUnit } from "../events/unitsController.js";
// Helper Function
const formatTemp = function (value) {
    return value !== null ? `${Math.floor(value)}` : "--";
};
///////////////////////////////////////////////////////////
export const DailyView = {
    DailyData: null,
    DisplayDailyForcast(dailyDataObj) {
        this.DailyData = dailyDataObj;
        const unit = currentUnit.temperature;
        const forecastGrid = document.querySelector("#forecast-grid");
        if (!forecastGrid)
            return;
        const DailyForecast = document.querySelectorAll(".DailyForecast");
        forecastGrid.innerHTML = "";
        DailyForecast.forEach((node, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const day = (_b = (_a = dailyDataObj.dateArray) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : "";
            const weathercode = (_d = (_c = dailyDataObj.weatherCodeArray) === null || _c === void 0 ? void 0 : _c[i]) !== null && _d !== void 0 ? _d : null;
            const max = (_f = (_e = dailyDataObj[unit].maxTemp) === null || _e === void 0 ? void 0 : _e[i]) !== null && _f !== void 0 ? _f : null;
            const min = (_h = (_g = dailyDataObj[unit].minTemp) === null || _g === void 0 ? void 0 : _g[i]) !== null && _h !== void 0 ? _h : null;
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
                          <small><span class="maxTemp">${formatTemp(max)}</span>°</small>
                          <small><span class="minTemp">${formatTemp(min)}</span>°</small>
                        </div>
                      </div>`;
            forecastGrid.insertAdjacentHTML("beforeend", dayStr);
        });
    },
    updateDailyTemps() {
        if (!this.DailyData)
            return;
        const DailyForecast = document.querySelectorAll(".DailyForecast");
        DailyForecast.forEach((day, i) => {
            var _a, _b, _c, _d;
            const maxTempEl = day.querySelector(".maxTemp");
            const minTempEl = day.querySelector(".minTemp");
            // Always read from currentUnit.temperature
            const unit = currentUnit.temperature;
            const max = (_b = (_a = this.DailyData[unit].maxTemp) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : null;
            const min = (_d = (_c = this.DailyData[unit].minTemp) === null || _c === void 0 ? void 0 : _c[i]) !== null && _d !== void 0 ? _d : null;
            maxTempEl.textContent = formatTemp(max);
            minTempEl.textContent = formatTemp(min);
        });
    },
};
//# sourceMappingURL=DailyView.js.map