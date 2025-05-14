import { ChevronLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackingItemModalWrapper } from "@/client/features/create-packing-item-modal/packing-item-modal-wrapper";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/Title";
import { getSignedUser } from "@/services/user/getSignedUser";

import { PackingListClient } from "./_parts/packing-list-client";
import { fetcher } from "./fetcher";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PackingListPage({ params }: PageProps) {
  const { id } = await params;
  const { user } = await getSignedUser();
  const { trip, membership, tripMembers, categorizedItems, categories } =
    await fetcher(id);

  if (!trip || !membership) {
    notFound();
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="mb-2 flex items-center gap-2">
        <Link href={`/protected/trips/${id}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            旅行詳細に戻る
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <Title icon={PackageIcon} text={`${trip.title} の持ち物リスト`} />
        <PackingItemModalWrapper tripId={id} tripMembers={tripMembers || []} />
      </div>

      {/* 持ち物リスト（クライアントコンポーネント） */}
      <PackingListClient
        categories={categories}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        categorizedItems={categorizedItems as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tripMembers={tripMembers as any[]}
        tripId={id}
        userId={user.id}
      />
    </div>
  );
}
