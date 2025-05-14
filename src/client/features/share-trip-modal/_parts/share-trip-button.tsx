"use client";

import { ShareIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/button";
import { ShareTripModal } from "../share-trip-modal";


interface ShareTripButtonProps {
  tripId: string;
  isOwner: boolean; // オーナーかどうかを示すプロパティ
}

export function ShareTripButton({ tripId, isOwner }: ShareTripButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // オーナーでない場合はボタンを表示しない
  if (!isOwner) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="flex items-center gap-1"
      >
        <ShareIcon size={16} />
        共有
      </Button>

      <ShareTripModal
        tripId={tripId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
