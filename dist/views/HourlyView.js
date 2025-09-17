import { currentUnit } from "../events/unitsController.js";
// Helper function
function formatHour(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
    });
}
export const HourlyView = {
    HoursData: null,
    DisplayHourlyData(DailyHoursData, weekDays) {
        this.HoursData = DailyHoursData;
        const presentDay = weekDays[0];
        const presentHours = DailyHoursData[presentDay];
        this.DisplayHours(presentDay, presentHours);
        DropdownDateView(presentDay, weekDays, DailyHoursData);
        hourdropdownEvent();
    },
    DisplayHours(presentDay, presentHours) {
        const unit = currentUnit.temperature;
        const presentDayDiv = document.querySelector(".presentDay");
        const HourlyForecastContainer = document.querySelector("#HourlyForecastContainer");
        presentDayDiv.textContent = presentDay;
        HourlyForecastContainer.innerHTML = "";
        presentHours.timeLgArray.forEach((time, index) => {
            const hour = formatHour(time);
            const temp = Number(presentHours.tempsObject[unit][index]);
            const weatherIcon = presentHours.weatherCodeArray[index];
            const newString = `<div
                        class="HourlyForecast flex items-center space-x-4 px-3 py-[5px] border border-neutral-700 bg-[var(--Neutral-600)] rounded-md"
                      >
                        <img
                          class="hourlyIcon size-8"
                          src="./assets/images/icon-${weatherIcon}.webp"
                          alt="icon-${weatherIcon}"
                        />
                        <p><span class="hour">${hour}</span></p>
                        <small class="ml-auto"><span class="hour-temp">${Math.ceil(temp)}</span>°</small>
                      </div>`;
            HourlyForecastContainer.insertAdjacentHTML("beforeend", newString);
        });
    },
    updateHourlyViews() {
        var _a;
        const unit = currentUnit.temperature;
        const presentDay = (_a = document.querySelector(".presentDay")) === null || _a === void 0 ? void 0 : _a.textContent;
        if (!presentDay)
            return;
        if (!this.HoursData)
            return;
        const dayData = this.HoursData[presentDay].tempsObject[unit];
        const HourlyTemp = document.querySelectorAll(".hour-temp");
        HourlyTemp.forEach((hour, index) => {
            if (dayData[index])
                hour.textContent = `${Math.ceil(dayData[index])}`;
        });
    },
};
/////////////////////////////////////////////////////
// Event Listeners
const DropdownDateView = function (presentDay, weekDays, DailyHoursData) {
    const DaysHolder = document.querySelector("#DaysHolder");
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
    DaysHolder.onclick = (e) => {
        // guard clause: make sure it's really an HTMLElement
        if (!(e.target instanceof HTMLElement))
            return;
        const target = e.target.closest(".DropdownDay");
        // now TS knows target is an HTMLElement
        if (!target)
            return;
        // safe zone ✅
        const newDay = target.textContent.trim();
        const newHours = DailyHoursData[newDay];
        HourlyView.DisplayHours(newDay, newHours);
        const allDropDay = DaysHolder.querySelectorAll(".DropdownDay");
        allDropDay.forEach((day) => {
            if (day === target)
                day.classList.add("bg-[var(--Neutral-700)]");
            if (day !== target)
                day.classList.remove("bg-[var(--Neutral-700)]");
        });
    };
};
const hourdropdownEvent = function () {
    document.querySelector("#hourdropdown").onclick = (e) => {
        const DaysHolder = document.querySelector("#DaysHolder");
        (DaysHolder === null || DaysHolder === void 0 ? void 0 : DaysHolder.classList.contains("hidden"))
            ? DaysHolder.classList.remove("hidden")
            : DaysHolder === null || DaysHolder === void 0 ? void 0 : DaysHolder.classList.add("hidden");
    };
};
//# sourceMappingURL=HourlyView.js.map