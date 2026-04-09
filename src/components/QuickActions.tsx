import { motion } from "framer-motion";
import { CreditCard, UserPlus, Trophy, Bell, Settings, PieChart, Gift, QrCode } from "lucide-react";

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

const actions = [
  { icon: CreditCard, label: "Bayar", color: "from-primary to-secondary", page: "payment" },
  { icon: UserPlus, label: "Tambah", color: "from-accent to-primary", page: "members" },
  { icon: Trophy, label: "Undian", color: "from-secondary to-primary", page: "schedule" },
  { icon: PieChart, label: "Laporan", color: "from-primary to-accent", page: "history" },
  { icon: Bell, label: "Notifikasi", color: "from-accent to-secondary", page: "home" },
  { icon: Gift, label: "Hadiah", color: "from-secondary to-accent", page: "home" },
  { icon: QrCode, label: "QR Code", color: "from-primary to-secondary", page: "home" },
  { icon: Settings, label: "Pengaturan", color: "from-accent to-primary", page: "home" },
];

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onNavigate(action.page)}
          className="flex flex-col items-center gap-1.5"
        >
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
            <action.icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
