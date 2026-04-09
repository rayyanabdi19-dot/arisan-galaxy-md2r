import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/pages/HomePage";
import MembersPage from "@/components/pages/MembersPage";
import PaymentPage from "@/components/pages/PaymentPage";
import SchedulePage from "@/components/pages/SchedulePage";
import HistoryPage from "@/components/pages/HistoryPage";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={setActivePage} />;
      case "members": return <MembersPage />;
      case "payment": return <PaymentPage />;
      case "schedule": return <SchedulePage />;
      case "history": return <HistoryPage />;
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

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24">
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
