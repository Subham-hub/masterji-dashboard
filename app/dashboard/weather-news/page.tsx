"use client";

import React from "react";
import dynamic from "next/dynamic";

const NewsCard = dynamic(() => import("./_components/NewsCard"), {
  ssr: false,
  loading: () => <p>Please Wait</p>,
});
const WeatherCard = dynamic(() => import("./_components/WeatherCard"), {
  ssr: false,
  loading: () => <p>Please Wait</p>,
});

const DashboardPage = () => {
  return (
    <div className="container mx-auto">
      <header>
        <h1 className="text-4xl font-bold mb-5 text-center">
          MasterJI Live Dashboard
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-5 lg:h-[80vh]">
        {/* RIGHT SIDE: Weather */}
        <WeatherCard />

        {/* LEFT SIDE: News */}
        <NewsCard />
      </div>
    </div>
  );
};

export default DashboardPage;
