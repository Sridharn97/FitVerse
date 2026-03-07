import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu, PanelLeftClose, PanelLeftOpen, Bell, Settings, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar, onToggleCollapse, collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
    <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 transition-colors" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" onClick={onToggleCollapse}>
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2.5 cursor-pointer group ml-1 lg:ml-2" onClick={() => navigate("/dashboard")}>
          <div className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300">
            <img src="/Logo.png" alt="FitVerse logo" className="h-8 w-8 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
            Fit<span className="text-primary bg-clip-text">Verse</span>
          </span>
        </div>
      </div>

      {user && (<div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-[1.5px] border-background animate-pulse"></span>
        </Button>

        <div className="h-6 w-[1px] bg-border/50 hidden sm:block mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 p-1 pr-3 rounded-full gap-2 border border-border/40 bg-background hover:bg-accent/50 hover:shadow-sm transition-all duration-300 group">
              <Avatar className="h-7 w-7 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground/80 group-hover:text-foreground md:inline max-w-[120px] truncate">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border-border/50 p-2">
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer rounded-md py-2 focus:bg-primary/5 focus:text-primary transition-colors">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/preferences")} className="cursor-pointer rounded-md py-2 focus:bg-primary/5 focus:text-primary transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md py-2 focus:bg-primary/5 focus:text-primary transition-colors">
              <Sparkles className="mr-2 h-4 w-4 text-amber-500 fill-amber-500/20" />
              <span>Upgrade Plan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-md py-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>)}
    </div>
  </header>);
};

export default Navbar;

