import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {OrganizationUsersData} from "@/data/organization-users";
import { Button } from "../ui/button";
import {MoreHorizontal} from "lucide-react";

const users = OrganizationUsersData();

export default function OrganizationTeamSettings() {
    return (
        <TabsContent value="team" className="space-y-6">
    <Card>
        <CardHeader>
            <CardTitle>Team</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="text-muted-foreground grid grid-cols-4 gap-4 border-b pb-2 text-sm font-medium">
                    <div>NAME</div>
                    <div>EMAIL</div>
                    <div>ROLE</div>
                    <div className="text-right">ACTIONS</div>
                </div>

                {users.users.map((user) => (
                    <div key={user.id} className="grid grid-cols-4 gap-4 py-2 text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div>{user.email}</div>
                        <div>{user.role}</div>
                        <div className="text-right font-medium">
                            <Button variant="ghost" size="sm" className="ml-auto">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
</TabsContent>
    )
}