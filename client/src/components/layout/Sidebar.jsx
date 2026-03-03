import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Dumbbell, TrendingUp, Apple, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/workouts", label: "Workouts", icon: Dumbbell },
    { to: "/progress", label: "Progress", icon: TrendingUp },
    { to: "/diet", label: "Diet & Goals", icon: Apple },
    { to: "/community", label: "Community", icon: Users },
];
const Sidebar = ({ open, onClose }) => {
    return (<>
      {open && (<div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose}/>)}
      <aside className={cn("fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card p-4 transition-transform duration-300 md:sticky md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between md:hidden mb-4">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4"/>
          </Button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (<NavLink key={to} to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" activeClassName="bg-primary/10 text-primary" onClick={onClose}>
              <Icon className="h-5 w-5"/>
              {label}
            </NavLink>))}
        </nav>
      </aside>
    </>);
};
export default Sidebar;
