import {
    AudioWaveform,
    BookOpen,
    Command,
    GalleryVerticalEnd,
    Monitor,
    SquareTerminal
} from "lucide-react";

export function SidebarData() {

    return {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Acme Inc",
                logo: GalleryVerticalEnd,
                plan: "Enterprise",
            },
            {
                name: "Acme Corp.",
                logo: AudioWaveform,
                plan: "Startup",
            },
            {
                name: "Evil Corp.",
                logo: Command,
                plan: "Free",
            },
        ],
        navMain: [
            {
                title: "Components",
                url: "#",
                icon: SquareTerminal,
                isActive: true,
                items: [
                    {
                        title: "Cards",
                        url: "/components/cards",
                    },
                    {
                        title: "Datatables",
                        url: "/components/datatables",
                    },
                ],
            },
            {
                title: "Documentation",
                url: "#",
                icon: BookOpen,
                items: [
                    {
                        title: "Knowledgebase",
                        url: "/documentation/knowledgebase",
                    },
                    {
                        title: "Support",
                        url: "/documentation/support",
                    },
                    {
                        title: "Changelog",
                        url: "/documentation/changelog",
                    },
                ],
            },
        ],
        documentation:[
            {
                name: "Support",
                url: "/documentation/support",
                icon: BookOpen,
            }
        ],
        main: [
            {
                name: "Dashboard",
                url: "/",
                icon: Monitor,
            },
        ],
    }
}