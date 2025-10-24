import {Card} from "@/components/ui/card";
import {AtSign, BookOpen, Phone} from "lucide-react";

export default function Page() {
    return (
        <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <BookOpen size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">docs.example.com</span>
                </Card>

                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <AtSign size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">support@example.com</span>
                </Card>

                <Card className="aspect-video flex flex-col items-center justify-center text-center space-y-2">
                    <Phone size={48} className="text-gray-700" />
                    <span className="text-lg font-medium">+31 (0800) 928349</span>
                </Card>
            </div>
        </>
    )
}
