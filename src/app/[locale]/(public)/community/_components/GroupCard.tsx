import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalizedContent } from "@/lib/utils";
import type { CommunityGroup } from "@/types/group";
import type { Locale } from "@/types/common";
import { Users, Clock } from "lucide-react";

interface GroupCardProps {
  group: CommunityGroup;
  locale: Locale;
  typeLabel: string;
  dayLabel: string;
}

export function GroupCard({ group, locale, typeLabel, dayLabel }: GroupCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <Users className="mb-3 h-6 w-6 text-primary" />
        <h3 className="font-serif text-lg font-semibold">
          <Link
            href={`/${locale}/community/groups/${group._id}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(group.name, locale)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {getLocalizedContent(group.description, locale)}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {dayLabel} · {group.meetingTime}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {group.leaderName}
          </p>
        </div>
        <Badge variant="secondary" className="mt-3">
          {typeLabel}
        </Badge>
      </CardContent>
    </Card>
  );
}
