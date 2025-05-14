import { LucideIcon } from "lucide-react";

import { cn } from "@/libs/utils";

interface TitleProps {
  icon?: LucideIcon;
  text: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Title コンポーネント
 * アイコンとテキストを表示するタイトルコンポーネント
 *
 * @param icon - lucide-reactのアイコンコンポーネント
 * @param text - 表示するテキスト
 * @param className - タイトルコンテナに適用するクラス名
 * @param iconClassName - アイコンに適用するクラス名
 */
export function Title({
  icon: Icon,
  text,
  className,
  iconClassName,
}: TitleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon && <Icon className={cn("h-5 w-5", iconClassName)} />}
      <h2 className="text-xl font-bold">{text}</h2>
    </div>
  );
}
