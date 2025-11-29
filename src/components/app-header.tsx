"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {SidebarTrigger} from "@/components/ui/sidebar";
import { Separator } from './ui/separator';
import { locales, usePathname } from '@/i18n/routing';
import React from "react";


export function AppHeader() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter((segment) => segment);

    let displaySegments = pathSegments;
    if (locales.includes(pathSegments[0])) {
        displaySegments = pathSegments.slice(1);
    }


    return (
        <>
            <header
                className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {displaySegments.map((segment, index) => {
                                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                                const isLast = index === pathSegments.length - 1;

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{segment}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}

                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
        </>
    )
}
