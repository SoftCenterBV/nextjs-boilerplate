import {useLocale} from "next-intl";
import {useParams} from "next/navigation";
import type {Locale} from '@/i18n/routing';
import {languageMap, locales, usePathname, useRouter} from '@/i18n/routing';
import {
    DropdownMenuItem,
    DropdownMenuPortal, DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";

const languages = locales.map((code) => ({
    code,
    ...languageMap[code],
}));


export default function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    function onLanguageChange(code: string) {
        const nextLocale = code as Locale;
        router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: nextLocale }
        );
    }


    const currentLang = languages.find((lang) => lang.code === locale) || languages[0];


    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger><currentLang.Icon className="mr-1 size-5" /> {currentLang.label}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onSelect={(e) => {
                                e.preventDefault();
                                onLanguageChange(lang.code);
                            }}
                        ><lang.Icon className="mr-2 size-4" />{lang.label}</DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>

    )

}