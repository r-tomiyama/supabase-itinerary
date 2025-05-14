"use client";

import { useEffect, useState } from "react";

import {
  ItineraryFormData as CreateItineraryFormData,
  createItinerary,
} from "@/client/actions/createItinerary";
import {
  ItineraryFormData as UpdateItineraryFormData,
  updateItinerary,
} from "@/client/actions/updateItinerary";
import type { Itinerary } from "@/app/protected/trips/[id]/_parts/itinerary-list";
import { formatDate, formatTimeForInput } from "@libs/utils";
import { Button } from "@ui/button";
import { FormActions } from "@ui/form-actions";
import { FormError } from "@ui/form-error";
import { FormGrid } from "@ui/form-grid";

import { ItineraryFormField } from "./itinerary-form-field";

interface ItineraryFormProps {
  tripId: string;
  tripDaysArray: {
    index: number;
    date: Date;
  }[];
  itineraryToEdit?: Itinerary | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type ItinerarySubmitData = CreateItineraryFormData | UpdateItineraryFormData;

export function ItineraryForm({
  tripId,
  tripDaysArray,
  itineraryToEdit,
  onSuccess,
  onCancel,
}: ItineraryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itineraryToEdit) {
      setFormData({
        id: itineraryToEdit.id,
        trip_id: tripId,
        day_index: itineraryToEdit.day_index,
        place_name: itineraryToEdit.place_name,
        address: itineraryToEdit.address ?? "",
        planned_arrival:
          itineraryToEdit.planned_arrival
            ? formatTimeForInput(itineraryToEdit.planned_arrival)
            : undefined,
        stay_duration: itineraryToEdit.stay_duration ?? undefined,
        planned_budget: itineraryToEdit.planned_budget ?? undefined,
        actual_arrival:
          itineraryToEdit.actual_arrival
            ? formatTimeForInput(itineraryToEdit.actual_arrival)
            : undefined,
        actual_cost: itineraryToEdit.actual_cost ?? undefined,
      });
    } else {
      setFormData({
        trip_id: tripId,
        day_index: tripDaysArray.length > 0 ? tripDaysArray[0].index : 0,
        place_name: "",
        address: "",
        planned_arrival: undefined,
        stay_duration: undefined,
        planned_budget: undefined,
        actual_arrival: undefined,
        actual_cost: undefined,
      });
    }
  }, [itineraryToEdit, tripId, tripDaysArray]);

  const [formData, setFormData] = useState<any>(() => {
    if (itineraryToEdit) {
      return {
        id: itineraryToEdit.id,
        trip_id: tripId,
        day_index: itineraryToEdit.day_index,
        place_name: itineraryToEdit.place_name,
        address: itineraryToEdit.address ?? "",
        planned_arrival:
          itineraryToEdit.planned_arrival
            ? formatTimeForInput(itineraryToEdit.planned_arrival)
            : "",
        stay_duration: itineraryToEdit.stay_duration ?? "",
        planned_budget: itineraryToEdit.planned_budget ?? undefined,
        actual_arrival:
          itineraryToEdit.actual_arrival
            ? formatTimeForInput(itineraryToEdit.actual_arrival)
            : "",
        actual_cost: itineraryToEdit.actual_cost ?? undefined,
      };
    }
    return {
      trip_id: tripId,
      day_index: tripDaysArray.length > 0 ? tripDaysArray[0].index : 0,
      place_name: "",
      address: "",
      planned_arrival: "",
      stay_duration: "",
      planned_budget: undefined,
      actual_arrival: "",
      actual_cost: undefined,
    };
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "day_index"
          ? parseInt(value)
          : name === "planned_budget" || name === "actual_cost"
            ? value
              ? parseInt(value)
              : undefined
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (itineraryToEdit && "id" in formData && formData.id) {
        const { itinerary, error } = await updateItinerary(
          formData as UpdateItineraryFormData,
        );
        if (error || !itinerary) {
          throw new Error(error ?? "旅程の更新に失敗しました");
        }
      } else {
        const { itinerary, error } = await createItinerary(
          formData as CreateItineraryFormData,
        );
        if (error || !itinerary) {
          throw new Error(error ?? "旅程の追加に失敗しました");
        }
      }
      onSuccess();
    } catch (err: unknown) {
      const error =
        err instanceof Error ? err : new Error("不明なエラーが発生しました");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const dayOptions = tripDaysArray.map((day) => ({
    value: day.index,
    label: `Day ${(day.index + 1).toString()}: ${formatDate(day.date.toISOString())}`,
  }));

  const submitButtonText = itineraryToEdit ? "旅程を更新" : "旅程を追加";

  return (
    <>
      <FormError error={error} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(e);
        }}
        className="space-y-6"
      >
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
            value={formData.address ?? ""}
            onChange={handleChange}
            placeholder="住所を入力（オプション）"
          />

          <ItineraryFormField
            label="予定到着時間"
            name="planned_arrival"
            type="time"
            value={formData.planned_arrival ?? ""}
            onChange={handleChange}
          />

          <ItineraryFormField
            label="滞在時間（分）"
            name="stay_duration"
            type="number"
            min="0"
            value={formData.stay_duration ?? ""}
            onChange={handleChange}
            placeholder="滞在予定時間（分）"
          />

          <ItineraryFormField
            label="予算（円）"
            name="planned_budget"
            type="number"
            min="0"
            value={formData.planned_budget ?? ""}
            onChange={handleChange}
            placeholder="予算を入力"
          />

          {itineraryToEdit && (
            <>
              <ItineraryFormField
                label="実績到着時間"
                name="actual_arrival"
                type="time"
                value={formData.actual_arrival ?? ""}
                onChange={handleChange}
              />
              <ItineraryFormField
                label="実績費用（円）"
                name="actual_cost"
                type="number"
                min="0"
                value={formData.actual_cost ?? ""}
                onChange={handleChange}
                placeholder="実績費用を入力"
              />
            </>
          )}
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
            {loading ? (itineraryToEdit ? "更新中..." : "追加中...") : submitButtonText}
          </Button>
        </FormActions>
      </form>
    </>
  );
}
