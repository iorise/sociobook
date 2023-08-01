import { Icons } from "@/components/icons"

export interface MainNav {
    title: string
    href: string
    icon?: keyof typeof Icons
    iconFill?: keyof typeof Icons
    allowed?: boolean
    hidden?: boolean
    show?: boolean
    disabled?: boolean
}

export interface SidebarNav {
    title: string
    href: string
    icon?: keyof typeof Icons
    disabled?: boolean
}