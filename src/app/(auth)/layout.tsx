import {GalleryVerticalEnd} from "lucide-react";

export default function LoginLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        {process.env.APP_NAME}
                    </a>
                </div>
                {children}

            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="https://picsum.photos/800/900"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )

}