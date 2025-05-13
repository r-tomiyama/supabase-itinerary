import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { fetcher } from "./fetcher";
import BudgetSummary from "./_parts/budget-summary";
import TripHero from "./_parts/trip-hero";
import ItineraryList from "./_parts/itinerary-list";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TripDetailPage({ params }: PageProps) {
  const { id } = await params;
  const {
    trip,
    membership,
    groupedItineraries,
    totalActualCost,
    tripDays,
    tripDaysArray
  } = await fetcher(id);

  if (!trip || !membership) {
    notFound();
  }
  
  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
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
