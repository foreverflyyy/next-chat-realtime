import { Icon } from "@/components/Icons";

export interface SidebarOption {
    id: number;
    name: string;
    href: string;
    Icon: Icon;
}

export const sidebarOptions:SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'
    },
]