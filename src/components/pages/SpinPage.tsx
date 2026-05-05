import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Sparkles, CheckCircle2, MessageCircle, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  member_order: number;
  phone?: string;
}

interface Draw {
  id: string;
  member_id: string;
  round: number;
  amount: number;
  draw_date: string;
  arisan_members?: { name: string };
}

const SpinPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [eligibleMembers, setEligibleMembers] = useState<Member[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);
  const [currentName, setCurrentName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [iuran, setIuran] = useState(500000);
  const [broadcastWinner, setBroadcastWinner] = useState<Member | null>(null);
  const [broadcastRound, setBroadcastRound] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    const [membersRes, drawsRes, settingsRes] = await Promise.all([
      supabase.from("arisan_members").select("*").order("member_order"),
      supabase.from("arisan_draws").select("*, arisan_members(name)").order("round"),
      supabase.from("arisan_settings").select("value").eq("key", "iuran_per_bulan").single(),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (drawsRes.data) setDraws(drawsRes.data as Draw[]);
    if (settingsRes.data) setIuran(Number(settingsRes.data.value) || 500000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const wonIds = new Set(draws.map((d) => d.member_id));
    setEligibleMembers(members.filter((m) => !wonIds.has(m.id)));
  }, [members, draws]);

  const totalHadiah = members.length * iuran;

  const startSpin = async () => {
    if (eligibleMembers.length === 0 || spinning) return;

    setSpinning(true);
    setWinner(null);
    setShowResult(false);

    const duration = 3000;
    const interval = 80;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const idx = Math.floor(Math.random() * eligibleMembers.length);
      setCurrentName(eligibleMembers[idx].name);

      if (step >= steps) {
        clearInterval(timer);
        const winnerIdx = Math.floor(Math.random() * eligibleMembers.length);
        const selected = eligibleMembers[winnerIdx];
        setWinner(selected);
        setCurrentName(selected.name);
        setSpinning(false);
        setShowResult(true);
      }
    }, interval);
  };

  const confirmWinner = async () => {
    if (!winner) return;
    const nextRound = draws.length + 1;
    const { error } = await supabase.from("arisan_draws").insert({
      member_id: winner.id,
      round: nextRound,
      amount: totalHadiah,
    });
    if (!error) {
      setShowResult(false);
      setBroadcastWinner(winner);
      setBroadcastRound(nextRound);
      setSentIds(new Set());
      setWinner(null);
      setCurrentName("");
      fetchData();
    }
  };

  const buildMessage = (recipient: Member, w: Member, round: number) => {
    const tanggal = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Halo ${recipient.name} 👋\n\n🎉 *Pengumuman Arisan* 🎉\n\nPemenang Putaran #${round} (${tanggal}):\n🏆 *${w.name}*\n💰 Hadiah: Rp ${totalHadiah.toLocaleString("id-ID")}\n\nTerima kasih atas partisipasinya. Sampai jumpa di putaran berikutnya!`;
  };

  const sanitizePhone = (phone: string) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "62" + p.slice(1);
    if (p.startsWith("8")) p = "62" + p;
    return p;
  };

  const sendWhatsApp = (recipient: Member) => {
    if (!broadcastWinner || !recipient.phone) return;
    const msg = encodeURIComponent(
      buildMessage(recipient, broadcastWinner, broadcastRound)
    );
    const phone = sanitizePhone(recipient.phone);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setSentIds((prev) => new Set(prev).add(recipient.id));
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">🎰 Guncang Arisan</h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-6 relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-primary-foreground/5 translate-y-6 -translate-x-6" />

        <Sparkles className="w-8 h-8 text-primary-foreground/60 mx-auto mb-3" />

        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentName || "ready"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.08 }}
              className={`text-2xl font-extrabold text-primary-foreground ${
                spinning ? "animate-pulse" : ""
              }`}
            >
              {currentName || "Siap Guncang?"}
            </motion.h2>
          </AnimatePresence>
        </div>

        <p className="text-primary-foreground/60 text-sm mt-2">
          {eligibleMembers.length} anggota belum mendapat giliran
        </p>

        <p className="text-primary-foreground font-bold mt-2 text-lg">
          Hadiah: Rp {totalHadiah.toLocaleString("id-ID")}
        </p>
      </motion.div>

      {!showResult ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startSpin}
          disabled={spinning || eligibleMembers.length === 0}
          className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 ${
            eligibleMembers.length === 0
              ? "bg-muted text-muted-foreground"
              : "gradient-accent text-primary-foreground glow-accent"
          }`}
        >
          <RotateCcw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
          {spinning
            ? "Mengocok..."
            : eligibleMembers.length === 0
            ? "Semua Sudah Mendapat Giliran"
            : "GUNCANG SEKARANG!"}
        </motion.button>
      ) : (
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center glow-accent"
          >
            <Trophy className="w-10 h-10 text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Pemenang:</p>
            <h3 className="text-xl font-extrabold gradient-text-accent">{winner?.name}</h3>
            <p className="text-muted-foreground text-xs mt-1">Putaran #{draws.length + 1}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowResult(false);
                setWinner(null);
                setCurrentName("");
              }}
              className="glass-card-light rounded-2xl py-3 text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Ulang
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={confirmWinner}
              className="gradient-accent rounded-2xl py-3 text-sm font-bold text-primary-foreground flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan
            </motion.button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Riwayat Undian</h3>
        {draws.length === 0 ? (
          <div className="glass-card-light rounded-2xl p-4 text-center text-muted-foreground text-sm">
            Belum ada undian
          </div>
        ) : (
          <div className="space-y-2">
            {draws.map((draw, i) => (
              <motion.div
                key={draw.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                    #{draw.round}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {draw.arisan_members?.name || "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(draw.draw_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">
                  Rp {draw.amount.toLocaleString("id-ID")}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {broadcastWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setBroadcastWinner(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-3xl p-5 w-full max-w-md max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-base">Broadcast WhatsApp</h3>
                </div>
                <button
                  onClick={() => setBroadcastWinner(null)}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Kirim pengumuman pemenang <span className="font-bold text-foreground">{broadcastWinner.name}</span> ke seluruh anggota.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  members.forEach((m, i) => {
                    if (m.phone) setTimeout(() => sendWhatsApp(m), i * 400);
                  });
                }}
                className="w-full gradient-accent text-primary-foreground rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2 mb-3"
              >
                <MessageCircle className="w-4 h-4" /> Kirim ke Semua
              </motion.button>
              <div className="flex-1 overflow-y-auto space-y-2">
                {members.map((m) => {
                  const sent = sentIds.has(m.id);
                  const hasPhone = !!m.phone;
                  return (
                    <div
                      key={m.id}
                      className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {m.phone || "Tidak ada nomor"}
                        </p>
                      </div>
                      <button
                        disabled={!hasPhone}
                        onClick={() => sendWhatsApp(m)}
                        className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1 ${
                          !hasPhone
                            ? "bg-muted text-muted-foreground"
                            : sent
                            ? "bg-secondary/20 text-secondary"
                            : "gradient-accent text-primary-foreground"
                        }`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        {sent ? "Terkirim" : "Kirim"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinPage;
