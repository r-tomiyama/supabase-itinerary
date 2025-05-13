import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@ui/button";

import { CreateTripForm } from "./parts/CreateTripForm";

export default function CreateTripPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            旅行一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">新しい旅行を計画する</h1>
        <p className="mt-2 text-gray-600">
          旅行の基本情報を入力してください。後で詳細を追加できます。
        </p>
      </div>

      <CreateTripForm />
    </div>
  );
}
