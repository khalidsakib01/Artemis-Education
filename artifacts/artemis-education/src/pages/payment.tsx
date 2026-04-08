import { Layout } from "@/components/layout";
import { useGetCourse, getGetCourseQueryKey, useCreatePayment } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

export default function Payment() {
  const { courseId } = useParams();
  const id = Number(courseId);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: course, isLoading } = useGetCourse(id, {
    query: { enabled: !!id, queryKey: getGetCourseQueryKey(id) }
  });

  const createPayment = useCreatePayment();
  
  const [method, setMethod] = useState<"bkash" | "nagad" | "manual">("bkash");
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId && method !== "manual") {
      toast({ variant: "destructive", title: "ত্রুটি", description: "ট্রানজেকশন আইডি দিন" });
      return;
    }

    createPayment.mutate({
      data: {
        courseId: id,
        amount: course?.price || 0,
        method: method,
        transactionId
      }
    }, {
      onSuccess: () => {
        toast({ title: "সফল", description: "পেমেন্ট সফল হয়েছে! কোর্সে এনরোল করা হয়েছে।" });
        setLocation(`/courses/${id}`);
      },
      onError: () => {
        toast({ variant: "destructive", title: "ত্রুটি", description: "পেমেন্ট ব্যর্থ হয়েছে" });
      }
    });
  };

  if (isLoading) {
    return <Layout><div className="p-8 max-w-xl mx-auto"><Skeleton className="h-[400px] w-full rounded-2xl" /></div></Layout>;
  }

  if (!course) {
    return <Layout><div className="p-8 text-center">কোর্স পাওয়া যায়নি</div></Layout>;
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-primary">পেমেন্ট সম্পন্ন করুন</h1>
          <p className="text-muted-foreground text-sm">নিরাপদ ও সহজ পেমেন্ট</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-gradient-to-br from-primary to-indigo-900 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-white/70 text-sm">কোর্সের নাম</span>
                  <h3 className="font-bold text-lg">{course.titleBn}</h3>
                </div>
                <ShieldCheck className="w-8 h-8 text-white/50" />
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                <span className="text-white/80">সর্বমোট পেমেন্ট:</span>
                <span className="text-2xl font-bold">৳{course.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                পেমেন্ট মাধ্যম বেছে নিন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="grid grid-cols-3 gap-3">
                <Label htmlFor="bkash" className={`cursor-pointer flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-muted transition-colors ${method === 'bkash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}>
                  <RadioGroupItem value="bkash" id="bkash" className="sr-only" />
                  <div className="w-12 h-12 bg-pink-500 rounded flex items-center justify-center text-white font-bold text-xs mb-2">bKash</div>
                  <span className="text-sm font-medium">বিকাশ</span>
                </Label>
                
                <Label htmlFor="nagad" className={`cursor-pointer flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-muted transition-colors ${method === 'nagad' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}>
                  <RadioGroupItem value="nagad" id="nagad" className="sr-only" />
                  <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs mb-2">Nagad</div>
                  <span className="text-sm font-medium">নগদ</span>
                </Label>
                
                <Label htmlFor="manual" className={`cursor-pointer flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-muted transition-colors ${method === 'manual' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}>
                  <RadioGroupItem value="manual" id="manual" className="sr-only" />
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center font-bold text-xs mb-2 text-center leading-tight">Bank/ Other</div>
                  <span className="text-sm font-medium">ম্যানুয়াল</span>
                </Label>
              </RadioGroup>

              {method !== "manual" && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm">
                    <p>১. আপনার {method === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাপ থেকে পেমেন্ট অপশনে যান</p>
                    <p>২. আমাদের মার্চেন্ট নাম্বার: <strong className="text-primary tracking-wider">01XXX-XXXXXX</strong></p>
                    <p>৩. অ্যামাউন্ট দিন: <strong>৳{course.price}</strong></p>
                    <p>৪. রেফারেন্স হিসেবে আপনার নাম দিন</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trxId">ট্রানজেকশন আইডি (TrxID)</Label>
                    <Input 
                      id="trxId"
                      placeholder="যেমন: 8N7A6D5E4F" 
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      className="font-mono uppercase h-12"
                    />
                  </div>
                </div>
              )}
              
              {method === "manual" && (
                <div className="mt-6 p-4 bg-muted/50 rounded-xl space-y-2 text-sm animate-in fade-in slide-in-from-top-2">
                  <p>ম্যানুয়াল পেমেন্টের জন্য আমাদের হটলাইনে যোগাযোগ করুন: <strong className="text-primary">096XX-XXXXXX</strong></p>
                  <p className="text-muted-foreground mt-2">অথবা অফিসে এসে সরাসরি ভর্তি হতে পারেন।</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={createPayment.isPending} className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90">
                {createPayment.isPending ? "প্রসেস হচ্ছে..." : (
                  <>পেমেন্ট নিশ্চিত করুন <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
