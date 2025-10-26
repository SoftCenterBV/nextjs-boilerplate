export function OrganizationSubscriptionData() {

    return {
        subscriptions: [
            {
                id: "1",
                product: "Acme Inc",
                plan: "Basic",
                renews_at: "2025-12-30",
                cycle: "Annual",
                amount: "€99.00",
            },
            {
                id: "2",
                product: "Acme Inc",
                plan: "Pro",
                renews_at: "2025-12-30",
                cycle: "Annual",
                amount: "€999.00",
            },
            {
                id: "3",
                product: "Acme Inc",
                plan: "Enterprise",
                renews_at: "2025-12-30",
                cycle: "Annual",
                amount: "€9999.00",
            },
        ],
    }
}