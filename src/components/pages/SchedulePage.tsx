import { motion } from "framer-motion";
import { Trophy, Calendar, CheckCircle2, Clock, Star } from "lucide-react";

const schedule = [
  { order: 1, name: "Siti Nurhaliza", month: "Jan 2026", status: "done" },
  { order: 2, name: "Budi Santoso", month: "Feb 2026", status: "done" },
  { order: 3, name: "Dewi Lestari", month: "Mar 2026", status: "done" },
  { order: 4, name: "Ahmad Fauzi", month: "Apr 2026", status: "done" },
  { order: 5, name: "Rina Wati", month: "Mei 2026", status: "current" },
  { order: 6, name: "Joko Widodo", month: "Jun 2026", status: "upcoming" },
  { order: 7, name: "Maya Sari", month: "Jul 2026", status: "upcoming" },
  { order: 8, name: "Hendra Gunawan", month: "Agu 2026", status: "upcoming" },
  { order: 9, name: "Fitri Handayani", month: "Sep 2026", status: "upcoming" },
  { order: 10, name: "Rudi Hartono", month: "Okt 2026", status: "upcoming" },
  { order: 11, name: "Lina Marlina", month: "Nov 2026", status: "upcoming" },
  { order: 12, name: "Tono Sugiarto", month: "Des 2026", status: "upcoming" },
  { order: 13, name: "Wulan Sari", month: "Jan 2027", status: "upcoming" },
  { order: 14, name: "Dedi Mulyadi", month: "Feb 2027", status: "upcoming" },
  { order: 15, name: "Nia Ramadhani", month: "Mar 2027", status: "upcoming" },
];

const SchedulePage = () => {
  const current = schedule.find(s => s.status === "current")!;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Jadwal Undian</h1>

      {/* Current Turn */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-accent rounded-3xl p-5 relative overflow-hidden glow-accent"
      >
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary-foreground/5 -translate-y-6 translate-x-6" />
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-primary-foreground" />
          <span className="text-primary-foreground/80 text-sm font-medium">Giliran Saat Ini</span>
        </div>
        <h2 className="text-2xl font-extrabold text-primary-foreground">{current.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="w-4 h-4 text-primary-foreground/60" />
          <span className="text-primary-foreground/70 text-sm">{current.month} · Putaran #{current.order}</span>
        </div>
        <p className="text-primary-foreground font-bold mt-3 text-lg">Rp 7.500.000</p>
      </motion.div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progress Arisan</span>
          <span className="font-bold text-secondary">5 / 15</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "33.3%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-2">
        {schedule.map((item, i) => (
          <motion.div
            key={item.order}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-2xl p-3 flex items-center justify-between ${
              item.status === "current"
                ? "glass-card glow-primary border-primary/30"
                : "glass-card-light"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                item.status === "done"
                  ? "bg-secondary/20 text-secondary"
                  : item.status === "current"
                  ? "gradient-accent text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {item.order}
              </div>
              <div>
                <p className={`text-sm font-semibold ${item.status === "current" ? "gradient-text-accent" : ""}`}>
                  {item.name}
                </p>
                <p className="text-[11px] text-muted-foreground">{item.month}</p>
              </div>
            </div>
            {item.status === "done" ? (
              <CheckCircle2 className="w-4 h-4 text-secondary" />
            ) : item.status === "current" ? (
              <Star className="w-4 h-4 text-accent animate-pulse-glow" />
            ) : (
              <Clock className="w-4 h-4 text-muted-foreground/50" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
