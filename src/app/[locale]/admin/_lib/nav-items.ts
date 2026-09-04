import {
  Home2Bold,
  CalendarBold,
  MicrophoneBold,
  PodcastBold,
  DocumentTextBold,
  TagBold,
  FolderBold,
  GalleryWideBold,
  FileTextBold,
  AlbumBold,
  UsersGroupRoundedBold,
} from "solar-icon-set";

export const NAV_ITEMS = [
  { href: "/admin", labelKey: "home", icon: Home2Bold },
  { href: "/admin/events", labelKey: "events", icon: CalendarBold },
  { href: "/admin/sermons", labelKey: "sermons", icon: MicrophoneBold },
  { href: "/admin/podcasts", labelKey: "podcasts", icon: PodcastBold },
  { href: "/admin/posts", labelKey: "posts", icon: DocumentTextBold },
  { href: "/admin/categories", labelKey: "categories", icon: FolderBold },
  {
    href: "/admin/media-assets",
    labelKey: "mediaAssets",
    icon: GalleryWideBold,
  },
  { href: "/admin/public-files", labelKey: "publicFiles", icon: FileTextBold },
  { href: "/admin/albums", labelKey: "albums", icon: AlbumBold },
  // Só admin gerencia contas — a API já bloqueia editor no backend (GET /users é
  // admin-only), aqui é só pra não mostrar um link que vai dar 403.
  { href: "/admin/users", labelKey: "users", icon: UsersGroupRoundedBold, roles: ["admin"] },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
