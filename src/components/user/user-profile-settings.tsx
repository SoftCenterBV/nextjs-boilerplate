import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function UserProfileSettings() {
    return (
        <TabsContent value="personal" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and profile information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="john.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}