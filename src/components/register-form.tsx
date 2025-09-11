"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"form">) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const first_name = formData.get("first_name") as string;
        const last_name = formData.get("last_name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const password_confirmation = formData.get("password_confirmation") as string;

        if (password !== password_confirmation) {
            setError("Passwords do not match");
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ first_name, last_name, email, password, password_confirmation }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message || "Something went wrong");
                    return;
                }

                const data = await res.json();
                setSuccess("Account created successfully!");
                localStorage.setItem("token", data.token);
                router.push("/dashboard");

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
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
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your details below to create your account
                </p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="first_name">First name</Label>
                    <Input id="first_name" name="first_name" type="text" placeholder="John" required />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input id="last_name" name="last_name" type="text" placeholder="Doo" required />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="password_confirmation">Password Confirmation</Label>
                    <Input id="password_confirmation" name="password_confirmation" type="password" required />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Account"}
                </Button>
            </div>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </form>
    );
}
