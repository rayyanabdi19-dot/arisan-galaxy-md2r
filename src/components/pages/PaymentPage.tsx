import { motion } from "framer-motion";
import { Wallet, CheckCircle, ArrowUpRight, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  member_order: number;
}

interface Payment {
  id: string;
  member_id: string;
  amount: number;
  month: string;
  method: string;
  status: string;
  paid_at: string;
  arisan_members?: { name: string };
}

const paymentMethods = [
  { id: "transfer", label: "Transfer Bank", icon: ArrowUpRight },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
  { id: "cash", label: "Tunai", icon: CreditCard },
];

const PaymentPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const [selectedMember, setSelectedMember] = useState("");
  const [processing, setProcessing] = useState(false);
  const [iuran, setIuran] = useState(500000);
  const currentMonth = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });

  const fetchData = async () => {
    const [m, p, s] = await Promise.all([
      supabase.from("arisan_members").select("*").order("member_order"),
      supabase.from("arisan_payments").select("*, arisan_members(name)").order("paid_at", { ascending: false }).limit(10),
      supabase.from("arisan_settings").select("value").eq("key", "iuran_per_bulan").single(),
    ]);
    if (m.data) setMembers(m.data);
    if (p.data) setPayments(p.data as Payment[]);
    if (s.data) setIuran(Number(s.data.value) || 500000);
  };

  useEffect(() => { fetchData(); }, []);

  const paidThisMonth = payments.filter((p) => p.month === currentMonth).map((p) => p.member_id);
  const unpaidMembers = members.filter((m) => !paidThisMonth.includes(m.id));

  const handlePay = async () => {
    if (!selectedMember) return;
    setProcessing(true);
    await supabase.from("arisan_payments").insert({
      member_id: selectedMember,
      amount: iuran,
      month: currentMonth,
      method: selectedMethod,
      status: "lunas",
    });
    setSelectedMember("");
    setProcessing(false);
    fetchData();
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Pembayaran</h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary-foreground/5 -translate-y-6 translate-x-6" />
        <p className="text-primary-foreground/70 text-sm">Iuran Bulan Ini</p>
        <h2 className="text-3xl font-extrabold text-primary-foreground mt-1">Rp {iuran.toLocaleString("id-ID")}</h2>
        <p className="text-primary-foreground/60 text-xs mt-2">{currentMonth}</p>
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold">
          <CheckCircle className="w-3 h-3" /> {paidThisMonth.length}/{members.length} sudah bayar
        </div>
      </motion.div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Pilih Anggota</h3>
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="w-full bg-muted/50 rounded-xl px-3 py-2.5 text-sm outline-none border border-border/30 focus:border-accent/50"
        >
          <option value="">-- Pilih anggota yang bayar --</option>
          {unpaidMembers.map((m) => (
            <option key={m.id} value={m.id}>#{m.member_order} - {m.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Metode Pembayaran</h3>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`rounded-2xl p-3 flex flex-col items-center gap-2 transition-all ${
                selectedMethod === method.id ? "glass-card glow-primary border-primary/40" : "glass-card-light"
              }`}
            >
              <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-[11px] font-medium">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handlePay}
        disabled={!selectedMember || processing}
        className={`w-full rounded-2xl py-4 font-bold text-sm ${
          !selectedMember ? "bg-muted text-muted-foreground" : "gradient-accent text-primary-foreground glow-accent"
        }`}
      >
        {processing ? "Memproses..." : `Bayar Sekarang - Rp ${iuran.toLocaleString("id-ID")}`}
      </motion.button>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Riwayat Pembayaran</h3>
        <div className="space-y-2">
          {payments.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">{item.arisan_members?.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(item.paid_at).toLocaleDateString("id-ID")} · {item.method}
                </p>
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
