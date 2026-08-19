"use client";

import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FILE_TYPES } from "../../_features/media-assets/media-asset.type";

const ALL = "all";

type Props = {
  fileType: (typeof FILE_TYPES)[number] | null;
  onChange: (next: { fileType?: (typeof FILE_TYPES)[number] | null }) => void;
};

export function MediaAssetsToolbar({ fileType, onChange }: Props) {
  const t = useTranslations("admin.mediaAssets.toolbar");

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={fileType ?? ALL}
        onValueChange={(value) => onChange({ fileType: value === ALL ? null : (value as (typeof FILE_TYPES)[number]) })}
      >
        <SelectTrigger className="h-10 w-48 border-dust-grey bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("filterAllTypes")}</SelectItem>
          {FILE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {t(`fileType.${type}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
