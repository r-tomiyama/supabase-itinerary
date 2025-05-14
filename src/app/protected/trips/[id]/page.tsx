import { ChevronLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import BudgetSummary from "./_parts/budget-summary";
import ItineraryList, { Itinerary } from "./_parts/itinerary-list";
import TripHero from "./_parts/trip-hero";
import TripMembers, { TripMembersProps } from "./_parts/trip-members";
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
    itineraries,
    totalActualCost,
    totalPlannedBudget,
    tripDays,
    tripDaysArray,
    tripMembers,
  } = await fetcher(id);

  if (!trip || !membership) {
    notFound();
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="mb-2 flex items-center gap-2">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            すべての旅行
          </Button>
        </Link>
      </div>
      <TripHero trip={trip} tripDays={tripDays} membership={membership} />

      <div className="mt-6 flex flex-col gap-8">
        <BudgetSummary
          trip={trip}
          totalActualCost={totalActualCost}
          totalPlannedBudget={totalPlannedBudget}
        />

        {/* パッキングページへのリンクを追加 */}
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <PackageIcon size={20} />
            持ち物リスト
          </h2>
          <Link href={`/protected/trips/${trip.id}/packing`}>
            <Button variant="outline" className="flex items-center gap-2">
              <PackageIcon size={16} />
              持ち物リストを管理
            </Button>
          </Link>
        </div>

        <ItineraryList
          trip={trip}
          itineraries={(itineraries || []) as Itinerary[]}
          tripDaysArray={tripDaysArray}
        />

        <TripMembers
          tripMembers={(tripMembers || []) as TripMembersProps["tripMembers"]}
        />
      </div>
    </div>
  );
}
