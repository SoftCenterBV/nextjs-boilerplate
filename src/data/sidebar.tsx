import {
    BookOpen,
    Monitor,
} from "lucide-react";

export function SidebarData() {

    return {
        main: [
            {
                name: "Dashboard",
                url: "/",
                icon: Monitor,
            },
        ],
        documentation:[
            {
                name: "Support",
                url: "/documentation/support",
                icon: BookOpen,
            }
        ],

    }
}