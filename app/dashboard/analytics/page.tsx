import React, { lazy, Suspense } from "react";

const AnalyticsChart = lazy(() => import("./_components/AnalyticsChart"));
const UserTable = lazy(() => import("./_components/UserTable"));

import { fetchMonthlySales, fetchUserActivity } from "@/http/analytics-http";
import LoadingSpinner from "@/components/LoadingSpinner";

const Page = async () => {
  const [userActivity, monthlySales] = await Promise.all([
    fetchUserActivity(),
    fetchMonthlySales(),
  ]);

  return (
    <div className="space-y-8 container mx-auto">
      <header className="text-2xl font-semibold mb-6 text-center">
        Analytics Dashboard
      </header>
      <Suspense fallback={<LoadingSpinner />}>
        <AnalyticsChart
          userActivity={userActivity}
          monthlySales={monthlySales}
        />
      </Suspense>
      <UserTable />
    </div>
  );
};

export default Page;
