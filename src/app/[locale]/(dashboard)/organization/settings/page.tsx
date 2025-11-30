import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/user/user-settings-header";
import OrganizationGeneralSettings from "@/components/organization/organization-general-settings";
import OrganizationBillingSettings from "@/components/organization/organization-billing-settings";
import OrganizationTeamSettings from "@/components/organization/organization-team-settings";
import OrganizationProfileHeader from "@/components/organization/organization-settings-header";

export default function OrganizationSettings() {
    return (
        <>
            <OrganizationProfileHeader userData={null}/>
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <OrganizationGeneralSettings/>
                <OrganizationBillingSettings/>
                <OrganizationTeamSettings/>
            </Tabs>
        </>
    );
}