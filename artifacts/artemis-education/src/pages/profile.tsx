import { Layout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { getGetUserProfileQueryKey, useGetUserProfile, useUpdateUserProfile } from "@workspace/api-client-react";
import { Award, Save, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { t } = useLang();
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetUserProfile({
    query: { queryKey: getGetUserProfileQueryKey() },
  });
  const updateProfile = useUpdateUserProfile();
  const [formData, setFormData] = useState({ nameBn: "", classLevel: "", goal: "" });

  useEffect(() => {
    if (profile) {
      setFormData({
        nameBn: profile.nameBn || "",
        classLevel: profile.classLevel || "",
        goal: profile.goal || "",
      });
    }
  }, [profile]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: t("\u09b8\u09ab\u09b2", "Success"),
            description: t("\u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2 \u0986\u09aa\u09a1\u09c7\u099f \u09b9\u09af\u09bc\u09c7\u099b\u09c7", "Profile updated successfully"),
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: t("\u09a4\u09cd\u09b0\u09c1\u099f\u09bf", "Error"),
            description: t("\u0986\u09aa\u09a1\u09c7\u099f \u09ac\u09cd\u09af\u09b0\u09cd\u09a5 \u09b9\u09af\u09bc\u09c7\u099b\u09c7", "Profile update failed"),
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <header>
          <h1 className="text-2xl font-bold text-primary">{t("\u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2", "Profile")}</h1>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6">
            <Card className="rounded-2xl text-center shadow-sm">
              <CardContent className="flex flex-col items-center pb-6 pt-6">
                <Avatar className="mb-4 h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">{profile?.nameBn?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.nameBn}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-3 border-none bg-accent text-accent-foreground">{profile?.classLevel || "HSC 2026"}</Badge>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Trophy className="text-amber-400" />
                  <span className="font-medium">{t("\u09ae\u09cb\u099f \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f", "Total Points")}</span>
                </div>
                <h3 className="text-3xl font-bold">{profile?.totalPoints || 0}</h3>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 md:col-span-2">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold">{t("\u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0997\u09a4 \u09a4\u09a5\u09cd\u09af \u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be", "Edit Profile")}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("\u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09be\u09ae (\u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc)", "Your name (Bangla)")}</Label>
                    <Input value={formData.nameBn} onChange={(event) => setFormData((prev) => ({ ...prev, nameBn: event.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("\u09b6\u09cd\u09b0\u09c7\u09a3\u09bf/\u09b2\u09c7\u09ad\u09c7\u09b2", "Class/Level")}</Label>
                      <Input value={formData.classLevel} onChange={(event) => setFormData((prev) => ({ ...prev, classLevel: event.target.value }))} placeholder={t("\u09af\u09c7\u09ae\u09a8: HSC 2026", "Example: HSC 2026")} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("\u09b2\u0995\u09cd\u09b7\u09cd\u09af", "Goal")}</Label>
                      <Input value={formData.goal} onChange={(event) => setFormData((prev) => ({ ...prev, goal: event.target.value }))} placeholder={t("\u09af\u09c7\u09ae\u09a8: Engineering", "Example: Engineering")} />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
                    {updateProfile.isPending ? t("\u09b8\u09c7\u09ad \u09b9\u099a\u09cd\u099b\u09c7...", "Saving...") : <><Save className="mr-2 h-4 w-4" /> {t("\u09b8\u09c7\u09ad \u0995\u09b0\u09c1\u09a8", "Save Changes")}</>}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Award className="text-primary" /> {t("\u0985\u09b0\u09cd\u099c\u09bf\u09a4 \u09ac\u09cd\u09af\u09be\u099c", "Earned Badges")}</h3>
                {profile?.badges?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">{badge}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("\u098f\u0996\u09a8\u0993 \u0995\u09cb\u09a8\u09cb \u09ac\u09cd\u09af\u09be\u099c \u0985\u09b0\u09cd\u099c\u09a8 \u0995\u09b0\u09c7\u09a8\u09a8\u09bf\u0964", "No badges earned yet.")}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
