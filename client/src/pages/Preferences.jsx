import { useState, useEffect } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Monitor, Shield, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Preferences = () => {
    const { progress, meals, workouts } = useFitness();
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();

    // Theme (Light, Dark, System)
    const [theme, setTheme] = useState(localStorage.getItem("fitverse_theme") || "system");

    // Color Theme (Teal, Green, Blue, Purple)
    const [colorTheme, setColorTheme] = useState(localStorage.getItem("fitverse_color_theme") || "teal");

    // Profile Visibility
    const [isAnonymous, setIsAnonymous] = useState(user?.isAnonymous ?? false);

    // Chart Customization
    const [chartDays, setChartDays] = useState(() => {
        const stored = localStorage.getItem("fitverse_chart_days");
        return stored ? JSON.parse(stored) : DAYS;
    });
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(localStorage.getItem("fitverse_first_day") || "sun");

    useEffect(() => {
        if (user) {
            setIsAnonymous(user.isAnonymous ?? false);
        }
    }, [user?.isAnonymous]);

    useEffect(() => {
        localStorage.setItem("fitverse_theme", theme);
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("fitverse_color_theme", colorTheme);
        const root = window.document.documentElement;
        if (colorTheme !== "teal") {
            root.setAttribute("data-theme", colorTheme);
        } else {
            root.removeAttribute("data-theme");
        }
    }, [colorTheme]);

    const handleAnonymousToggle = async (val) => {
        setIsAnonymous(val);
        try {
            await updateProfile({ isAnonymous: val });
            toast({ title: "Preference Saved", description: "Anonymous posting updated." });
        } catch (e) {
            setIsAnonymous(!val);
            toast({ title: "Update failed", description: "Could not save preference.", variant: "destructive" });
        }
    };

    const handleDayToggle = (day) => {
        setChartDays(prev => {
            const next = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
            localStorage.setItem("fitverse_chart_days", JSON.stringify(next));
            return next;
        });
    };

    const handleFirstDay = (val) => {
        setFirstDayOfWeek(val);
        localStorage.setItem("fitverse_first_day", val);
    };

    const handleExportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Type,Date,Details\n";

        progress.forEach(p => {
            csvContent += `Progress,${p.date},Weight: ${p.weight} BMI: ${p.bmi || 'N/A'}\n`;
        });
        workouts.forEach(w => {
            csvContent += `Workout,${w.date},${w.name} - ${w.completed ? 'Completed' : 'Pending'}\n`;
        });
        meals.forEach(m => {
            csvContent += `Meal,${m.date},${m.name} - ${m.calories} kcal\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const a = document.createElement("a");
        a.href = encodedUri;
        a.download = "fitverse_export.csv";
        a.click();
        toast({ title: "CSV Exported", description: "Your CSV data has been downloaded." });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold md:text-3xl">Preferences</h1>
                <p className="mt-1 text-sm text-muted-foreground">Customize your FitVerse experience.</p>
            </div>

            <Card className="overflow-hidden border-border/50 shadow-sm">
                <div className="divide-y divide-border/50">

                    {/* Appearance */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1 md:w-1/3">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Monitor className="h-4 w-4 text-muted-foreground" /> Appearance</h3>
                            <p className="text-sm text-muted-foreground pt-1">Adjust how FitVerse looks on your device.</p>
                        </div>
                        <div className="flex flex-col gap-6 md:w-2/3">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mode</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger className="w-full sm:w-[220px] bg-background"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System Settings</SelectItem>
                                        <SelectItem value="light">Light Mode</SelectItem>
                                        <SelectItem value="dark">Dark Mode</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Theme</Label>
                                <Select value={colorTheme} onValueChange={setColorTheme}>
                                    <SelectTrigger className="w-full sm:w-[220px] bg-background"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="teal">Neon Teal (Default)</SelectItem>
                                        <SelectItem value="green">Forest Green</SelectItem>
                                        <SelectItem value="blue">Ocean Blue</SelectItem>
                                        <SelectItem value="purple">Deep Purple</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Social */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Shield className="h-4 w-4 text-muted-foreground" /> Privacy & Social</h3>
                            <p className="text-sm text-muted-foreground pt-1">Hide your username when posting in the forum.</p>
                        </div>
                        <div className="flex justify-end md:w-[220px]">
                            <Switch checked={isAnonymous} onCheckedChange={handleAnonymousToggle} />
                        </div>
                    </div>

                    {/* Calendar & Charts */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1 md:w-1/3">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Calendar className="h-4 w-4 text-muted-foreground" /> Calendar & Charts</h3>
                            <p className="text-sm text-muted-foreground pt-1">Personalize your views and chart data.</p>
                        </div>
                        <div className="flex flex-col gap-6 md:w-2/3">
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Day of the Week</Label>
                                <Select value={firstDayOfWeek} onValueChange={handleFirstDay}>
                                    <SelectTrigger className="w-full sm:w-[220px] bg-background"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sun">Sunday</SelectItem>
                                        <SelectItem value="mon">Monday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tracking Days (Dashboard)</Label>
                                <div className="flex flex-wrap gap-4 pt-1">
                                    {DAYS.map(day => (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox id={`day-${day}`} checked={chartDays.includes(day)} onCheckedChange={() => handleDayToggle(day)} />
                                            <Label htmlFor={`day-${day}`} className="font-normal cursor-pointer">{day}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Export */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Download className="h-4 w-4 text-muted-foreground" /> Data Export</h3>
                            <p className="text-sm text-muted-foreground pt-1">Download your fitness journey data as a CSV.</p>
                        </div>
                        <div className="flex md:w-[220px]">
                            <Button onClick={handleExportCSV} className="w-full shadow-sm">
                                <Download className="mr-2 h-4 w-4" /> Download CSV
                            </Button>
                        </div>
                    </div>

                </div>
            </Card>
        </div>
    );
};

export default Preferences;
