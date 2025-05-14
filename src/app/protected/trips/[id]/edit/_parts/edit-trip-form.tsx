"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";

import { updateTrip, TripFormData } from "@/client/actions/updateTrip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@libs/utils";

interface EditTripFormProps {
  trip: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    description?: string | null;
    budget_total?: number | null;
  };
}

export default function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 日付をYYYY-MM-DD形式にフォーマットする関数
  const formatDateForInput = (dateString: string): string => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  const [formData, setFormData] = useState<TripFormData>({
    id: trip.id,
    title: trip.title,
    description: trip.description || "",
    start_date: trip.start_date,
    end_date: trip.end_date,
    budget_total: trip.budget_total || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { trip, error } = await updateTrip(formData);

      if (error) {
        setError(error);
        return;
      }

      // 更新に成功したら元のページに戻る
      router.push(`/protected/trips/${trip!.id}`);
      router.refresh();
    } catch (err) {
      setError("旅行の更新中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">旅行タイトル</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="例: 東京旅行"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">旅行の説明</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="旅行の説明を入力してください"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="start_date">開始日</Label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={formatDateForInput(formData.start_date)}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="end_date">終了日</Label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              value={formatDateForInput(formData.end_date)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="budget_total">予算（円）</Label>
          <Input
            type="number"
            id="budget_total"
            name="budget_total"
            value={formData.budget_total}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/protected/trips/${trip.id}`)}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}