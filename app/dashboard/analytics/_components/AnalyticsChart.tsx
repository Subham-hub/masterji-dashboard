"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnalyticsType } from "@/types/analytics-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({
  userActivity,
  monthlySales,
}: {
  userActivity: AnalyticsType;
  monthlySales: AnalyticsType;
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6">
      <Card className="w-full md:w-1/2">
        <CardHeader className="text-lg font-semibold mb-4">
          User Activity
        </CardHeader>
        <CardContent>
          <Line data={userActivity} options={{ responsive: true }} />
        </CardContent>
      </Card>

      <Card className="w-full md:w-1/2">
        <CardHeader className="text-lg font-semibold mb-4">
          Monthly Sales Performance
        </CardHeader>
        <CardContent>
          <Bar data={monthlySales} options={{ responsive: true }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsChart;
