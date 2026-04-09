import { motion } from "framer-motion";
import { Trophy, Calendar, CheckCircle2, Clock, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  member_order: number;
}

interface Draw {
  member_id: string;
  round: number;
  draw_date: string;
}

const SchedulePage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [m, d] = await Promise.all([
        supabase.from("arisan_members").select("*").order("member_order"),
        supabase.from("arisan_draws").select("*").order("round"),
      ]);
      if (m.data) setMembers(m.data);
      if (d.data) setDraws(d.data);
    };
    fetch();
  }, []);

  const drawnIds = new Set(draws.map((d) => d.member_id));
  const currentRound = draws.length + 1;
  const totalMembers = members.length;

  const getStatus = (member: Member) => {
    const draw = draws.find((d) => d.member_id === member.id);
    if (draw) return { status: "done" as const, round: draw.round };
    return { status: "upcoming" as const, round: 0 };
  };

  // Sort: done first by round, then upcoming
  const sorted = [...members].sort((a, b) => {
    const sa = getStatus(a);
    const sb = getStatus(b);
    if (sa.status === "done" && sb.status !== "done") return -1;
    if (sa.status !== "done" && sb.status === "done") return 1;
    if (sa.status === "done" && sb.status === "done") return sa.round - sb.round;
    return a.member_order - b.member_order;
  });

  const progress = totalMembers > 0 ? (draws.length / totalMembers) * 100 : 0;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Jadwal Undian</h1>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progress Arisan</span>
          <span className="font-bold text-secondary">{draws.length} / {totalMembers}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
      </div>

      {/* Info */}
      {draws.length < totalMembers && (
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-muted-foreground text-xs">Putaran selanjutnya</p>
          <p className="text-2xl font-extrabold gradient-text-accent">#{currentRound}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {members.filter((m) => !drawnIds.has(m.id)).length} anggota belum mendapat
          </p>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {sorted.map((member, i) => {
          const info = getStatus(member);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                  info.status === "done"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {info.status === "done" ? info.round : "—"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {info.status === "done" ? `Putaran #${info.round}` : "Belum mendapat"}
                  </p>
                </div>
              </div>
              {info.status === "done" ? (
                <CheckCircle2 className="w-4 h-4 text-secondary" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground/50" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SchedulePage;
