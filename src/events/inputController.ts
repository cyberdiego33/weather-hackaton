import { starterApp } from "../appController.js";
import { GeoLocation, GeoResponse } from "../types.js";

///////////////////////////////////////////////////////////////
// UI Selectors
const form = document.querySelector<HTMLFormElement>("form");
const input = document.querySelector<HTMLInputElement>("#searchInput");
const suggestionBox = document.querySelector<HTMLUListElement>("#ULSuggestion");
const statusBox = document.querySelector("#form-status");
const unitsOptions = document.querySelector<HTMLElement>("#UnitOptions")!;
const unitsDropDown = document.querySelector<HTMLElement>("#unitsDropDown")!;

///////////////////////////////////////////////////////////////
// helper functions
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export const spinner = function (load: "on" | "off") {
  if (!statusBox) return;

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

export const ErrorHandler = function (message: string) {
  if (!statusBox) return;

  statusBox.innerHTML = `
    <p class="text-xs py-1 text-red-600">${message}</p>`;

  // optional: fade out after 3s
  setTimeout(() => {
    if (statusBox.textContent?.includes(message)) {
      statusBox.innerHTML = "";
    }
  }, 3000);
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
    if (!data.results) {
      return [];
    }
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

/////////////////////////////////////////////////
// For the input suggestions
let highlightedIndex = -1; // -1 means nothing selected

function highlightSuggestion(items: NodeListOf<HTMLLIElement>, index: number) {
  items.forEach((li, i) => {
    if (i === index) {
      li.classList.add("bg-[var(--Neutral-700)]");
    } else {
      li.classList.remove("bg-[var(--Neutral-700)]");
    }
  });
}

///////////////////////////////////////////////////////////////
// Render suggestions
async function showSuggestions(query: string) {
  if (!input || !suggestionBox) return;

  suggestionBox.innerHTML = "";
  highlightedIndex = -1; // reset on new query

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

  // Hide suggestions and units dropdown on outside click
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as Node;

    const inputParent = input.parentElement;
    const isInsideSuggestion = inputParent?.contains(target);
    const isInsideUnits = unitsDropDown.contains(target);

    if (!isInsideSuggestion) {
      suggestionBox!.classList.add("hidden");
    }

    if (!isInsideUnits) {
      unitsOptions.classList.add("hidden");
    }
  });
}

input!.addEventListener("keydown", (e: KeyboardEvent) => {
  const items = suggestionBox?.querySelectorAll("li");
  if (!items || items.length === 0) {
    return;
  }

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
      const li = items[highlightedIndex]!;
      li.dispatchEvent(new Event("click")); // simulate click
    } else {
      // default to first suggestion if none highlighted
      const li = items[0];
      if (li) li.dispatchEvent(new Event("click"));
    }
  }
});

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
