import { Layout } from "@/components/layout";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// MOCK RESULTS PAGE since we don't have a direct endpoint to fetch past result details right now
// in a real app, this would use a useGetQuizResult hook or use state passed from submission.

export default function QuizResults() {
  const { id } = useParams();
  const quizId = Number(id);

  // Hardcoded for presentation. 
  // The API spec returns QuizResult from the submission mutation.
  const score = 8;
  const total = 10;
  const passed = true;
  const percentage = (score / total) * 100;

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Link href={`/lessons/${quizId}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">ফলাফল</h1>
          </div>
        </header>

        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-gradient-to-br from-primary to-indigo-900 text-white text-center p-8">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          
          <h2 className="text-4xl font-bold mb-2">
            {score} <span className="text-2xl text-white/70">/ {total}</span>
          </h2>
          <p className="text-lg font-medium text-white/90 mb-6">
            {passed ? "অভিনন্দন! আপনি পাস করেছেন।" : "দুঃখিত, আপনি পাস করতে পারেননি। আবার চেষ্টা করুন।"}
          </p>

          <div className="max-w-xs mx-auto">
            <Progress value={percentage} className="h-2 bg-white/20" />
            <div className="mt-2 text-sm text-white/70">{percentage}% সঠিক উত্তর</div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-lg">উত্তর পর্যালোচনা</h3>
          
          <Card className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <CardContent className="p-4 flex gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              <div>
                <p className="font-medium">১. নিউটনের গতির ২য় সূত্রটি কোনটি?</p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">আপনার উত্তর: F = ma</p>
                <div className="mt-2 text-xs bg-white dark:bg-black/20 p-2 rounded text-muted-foreground">
                  <strong>ব্যাখ্যা:</strong> বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক।
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
            <CardContent className="p-4 flex gap-4">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-medium">২. আলোর বেগ কত?</p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1 line-through">আপনার উত্তর: 3 x 10^7 m/s</p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">সঠিক উত্তর: 3 x 10^8 m/s</p>
                <div className="mt-2 text-xs bg-white dark:bg-black/20 p-2 rounded text-muted-foreground">
                  <strong>ব্যাখ্যা:</strong> শূন্য মাধ্যমে আলোর বেগ 3 x 10^8 m/s।
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-6 text-center">
          <Link href={`/lessons/${quizId}`}>
            <Button size="lg" className="w-full sm:w-auto">
              পরবর্তী পাঠে যান
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
