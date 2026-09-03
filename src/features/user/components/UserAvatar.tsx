import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Initials from the display name, falling back to the email for a nameless account. */
export function getInitials(name: string | null, fallback: string): string {
  return (name?.trim() || fallback)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface UserAvatarProps {
  name: string | null;
  email: string;
  image: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}

/** GitHub avatar image when present, otherwise initials generated from the name. */
export function UserAvatar({ name, email, image, size, className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {image ? <AvatarImage src={image} alt="" /> : null}
      <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
    </Avatar>
  );
}
