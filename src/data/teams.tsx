import {AudioWaveform, Command, GalleryVerticalEnd} from "lucide-react";
import {ElementType} from "react";

export function TeamsData() {

    return {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Acme Inc",
                logo: GalleryVerticalEnd as ElementType,
                plan: "Enterprise",
            },
            {
                name: "Acme Corp.",
                logo: AudioWaveform as ElementType,
                plan: "Startup",
            },
            {
                name: "Evil Corp.",
                logo: Command as ElementType,
                plan: "Free",
            },
        ],
    }
}