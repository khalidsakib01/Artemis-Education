import { Layout } from "@/components/layout";
import { useGetUserProfile, getGetUserProfileQueryKey, useUpdateUserProfile } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Trophy, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetUserProfile({
    query: { queryKey: getGetUserProfileQueryKey() }
  });
  
  const updateProfile = useUpdateUserProfile();

  const [formData, setFormData] = useState({
    nameBn: "",
    classLevel: "",
    goal: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nameBn: profile.nameBn || "",
        classLevel: profile.classLevel || "",
        goal: profile.goal || ""
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "সফল", description: "প্রোফাইল আপডেট করা হয়েছে" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "ত্রুটি", description: "আপডেট ব্যর্থ হয়েছে" });
      }
    });
  };

  if (isLoading) {
    return <Layout><div className="p-8"><Skeleton className="h-64 w-full rounded-2xl" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-primary">প্রোফাইল</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="rounded-2xl text-center shadow-sm">
              <CardContent className="pt-6 pb-6 flex flex-col items-center">
                <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile?.nameBn?.substring(0,1)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile?.nameBn}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <Badge className="mt-3 bg-accent text-accent-foreground border-none">
                  {profile?.classLevel || 'Class 10'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="text-amber-400" />
                  <span className="font-medium">মোট পয়েন্ট</span>
                </div>
                <h3 className="text-3xl font-bold">{profile?.totalPoints || 0}</h3>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">ব্যক্তিগত তথ্য সম্পাদনা</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>আপনার নাম (বাংলায়)</Label>
                    <Input 
                      value={formData.nameBn} 
                      onChange={e => setFormData(p => ({...p, nameBn: e.target.value}))} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>শ্রেণী/লেভেল</Label>
                      <Input 
                        value={formData.classLevel} 
                        onChange={e => setFormData(p => ({...p, classLevel: e.target.value}))} 
                        placeholder="যেমন: HSC 2026"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>লক্ষ্য</Label>
                      <Input 
                        value={formData.goal} 
                        onChange={e => setFormData(p => ({...p, goal: e.target.value}))} 
                        placeholder="যেমন: Engineering"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
                    {updateProfile.isPending ? "সেভ হচ্ছে..." : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> সেভ করুন
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-primary" /> অর্জিত ব্যাজ
                </h3>
                {profile?.badges?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">এখনো কোনো ব্যাজ অর্জন করেননি।</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
