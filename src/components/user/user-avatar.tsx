import { cva, type VariantProps } from "class-variance-authority";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatarVariants = cva("hover:cursor-pointer", {
  variants: {
    variant: {
      focus:
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    },
    size: {
      default: "w-8 h-8 md:h-10 md:w-10",
      xl: "w-44 h-44 border-4 border-secondaryBackground",
      lg: "w-16 h-16 md:w-24 md:h-24",
      md: "w-8 h-8 md:h-10 md:w-10",
      sm: "w-7 h-7 md:w-9 md:h-9",
      xs: "w-5 h-5 md:w-6 md:h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src: string;
  alt?: string;
  className?: string;
}

export function UserAvatar({
  src,
  alt,
  size,
  className,
  ...props
}: UserAvatarProps) {
  return (
    <Avatar className={cn(avatarVariants({ size }), className)} {...props}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        <img src="/images/placeholder.png" />
      </AvatarFallback>
    </Avatar>
  );
}
