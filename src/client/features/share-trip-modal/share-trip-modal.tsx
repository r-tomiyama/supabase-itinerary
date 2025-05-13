"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/client/components/modal";
import { useSignedUser } from "@/client/hooks/useSignedUser";
import { shareTrip } from "@/client/actions/shareTrip";
import { findUserByEmail } from "@/client/actions/findUserByEmail";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

interface ShareTripModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareTripModal({
  tripId,
  isOpen,
  onClose,
}: ShareTripModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    id: string;
    display_name: string;
    email: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useSignedUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFoundUser(null);
    setIsSearching(true);

    try {
      // メールアドレスでユーザーを検索
      const { user: searchedUser, error: findError } =
        await findUserByEmail(email);

      if (findError || !searchedUser) {
        setError("指定されたメールアドレスのユーザーが見つかりません");
        return;
      }

      setFoundUser(searchedUser);
    } catch {
      setError("検索中にエラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async () => {
    if (!user || !foundUser) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // 旅行を共有
      const { success, error: shareError } = await shareTrip(
        tripId,
        foundUser.id,
        user.id,
      );

      if (shareError || !success) {
        setError(shareError ?? "共有に失敗しました");
        return;
      }

      setSuccess(`${foundUser.display_name}さんと旅行を共有しました`);
      setEmail("");
      setFoundUser(null);
    } catch {
      setError("共有処理中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setEmail("");
    setError(null);
    setSuccess(null);
    setFoundUser(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="旅行を共有">
      <div className="space-y-4">
        <form
          onSubmit={(e) => {
            void handleSearch(e);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              メールアドレス
            </label>
            <div className="mt-1 flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="共有したいユーザーのメールアドレス"
                required
                disabled={isSearching || isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isSearching || isLoading || !email}
              >
                {isSearching ? "検索中..." : "検索"}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              ※登録済みのユーザーのメールアドレスを入力してください
            </p>
          </div>
        </form>

        {foundUser && (
          <div className="rounded-md border border-gray-200 p-3">
            <h3 className="font-medium">検索結果</h3>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-medium">名前:</span>{" "}
                {foundUser.display_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">メール:</span> {foundUser.email}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-700">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700">
            <CheckCircle size={16} />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleModalClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={() => {
              void handleShare();
            }}
            disabled={isLoading || isSearching || !foundUser}
          >
            {isLoading ? "処理中..." : "共有"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
