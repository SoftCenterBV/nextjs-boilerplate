import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/user/user-settings-header";
import UserProfileSettings from "@/components/user/user-profile-settings";
import UserAccountSettings from "@/components/user/user-account-settings";
import UserSecuritySettings from "@/components/user/user-security-settings";
import UserNotificationSettings from "@/components/user/user-notification-settings";

export default function UserSettings() {
    return (
        <>
            <ProfileHeader/>
            <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <UserProfileSettings/>
            <UserAccountSettings/>
            <UserSecuritySettings/>
            <UserNotificationSettings/>
            </Tabs>
        </>
    );
}