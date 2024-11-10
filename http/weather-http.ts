"use server";

import { WeatherData } from "@/types/weather-card-types";
import { handleHttpError } from "@/lib/utils";

export const getWeatherAndAstronomy = async (
  cityName: string
): Promise<WeatherData> => {
  const weatherDataUrl = "https://api.openweathermap.org/data/2.5/weather";

  try {
    const url = `${weatherDataUrl}?q=${cityName}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Error fetching weather data: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();

    const {
      name,
      sys: { country, sunrise, sunset },
      main: { temp, feels_like, humidity },
      wind: { speed: responseSpeed },
      weather,
    } = data;

    const responseToReturn: WeatherData = {
      name,
      sys: { country, sunrise, sunset },
      main: { temp, feels_like, humidity },
      wind: { speed: responseSpeed * 3.6 }, // converting from m/s to km/h
      condition: {
        description: weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
      },
      astronomyTime: {
        sunrise: new Date(sunrise * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sunset: new Date(sunset * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };

    return responseToReturn;
  } catch (error: unknown) {
    const { message, statusCode } = handleHttpError(error);
    console.error(
      `HTTP Error from weather-http.ts-getWeatherAndAstronomyFN, code: ${statusCode}:`,
      message
    );
    throw new Error(message);
  }
};
