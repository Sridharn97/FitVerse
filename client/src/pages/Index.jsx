import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, TrendingUp, Apple, Users, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import landingHero from "@/assets/landing_hero.png";
import landingFeatures from "@/assets/landing_features.png";

const features = [
  { icon: Dumbbell, title: "Workout Plans", desc: "Create and manage custom workout routines with an exercise library" },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Track weight, BMI, and body measurements with visual charts" },
  { icon: Apple, title: "Diet & Goals", desc: "Log meals, set calorie targets, and monitor your nutrition" },
  { icon: Users, title: "Community Forum", desc: "Share tips, ask questions, and connect with fitness enthusiasts" },
];

const Index = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-background selection:bg-primary/30">
        {/* Navigation / Header */}
        <nav className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2">
            <img src="/Logo.png" alt="FitVerse logo" className="h-8 w-8 rounded-sm object-cover" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Fit<span className="text-primary">Verse</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
                   Log in
                </Button>
                <Button onClick={() => navigate("/auth")}>
                   Get Started
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/profile")}>
                   Profile
                </Button>
                <Button onClick={() => navigate("/dashboard")}>
                   Dashboard
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              
              <div className="text-center lg:text-left lg:col-span-6 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-sm animate-fade-in">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Your Premium Fitness Journey</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Body & Mind</span>
                </h1>
                
                <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Plan workouts, track progress, manage nutrition, and connect with a community of fitness enthusiasts — all in one premium platform.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                    {user ? "Go to Dashboard" : "Start For Free"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-16 lg:mt-0 lg:col-span-6 relative perspective-1000">
                {/* Glow behind the card - reduced in light mode */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[2.5rem] blur-3xl opacity-20 dark:opacity-50 transform rotate-6" />
                <div className="relative rounded-[2.5rem] overflow-hidden border border-border/50 dark:border-white/10 shadow-xl dark:shadow-2xl bg-card/95 dark:bg-card/50 backdrop-blur-none dark:backdrop-blur-sm transform transition-transform hover:scale-[1.02] duration-500">
                  <img src={landingHero} alt="Dynamic workout in premium gym" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent dark:from-background/80 dark:to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-background/90 dark:bg-background/40 backdrop-blur-none dark:backdrop-blur-md border border-border/50 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-foreground/80">Current Workout</p>
                        <p className="text-lg font-bold text-foreground">HIIT Cardio Blast</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* App Showcase / Why Choose Us */}
        <section className="py-24 bg-card/30 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative mb-16 lg:mb-0">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] blur-2xl opacity-50" />
                <img src={landingFeatures} alt="Modern gym equipment" className="relative rounded-[2rem] border border-white/5 shadow-2xl w-full object-cover aspect-[4/3]" />
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Built for the Modern Athlete</h2>
                <p className="text-lg text-muted-foreground">FitVerse combines beautiful design with powerful tools to give you the best fitness experience possible. From tracking the smallest macros to planning the biggest lifts.</p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {features.slice(0, 2).map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                         <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground font-medium">A complete suite of tools designed to help you succeed.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card/30 hover:bg-card/80 p-8 sm:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-150 group-hover:-rotate-12">
                  <Icon className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">{title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-sm">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-5xl mb-6">Ready to start your journey?</h2>
            <p className="text-xl text-muted-foreground mb-10">Join thousands of others who are achieving their fitness goals with FitVerse.</p>
            <Button size="lg" className="h-14 px-10 text-lg font-semibold shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              Create Free Account
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center bg-background/50 backdrop-blur-sm">
          <div className="flex justify-center items-center gap-2 mb-4">
             <img src="/Logo.png" alt="FitVerse logo" className="h-6 w-6 rounded-sm opacity-50 grayscale" />
             <span className="font-semibold text-muted-foreground">FitVerse</span>
          </div>
          <p className="text-sm text-muted-foreground/60">
            © 2026 FitVerse. Built for fitness enthusiasts. All rights reserved.
          </p>
        </footer>
      </div>
    );
};

export default Index;
