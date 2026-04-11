import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/pages/HomePage";
import MembersPage from "@/components/pages/MembersPage";
import PaymentPage from "@/components/pages/PaymentPage";
import SchedulePage from "@/components/pages/SchedulePage";
import HistoryPage from "@/components/pages/HistoryPage";
import SpinPage from "@/components/pages/SpinPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Sparkles } from "lucide-react";

const Index = () => {
  const [activePage, setActivePage] = useState("home");
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={() => {}} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={setActivePage} />;
      case "members": return <MembersPage />;
      case "payment": return <PaymentPage />;
      case "schedule": return <SchedulePage />;
      case "history": return <HistoryPage />;
      case "spin": return <SpinPage />;
      default: return <HomePage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[-10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[50%] w-48 h-48 rounded-full bg-secondary/8 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header with user info & logout */}
      <div className="relative z-20 max-w-lg mx-auto px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[180px]">
            {user.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors glass-card-light px-3 py-1.5 rounded-xl"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-2 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav active={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default Index;
