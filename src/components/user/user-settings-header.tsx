"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail } from "lucide-react";
import { UserData } from "@/lib/api";

interface ProfileFormNewProps {
  userData: UserData | null;
}
export default function ProfileHeader({ userData }: ProfileFormNewProps) {
  // Derive display values directly from props so the component updates when `userData` changes
  const firstName = userData?.first_name ?? "";
  const lastName = userData?.last_name ?? "";
  const email = userData?.email ?? "";
  const avatarSrc = userData?.avatar ?? "https://bundui-images.netlify.app/avatars/08.png";
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}` || "JD";

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarSrc} alt={`${firstName} ${lastName}`} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {firstName} {lastName}
              </h1>
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {email}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}