'use client';

import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {UserData} from "@/lib/api";
import {startTransition, useState} from "react";
import {useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import {useParams} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

interface ProfileFormNewProps {
    userData: UserData | null;
}


export default function UserProfileSettings({userData}: ProfileFormNewProps) {
    const t = useTranslations('profile.settings');
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [firstName, setFirstName] = useState(userData?.data.first_name);
    const [lastName, setLastName] = useState(userData?.data.last_name);
    const [email] = useState(userData?.data.email);


    const onUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            toast.success('user updated')
            // const updatedUser = await updateUserProfile(userData!.data.id, {
            //     first_name: firstName,
            //     last_name: lastName,
            // });

            // if (updatedUser) {
            //     toast.success(t('updateSuccess'));
            // } else {
            //     toast.error(t('updateError'));
            // }
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