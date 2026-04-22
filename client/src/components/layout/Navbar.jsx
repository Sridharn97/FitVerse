import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (<header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
    <div className="flex h-16 items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg lg:hidden hover:bg-primary/10" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="group flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-accent/30" onClick={() => navigate("/dashboard")}>
          <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 p-1 transition-all duration-300 group-hover:shadow-[0_0_18px_hsl(var(--primary)/0.24)]">
            <img src="/Logo.png" alt="FitVerse logo" className="h-8 w-8 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-primary/25 transition-all duration-300 group-hover:ring-primary/45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground sm:text-[1.35rem]">
            Fit<span className="text-primary bg-clip-text">Verse</span>
          </span>
        </div>
      </div>

      {user && (<div className="flex items-center gap-2 sm:gap-3">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="group relative h-10 gap-2 rounded-full border border-border/70 bg-card/80 p-1 pr-3 transition-all duration-300 hover:bg-accent/50 hover:shadow-sm">
              <Avatar className="h-7 w-7 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground md:inline">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-56 rounded-xl border-border/60 bg-popover/95 p-2 shadow-lg">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>)}
    </div>
  </header>);
};

export default Navbar;

