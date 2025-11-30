'use client';

import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {UserData} from "@/lib/api";
import {useState} from "react";

interface ProfileFormNewProps {
    userData: UserData | null;
}


export default function UserProfileSettings({userData}: ProfileFormNewProps) {
    const [firstName, setFirstName] = useState(userData?.data.first_name);
    const [lastName, setLastName] = useState(userData?.data.last_name);
    const [email] = useState(userData?.data.email);
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
                            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}