import { starterApp } from "./appController.js";
import { GeoLocation, GeoResponse } from "./types.js";

///////////////////////////////////////////////////////////////
// UI Selectors
const form = document.querySelector<HTMLFormElement>("form");
const input = document.querySelector<HTMLInputElement>("#searchInput");
const suggestionBox = document.querySelector<HTMLUListElement>("#ULSuggestion");

///////////////////////////////////////////////////////////////
// helper functions
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export const spinner = function (load: string) {
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

export const ErrorHandler = function (message: string) {
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
async function fetchCities(query: string): Promise<GeoLocation[]> {
  if (!query) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");

    const data: GeoResponse = await res.json();
    if (!data.results) return [];

    // ✅ Deduplicate by "name + country"
    const unique = new Map<string, GeoLocation>();
    data.results.forEach((city) => {
      const key = `${city.name}-${city.country}`;
      if (!unique.has(key)) unique.set(key, city);
    });

    return Array.from(unique.values()).slice(0, 5); // ensure max 5
  } catch (err) {
    console.error("Error fetching cities:", err);
    return [];
  }
}

///////////////////////////////////////////////////////////////
// Render suggestions
async function showSuggestions(query: string) {
  if (!input || !suggestionBox) return;

  suggestionBox.innerHTML = "";
  if (!query) {
    suggestionBox.classList.add("hidden");
    return;
  }

  const cities = await fetchCities(query);

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
  } else {
    suggestionBox.classList.add("hidden");
  }
}

///////////////////////////////////////////////////////////////
// Input debounce
if (input) {
  const debouncedShowSuggestions = debounce((e: Event) => {
    const query = (e.target as HTMLInputElement).value.trim();
    showSuggestions(query);
  }, 300);

  input.addEventListener("input", debouncedShowSuggestions);

  // Hide suggestions on outside click
  document.addEventListener("click", (e: MouseEvent) => {
    if (!input.parentElement?.contains(e.target as Node)) {
      suggestionBox!.classList.add("hidden");
    }
  });
}

///////////////////////////////////////////////////////////////
// Submit handler
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!input) return;

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
    } else {
      // fallback: search again
      const cities = await fetchCities(city);

      const first = cities?.[0];
      if (first) {
        const { latitude, longitude } = first;
        starterApp({ latitude, longitude });
      } else {
        ErrorHandler("City not found");
      }
    }
  } catch (error) {
    ErrorHandler("No search result found!");
  }

  input.value = "";
  input.blur();
});

export const hello = function () {
  return null;
};
