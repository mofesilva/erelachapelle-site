import {
  CalendarBold,
  MicrophoneBold,
  PodcastBold,
  DocumentTextBold,
  TagBold,
  FolderBold,
  GalleryWideBold,
  AlbumBold,
} from "solar-icon-set";

export const NAV_ITEMS = [
  { href: "/admin/events", labelKey: "events", icon: CalendarBold },
  { href: "/admin/sermons", labelKey: "sermons", icon: MicrophoneBold },
  { href: "/admin/podcasts", labelKey: "podcasts", icon: PodcastBold },
  { href: "/admin/posts", labelKey: "posts", icon: DocumentTextBold },
  { href: "/admin/themes", labelKey: "themes", icon: TagBold },
  { href: "/admin/categories", labelKey: "categories", icon: FolderBold },
  { href: "/admin/media-assets", labelKey: "mediaAssets", icon: GalleryWideBold },
  { href: "/admin/albums", labelKey: "albums", icon: AlbumBold },
] as const;
