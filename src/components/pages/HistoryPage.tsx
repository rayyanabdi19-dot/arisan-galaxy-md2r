import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  type: "in" | "out";
  desc: string;
  amount: number;
  date: string;
}

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");

  useEffect(() => {
    const fetch = async () => {
      const [paymentsRes, drawsRes] = await Promise.all([
        supabase.from("arisan_payments").select("*, arisan_members(name)").order("paid_at", { ascending: false }),
        supabase.from("arisan_draws").select("*, arisan_members(name)").order("draw_date", { ascending: false }),
      ]);

      const txs: Transaction[] = [];

      if (paymentsRes.data) {
        paymentsRes.data.forEach((p: any) => {
          txs.push({
            id: p.id,
            type: "in",
            desc: `Iuran - ${p.arisan_members?.name || "?"}`,
            amount: p.amount,
            date: p.paid_at,
          });
        });
      }

      if (drawsRes.data) {
        drawsRes.data.forEach((d: any) => {
          txs.push({
            id: d.id,
            type: "out",
            desc: `Pencairan - ${d.arisan_members?.name || "?"}`,
            amount: d.amount,
            date: d.draw_date,
          });
        });
      }

      txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(txs);
    };
    fetch();
  }, []);

  const filtered = transactions.filter((t) => (filter === "all" ? true : t.type === filter));

  const totalIn = transactions.filter((t) => t.type === "in").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.type === "out").reduce((s, t) => s + t.amount, 0);
  const countIn = transactions.filter((t) => t.type === "in").length;
  const countOut = transactions.filter((t) => t.type === "out").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Riwayat</h1>
        <Filter className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Masuk</span>
          </div>
          <p className="text-lg font-bold text-secondary">Rp {totalIn.toLocaleString("id-ID")}</p>
          <p className="text-[11px] text-muted-foreground">{countIn} transaksi</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">Keluar</span>
          </div>
          <p className="text-lg font-bold text-accent">Rp {totalOut.toLocaleString("id-ID")}</p>
          <p className="text-[11px] text-muted-foreground">{countOut} transaksi</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "in", "out"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? "gradient-primary text-primary-foreground" : "glass-card-light text-muted-foreground"
            }`}
          >
            {f === "all" ? "Semua" : f === "in" ? "Masuk" : "Keluar"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tx.type === "in" ? "bg-secondary/20" : "bg-accent/20"
              }`}>
                {tx.type === "in" ? (
                  <TrendingUp className="w-4 h-4 text-secondary" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-accent" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{tx.desc}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(tx.date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold ${tx.type === "in" ? "text-secondary" : "text-accent"}`}>
              {tx.type === "in" ? "+" : "-"}Rp {tx.amount.toLocaleString("id-ID")}
            </span>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="glass-card-light rounded-2xl p-4 text-center text-muted-foreground text-sm">
            Belum ada transaksi
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
