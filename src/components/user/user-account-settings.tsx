import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Switch} from "@/components/ui/switch";
import {Trash2} from "lucide-react";

export default function UserAccountSettings() {
    return (
    <TabsContent value="account" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base">Account Status</Label>
                        <p className="text-muted-foreground text-sm">Your account is currently active</p>
                    </div>
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        Active
                    </Badge>
                </div>
                <Separator/>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base">Subscription Plan</Label>
                        <p className="text-muted-foreground text-sm">Pro Plan - $29/month</p>
                    </div>
                    <Button variant="outline">Manage Subscription</Button>
                </div>
                <Separator/>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base">Account Visibility</Label>
                        <p className="text-muted-foreground text-sm">
                            Make your profile visible to other users
                        </p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                <Separator/>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base">Data Export</Label>
                        <p className="text-muted-foreground text-sm">Download a copy of your data</p>
                    </div>
                    <Button variant="outline">Export Data</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-base">Delete Account</Label>
                        <p className="text-muted-foreground text-sm">
                            Permanently delete your account and all data
                        </p>
                    </div>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    </TabsContent>
    );
}