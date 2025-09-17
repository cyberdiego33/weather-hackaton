import { currentUnit } from "../events/unitsController.js";
// Helper Function
const formatTemp = function (value) {
    return value !== null ? `${Math.floor(value)}` : "--";
};
export const CurrentView = {
    cityName: null,
    currentTime: null,
    currentTemp: null,
    weathercode: null,
    MetricsData: null,
    imperialData: null,
    DataObj: null,
    setData(currentAppData) {
        this.DataObj = currentAppData;
        this.cityName = currentAppData.cityName;
        this.currentTime = currentAppData.currentTime;
        this.weathercode = currentAppData.weatherCode;
        this.MetricsData = currentAppData.metric;
        this.imperialData = currentAppData.imperial;
        this.currentTemp = formatTemp(currentAppData[currentUnit.temperature].temperature);
    },
    updateTemp() {
        var _a, _b;
        const temp = currentUnit.temperature === "metric"
            ? (_a = this.MetricsData) === null || _a === void 0 ? void 0 : _a.temperature
            : (_b = this.imperialData) === null || _b === void 0 ? void 0 : _b.temperature;
        const CurrentTemp = document.querySelector("#CurrentTemp");
        if (CurrentTemp)
            CurrentTemp.textContent = formatTemp(temp !== null && temp !== void 0 ? temp : null);
    },
    updateFeels() {
        var _a, _b;
        const feelsLike = (_b = (_a = this.DataObj) === null || _a === void 0 ? void 0 : _a.metric.feelsLike) !== null && _b !== void 0 ? _b : null;
        const CurrentFeels = document.querySelector("#CurrentFeels");
        const CurrentFeelsUnit = document.querySelector("#CurrentFeelsUnit");
        if (CurrentFeels)
            CurrentFeels.textContent = formatTemp(feelsLike);
        if (CurrentFeelsUnit)
            CurrentFeelsUnit.textContent = "°";
    },
    updateHumidity() {
        var _a, _b;
        const humidity = (_b = (_a = this.DataObj) === null || _a === void 0 ? void 0 : _a.metric.humidity) !== null && _b !== void 0 ? _b : null;
        const CurrentHumidity = document.querySelector("#CurrentHumidity");
        const CurrentHumidityUnit = document.querySelector("#CurrentHumidityUnit");
        if (CurrentHumidity)
            CurrentHumidity.textContent = formatTemp(humidity);
        if (CurrentHumidityUnit)
            CurrentHumidityUnit.textContent = "%";
    },
    updateWind() {
        var _a, _b;
        const wind = currentUnit.wind === "metric"
            ? (_a = this.MetricsData) === null || _a === void 0 ? void 0 : _a.wind
            : (_b = this.imperialData) === null || _b === void 0 ? void 0 : _b.wind;
        const windUnit = currentUnit.wind === "metric" ? "km/h" : "mph";
        const CurrentWind = document.querySelector("#CurrentWind");
        const CurrentWindUnit = document.querySelector("#CurrentWindUnit");
        if (CurrentWind)
            CurrentWind.textContent = formatTemp(wind !== null && wind !== void 0 ? wind : null);
        if (CurrentWindUnit)
            CurrentWindUnit.textContent = windUnit;
    },
    updatePrecipitation() {
        var _a, _b;
        const precipitation = currentUnit.precipitation === "metric"
            ? (_a = this.MetricsData) === null || _a === void 0 ? void 0 : _a.precipitation
            : (_b = this.imperialData) === null || _b === void 0 ? void 0 : _b.precipitation;
        const precipitationUnit = currentUnit.precipitation === "metric" ? "mm" : "in";
        const CurrentPrecipitation = document.querySelector("#CurrentPrecipitation");
        const CurrentPrecipitationUnit = document.querySelector("#CurrentPrecipitationUnit");
        if (CurrentPrecipitation)
            CurrentPrecipitation.textContent = formatTemp(precipitation !== null && precipitation !== void 0 ? precipitation : null);
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
        const HeroContainer = document.querySelector("#HeroContainer");
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
//# sourceMappingURL=CurrentWView.js.map