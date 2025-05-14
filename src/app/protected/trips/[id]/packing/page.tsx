import { ChevronLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/Title";

import { PackingItemModalWrapper } from "@/client/features/create-packing-item-modal/packing-item-modal-wrapper";
import { PackingListClient } from "./_parts/packing-list-client";
import { getSignedUser } from "@/services/user/getSignedUser";
import { fetcher } from "./fetcher";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PackingListPage({ params }: PageProps) {
  const { id } = await params;
  const { user } = await getSignedUser();
  const {
    trip,
    membership,
    tripMembers,
    packingItems,
    categorizedItems,
    categories,
  } = await fetcher(id);

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
        categorizedItems={categorizedItems || {}}
        tripMembers={tripMembers || []}
        tripId={id}
        userId={user.id}
      />
    </div>
  );
}
