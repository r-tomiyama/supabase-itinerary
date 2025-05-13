"use client";

import { Button } from "@ui/button";
import { PlusIcon } from "lucide-react";

interface CreateItineraryModalTriggerProps {
  onClick: () => void;
}

export function CreateItineraryModalTrigger({ onClick }: CreateItineraryModalTriggerProps) {
  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <PlusIcon size={16} />
      旅程を追加
    </Button>
  );
}
