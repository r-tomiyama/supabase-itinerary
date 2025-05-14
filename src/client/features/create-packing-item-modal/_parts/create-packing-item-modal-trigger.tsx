"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CreatePackingItemModalTriggerProps {
  onClick: () => void;
}

export function CreatePackingItemModalTrigger({
  onClick,
}: CreatePackingItemModalTriggerProps) {
  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <PlusIcon size={16} />
      持ち物を追加
    </Button>
  );
}
