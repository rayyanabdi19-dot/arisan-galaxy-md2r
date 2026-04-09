import { motion } from "framer-motion";
import { UserPlus, Phone, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

const initialMembers = [
  { id: 1, name: "Siti Nurhaliza", phone: "0812-xxxx-1234", status: "lunas", order: 1 },
  { id: 2, name: "Budi Santoso", phone: "0813-xxxx-5678", status: "lunas", order: 2 },
  { id: 3, name: "Dewi Lestari", phone: "0856-xxxx-9012", status: "belum", order: 3 },
  { id: 4, name: "Ahmad Fauzi", phone: "0821-xxxx-3456", status: "lunas", order: 4 },
  { id: 5, name: "Rina Wati", phone: "0878-xxxx-7890", status: "belum", order: 5 },
  { id: 6, name: "Joko Widodo", phone: "0857-xxxx-2345", status: "lunas", order: 6 },
  { id: 7, name: "Maya Sari", phone: "0819-xxxx-6789", status: "lunas", order: 7 },
  { id: 8, name: "Hendra Gunawan", phone: "0822-xxxx-0123", status: "belum", order: 8 },
  { id: 9, name: "Fitri Handayani", phone: "0838-xxxx-4567", status: "lunas", order: 9 },
  { id: 10, name: "Rudi Hartono", phone: "0815-xxxx-8901", status: "lunas", order: 10 },
  { id: 11, name: "Lina Marlina", phone: "0858-xxxx-2346", status: "belum", order: 11 },
  { id: 12, name: "Tono Sugiarto", phone: "0823-xxxx-6780", status: "lunas", order: 12 },
  { id: 13, name: "Wulan Sari", phone: "0877-xxxx-0124", status: "lunas", order: 13 },
  { id: 14, name: "Dedi Mulyadi", phone: "0816-xxxx-4568", status: "belum", order: 14 },
  { id: 15, name: "Nia Ramadhani", phone: "0859-xxxx-8902", status: "lunas", order: 15 },
];

const MembersPage = () => {
  const [filter, setFilter] = useState<"all" | "lunas" | "belum">("all");

  const filtered = initialMembers.filter(m =>
    filter === "all" ? true : m.status === filter
  );

  const lunasCount = initialMembers.filter(m => m.status === "lunas").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Anggota</h1>
        <button className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
          <UserPlus className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>

      {/* Summary */}
      <div className="glass-card rounded-2xl p-4 flex justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold">{initialMembers.length}</p>
          <p className="text-[11px] text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{lunasCount}</p>
          <p className="text-[11px] text-muted-foreground">Lunas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{initialMembers.length - lunasCount}</p>
          <p className="text-[11px] text-muted-foreground">Belum</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "lunas", "belum"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? "gradient-primary text-primary-foreground"
                : "glass-card-light text-muted-foreground"
            }`}
          >
            {f === "all" ? "Semua" : f === "lunas" ? "Lunas" : "Belum Bayar"}
          </button>
        ))}
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {filtered.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card-light rounded-2xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                #{member.order}
              </div>
              <div>
                <p className="text-sm font-semibold">{member.name}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span className="text-[11px]">{member.phone}</span>
                </div>
              </div>
            </div>
            {member.status === "lunas" ? (
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            ) : (
              <Clock className="w-5 h-5 text-accent" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
