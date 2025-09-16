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
    currentTime: string | null;
    metricData: {
      temperature: number | null;
      feelsLike: number | null;
      humidity: number | null;
      wind: number | null;
      precipitation: number | null;
    };
    imperialData: {
      temperature: number | null;
      feelsLike: number | null;
      humidity: number | null;
      wind: number | null;
      precipitation: number | null;
    };
  };
  DailyData: {
    dateArray: string[] | null;
    maxTemp: number[];
    minTemp: number[];
    weekDays: string[];
  };
  HourlyData: {
    timeArray: string[];
    apparentTempArray: number[];
    tempArray: number[];
  };
  DailyHoursData: DailyHoursDataType;
};

export type currentDataType = {
  cityName: string | null;
  currentTime: string | null;
  metricData: MetricsDataType;
  imperialData: imperialDataType;
};

export type MetricsDataType = {
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  wind: number | null;
  precipitation: number | null;
};

export type imperialDataType = {
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
  weekDays: string[];
};

export type HourlyForecastType = {
  timeArray: string[];
  apparentTempArray: number[];
  tempArray: number[];
};

export interface GeoLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type GeoResponse = {
  results?: GeoLocation[];
};
