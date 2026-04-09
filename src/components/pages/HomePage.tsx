import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar } from "lucide-react";
import QuickActions from "../QuickActions";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { label: "Total Kas", value: "Rp 12.500.000", icon: TrendingUp, change: "+8.2%" },
  { label: "Anggota", value: "15 Orang", icon: Users, change: "Aktif" },
  { label: "Putaran", value: "Ke-5 / 15", icon: Calendar, change: "Mei 2026" },
];

const recentActivity = [
  { name: "Siti Nurhaliza", action: "membayar iuran", time: "2 jam lalu", amount: "Rp 500.000" },
  { name: "Budi Santoso", action: "menerima arisan", time: "1 hari lalu", amount: "Rp 7.500.000" },
  { name: "Dewi Lestari", action: "membayar iuran", time: "2 hari lalu", amount: "Rp 500.000" },
];

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Selamat datang 👋</p>
          <h1 className="text-xl font-bold">Arisan Keluarga</h1>
        </div>
        <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
          AK
        </div>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-5 glow-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-primary-foreground/5 translate-y-6 -translate-x-6" />
        <p className="text-primary-foreground/70 text-sm font-medium">Saldo Arisan</p>
        <h2 className="text-3xl font-extrabold text-primary-foreground mt-1">Rp 12.500.000</h2>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-primary-foreground/60 text-[11px]">Iuran/bulan</p>
            <p className="text-primary-foreground font-semibold text-sm">Rp 500.000</p>
          </div>
          <div>
            <p className="text-primary-foreground/60 text-[11px]">Dapat giliran</p>
            <p className="text-primary-foreground font-semibold text-sm">Rp 7.500.000</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Menu Cepat</h3>
        <QuickActions onNavigate={onNavigate} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card rounded-2xl p-3 text-center"
          >
            <stat.icon className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold mt-0.5">{stat.value}</p>
            <span className="text-[10px] text-secondary font-medium">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Aktivitas Terbaru</h3>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {item.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.action} · {item.time}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-secondary">{item.amount}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
