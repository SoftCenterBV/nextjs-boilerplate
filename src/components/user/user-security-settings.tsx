import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Key, Shield} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {TabsContent} from "@/components/ui/tabs";

export default function UserSecuritySettings() {
    return (
        <TabsContent value="security" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and authentication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Password</Label>
                                <p className="text-muted-foreground text-sm">Last changed 3 months ago</p>
                            </div>
                            <Button variant="outline">
                                <Key className="mr-2 h-4 w-4"/>
                                Change Password
                            </Button>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Two-Factor Authentication</Label>
                                <p className="text-muted-foreground text-sm">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                    Enabled
                                </Badge>
                                <Button variant="outline" size="sm">
                                    Configure
                                </Button>
                            </div>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Login Notifications</Label>
                                <p className="text-muted-foreground text-sm">
                                    Get notified when someone logs into your account
                                </p>
                            </div>
                            <Switch defaultChecked/>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Active Sessions</Label>
                                <p className="text-muted-foreground text-sm">
                                    Manage devices that are logged into your account
                                </p>
                            </div>
                            <Button variant="outline">
                                <Shield className="mr-2 h-4 w-4"/>
                                View Sessions
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}