import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import QuickActions from "../QuickActions";
import logo from "/logo.png";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const [memberCount, setMemberCount] = useState(0);
  const [drawCount, setDrawCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [iuranPerBulan, setIuranPerBulan] = useState(500000);
  const [unpaidMembers, setUnpaidMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth = new Date().toISOString().slice(0, 7); // "2026-04"

      const [m, d, p, rp, s, allMembers, paidThisMonth] = await Promise.all([
        supabase.from("arisan_members").select("id", { count: "exact", head: true }),
        supabase.from("arisan_draws").select("id", { count: "exact", head: true }),
        supabase.from("arisan_payments").select("amount"),
        supabase.from("arisan_payments").select("*, arisan_members(name)").order("paid_at", { ascending: false }).limit(3),
        supabase.from("arisan_settings").select("value").eq("key", "iuran_per_bulan").single(),
        supabase.from("arisan_members").select("id, name, phone").order("member_order"),
        supabase.from("arisan_payments").select("member_id").eq("month", currentMonth),
      ]);
      setMemberCount(m.count || 0);
      setDrawCount(d.count || 0);
      if (p.data) setTotalPayments(p.data.reduce((s: number, x: any) => s + x.amount, 0));
      if (rp.data) setRecentPayments(rp.data);
      if (s.data) setIuranPerBulan(Number(s.data.value) || 500000);

      if (allMembers.data && paidThisMonth.data) {
        const paidIds = new Set(paidThisMonth.data.map((p: any) => p.member_id));
        setUnpaidMembers(allMembers.data.filter((m: any) => !paidIds.has(m.id)));
      }
    };
    fetchData();
  }, []);
  const totalHadiah = memberCount * iuranPerBulan;

  const stats = [
    { label: "Total Kas", value: `Rp ${totalPayments.toLocaleString("id-ID")}`, icon: TrendingUp, change: "Terkumpul" },
    { label: "Anggota", value: `${memberCount} Orang`, icon: Users, change: "Aktif" },
    { label: "Putaran", value: `Ke-${drawCount + 1} / ${memberCount}`, icon: Calendar, change: `${memberCount - drawCount} sisa` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Selamat datang 👋</p>
          <h1 className="text-xl font-bold">Arisan Keluarga</h1>
        </div>
        <div className="w-10 h-10 rounded-2xl overflow-hidden glow-primary flex items-center justify-center bg-background">
          <img src={logo} alt="Arisan Galaxy" className="w-full h-full object-contain" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-5 glow-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-primary-foreground/5 translate-y-6 -translate-x-6" />
        <p className="text-primary-foreground/70 text-sm font-medium">Saldo Arisan</p>
        <h2 className="text-3xl font-extrabold text-primary-foreground mt-1">Rp {totalPayments.toLocaleString("id-ID")}</h2>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-primary-foreground/60 text-[11px]">Iuran/bulan</p>
            <p className="text-primary-foreground font-semibold text-sm">Rp {iuranPerBulan.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-primary-foreground/60 text-[11px]">Dapat giliran</p>
            <p className="text-primary-foreground font-semibold text-sm">Rp {totalHadiah.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Menu Cepat</h3>
        <QuickActions onNavigate={onNavigate} />
      </div>

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

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Aktivitas Terbaru</h3>
        <div className="space-y-3">
          {recentPayments.length === 0 ? (
            <div className="glass-card-light rounded-2xl p-4 text-center text-muted-foreground text-sm">
              Belum ada aktivitas
            </div>
          ) : (
            recentPayments.map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {(item.arisan_members?.name || "?").split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.arisan_members?.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      membayar iuran · {new Date(item.paid_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">Rp {item.amount.toLocaleString("id-ID")}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {unpaidMembers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive">
              Pengingat Iuran — {new Date().toLocaleString("id-ID", { month: "long", year: "numeric" })}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {unpaidMembers.length} anggota belum membayar iuran bulan ini
          </p>
          <div className="space-y-2">
            {unpaidMembers.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between glass-card-light rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center text-[10px] font-bold text-destructive">
                    {m.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <span className="text-[11px] text-destructive font-semibold">Belum bayar</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate("payment")}
            className="mt-3 w-full text-center text-xs font-semibold text-primary py-2 rounded-xl border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            Catat Pembayaran →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
