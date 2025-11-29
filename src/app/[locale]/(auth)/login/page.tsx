'use client';

import {FormEvent, useState, useTransition} from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import { Link, useRouter} from "@/i18n/routing";
import { login, verifyLogin2FA } from '@/lib/api';
import {ApiError} from "@/lib/api/types";


export default function LoginPage() {
    const t = useTranslations('auth.login');
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('return_to');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [show2FAInput, setShow2FAInput] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [loginToken, setLoginToken] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();

        startTransition(() => {
            login({email, password, returnTo: returnTo || undefined})
                .then((result) => {
                    if (result.success) {
                        setFailedAttempts(0);
                        if (result.twoFactorRequired) {
                            setShow2FAInput(true);
                            setLoginToken(result.loginToken);
                            toast.info("enter2FACode")
                        } else {
                            router.push(result.redirectUrl);
                        }
                    } else {
                        setFailedAttempts((prev) => prev + 1);

                        const {error} = result;
                        const title = "Login failed.";
                        let description = "Unknown error";

                        // Extract the key part from the full messageKey
                        if (error.messageKey?.startsWith('auth.login.')) {
                            const keyPart = error.messageKey.replace('auth.login.', '');
                            description = t(keyPart);
                        }

                        toast.error(title, {description});
                    }
                })
                .catch(() => {
                    setFailedAttempts((prev) => prev + 1);

                    toast.error(t('LoginFailed.'), {
                        description: t('unknownError'),
                    });
                });
        });
    }

    const handle2FASubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!twoFactorCode || twoFactorCode.length !== 6) {
            toast.error(t('verify2FA.invalidCodeLength'));
            return;
        }

        startTransition(() => {
            verifyLogin2FA({
                login_token: loginToken,
                code: twoFactorCode,
                returnTo: returnTo || undefined,
            })
                // Explicitly type the result based on the Promise return type of verifyLogin2FA
                .then(
                    (
                        result:
                            | { success: true; redirectUrl: string; data: any }
                            | { success: false; error: ApiError }
                    ) => {
                        if (result.success) {
                            setFailedAttempts(0);

                            // 2FA verification successful, redirect
                            router.push(result.redirectUrl);
                        } else {
                            setFailedAttempts((prev) => prev + 1);

                            const { error } = result;
                            const title = t('verify2FA.verificationFailed');
                            let description = t('verify2FA.unknownError'); // Default 2FA error

                            // Use specific message key if available
                            if (error.messageKey?.startsWith('auth.login.')) {
                                const keyPart = error.messageKey.replace('auth.login.', '');
                                description = t(keyPart); // Use login translations for consistency if mapped
                            } else if (error.messageKey) {
                                // Fallback to using the raw message key if not under auth.login
                                description = t(error.messageKey);
                            }

                            toast.error(title, { description });
                        }
                    }
                )
                .catch(() => {
                    setFailedAttempts((prev) => prev + 1);

                    // Remove unused parameter
                    toast.error(t('verify2FA.verificationFailed'), {
                        description: t('verify2FA.unknownError'),
                    });
                });
        });
    };


    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
            <form
                onSubmit={handleLoginSubmit}
                className={cn("flex flex-col gap-6")}
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
                        <Input id="email" name="email" type="email" autoComplete="username" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} required />
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
                        <Input id="password" name="password" type="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} required />
                    </div>

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
        </div>
      </div>
  )
}
