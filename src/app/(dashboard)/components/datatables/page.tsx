import {
    Card,
} from "@/components/ui/card"
export default function Page() {
    return (
        <>
                <div className="grid auto-rows-min gap-4 md:grid-cols-6">
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card className="aspect-video"/>
                    <Card className="aspect-video"/>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card className="aspect-video"/>
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"/>
        </>
    )
}
