import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: 1, type: "in", desc: "Iuran - Siti Nurhaliza", amount: "Rp 500.000", date: "05 Apr 2026" },
  { id: 2, type: "in", desc: "Iuran - Budi Santoso", amount: "Rp 500.000", date: "05 Apr 2026" },
  { id: 3, type: "out", desc: "Pencairan - Rina Wati", amount: "Rp 7.500.000", date: "01 Apr 2026" },
  { id: 4, type: "in", desc: "Iuran - Ahmad Fauzi", amount: "Rp 500.000", date: "28 Mar 2026" },
  { id: 5, type: "in", desc: "Iuran - Dewi Lestari", amount: "Rp 500.000", date: "27 Mar 2026" },
  { id: 6, type: "in", desc: "Iuran - Maya Sari", amount: "Rp 500.000", date: "25 Mar 2026" },
  { id: 7, type: "out", desc: "Pencairan - Ahmad Fauzi", amount: "Rp 7.500.000", date: "01 Mar 2026" },
  { id: 8, type: "in", desc: "Iuran - Joko Widodo", amount: "Rp 500.000", date: "28 Feb 2026" },
  { id: 9, type: "in", desc: "Iuran - Fitri Handayani", amount: "Rp 500.000", date: "27 Feb 2026" },
  { id: 10, type: "in", desc: "Iuran - Rudi Hartono", amount: "Rp 500.000", date: "25 Feb 2026" },
];

const HistoryPage = () => {
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");

  const filtered = transactions.filter(t => filter === "all" ? true : t.type === filter);

  const totalIn = transactions.filter(t => t.type === "in").length;
  const totalOut = transactions.filter(t => t.type === "out").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Riwayat</h1>
        <Filter className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Masuk</span>
          </div>
          <p className="text-lg font-bold text-secondary">Rp 4.000.000</p>
          <p className="text-[11px] text-muted-foreground">{totalIn} transaksi</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">Keluar</span>
          </div>
          <p className="text-lg font-bold text-accent">Rp 15.000.000</p>
          <p className="text-[11px] text-muted-foreground">{totalOut} transaksi</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "in", "out"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? "gradient-primary text-primary-foreground"
                : "glass-card-light text-muted-foreground"
            }`}
          >
            {f === "all" ? "Semua" : f === "in" ? "Masuk" : "Keluar"}
          </button>
        ))}
      </div>

      {/* Transactions */}
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
                <p className="text-[11px] text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <span className={`text-xs font-bold ${tx.type === "in" ? "text-secondary" : "text-accent"}`}>
              {tx.type === "in" ? "+" : "-"}{tx.amount}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
