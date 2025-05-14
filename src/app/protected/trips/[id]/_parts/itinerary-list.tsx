"use client";

import {
  CheckIcon,
  ClipboardEditIcon,
  ClockIcon,
  CoinsIcon,
  HourglassIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  RouteIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Title } from "@/components/ui/Title";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { isItineraryActive, parseTimeToSeconds } from "@libs/utils";

import { deleteItinerary } from "../../../../../client/actions/deleteItinerary";
import { updateActualData } from "../../../../../client/actions/updateActualData";
import { ItineraryModalWrapper } from "../../../../../client/features/create-itinerary-modal/itinerary-modal-wrapper";

export interface Itinerary {
  id: string;
  place_name: string;
  address?: string | null;
  planned_arrival?: string | null;
  actual_arrival?: string | null;
  stay_duration?: string | null;
  move_duration?: string | null;
  planned_budget?: number | null;
  actual_cost?: number | null;
  day_index: number; // fetcher.ts から取得するデータに含まれているか確認が必要
  trip_id?: string;
  created_at?: string | null;
}

interface ItineraryListProps {
  trip: {
    id: string;
    start_date: string;
  };
  itineraries: Itinerary[];
  tripDaysArray: {
    index: number;
    date: string;
  }[];
}

export default function ItineraryList({
  trip,
  itineraries,
  tripDaysArray,
}: ItineraryListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deletingItineraryId, setDeletingItineraryId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // 実績データ編集用の状態
  const [editingActualData, setEditingActualData] = useState<
    Record<
      string,
      { isEditing: boolean; actual_arrival?: string; actual_cost?: number }
    >
  >({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [updateError, setUpdateError] = useState<string | null>(null);

  // 5分ごとに現在時刻を更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 300000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 日付ごとにグループ化
  const groupedItineraries = itineraries?.reduce<Record<number, Itinerary[]>>(
    (acc, item) => {
      // この条件チェックは常に実行される必要があるため、!演算子を使用
      if (!(item.day_index in acc)) {
        acc[item.day_index] = [];
      }
      // TypeScriptの型エラーを回避するために型アサーションを使用
      const enhancedItem = {
        ...item,
        stay_duration: item.stay_duration as string | null,
        move_duration: (item as any).move_duration as string | null,
        trip_id: (item as any).trip_id || trip.id,
        created_at: (item as any).created_at || null,
      };

      acc[item.day_index].push(enhancedItem as Itinerary);
      return acc;
    },
    {},
  );

  // 各日にちのアイテムを予定到着時間でソート
  if (groupedItineraries) {
    Object.keys(groupedItineraries).forEach((dayIndex) => {
      groupedItineraries[Number(dayIndex)].sort((a, b) => {
        // parseTimeToSeconds関数を使用して時間を秒数に変換して比較
        // 時間がない場合はInfinityを返すので自動的に後ろに配置される
        return (
          parseTimeToSeconds(a.planned_arrival) -
          parseTimeToSeconds(b.planned_arrival)
        );
      });
    });
  }

  const handleEdit = (item: Itinerary) => {
    setEditingItinerary(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItinerary(null);
  };

  const handleOpenNewItineraryModal = () => {
    setEditingItinerary(null); // 新規作成モード
    setIsModalOpen(true);
  };

  const handleDelete = async (itineraryId: string) => {
    if (confirm("この旅程を削除してもよろしいですか？")) {
      setDeletingItineraryId(itineraryId);
      setIsDeleting(true);
      setDeleteError(null);

      try {
        const result = await deleteItinerary(itineraryId);
        if (result.success) {
          // 成功した場合、ページをリロードして最新の状態を表示
          window.location.reload();
        } else {
          setDeleteError(result.error || "削除中にエラーが発生しました");
        }
      } catch (error) {
        setDeleteError("削除処理中に予期せぬエラーが発生しました");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 実績データの編集モード切り替え
  const toggleActualDataEdit = (item: Itinerary) => {
    setEditingActualData((prev) => ({
      ...prev,
      [item.id]: {
        isEditing: !(prev[item.id]?.isEditing ?? false),
        actual_arrival: item.actual_arrival || "",
        actual_cost: item.actual_cost || undefined,
      },
    }));
  };

  // 編集中の実績データの値を更新
  const handleActualDataChange = (
    itemId: string,
    field: "actual_arrival" | "actual_cost",
    value: string | number,
  ) => {
    setEditingActualData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // 実績データの保存
  const saveActualData = async (itemId: string) => {
    setIsUpdating({ ...isUpdating, [itemId]: true });
    setUpdateError(null);

    try {
      const data = editingActualData[itemId];
      const result = await updateActualData({
        id: itemId,
        actual_arrival: data.actual_arrival || null,
        actual_cost:
          data.actual_cost !== undefined ? Number(data.actual_cost) : null,
      });

      if (result.success) {
        // 編集モードを終了
        setEditingActualData((prev) => {
          const newState = { ...prev };
          newState[itemId].isEditing = false;
          return newState;
        });
        // ページをリロードして最新の状態を表示
        window.location.reload();
      } else {
        setUpdateError(result.error || "更新中にエラーが発生しました");
      }
    } catch (error) {
      setUpdateError("更新処理中に予期せぬエラーが発生しました");
    } finally {
      setIsUpdating({ ...isUpdating, [itemId]: false });
    }
  };

  // 編集のキャンセル
  const cancelActualDataEdit = (itemId: string) => {
    setEditingActualData((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  return (
    <div>
      <Title icon={RouteIcon} text="旅程" />
      <div className="mb-4 flex items-center justify-end">
        <Button
          onClick={handleOpenNewItineraryModal}
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          旅程を追加
        </Button>
      </div>

      {isModalOpen && (
        <ItineraryModalWrapper
          tripId={trip.id}
          tripDaysArray={tripDaysArray}
          itineraryToEdit={editingItinerary}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <div className="space-y-6">
        {groupedItineraries &&
          Object.entries(groupedItineraries).map(([dayIndex, dayItems]) => {
            const dayDate = new Date(trip.start_date);
            dayDate.setDate(dayDate.getDate() + parseInt(dayIndex));
            const dayNum = parseInt(dayIndex) + 1;

            return (
              <div key={dayIndex} className="rounded-lg bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-teal-600 font-medium text-white">
                    {dayNum}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {new Date(dayDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                </div>

                <div className="relative ml-5 pl-5">
                  {dayItems.map((item, i) => {
                    const isActive = isItineraryActive(
                      item.planned_arrival,
                      item.stay_duration,
                      currentTime,
                      tripDaysArray[parseInt(dayIndex)]?.date,
                    );
                    const isEditingThis =
                      editingActualData[item.id]?.isEditing || false;

                    return (
                      <div key={item.id} className="relative">
                        {/* 縦線 */}
                        {i < dayItems.length - 1 && (
                          <div
                            className={`absolute left-0 top-0 h-full w-0.5 ${
                              isActive ? "bg-teal-500" : "bg-gray-200"
                            }`}
                          ></div>
                        )}

                        <div
                          className={`mb-4 rounded-lg bg-white p-4 shadow-sm ${
                            isActive
                              ? "border-2 border-teal-500 bg-teal-50"
                              : ""
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-lg font-semibold">
                              {item.place_name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  handleEdit(item);
                                }}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                title="編集"
                                aria-label="旅程を編集"
                                disabled={isDeleting}
                              >
                                <PencilIcon size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                                title="削除"
                                aria-label="旅程を削除"
                                disabled={isDeleting}
                              >
                                <TrashIcon size={16} />
                              </button>
                            </div>
                          </div>

                          {item.address && (
                            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
                              <MapPinIcon size={14} />
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-teal-600 hover:underline"
                              >
                                {item.address}
                              </a>
                            </div>
                          )}

                          {item.stay_duration && (
                            <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
                              <HourglassIcon size={14} />
                              <span>滞在時間: {item.stay_duration}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {isActive && (
                              <div className="absolute bottom-3 left-3 rounded-md bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
                                Now
                              </div>
                            )}
                            {(item.planned_arrival || isEditingThis) && (
                              <div className="rounded-md bg-gray-50 p-3">
                                <div className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                                  <ClockIcon size={14} />
                                  <span>到着時間</span>
                                </div>
                                {item.planned_arrival && (
                                  <div className="flex justify-between">
                                    <span className="text-sm">予定:</span>
                                    <span className="text-sm font-medium">
                                      {item.planned_arrival}
                                    </span>
                                  </div>
                                )}
                                {isEditingThis ? (
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm">実際:</span>
                                    <Input
                                      type="time"
                                      className="w-32 text-sm"
                                      value={
                                        editingActualData[item.id]
                                          ?.actual_arrival || ""
                                      }
                                      onChange={(e) => {
                                        handleActualDataChange(
                                          item.id,
                                          "actual_arrival",
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  item.actual_arrival && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">実際:</span>
                                      <span
                                        className={`text-sm font-medium ${
                                          item.actual_arrival &&
                                          item.planned_arrival &&
                                          parseTimeToSeconds(
                                            item.actual_arrival,
                                          ) >
                                            parseTimeToSeconds(
                                              item.planned_arrival,
                                            )
                                            ? "text-red-500"
                                            : parseTimeToSeconds(
                                                  item.actual_arrival,
                                                ) <
                                                parseTimeToSeconds(
                                                  item.planned_arrival,
                                                )
                                              ? "text-green-500"
                                              : ""
                                        }`}
                                      >
                                        {item.actual_arrival}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {(isEditingThis ||
                              item.planned_budget !== null ||
                              item.actual_cost !== null) && (
                              <div className="rounded-md bg-gray-50 p-3">
                                <div className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                                  <CoinsIcon size={14} />
                                  <span className="font-medium">費用</span>
                                </div>
                                {item.planned_budget !== null && (
                                  <div className="flex justify-between">
                                    <span className="text-sm">予算:</span>
                                    <span className="text-sm font-medium">
                                      ¥{item.planned_budget?.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                {isEditingThis ? (
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm">実費:</span>
                                    <Input
                                      type="number"
                                      className="w-32 text-sm"
                                      value={
                                        editingActualData[item.id]
                                          ?.actual_cost || ""
                                      }
                                      onChange={(e) => {
                                        handleActualDataChange(
                                          item.id,
                                          "actual_cost",
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  </div>
                                ) : (
                                  item.actual_cost !== null && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">実費:</span>
                                      <span
                                        className={`text-sm font-medium ${
                                          (item.actual_cost ?? 0) >
                                          (item.planned_budget ?? 0)
                                            ? "text-red-500"
                                            : "text-green-500"
                                        }`}
                                      >
                                        ¥{item.actual_cost?.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex justify-end gap-2">
                            {isEditingThis ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    cancelActualDataEdit(item.id);
                                  }}
                                  disabled={isUpdating[item.id]}
                                >
                                  <XIcon size={14} className="mr-1" />{" "}
                                  キャンセル
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => saveActualData(item.id)}
                                  disabled={isUpdating[item.id]}
                                >
                                  <CheckIcon size={14} className="mr-1" /> 保存
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toggleActualDataEdit(item);
                                }}
                                className="bg-gray-100 text-gray-500"
                              >
                                <ClipboardEditIcon size={14} className="mr-1" />{" "}
                                実績入力
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* 移動時間の表示 */}
                        {i < dayItems.length - 1 &&
                          (item as any).move_duration && (
                            <div className="relative flex items-center pb-7">
                              <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>
                              <div className="absolute left-0 h-0.5 w-5 bg-gray-200"></div>
                              <div className="my-auto ml-6 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                移動時間: {(item as any).move_duration}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {(!groupedItineraries ||
        Object.keys(groupedItineraries).length === 0) && (
        <div className="rounded-lg border py-12 text-center">
          <p className="mb-2">この旅行にはまだ旅程が追加されていません</p>
          <div className="flex justify-center">
            <Button
              onClick={handleOpenNewItineraryModal}
              className="flex items-center gap-2"
            >
              <PlusIcon size={16} />
              旅程を追加
            </Button>
          </div>
        </div>
      )}

      {(deleteError || updateError) && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-800">
          <p>{deleteError || updateError}</p>
        </div>
      )}
    </div>
  );
}
