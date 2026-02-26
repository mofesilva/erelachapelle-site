import Image from "next/image";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
  photo?: string;
  name: string;
  role: string;
  bio: string;
  className?: string;
}

export function TeamMemberCard({
  photo,
  name,
  role,
  bio,
  className,
}: TeamMemberCardProps) {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className={cn(
        "flex flex-col items-center text-center transition-medium hover-elevation-sm",
        className
      )}
    >
      {/* Photo or Initials Placeholder */}
      <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full ring-2 ring-primary/10">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
            sizes="128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary">
            <span className="font-serif text-4xl text-white">{initials}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-serif text-xl font-semibold text-primary">{name}</h3>

      {/* Role */}
      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-powder-petal">
        {role}
      </p>

      {/* Bio */}
      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{bio}</p>
    </article>
  );
}
