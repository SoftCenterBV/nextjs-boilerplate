'use client';

import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {UserData} from "@/lib/api";
import {startTransition, useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {updateUserProfile} from "@/lib/api/server-actions/user-actions";
import {useRouter} from "next/navigation";

interface ProfileFormNewProps {
    userData: UserData | null;
}


export default function UserProfileSettings({userData}: ProfileFormNewProps) {
    const t = useTranslations('profile.settings');
    const [firstName, setFirstName] = useState(userData?.first_name ?? '');
    const [lastName, setLastName] = useState(userData?.last_name ?? '');
    const email = userData?.email ?? '';
    const router = useRouter();

    // Ensure local state follows server props when userData is refreshed
    useEffect(() => {
        setFirstName(userData?.first_name ?? '');
        setLastName(userData?.last_name ?? '');
    }, [userData?.id]);


    const onUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const updatedUser = await updateUserProfile(userData!.id, {
                first_name: firstName,
                last_name: lastName,
            })
            if (updatedUser) {
                toast.success(t('updateSuccess'));
                // Refresh the current route so server components re-fetch data and receive the updated user
                router.refresh();
            } else {
                toast.error(t('updateError'));
            }

        });
    };
    return (
        <TabsContent value="personal" className="space-y-6">
            <form onSubmit={onUpdate}>
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
                <CardFooter className="flex w-full justify-end" >
                    <Button>Submit</Button>
                </CardFooter>

            </Card>
        </form>
        </TabsContent>
    )
}