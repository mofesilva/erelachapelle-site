import Link from "next/link";
import { Badge } from "@/_components/ui/badge";
import { Card, CardContent } from "@/_components/ui/card";
import { getLocalizedContent } from "@/lib/utils";
import type { CommunityGroup } from "@/lib/groups";
import type { Locale } from "@/types/common";
import { UsersGroupRoundedBold, ClockCircleBold } from "solar-icon-set";

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
        <UsersGroupRoundedBold size={24} color="var(--primary)" className="mb-3" />
        <h6 className="font-serif font-semibold">
          <Link
            href={`/${locale}/community/groups/${group._id}`}
            className="hover:text-primary"
          >
            {getLocalizedContent(group.name, locale)}
          </Link>
        </h6>
        <p className="mt-2 line-clamp-2 text-muted-foreground">
          {getLocalizedContent(group.description, locale)}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <ClockCircleBold size={16} color="var(--primary)" />
            <span>
              {dayLabel} · {group.meetingTime}
            </span>
          </div>
          <p className="text-muted-foreground">
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
