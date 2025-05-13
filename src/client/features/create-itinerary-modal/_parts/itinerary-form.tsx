"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { formatDate } from "@libs/utils";
import { FormGrid } from "@ui/form-grid";
import { FormActions } from "@ui/form-actions";
import { FormError } from "@ui/form-error";
import { ItineraryFormData, createItinerary } from "@/client/actions/createItinerary";
import { ItineraryFormField } from "./itinerary-form-field";

interface ItineraryFormProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: Date;
  }[];
  onSuccess: () => void;
  onCancel: () => void;
  userId: string;
}

export function ItineraryForm({ tripId, tripDaysArray, onSuccess, onCancel, userId }: ItineraryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ItineraryFormData>({
    trip_id: tripId,
    day_index: tripDaysArray.length > 0 ? tripDaysArray[0].index : 0,
    place_name: "",
    address: "",
    planned_arrival: "",
    stay_duration: "",
    planned_budget: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "day_index" 
        ? parseInt(value) 
        : name === "planned_budget" 
          ? value ? parseInt(value) : undefined 
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 旅程を作成
      const { itinerary, error } = await createItinerary(formData, userId);
      
      if (error || !itinerary) {
        throw new Error(error || "旅程の追加に失敗しました");
      }

      // 成功したらコールバックを呼び出し
      onSuccess();
    } catch (err: any) {
      setError(err.message || "旅程の追加中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 日付の選択肢を作成
  const dayOptions = tripDaysArray.map(day => ({
    value: day.index,
    label: `Day ${day.index + 1}: ${formatDate(day.date.toISOString())}`
  }));

  return (
    <>
      <FormError error={error} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormGrid>
          <ItineraryFormField
            label="旅行日"
            name="day_index"
            value={formData.day_index}
            onChange={handleChange}
            required
            options={dayOptions}
            ariaLabel="旅行日を選択"
          />
          
          <ItineraryFormField
            label="場所名"
            name="place_name"
            value={formData.place_name}
            onChange={handleChange}
            placeholder="場所の名前を入力"
            required
          />
          
          <ItineraryFormField
            label="住所"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="住所を入力（オプション）"
          />
          
          <ItineraryFormField
            label="予定到着時間"
            name="planned_arrival"
            type="time"
            value={formData.planned_arrival}
            onChange={handleChange}
          />
          
          <ItineraryFormField
            label="滞在時間（分）"
            name="stay_duration"
            type="number"
            min="0"
            value={formData.stay_duration}
            onChange={handleChange}
            placeholder="滞在予定時間（分）"
          />
          
          <ItineraryFormField
            label="予算（円）"
            name="planned_budget"
            type="number"
            min="0"
            value={formData.planned_budget || ""}
            onChange={handleChange}
            placeholder="予算を入力"
          />
        </FormGrid>
        
        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "追加中..." : "旅程を追加"}
          </Button>
        </FormActions>
      </form>
    </>
  );
}
