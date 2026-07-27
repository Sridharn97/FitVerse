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
            <span className="text-xl font-bold tracking-tight text-white">
              Fit<span className="text-primary">Verse</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex text-white/90 hover:text-white hover:bg-white/10" onClick={() => navigate("/auth")}>
                   Log in
                </Button>
                <Button className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" onClick={() => navigate("/auth")}>
                   Get Started
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex text-white/90 hover:text-white hover:bg-white/10" onClick={() => navigate("/profile")}>
                   Profile
                </Button>
                <Button className="shadow-[0_0_15px_rgba(var(--primary),0.5)]" onClick={() => navigate("/dashboard")}>
                   Dashboard
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section with Video Background */}
        <header className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0 bg-background">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover scale-105"
              poster={landingHero}
            >
               <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-dumbbells-in-a-gym-4265-large.mp4" type="video/mp4" />
            </video>
            {/* Dark/Gradient overlays to ensure text readability */}
            <div className="absolute inset-0 bg-background/90 dark:bg-background/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent z-10 mix-blend-overlay" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20 w-full pt-32 pb-20">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              
              {/* Left Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-1.5 backdrop-blur-md animate-fade-in shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-white">Your Premium Fitness Journey</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                  Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Body & Mind</span>
                </h1>
                
                <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 font-medium">
                  Plan workouts, track progress, manage nutrition, and connect with a community of fitness enthusiasts — all in one premium platform.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                    {user ? "Go to Dashboard" : "Start For Free"} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 transition-all duration-300" onClick={() => navigate("/auth")}>
                     <Play className="mr-2 h-5 w-5" /> Watch Demo
                  </Button>
                </div>
              </div>

              {/* Right Side Video/Glass Card */}
              <div className="mt-16 lg:mt-0 lg:col-span-5 relative perspective-1000 hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-accent/40 rounded-[2.5rem] blur-3xl opacity-40 transform rotate-6" />
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl p-8 transform transition-transform hover:scale-[1.02] duration-500">
                  
                  {/* Embedded Videomatic Element */}
                  <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video border border-white/10 shadow-inner bg-black/50">
                     <video 
                       autoPlay 
                       loop 
                       muted 
                       playsInline 
                       className="w-full h-full object-cover"
                       poster={landingHero}
                     >
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-fit-man-working-out-with-heavy-dumbbells-23429-large.mp4" type="video/mp4" />
                     </video>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50">
                              <Play className="h-5 w-5 text-primary fill-primary" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-white/80">Current Workout</p>
                              <p className="text-base font-bold text-white">HIIT Cardio Blast</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* UI Metrics */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 font-medium">Daily Goal</span>
                      <span className="text-primary font-bold">85%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_var(--primary)] relative">
                         <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                        <TrendingUp className="h-6 w-6 text-primary mb-2" />
                        <div className="text-2xl font-bold text-white">2,450</div>
                        <div className="text-sm text-white/60">Calories Burned</div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                        <Dumbbell className="h-6 w-6 text-primary mb-2" />
                        <div className="text-2xl font-bold text-white">45m</div>
                        <div className="text-sm text-white/60">Active Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* App Showcase / Why Choose Us */}
        <section className="py-24 bg-card/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative mb-16 lg:mb-0">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] blur-2xl opacity-50" />
                <div className="relative rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden aspect-[4/3] group">
                  <img src={landingFeatures} alt="Modern gym equipment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-background/90 dark:bg-background/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <div className="flex items-center gap-4">
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                          <div>
                             <h4 className="text-lg font-bold text-foreground">Premium Experience</h4>
                             <p className="text-sm text-muted-foreground">Syncs with all your devices seamlessly.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Built for the Modern Athlete</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">FitVerse combines beautiful design with powerful tools to give you the best fitness experience possible. From tracking the smallest macros to planning the biggest lifts.</p>
                
                <div className="grid sm:grid-cols-2 gap-8 pt-4">
                  {features.slice(0, 2).map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4 group">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                         <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground font-medium">A complete suite of tools designed to help you succeed.</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/30 hover:bg-card/80 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-150 group-hover:-rotate-12">
                  <Icon className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4 text-center space-y-8">
            <h2 className="text-4xl font-bold text-foreground md:text-6xl tracking-tight">Ready to start your journey?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Join thousands of others who are achieving their fitness goals with FitVerse. No credit card required.</p>
            <Button size="lg" className="h-16 px-12 text-xl font-bold shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] hover:scale-105 transition-all duration-300" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
              Create Free Account
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 text-center bg-background/50 backdrop-blur-md relative z-10">
          <div className="flex justify-center items-center gap-2 mb-6">
             <img src="/Logo.png" alt="FitVerse logo" className="h-8 w-8 rounded-sm object-cover grayscale opacity-80" />
             <span className="font-bold text-xl text-foreground">Fit<span className="text-primary">Verse</span></span>
          </div>
          <p className="text-sm text-muted-foreground/80 font-medium">
            © 2026 FitVerse. Built for fitness enthusiasts. All rights reserved.
          </p>
        </footer>
      </div>
    );
};

export default Index;
