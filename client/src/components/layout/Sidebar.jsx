import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Dumbbell, TrendingUp, Apple, Users, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/diet", label: "Diet & Goals", icon: Apple },
  { to: "/community", label: "Community", icon: Users },
];
const Sidebar = ({ open, onClose, collapsed, onToggleCollapse, onOptionSelect }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut)
      return;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/auth");
    }
  };

  const handleSidebarInteract = () => {
    if (typeof window === "undefined")
      return;

    if (!collapsed)
      return;

    if (window.matchMedia("(min-width: 1024px)").matches)
      onToggleCollapse();
  };

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (<>
    {open && (<div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onClose} />)}
    <aside onMouseEnter={handleSidebarInteract} onTouchStart={handleSidebarInteract} className={cn("fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border/70 bg-card/95 px-3 py-3 shadow-xl shadow-black/5 backdrop-blur-lg transition-all duration-300 lg:sticky lg:translate-x-0", collapsed ? "lg:w-20" : "lg:w-64", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <nav className="flex flex-col gap-1.5">
        {links.map(({ to, label, icon: Icon }) => (<NavLink key={to} to={to} className={cn("group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/70 hover:text-foreground", collapsed && "lg:justify-center lg:px-0")} activeClassName="bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]" onClick={onOptionSelect}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70 ring-1 ring-border/50 transition-all group-hover:bg-primary/10 group-hover:ring-primary/30">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <span className={cn(collapsed && "lg:hidden")}>{label}</span>
        </NavLink>))}
      </nav>
      <div className="mt-auto border-t border-border/60 pt-3">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn("flex h-11 w-full items-center justify-start gap-3 rounded-xl px-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive", collapsed && "lg:justify-center lg:px-0")}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <LogOut className="h-4.5 w-4.5" />
          </span>
          <span className={cn(collapsed && "lg:hidden")}>Logout</span>
        </Button>
      </div>
    </aside>
  </>);
};
export default Sidebar;
