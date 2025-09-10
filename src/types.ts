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
  current_weather: { temperature: number; time: string; windspeed: number };
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

export type statetype = {
  currentData: {
    cityName: string | null;
    temperature: number | null;
    currentTime: string | null;
    wind: number | null;
    feelsLike: string | null;
    humidity: number | null;
    precipitation: number | null;
  };
  DailyData: {
    dateArray: string[] | null;
    maxTemp: number[] | null;
    minTemp: number[] | null;
  };
  HourlyData: {
    timeArray: string[] | null;
    apparentTempArray: number[] | null;
    tempArray: number[] | null;
  };
};

export type currentDataType = {
  cityName: string | null;
  currentTime: string | null;
  temperature: number | null;
  feelsLike: string | null;
  humidity: number | null;
  wind: number | null;
  precipitation: number | null;
};

export type DailyForecastType = {
  dateArray: string[] | null;
  maxTemp: number[] | null;
  minTemp: number[] | null;
};

export type HourlyForecastType = {
  timeArray: string[] | null;
  apparentTempArray: number[] | null;
  tempArray: number[] | null;
};
