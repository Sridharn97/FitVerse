import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Mail, Lock, User, ArrowRight, Flame, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authBg from "@/assets/auth-fitness.jpg";
const Auth = () => {
    const { user, login, signup } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    if (user)
        return <Navigate to="/dashboard" replace/>;
    const handleLogin = (e) => {
        e.preventDefault();
        if (login(loginEmail, loginPassword)) {
            navigate("/dashboard");
        }
        else {
            toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
        }
    };
    const handleSignup = (e) => {
        e.preventDefault();
        if (signup(signupName, signupEmail, signupPassword)) {
        toast({ title: "Welcome to FitVerse!", description: "Account created successfully" });
            navigate("/dashboard");
        }
        else {
            toast({ title: "Signup failed", description: "Email already exists", variant: "destructive" });
        }
    };
    return (<div className="flex min-h-screen bg-background">
      {/* Left - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={authBg} alt="Fitness gym with green neon lighting" className="absolute inset-0 h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"/>
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/Logo.png" alt="FitVerse logo" className="h-12 w-12 rounded-full object-cover border border-primary/30"/>
              <h2 className="text-3xl font-bold text-foreground">
                Fit<span className="text-primary">Verse</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-md">
              Transform your fitness journey with smart workout planning, progress tracking, and a supportive community.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 backdrop-blur-sm">
                  <Flame className="h-4 w-4 text-primary"/>
                </div>
                <span className="text-sm text-muted-foreground">Track calories & macros effortlessly</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 backdrop-blur-sm">
                  <Target className="h-4 w-4 text-primary"/>
                </div>
                <span className="text-sm text-muted-foreground">Set goals and crush them every day</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-primary"/>
                </div>
                <span className="text-sm text-muted-foreground">Visualize your progress with charts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <img src="/Logo.png" alt="FitVerse logo" className="h-14 w-14 rounded-full object-cover"/>
            <h1 className="text-2xl font-bold text-foreground">
              Fit<span className="text-primary">Verse</span>
            </h1>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue your fitness journey</p>
          </div>

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="login" className="text-sm font-semibold">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-semibold">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="login-email" type="email" placeholder="you@example.com" className="pl-11 h-12 bg-card border-border/50 focus:border-primary" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="login-password" type="password" placeholder="••••••••" className="pl-11 h-12 bg-card border-border/50 focus:border-primary" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required/>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold group">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 space-y-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="signup-name" placeholder="John Doe" className="pl-11 h-12 bg-card border-border/50 focus:border-primary" value={signupName} onChange={e => setSignupName(e.target.value)} required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-11 h-12 bg-card border-border/50 focus:border-primary" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input id="signup-password" type="password" placeholder="••••••••" className="pl-11 h-12 bg-card border-border/50 focus:border-primary" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required/>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold group">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to FitVerse's Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>);
};
export default Auth;
