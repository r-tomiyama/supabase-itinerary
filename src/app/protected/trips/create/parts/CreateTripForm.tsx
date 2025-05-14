"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TripFormData, createTrip } from "@/client/actions/createTrip";
import { useSignedUser } from "@/client/hooks/useSignedUser";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

export function CreateTripForm() {
  const router = useRouter();
  const { user } = useSignedUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    budget_total: 0, // budget_totalを数値で初期化
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "budget_total"
          ? value === "" // 空文字の場合は0を設定
            ? 0
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // トリップを作成
      const userId = user?.id ?? "";
      const { trip, error } = await createTrip(formData, userId);

      if (error || !trip) {
        throw new Error(error ?? "トリップの作成に失敗しました");
      }

      // 成功したら詳細ページへリダイレクト
      router.push(`/protected/trips/${trip.id}`);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  // 今日の日付をYYYY-MM-DD形式で取得
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(e);
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">旅行タイトル *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例: 京都旅行 2025"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start_date">開始日 *</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                min={getToday()}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">終了日 *</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date || getToday()}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="budget_total">予算（円）</Label>
            <Input
              id="budget_total"
              name="budget_total"
              type="number"
              value={formData.budget_total === 0 ? "" : formData.budget_total}
              onChange={handleChange}
              placeholder="例: 100000"
              min="0"
              step="1"
            />
            <p className="mt-1 text-xs text-gray-500">予算は後で変更可能です</p>
          </div>

          <div>
            <Label htmlFor="description">説明</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="旅行についての説明や注意点など"
              className="min-h-[100px] w-full rounded-md border p-2"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "作成中..." : "旅行を作成する"}
          </Button>
        </div>
      </form>
    </>
  );
}
