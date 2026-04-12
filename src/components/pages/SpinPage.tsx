import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  member_order: number;
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
      setWinner(null);
      setCurrentName("");
      fetchData();
    }
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
    </div>
  );
};

export default SpinPage;
