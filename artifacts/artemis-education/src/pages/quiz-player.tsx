import { Layout } from "@/components/layout";
import { useGetQuiz, getGetQuizQueryKey, useSubmitQuiz } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function QuizPlayer() {
  const { id } = useParams();
  const quizId = Number(id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: quiz, isLoading } = useGetQuiz(quizId, {
    query: { enabled: !!quizId, queryKey: getGetQuizQueryKey(quizId) }
  });

  const submitQuiz = useSubmitQuiz();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (quiz?.timeLimitMinutes && timeLeft === null) {
      setTimeLeft(quiz.timeLimitMinutes * 60);
    }
  }, [quiz, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAutoSubmit = () => {
    if (!quiz) return;
    toast({ title: "সময় শেষ!", description: "আপনার উত্তর জমা দেওয়া হচ্ছে।" });
    doSubmit();
  };

  const handleSubmitClick = () => {
    if (!quiz?.questions) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!confirm("আপনি সব প্রশ্নের উত্তর দেননি। জমা দিতে চান?")) return;
    }
    doSubmit();
  };

  const doSubmit = () => {
    submitQuiz.mutate({
      id: quizId,
      data: { answers }
    }, {
      onSuccess: (result) => {
        // Assuming we navigate to results page, we could pass state or just rely on API
        setLocation(`/quiz/${quizId}/results`);
      },
      onError: () => {
        toast({ variant: "destructive", title: "ত্রুটি", description: "উত্তর জমা দেওয়া যায়নি" });
      }
    });
  };

  if (isLoading) {
    return <Layout><div className="p-8 max-w-3xl mx-auto space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-64 w-full" /></div></Layout>;
  }

  if (!quiz || !quiz.questions) {
    return <Layout><div className="p-8 text-center">কুইজ পাওয়া যায়নি</div></Layout>;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <Layout>
      <div className="pb-24">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <h1 className="font-bold text-lg truncate pr-4">{quiz.titleBn}</h1>
            <div className={`flex items-center gap-2 font-mono font-bold px-3 py-1.5 rounded-lg ${timeLeft !== null && timeLeft < 60 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-muted'}`}>
              <Clock className="w-4 h-4" />
              {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>উত্তর দেওয়া হয়েছে: {answeredCount}/{quiz.questions.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>

        {/* Questions */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">
          {quiz.questions.map((q, i) => (
            <Card key={q.id} className="rounded-2xl shadow-sm overflow-hidden" id={`q-${q.id}`}>
              <div className="bg-muted/30 px-6 py-4 border-b">
                <span className="text-sm font-bold text-muted-foreground mb-2 block">প্রশ্ন {i + 1}</span>
                <h3 className="text-lg font-medium leading-relaxed">{q.questionBn}</h3>
              </div>
              <CardContent className="p-6">
                <RadioGroup 
                  value={answers[q.id]?.toString()} 
                  onValueChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: parseInt(v) }))}
                  className="space-y-3"
                >
                  {q.options.map((opt, optIndex) => (
                    <Label 
                      key={optIndex}
                      htmlFor={`q-${q.id}-opt-${optIndex}`}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        answers[q.id] === optIndex ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={optIndex.toString()} id={`q-${q.id}-opt-${optIndex}`} />
                      <span className="text-base font-normal">{opt}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <div className="pt-4 flex flex-col items-center gap-4">
            {answeredCount < quiz.questions.length && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                এখনো {quiz.questions.length - answeredCount} টি প্রশ্নের উত্তর বাকি আছে
              </div>
            )}
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-12 h-14 text-lg font-bold"
              onClick={handleSubmitClick}
              disabled={submitQuiz.isPending}
            >
              {submitQuiz.isPending ? "জমা হচ্ছে..." : "কুইজ জমা দিন"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
