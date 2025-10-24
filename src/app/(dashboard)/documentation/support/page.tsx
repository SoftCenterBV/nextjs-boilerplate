import {Card} from "@/components/ui/card";
import {AtSign, BookOpen, Phone} from "lucide-react";

export default function Page() {
    return (
        <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <BookOpen size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">{process.env.KNOWLEDGE_BASE_DOMAIN}</span>
                </Card>

                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <AtSign size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">{process.env.SUPPORT_EMAIL}</span>
                </Card>

                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <Phone size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">{process.env.SUPPORT_PHONE}</span>
                </Card>
            </div>
        </>
    )
}
