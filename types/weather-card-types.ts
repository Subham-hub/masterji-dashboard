export interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  condition: {
    description: string;
    icon: string;
  };
  astronomyTime: {
    sunrise: string;
    sunset: string;
  };
}
