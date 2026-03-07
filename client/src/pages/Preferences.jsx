import { useState, useEffect } from "react";
import { useFitness } from "@/contexts/FitnessContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Monitor, Shield, Bell, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Preferences = () => {
    const { progress, meals, workouts } = useFitness();
    const { updateProfile } = useAuth();
    const { toast } = useToast();

    // Theme (Light, Dark, System)
    const [theme, setTheme] = useState(localStorage.getItem("fitverse_theme") || "system");

    // Profile Visibility
    const [isAnonymous, setIsAnonymous] = useState(localStorage.getItem("fitverse_anonymous") === "true");

    // Alerts
    const [alertsMentions, setAlertsMentions] = useState(localStorage.getItem("fitverse_alerts_mentions") !== "false");
    const [alertsUpvotes, setAlertsUpvotes] = useState(localStorage.getItem("fitverse_alerts_upvotes") !== "false");
    const [alertsReplies, setAlertsReplies] = useState(localStorage.getItem("fitverse_alerts_replies") !== "false");

    // Chart Customization
    const [chartDays, setChartDays] = useState(() => {
        const stored = localStorage.getItem("fitverse_chart_days");
        return stored ? JSON.parse(stored) : DAYS;
    });
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(localStorage.getItem("fitverse_first_day") || "sun");

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

    const handleAnonymousToggle = async (val) => {
        setIsAnonymous(val);
        localStorage.setItem("fitverse_anonymous", String(val));
        try {
            await updateProfile({ isAnonymous: val });
        } catch (e) { }
        toast({ title: "Preference Saved", description: "Anonymous posting updated." });
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
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Monitor className="h-4 w-4 text-muted-foreground" /> Appearance</h3>
                            <p className="text-sm text-muted-foreground pt-1">Adjust how FitVerse looks on your device.</p>
                        </div>
                        <div className="flex md:w-[220px]">
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">System Settings</SelectItem>
                                    <SelectItem value="light">Light Mode</SelectItem>
                                    <SelectItem value="dark">Dark Mode</SelectItem>
                                </SelectContent>
                            </Select>
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

                    {/* Community Alerts */}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1 md:w-1/3">
                            <h3 className="flex items-center gap-2 font-medium leading-none text-foreground"><Bell className="h-4 w-4 text-muted-foreground" /> Community Alerts</h3>
                            <p className="text-sm text-muted-foreground pt-1">Manage notifications from the forum.</p>
                        </div>
                        <div className="flex flex-col gap-4 md:w-2/3">
                            <div className="flex items-center justify-between py-1">
                                <Label className="font-medium text-sm cursor-pointer">Mentions (@username)</Label>
                                <Switch checked={alertsMentions} onCheckedChange={(val) => { setAlertsMentions(val); localStorage.setItem("fitverse_alerts_mentions", val) }} />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label className="font-medium text-sm cursor-pointer">Upvotes on your posts</Label>
                                <Switch checked={alertsUpvotes} onCheckedChange={(val) => { setAlertsUpvotes(val); localStorage.setItem("fitverse_alerts_upvotes", val) }} />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label className="font-medium text-sm cursor-pointer">Replies to your posts</Label>
                                <Switch checked={alertsReplies} onCheckedChange={(val) => { setAlertsReplies(val); localStorage.setItem("fitverse_alerts_replies", val) }} />
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
