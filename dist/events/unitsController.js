import { CurrentView } from "../views/CurrentWView.js";
import { DailyView } from "../views/DailyView.js";
import { HourlyView } from "../views/HourlyView.js";
// Global Options
// Switch Imperial, Temperature, WindSpeed, Precipitation
export const currentUnit = {
    imperialMode: false,
    temperature: "metric",
    wind: "metric",
    precipitation: "metric",
};
////////////////////////////////////////////////////////////////
// Helper Function
const callBack = function (parentEl, e) {
    var _a;
    // guard clause: make sure it's really an HTMLElement
    if (!(e.target instanceof HTMLElement))
        return null;
    const target = e.target.closest(".option");
    // now TS knows target is an HTMLElement
    if (!target)
        return null;
    const dataAt = (_a = target.dataset.option) !== null && _a !== void 0 ? _a : null;
    // safe zone ✅
    const allOptions = parentEl.querySelectorAll(".option");
    allOptions.forEach((option) => {
        if (option === target) {
            const clickedImg = option.querySelector("img");
            clickedImg === null || clickedImg === void 0 ? void 0 : clickedImg.classList.remove("hidden");
            option.classList.add("bg-[var(--Neutral-700)]");
        }
        if (option !== target) {
            const clickedImg = option.querySelector("img");
            clickedImg === null || clickedImg === void 0 ? void 0 : clickedImg.classList.add("hidden");
            option.classList.remove("bg-[var(--Neutral-700)]");
        }
    });
    // console.log("returning: ", dataAt);
    return dataAt;
};
export const UnitsEvents = function () {
    const unitsDropDown = document.querySelector("#unitsDropDown");
    const UnitOptions = document.querySelector("#UnitOptions");
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
const ImperialEvent = function () {
    const ImperialDiv = document.querySelector("#ImperialDiv");
    if (!ImperialDiv)
        return;
    ImperialDiv.addEventListener("click", (e) => {
        const isImperial = ImperialDiv.classList.toggle("bg-[var(--Neutral-700)]");
        const clickedImg = ImperialDiv.querySelector("img");
        clickedImg === null || clickedImg === void 0 ? void 0 : clickedImg.classList.toggle("hidden");
        // console.log(isImperial);
        if (isImperial) {
            currentUnit.imperialMode = true;
            currentUnit.temperature = "imperial";
            currentUnit.wind = "imperial";
            currentUnit.precipitation = "imperial";
            CurrentView.updatePrecipitation();
            CurrentView.updateWind();
            changeTemp();
        }
        else {
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
        const groups = document.querySelectorAll(".unit-group");
        groups.forEach((group) => {
            const options = group.querySelectorAll(".option");
            options.forEach((option) => {
                const dataAt = option.dataset.option;
                // Decide which option is "imperial" vs "metric"
                const isImperialOption = dataAt === "imperial";
                const img = option.querySelector("img");
                if (isImperial && isImperialOption) {
                    img === null || img === void 0 ? void 0 : img.classList.remove("hidden");
                    option.classList.add("bg-[var(--Neutral-700)]");
                }
                else if (!isImperial && !isImperialOption) {
                    img === null || img === void 0 ? void 0 : img.classList.remove("hidden");
                    option.classList.add("bg-[var(--Neutral-700)]");
                }
                else {
                    img === null || img === void 0 ? void 0 : img.classList.add("hidden");
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
const TemperatureEvent = function () {
    const TemperatureDiv = document.querySelector("#TemperatureDiv");
    if (!TemperatureDiv)
        return;
    TemperatureDiv.addEventListener("click", (e) => {
        const dataAt = callBack(TemperatureDiv, e);
        if (dataAt && dataAt !== currentUnit.temperature) {
            currentUnit.temperature = dataAt;
            changeTemp();
        }
    });
};
// WindSpeed Event Listener
const WindspeedEvent = function () {
    const WindspeedDiv = document.querySelector("#WindspeedDiv");
    if (!WindspeedDiv)
        return;
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
const PrecipitationEvent = function () {
    const PrecipitationDiv = document.querySelector("#PrecipitationDiv");
    if (!PrecipitationDiv)
        return;
    PrecipitationDiv.addEventListener("click", (e) => {
        const dataAt = callBack(PrecipitationDiv, e);
        if (dataAt && dataAt !== currentUnit.precipitation) {
            currentUnit.precipitation = dataAt;
            CurrentView.updatePrecipitation();
        }
    });
};
//# sourceMappingURL=unitsController.js.map