import { v4 as uuidv4 } from "uuid";

import { createClient } from "@services/supabase/client";

interface UploadTripImageResult {
  url: string | null;
  error: string | null;
}

/**
 * 旅行の画像をアップロードする
 * @param file アップロードするファイル
 * @param tripId 旅行ID
 * @returns アップロードされた画像のURLとエラー
 */
export async function uploadTripImage(
  file: File,
  tripId: string
): Promise<UploadTripImageResult> {
  const supabase = createClient();

  try {
    // ファイルタイプのチェック
    if (!file.type.startsWith('image/')) {
      return {
        url: null,
        error: '画像ファイルのみアップロードできます',
      };
    }

    // ファイルサイズのチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      return {
        url: null,
        error: '画像サイズは5MB以下にしてください',
      };
    }

    // ファイル名を生成（衝突を避けるためにUUIDを使用）
    const fileExt = file.name.split('.').pop() || 'jpg';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const uuid = uuidv4();
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const fileName = `${tripId}/${uuid}.${fileExt}`;

    // ストレージにアップロード
    const { error: uploadError } = await supabase.storage
      .from('trip-images')
      .upload(fileName, file);

    if (uploadError) {
      return {
        url: null,
        error: uploadError.message || 'アップロードに失敗しました',
      };
    }

    // 公開URLを取得
    const { data } = supabase.storage
      .from('trip-images')
      .getPublicUrl(fileName);

    return {
      url: data.publicUrl,
      error: null,
    };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('不明なエラーが発生しました');
    return {
      url: null,
      error: error.message,
    };
  }
}
