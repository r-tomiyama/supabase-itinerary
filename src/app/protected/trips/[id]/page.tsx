import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import BudgetSummary from "./_parts/budget-summary";
import ItineraryList from "./_parts/itinerary-list";
import TripHero from "./_parts/trip-hero";
import { fetcher } from "./fetcher";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripDetailPage({ params }: PageProps) {
  const { id } = await params;
  const {
    trip,
    membership,
    groupedItineraries,
    totalActualCost,
    tripDays,
    tripDaysArray,
  } = await fetcher(id);

  if (!trip || !membership) {
    notFound();
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="mb-2 flex items-center gap-2">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            すべての旅行
          </Button>
        </Link>
      </div>

      <TripHero trip={trip} tripDays={tripDays} />

      <BudgetSummary trip={trip} totalActualCost={totalActualCost} />

      <ItineraryList
        trip={trip}
        groupedItineraries={groupedItineraries}
        tripDaysArray={tripDaysArray}
      />
    </div>
  );
}
