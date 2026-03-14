import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Dumbbell, TrendingUp, Apple, Users, X, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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

  const handleLogout = () => {
    logout();
    navigate("/auth");
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
    <aside onMouseEnter={handleSidebarInteract} onTouchStart={handleSidebarInteract} className={cn("fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card p-4 transition-all duration-300 lg:sticky lg:translate-x-0", collapsed ? "lg:w-20" : "lg:w-64", open ? "translate-x-0" : "-translate-x-full")}>
      <div className="flex items-center justify-between lg:hidden mb-4">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mb-3 hidden items-center justify-end lg:flex">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (<NavLink key={to} to={to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", collapsed && "lg:justify-center lg:px-0")} activeClassName="bg-primary/10 text-primary" onClick={onOptionSelect}>
          <Icon className="h-5 w-5" />
          <span className={cn(collapsed && "lg:hidden")}>{label}</span>
        </NavLink>))}
      </nav>
      <div className="mt-auto pt-4 flex flex-col gap-1">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={cn("flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive", collapsed && "lg:justify-center lg:px-0")}
        >
          <LogOut className="h-5 w-5" />
          <span className={cn(collapsed && "lg:hidden")}>Logout</span>
        </Button>
      </div>
    </aside>
  </>);
};
export default Sidebar;
