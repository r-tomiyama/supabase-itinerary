"use client";

import dayjs from "dayjs";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateTrip, TripFormData } from "@/client/actions/updateTrip";
import { uploadTripImage } from "@/client/actions/uploadTripImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditTripFormProps {
  trip: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    description?: string | null;
    budget_total?: number | null;
    image_url?: string | null;
  };
}

export default function EditTripForm({ trip }: EditTripFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    image_url: trip.image_url || null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const { url, error } = await uploadTripImage(file, trip.id);
      
      if (error || !url) {
        setUploadError(error || "アップロードに失敗しました");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image_url: url,
      }));
    } catch {
      setUploadError("画像のアップロード中にエラーが発生しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: null,
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
      if (trip) {
        router.push(`/protected/trips/${trip.id}`);
        router.refresh();
      }
    } catch {
      setError("旅行の更新中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {uploadError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{uploadError}</div>
        </div>
      )}

      <div className="space-y-4">
        {/* 画像アップロード */}
        <div>
          <Label htmlFor="image">旅行の画像</Label>
          <div className="mt-2">
            {formData.image_url ? (
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={formData.image_url}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleRemoveImage}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-6">
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer flex-col items-center justify-center"
                >
                  {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  )}
                  <span className="mt-2 text-sm text-gray-500">
                    クリックして画像をアップロード
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      void handleImageUpload(e);
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            推奨サイズ: 1200 x 800px、最大5MB
          </p>
        </div>
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
          onClick={() => {
            router.push(`/protected/trips/${trip.id}`);
          }}
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
