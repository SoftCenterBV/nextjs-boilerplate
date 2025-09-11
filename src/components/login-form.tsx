"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"form">) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        startTransition(async () => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || "Login failed");
                    return;
                }

                const data = await res.json();
                localStorage.setItem("token", data.token);
                router.push("/dashboard");

            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>

                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" name="password" type="password" required />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </Button>
            </div>

            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </form>
    );
}
