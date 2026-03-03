import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, TrendingUp, Apple, Users, ArrowRight } from "lucide-react";
const features = [
  { icon: Dumbbell, title: "Workout Plans", desc: "Create and manage custom workout routines with an exercise library" },
    { icon: TrendingUp, title: "Progress Tracking", desc: "Track weight, BMI, and body measurements with visual charts" },
    { icon: Apple, title: "Diet & Goals", desc: "Log meals, set calorie targets, and monitor your nutrition" },
    { icon: Users, title: "Community Forum", desc: "Share tips, ask questions, and connect with fitness enthusiasts" },
];
const Index = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    return (<div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"/>
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <img src="/Logo.png" alt="FitVerse logo" className="h-4 w-4 rounded-sm object-cover"/>
            <span className="text-sm font-medium text-primary">Your Fitness Journey Starts Here</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Fit<span className="text-primary">Verse</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Plan workouts, track progress, manage nutrition, and connect with a community of fitness enthusiasts — all in one place.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
            {!user && (<Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>)}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl mb-10">
          Everything You Need to Reach Your Goals
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (<Card key={title} className="transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary"/>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 FitVerse. Built for fitness enthusiasts.
        </p>
      </footer>
    </div>);
};
export default Index;
