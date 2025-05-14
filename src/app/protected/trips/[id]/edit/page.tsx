import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import { fetcher } from "../fetcher";
import EditTripForm from "./_parts/edit-trip-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTripPage({ params }: PageProps) {
  const { id } = await params;
  const { trip, membership } = await fetcher(id);

  // 旅行データが存在しない場合や、ユーザーがオーナーでない場合は404エラー
  if (!trip || !membership || membership.role !== "owner") {
    notFound();
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="mb-2 flex items-center gap-2">
        <Link href={`/protected/trips/${id}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            旅行詳細に戻る
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">旅行を編集</h1>
        <EditTripForm trip={trip} />
      </div>
    </div>
  );
}
