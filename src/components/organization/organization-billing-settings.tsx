import {TabsContent} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {OrganizationSubscriptionData} from "@/data/organization-subscription";
import {OrganizationTransactionData} from "@/data/organization-transaction";


const subscriptions = OrganizationSubscriptionData();
const transactions = OrganizationTransactionData();

export default function OrganizationBillingSettings() {
    return (
        <TabsContent value="billing" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Billing Settings</CardTitle>
                    <CardDescription>Manage your billing preferences and subscription.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label className="text-base">Payment Method</Label>
                            <p className="text-muted-foreground text-sm">You can change your payment method here.</p>
                        </div>
                        <Button variant="outline">Change Payment Method</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Billing details</CardTitle>
                    <CardDescription>Update your billing details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="billingname">Billing Contact Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invoiceemail">Invoice Email</Label>
                            <Input id="email" type="email" placeholder="invoice@example.com" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-muted-foreground grid grid-cols-5 gap-4 border-b pb-2 text-sm font-medium">
                            <div>PRODUCT</div>
                            <div>PLAN</div>
                            <div>CYCLE</div>
                            <div>DATE</div>
                            <div className="text-right">AMOUNT</div>
                        </div>

                        {subscriptions.subscriptions.map((subscription) => (
                            <div key={subscription.id} className="grid grid-cols-5 gap-4 py-2 text-sm">
                                <div>{subscription.product}</div>
                                <div>
                                    <Badge
                                        variant={subscription.plan === "Basic" ? "default" : "secondary"}
                                        className={
                                            subscription.plan === "Basic"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }>
                                        {subscription.plan}
                                    </Badge>
                                </div>
                                <div><Badge>{subscription.cycle}</Badge></div>
                                <div>{subscription.renews_at}</div>
                                <div className="text-right font-medium">{subscription.amount}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Transaction history</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-muted-foreground grid grid-cols-6 gap-4 border-b pb-2 text-sm font-medium">
                            <div>REFERENCE</div>
                            <div>PRODUCT</div>
                            <div>STATUS</div>
                            <div>DATE</div>
                            <div>AMOUNT</div>
                            <div className="text-right">INVOICE</div>
                        </div>

                        {transactions.transactions.map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-6 gap-4 py-2 text-sm">
                                <div className="font-medium">{transaction.id}</div>
                                <div>{transaction.product}</div>
                                <div>
                                    <Badge
                                        variant={transaction.status === "Paid" ? "default" : "secondary"}
                                        className={
                                            transaction.status === "Paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }>
                                        {transaction.status}
                                    </Badge>
                                </div>
                                <div>{transaction.date}</div>
                                <div>{transaction.amount}</div>
                                <div className="text-right font-medium"><Button>Download</Button></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}