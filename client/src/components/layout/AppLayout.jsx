import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const AppLayout = () => {
  const { user, authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined")
      return false;
    return window.localStorage.getItem("fitverse-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined")
      return;
    window.localStorage.setItem("fitverse-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleSidebarOptionSelect = () => {
    if (typeof window === "undefined")
      return;

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
      return;
    }

    setSidebarCollapsed(true);
  };

  if (authLoading)
    return null;
  if (!user)
    return <Navigate to="/auth" replace />;
  return (<div className="min-h-screen bg-background">
    <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onToggleCollapse={() => setSidebarCollapsed((current) => !current)} collapsed={sidebarCollapsed} />
    {!sidebarOpen && (<button aria-label="Open sidebar" className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-5 bg-transparent lg:hidden" onTouchStart={() => setSidebarOpen(true)} onClick={() => setSidebarOpen(true)} />)}
    <div className="flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((current) => !current)} onOptionSelect={handleSidebarOptionSelect} />
      <main className="flex-1 overflow-auto p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  </div>);
};
export default AppLayout;
