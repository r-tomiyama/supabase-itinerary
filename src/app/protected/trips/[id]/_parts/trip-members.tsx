import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Title } from "@/components/ui/Title";

export interface TripMembersProps {
  tripMembers: {
    id: string;
    trip_id: string;
    user_id: string;
    role: "owner" | "editor" | "viewer";
    created_at: string;
    profiles: {
      id: string;
      email: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }[];
}

export default function TripMembers({ tripMembers }: TripMembersProps) {
  if (tripMembers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <Title icon={Users} text="メンバー一覧" className="mb-3" />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {tripMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="size-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {member.profiles.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.profiles.avatar_url}
                  alt={member.profiles.display_name || member.profiles.email}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-gray-200 text-gray-500">
                  {(member.profiles.display_name ||
                    member.profiles.email)[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">
                {member.profiles.display_name || member.profiles.email}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={member.role === "owner" ? "default" : "outline"}
                >
                  {member.role === "owner"
                    ? "オーナー"
                    : member.role === "editor"
                      ? "編集者"
                      : "閲覧者"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
