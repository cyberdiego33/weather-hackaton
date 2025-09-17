var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { starterApp } from "./appController.js";
///////////////////////////////////////////////////////////////
// UI Selectors
const form = document.querySelector("form");
const input = document.querySelector("#searchInput");
const suggestionBox = document.querySelector("#ULSuggestion");
///////////////////////////////////////////////////////////////
// helper functions
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
export const spinner = function (load) {
    console.log("spinner", load);
    const li = `<li class="flex items-center">
                    <img
                    class="animate-spin size-3 mr-2"
                    src="./assets/images/icon-loading.svg"
                    alt="icon-loading"
                    /><small>Search in progress</small>
                </li>`;
    if (suggestionBox && load === "on") {
        suggestionBox.classList.remove("hidden");
        suggestionBox.innerHTML = li;
    }
    if (suggestionBox && load === "off") {
        suggestionBox.innerHTML = "";
        suggestionBox.classList.add("hidden");
    }
};
export const ErrorHandler = function (message) {
    const li = `<li><small class="errorMessage text-xs text-red-600">${message}</small></li>`;
    console.log("handling error");
    if (suggestionBox) {
        suggestionBox.innerHTML = "";
        suggestionBox.innerHTML = li;
    }
    console.log(suggestionBox);
};
///////////////////////////////////////////////////////////////
// Shared fetch for city results
function fetchCities(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!query)
            return [];
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        try {
            const res = yield fetch(url);
            if (!res.ok)
                throw new Error("Network error");
            const data = yield res.json();
            if (!data.results)
                return [];
            // ✅ Deduplicate by "name + country"
            const unique = new Map();
            data.results.forEach((city) => {
                const key = `${city.name}-${city.country}`;
                if (!unique.has(key))
                    unique.set(key, city);
            });
            return Array.from(unique.values()).slice(0, 5); // ensure max 5
        }
        catch (err) {
            console.error("Error fetching cities:", err);
            return [];
        }
    });
}
///////////////////////////////////////////////////////////////
// Render suggestions
function showSuggestions(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!input || !suggestionBox)
            return;
        suggestionBox.innerHTML = "";
        if (!query) {
            suggestionBox.classList.add("hidden");
            return;
        }
        const cities = yield fetchCities(query);
        if (cities.length > 0) {
            suggestionBox.classList.remove("hidden");
            cities.forEach((city) => {
                const li = document.createElement("li");
                li.textContent = `${city.name}, ${city.country}`;
                li.className =
                    "p-1 rounded-md hover:bg-[var(--Neutral-700)] hover:border border-[var(--Neutral-600)] cursor-pointer";
                li.addEventListener("click", () => {
                    input.value = city.name;
                    input.dataset.lat = String(city.latitude);
                    input.dataset.lon = String(city.longitude);
                    suggestionBox.classList.add("hidden");
                });
                suggestionBox.appendChild(li);
            });
        }
        else {
            suggestionBox.classList.add("hidden");
        }
    });
}
///////////////////////////////////////////////////////////////
// Input debounce
if (input) {
    const debouncedShowSuggestions = debounce((e) => {
        const query = e.target.value.trim();
        showSuggestions(query);
    }, 300);
    input.addEventListener("input", debouncedShowSuggestions);
    // Hide suggestions on outside click
    document.addEventListener("click", (e) => {
        var _a;
        if (!((_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
            suggestionBox.classList.add("hidden");
        }
    });
}
///////////////////////////////////////////////////////////////
// Submit handler
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    if (!input)
        return;
    const city = input.value.trim().toLowerCase();
    if (!city) {
        ErrorHandler("Input required");
        return;
    }
    // ✅ Prefer dataset coords if user clicked a suggestion
    const lat = input.dataset.lat;
    const lon = input.dataset.lon;
    try {
        if (lat && lon) {
            starterApp({ latitude: Number(lat), longitude: Number(lon) });
        }
        else {
            // fallback: search again
            const cities = yield fetchCities(city);
            const first = cities === null || cities === void 0 ? void 0 : cities[0];
            if (first) {
                const { latitude, longitude } = first;
                starterApp({ latitude, longitude });
            }
            else {
                ErrorHandler("City not found");
            }
        }
    }
    catch (error) {
        ErrorHandler("No search result found!");
    }
    input.value = "";
    input.blur();
}));
export const hello = function () {
    return null;
};
//# sourceMappingURL=inputController.js.map