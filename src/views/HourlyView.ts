import { DailyHoursDataType, WeekdayType, DailyHours } from "../types.js";

// Helper function
function formatHour(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

export const DisplayHourlyData = function (
  DailyHoursData: DailyHoursDataType,
  weekDays: string[]
): void {
  const presentDay = weekDays[0] as WeekdayType;
  const presentHours = DailyHoursData[presentDay];

  // Populate the present days hourly data
  DisplayHours(presentDay, presentHours);

  // Adding the WeekDays in order into the dropdown
  DropdownDateView(presentDay, weekDays, DailyHoursData);
  hourdropdownEvent();
};

const DisplayHours = function (
  presentDay: WeekdayType,
  presentHours: DailyHours
): void {
  const presentDayDiv = document.querySelector(".presentDay")!;
  const HourlyForecastContainer = document.querySelector(
    "#HourlyForecastContainer"
  )!;

  presentDayDiv.textContent = presentDay;
  HourlyForecastContainer.innerHTML = "";

  presentHours.timeLgArray.forEach((time, index) => {
    const hour = formatHour(time);
    const temp = Number(presentHours.tempLgArray[index]);
    const newString = `<div
                        class="HourlyForecast flex items-center space-x-4 px-3 py-[5px] border border-neutral-700 bg-[var(--Neutral-600)] rounded-md"
                      >
                        <img
                          class="hourlyIcon size-8"
                          src="./assets/images/icon-overcast.webp"
                          alt="icon-overcast"
                        />
                        <p><span class="hour">${hour}</span></p>
                        <small class="ml-auto"><span class="temp">${Math.ceil(
                          temp
                        )}</span>°</small>
                      </div>`;

    HourlyForecastContainer.insertAdjacentHTML("beforeend", newString);
  });
};

const DropdownDateView = function (
  presentDay: WeekdayType,
  weekDays: string[],
  DailyHoursData: DailyHoursDataType
): void {
  const DaysHolder = document.querySelector<HTMLElement>("#DaysHolder")!;
  DaysHolder.innerHTML = "";

  weekDays.forEach((day) => {
    const active = day === presentDay ? "bg-[var(--Neutral-700)]" : "";
    const newString = `<p
                          class="DropdownDay font-semibold text-sm text-nowrap p-1 rounded-md hover:bg-[var(--Neutral-700)] ${active}"
                        >
                          ${day}
                        </p>`;

    DaysHolder.insertAdjacentHTML("beforeend", newString);
  });

  DaysHolder.onclick = (e: Event) => {
    // guard clause: make sure it's really an HTMLElement
    if (!(e.target instanceof HTMLElement)) return;
    const target = e.target.closest(".DropdownDay");

    // now TS knows target is an HTMLElement
    if (!target) return;

    // safe zone ✅
    const newDay = target.textContent.trim() as WeekdayType;
    const newHours = DailyHoursData[newDay];

    DisplayHours(newDay, newHours);

    const allDropDay = DaysHolder.querySelectorAll(".DropdownDay");
    allDropDay.forEach((day) => {
      if (day === target) day.classList.add("bg-[var(--Neutral-700)]");
      if (day !== target) day.classList.remove("bg-[var(--Neutral-700)]");
    });
  };
};

const hourdropdownEvent = function (): void {
  document.querySelector<HTMLElement>("#hourdropdown")!.onclick = (e) => {
    const DaysHolder = document.querySelector("#DaysHolder");

    DaysHolder?.classList.contains("hidden")
      ? DaysHolder.classList.remove("hidden")
      : DaysHolder?.classList.add("hidden");
  };
};
