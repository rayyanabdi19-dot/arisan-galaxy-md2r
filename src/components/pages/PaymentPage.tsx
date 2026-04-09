import { motion } from "framer-motion";
import { Wallet, CheckCircle, ArrowUpRight, CreditCard } from "lucide-react";
import { useState } from "react";

const paymentMethods = [
  { id: "transfer", label: "Transfer Bank", icon: ArrowUpRight },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
  { id: "cash", label: "Tunai", icon: CreditCard },
];

const paymentHistory = [
  { month: "April 2026", status: "lunas", date: "05 Apr 2026", method: "Transfer" },
  { month: "Maret 2026", status: "lunas", date: "03 Mar 2026", method: "E-Wallet" },
  { month: "Februari 2026", status: "lunas", date: "01 Feb 2026", method: "Tunai" },
  { month: "Januari 2026", status: "lunas", date: "05 Jan 2026", method: "Transfer" },
];

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Pembayaran</h1>

      {/* Current Payment */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary-foreground/5 -translate-y-6 translate-x-6" />
        <p className="text-primary-foreground/70 text-sm">Iuran Bulan Ini</p>
        <h2 className="text-3xl font-extrabold text-primary-foreground mt-1">Rp 500.000</h2>
        <p className="text-primary-foreground/60 text-xs mt-2">Jatuh tempo: 10 Mei 2026</p>
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold">
          <CheckCircle className="w-3 h-3" /> Putaran ke-5
        </div>
      </motion.div>

      {/* Payment Method */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Metode Pembayaran</h3>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`rounded-2xl p-3 flex flex-col items-center gap-2 transition-all ${
                selectedMethod === method.id
                  ? "glass-card glow-primary border-primary/40"
                  : "glass-card-light"
              }`}
            >
              <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-[11px] font-medium">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowConfirm(!showConfirm)}
        className="w-full gradient-accent rounded-2xl py-4 text-primary-foreground font-bold text-sm glow-accent"
      >
        {showConfirm ? "✓ Pembayaran Berhasil!" : "Bayar Sekarang - Rp 500.000"}
      </motion.button>

      {/* Payment History */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Riwayat Pembayaran</h3>
        <div className="space-y-2">
          {paymentHistory.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">{item.month}</p>
                <p className="text-[11px] text-muted-foreground">{item.date} · {item.method}</p>
              </div>
              <div className="flex items-center gap-1 text-secondary text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Lunas
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
