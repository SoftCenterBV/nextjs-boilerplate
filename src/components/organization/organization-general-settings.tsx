import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function OrganizationGeneralSettings() {
    return (
        <TabsContent value="general" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Business Information</CardTitle>
                    <CardDescription>Update your business details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization name</Label>
                            <Input id="name" placeholder="Example" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="business@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="Street 1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalcode">Postalcode</Label>
                            <Input id="postalcode" placeholder="1234 DB" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Amsterdam" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" placeholder="The Netherlands" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}