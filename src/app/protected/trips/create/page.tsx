import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@ui/button";
import { CreateTripForm } from "./parts/CreateTripForm";

export default function CreateTripPage() {

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/protected">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ChevronLeftIcon size={16} />
            旅行一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">新しい旅行を計画する</h1>
        <p className="text-gray-600 mt-2">旅行の基本情報を入力してください。後で詳細を追加できます。</p>
      </div>

      <CreateTripForm />
    </div>
  );
}
