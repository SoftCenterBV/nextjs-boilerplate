import {OrganizationData} from "@/lib/api/types";
import {fetchAsJson} from "@/lib/api/client";

export const getUserOrganizations = async (): Promise<OrganizationData[]> => {
    try {
        const organizations = await fetchAsJson<{ data: OrganizationData[] }>('/organizations');
        return organizations.data;
    } catch (error) {
        return [];
    }
};
