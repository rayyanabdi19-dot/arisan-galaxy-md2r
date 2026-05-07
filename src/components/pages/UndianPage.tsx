import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Trophy, Sparkles, RotateCcw, CheckCircle2, Clock, Users } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const UndianPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [iuran, setIuran] = useState(500000);
  const [drawDate, setDrawDate] = useState<Date>(new Date());
  const [spinning, setSpinning] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [winner, setWinner] = useState<Member | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchData = useCallback(async () => {
    const [m, d, s] = await Promise.all([
      supabase.from("arisan_members").select("*").order("member_order"),
      supabase.from("arisan_draws").select("*, arisan_members(name)").order("round", { ascending: false }),
      supabase.from("arisan_settings").select("value").eq("key", "iuran_per_bulan").single(),
    ]);
    if (m.data) setMembers(m.data);
    if (d.data) setDraws(d.data as Draw[]);
    if (s.data) setIuran(Number(s.data.value) || 500000);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const wonIds = new Set(draws.map((x) => x.member_id));
  const eligible = members.filter((x) => !wonIds.has(x.id));
  const totalHadiah = members.length * iuran;
  const nextRound = draws.length + 1;

  const startSpin = () => {
    if (eligible.length === 0 || spinning) return;
    setSpinning(true);
    setWinner(null);
    setShowResult(false);
    let step = 0;
    const steps = 32;
    const t = setInterval(() => {
      step++;
      const i = Math.floor(Math.random() * eligible.length);
      setCurrentName(eligible[i].name);
      if (step >= steps) {
        clearInterval(t);
        const win = eligible[Math.floor(Math.random() * eligible.length)];
        setWinner(win);
        setCurrentName(win.name);
        setSpinning(false);
        setShowResult(true);
      }
    }, 90);
  };

  const saveWinner = async () => {
    if (!winner) return;
    const { error } = await supabase.from("arisan_draws").insert({
      member_id: winner.id,
      round: nextRound,
      amount: totalHadiah,
      draw_date: drawDate.toISOString(),
    });
    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
      return;
    }
    toast.success(`Pemenang putaran #${nextRound} disimpan`);
    setShowResult(false);
    setWinner(null);
    setCurrentName("");
    fetchData();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">🎯 Undian Arisan</h1>
        <p className="text-xs text-muted-foreground mt-1">Atur tanggal, lihat peserta, dan cari pemenang</p>
      </div>

      {/* Tanggal undian */}
      <div className="glass-card rounded-2xl p-4 space-y-2">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" /> Tanggal Undian
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-semibold rounded-xl bg-muted/40 border-border/50",
                !drawDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {drawDate ? format(drawDate, "EEEE, dd MMMM yyyy", { locale: idLocale }) : "Pilih tanggal"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={drawDate}
              onSelect={(d) => d && setDrawDate(d)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Hero spin */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-hero rounded-3xl p-6 relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary-foreground/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-primary-foreground/5 translate-y-6 -translate-x-6" />
        <Sparkles className="w-7 h-7 text-primary-foreground/60 mx-auto mb-3" />
        <p className="text-primary-foreground/70 text-[11px] font-medium tracking-wide uppercase">Putaran #{nextRound}</p>
        <div className="h-14 flex items-center justify-center mt-1">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentName || "ready"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.08 }}
              className={`text-2xl font-extrabold text-primary-foreground ${spinning ? "animate-pulse" : ""}`}
            >
              {currentName || (eligible.length === 0 ? "Selesai" : "Siap?")}
            </motion.h2>
          </AnimatePresence>
        </div>
        <p className="text-primary-foreground font-bold mt-2 text-base">
          Hadiah: Rp {totalHadiah.toLocaleString("id-ID")}
        </p>
      </motion.div>

      {!showResult ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={startSpin}
          disabled={spinning || eligible.length === 0}
          className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 ${
            eligible.length === 0 ? "bg-muted text-muted-foreground" : "gradient-accent text-primary-foreground glow-accent"
          }`}
        >
          <RotateCcw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Mengocok..." : eligible.length === 0 ? "Semua Sudah Mendapat" : "MULAI UNDIAN"}
        </motion.button>
      ) : (
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center glow-accent"
          >
            <Trophy className="w-9 h-9 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Pemenang Putaran #{nextRound}</p>
            <h3 className="text-xl font-extrabold gradient-text-accent">{winner?.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              {format(drawDate, "dd MMMM yyyy", { locale: idLocale })}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setShowResult(false); setWinner(null); setCurrentName(""); }}
              className="glass-card-light rounded-2xl py-3 text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Ulang
            </button>
            <button
              onClick={saveWinner}
              className="gradient-accent rounded-2xl py-3 text-sm font-bold text-primary-foreground flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan
            </button>
          </div>
        </div>
      )}

      {/* Daftar peserta */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Daftar Peserta
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {eligible.length} belum / {members.length} total
          </span>
        </div>
        {members.length === 0 ? (
          <div className="glass-card-light rounded-2xl p-4 text-center text-muted-foreground text-sm">
            Belum ada anggota
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m, i) => {
              const draw = draws.find((d) => d.member_id === m.id);
              const done = !!draw;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      done ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                    }`}>
                      {done ? `#${draw!.round}` : m.member_order}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {done
                          ? `Menang ${format(new Date(draw!.draw_date), "dd MMM yyyy", { locale: idLocale })}`
                          : "Menunggu giliran"}
                      </p>
                    </div>
                  </div>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hasil Pemenang */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-1.5">
          <Trophy className="w-4 h-4" /> Hasil Pemenang
        </h3>
        {draws.length === 0 ? (
          <div className="glass-card-light rounded-2xl p-4 text-center text-muted-foreground text-sm">
            Belum ada pemenang
          </div>
        ) : (
          <div className="space-y-2">
            {draws.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025 }}
                className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    #{d.round}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{d.arisan_members?.name || "—"}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {format(new Date(d.draw_date), "dd MMMM yyyy", { locale: idLocale })}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary shrink-0">
                  Rp {d.amount.toLocaleString("id-ID")}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UndianPage;