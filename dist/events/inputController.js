var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { starterApp } from "../appController.js";
///////////////////////////////////////////////////////////////
// UI Selectors
const form = document.querySelector("form");
const input = document.querySelector("#searchInput");
const suggestionBox = document.querySelector("#ULSuggestion");
const statusBox = document.querySelector("#form-status");
const unitsDropDown = document.querySelector("#unitsDropDown");
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
    if (!statusBox)
        return;
    if (load === "on") {
        statusBox.innerHTML = `
      <div class="flex items-center text-neutral-400">
        <img class="animate-spin size-3 mr-2"
             src="./assets/images/icon-loading.svg"
             alt="loading" />
        <span>Loading...</span>
      </div>`;
    }
    if (load === "off") {
        statusBox.innerHTML = "";
    }
};
export const ErrorHandler = function (message) {
    if (!statusBox)
        return;
    statusBox.innerHTML = `
    <p class="text-xs py-1 text-red-600">${message}</p>`;
    // optional: fade out after 3s
    setTimeout(() => {
        var _a;
        if ((_a = statusBox.textContent) === null || _a === void 0 ? void 0 : _a.includes(message)) {
            statusBox.innerHTML = "";
        }
    }, 3000);
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
            if (!data.results) {
                ErrorHandler("Couldn't find city");
                return [];
            }
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
/////////////////////////////////////////////////
// For the input suggestions
let highlightedIndex = -1; // -1 means nothing selected
function highlightSuggestion(items, index) {
    items.forEach((li, i) => {
        if (i === index) {
            li.classList.add("bg-[var(--Neutral-700)]");
        }
        else {
            li.classList.remove("bg-[var(--Neutral-700)]");
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
        highlightedIndex = -1; // reset on new query
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
    // Hide suggestions and units dropdown on outside click
    document.addEventListener("click", (e) => {
        const target = e.target;
        const inputParent = input.parentElement;
        const isInsideSuggestion = inputParent === null || inputParent === void 0 ? void 0 : inputParent.contains(target);
        const isInsideUnits = unitsDropDown.contains(target);
        if (!isInsideSuggestion) {
            suggestionBox.classList.add("hidden");
        }
        if (!isInsideUnits) {
            unitsDropDown.classList.add("hidden");
        }
    });
}
input.addEventListener("keydown", (e) => {
    const items = suggestionBox === null || suggestionBox === void 0 ? void 0 : suggestionBox.querySelectorAll("li");
    if (!items || items.length === 0)
        return;
    if (e.key === "ArrowDown") {
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % items.length;
        highlightSuggestion(items, highlightedIndex);
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
        highlightSuggestion(items, highlightedIndex);
    }
    if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0) {
            const li = items[highlightedIndex];
            li.dispatchEvent(new Event("click")); // simulate click
        }
        else {
            // default to first suggestion if none highlighted
            const li = items[0];
            if (li)
                li.dispatchEvent(new Event("click"));
        }
    }
});
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
//# sourceMappingURL=inputController.js.map