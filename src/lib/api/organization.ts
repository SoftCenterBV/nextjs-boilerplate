import {cache} from "react";


import type { OrganizationData} from "@/lib/api/types";


// Server action state types
export type OrganizationActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    data?: OrganizationData;
};

export const getUserOrganizations = cache(async (): Promise<OrganizationData[]> => {
    const response = await fetch("/api/organizations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch organizations");
    }

    return response.json();
}