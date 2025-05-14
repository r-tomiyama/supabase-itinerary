"use client";

import { PackingItemModalWrapper } from "@/client/features/create-packing-item-modal/packing-item-modal-wrapper";

interface EmptyPackingListProps {
  tripId: string;
}

export function EmptyPackingList({ tripId }: EmptyPackingListProps) {
  return (
    <div className="rounded-lg border py-12 text-center">
      <p className="mb-2">この旅行にはまだ持ち物が追加されていません</p>
      <div className="flex justify-center">
        <PackingItemModalWrapper tripId={tripId} tripMembers={[]} />
      </div>
    </div>
  );
}
