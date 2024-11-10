"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeatherAndAstronomy } from "@/http/weather-http";
import { WeatherData } from "@/types/weather-card-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  cityname: z.string().min(3, {
    message: "City name must be at least 3 characters.",
  }),
});

export default function WeatherCard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityname: "",
    },
  });
  const [weatherData, setweatherData] = useState<WeatherData>();
  const { toast } = useToast();

  async function onSubmit(value: z.infer<typeof formSchema>) {
    try {
      setweatherData(await getWeatherAndAstronomy(value.cityname));
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        // @ts-expect-error ???
        description: error.message! || "An error occurred. Please try again.",
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Card className="lg:w-[30%]">
      <CardHeader>
        <CardTitle className="text-2xl">
          How&apos;s the weather today?
        </CardTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-center gap-3"
          >
            <FormField
              control={form.control}
              name="cityname"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="w-max">
                    <Input placeholder="Enter your city name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <span className="animate-spin">
                  <Loader2 />
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardHeader>
      <Suspense fallback={<p>Loading....</p>}>
        <CardContent>
          {weatherData && <WeatherStats weatherData={weatherData} />}
        </CardContent>
      </Suspense>
    </Card>
  );
}

function WeatherStats({ weatherData }: { weatherData: WeatherData }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="xl:my-3 my-0 text-center space-y-2">
          <h2 className="text-3xl font-light">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p className="text-base font-extralight text-gray-500">
            {weatherData.condition.description}
          </p>
        </CardTitle>
        <CardDescription className="flex justify-center">
          <Image
            src={weatherData.condition.icon}
            alt={weatherData.condition.description}
            width={50}
            height={50}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 my-1">
        <WeatherDetails
          label="Current Temperature"
          value={`${weatherData.main.temp.toFixed(2)}°C`}
        />
        <WeatherDetails
          label="Feels Like"
          value={`${weatherData.main.feels_like.toFixed(2)}°C`}
        />
        <WeatherDetails
          label="Humidity"
          value={`${weatherData.main.humidity.toFixed(2)}%`}
        />
        <WeatherDetails
          label="Wind Speed"
          value={`${weatherData.wind.speed.toFixed(2)} km/h`}
        />
      </CardContent>
      <CardFooter className="flex flex-col ">
        <h4 className="">
          <strong>Sunrise</strong>: {weatherData.astronomyTime.sunrise}
        </h4>
        <h4>
          <strong>Sunset</strong>: {weatherData.astronomyTime.sunset}
        </h4>
      </CardFooter>
    </Card>
  );
}

function WeatherDetails({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 text-center lg:text-md text-xs text-wrap">
      <strong className="font-extrabold">{value}</strong>
      <p>{label}</p>
    </Card>
  );
}
