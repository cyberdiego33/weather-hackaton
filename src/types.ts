export type Urls = {
  forecastUrl: string;
  bigDataUrl: string;
};

export type optionsDate = {
  weekday: string;
  year: string;
  month: string;
  day: string;
};

export interface WeatherResp {
  current_weather: {
    temperature: number;
    time: string;
    windspeed: number;
    weathercode: number;
  };
  hourly: {
    time: string[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    temperature_2m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export type WeekdayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type DailyHours = {
  timeLgArray: string[];
  feelslgArray: number[];
  tempLgArray: number[];
};

export type DailyHoursDataType = Record<WeekdayType, DailyHours>;

export type statetype = {
  currentData: {
    cityName: string | null;
    temperature: number | null;
    currentTime: string | null;
    wind: number | null;
    feelsLike: number | null;
    humidity: number | null;
    precipitation: number | null;
  };
  DailyData: {
    dateArray: string[] | null;
    maxTemp: number[];
    minTemp: number[];
  };
  HourlyData: {
    timeArray: string[];
    apparentTempArray: number[];
    tempArray: number[];
  };
  DailyHoursData: DailyHoursDataType;
  /* {
    Monday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Tuesday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Wednesday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Thursday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Friday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Saturday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    };
    Sunday: {
      timeLgArray: string[];
      feelslgArray: number[];
      tempLgArray: number[];
    }; 
  };*/
};

export type currentDataType = {
  cityName: string | null;
  currentTime: string | null;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  wind: number | null;
  precipitation: number | null;
};

export type DailyForecastType = {
  dateArray: string[] | null;
  maxTemp: number[];
  minTemp: number[];
};

export type HourlyForecastType = {
  timeArray: string[];
  apparentTempArray: number[];
  tempArray: number[];
};
