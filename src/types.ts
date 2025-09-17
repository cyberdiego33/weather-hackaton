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
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
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
  tempsObject: {
    imperial: number[];
    metric: number[];
  };
  weatherCodeArray: string[];
};

export type DailyHoursDataType = Record<WeekdayType, DailyHours>;

export type statetype = {
  currentData: currentDataType;
  DailyData: DailyForecastType;
  DailyHoursData: DailyHoursDataType;
};

export type currentDataType = {
  cityName: string | null;
  currentTime: string | null;
  weatherCode: string | null;
  metric: MetricsDataType;
  imperial: imperialDataType;
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
  weatherCodeArray: string[];
  metric: {
    maxTemp: number[];
    minTemp: number[];
  };
  imperial: {
    maxTemp: number[];
    minTemp: number[];
  };
  weekDays: string[];
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

export type currentUnitType = {
  imperialMode: boolean;
  temperature: "metric" | "imperial";
  wind: "metric" | "imperial";
  precipitation: "metric" | "imperial";
};
