import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Phone, CheckCircle2, Clock, Trash2, Edit2, X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  phone: string;
  member_order: number;
}

interface Payment {
  member_id: string;
  month: string;
  status: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<"all" | "lunas" | "belum">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const currentMonth = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });

  const fetchData = async () => {
    const [membersRes, paymentsRes] = await Promise.all([
      supabase.from("arisan_members").select("*").order("member_order"),
      supabase.from("arisan_payments").select("member_id, month, status").eq("month", currentMonth),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (paymentsRes.data) setPayments(paymentsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const getStatus = (memberId: string) => {
    const p = payments.find((p) => p.member_id === memberId);
    return p?.status === "lunas" ? "lunas" : "belum";
  };

  const filtered = members.filter((m) =>
    filter === "all" ? true : getStatus(m.id) === filter
  );

  const lunasCount = members.filter((m) => getStatus(m.id) === "lunas").length;

  const addMember = async () => {
    if (!form.name || !form.phone) return;
    const maxOrder = members.length > 0 ? Math.max(...members.map((m) => m.member_order)) : 0;
    await supabase.from("arisan_members").insert({
      name: form.name,
      phone: form.phone,
      member_order: maxOrder + 1,
    });
    setForm({ name: "", phone: "" });
    setShowAdd(false);
    fetchData();
  };

  const updateMember = async (id: string) => {
    await supabase.from("arisan_members").update({ name: form.name, phone: form.phone }).eq("id", id);
    setEditId(null);
    setForm({ name: "", phone: "" });
    fetchData();
  };

  const deleteMember = async (id: string) => {
    await supabase.from("arisan_members").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Anggota</h1>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditId(null); setForm({ name: "", phone: "" }); }}
          className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center"
        >
          {showAdd ? <X className="w-4 h-4 text-primary-foreground" /> : <UserPlus className="w-4 h-4 text-primary-foreground" />}
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-4 space-y-3 overflow-hidden"
          >
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama anggota"
              className="w-full bg-muted/50 rounded-xl px-3 py-2 text-sm outline-none border border-border/30 focus:border-accent/50"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="No. Telepon"
              className="w-full bg-muted/50 rounded-xl px-3 py-2 text-sm outline-none border border-border/30 focus:border-accent/50"
            />
            <button onClick={addMember} className="w-full gradient-accent rounded-xl py-2 text-sm font-bold text-primary-foreground">
              Tambah Anggota
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="glass-card rounded-2xl p-4 flex justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold">{members.length}</p>
          <p className="text-[11px] text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{lunasCount}</p>
          <p className="text-[11px] text-muted-foreground">Lunas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{members.length - lunasCount}</p>
          <p className="text-[11px] text-muted-foreground">Belum</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "lunas", "belum"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? "gradient-primary text-primary-foreground" : "glass-card-light text-muted-foreground"
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
            {editId === member.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 bg-muted/50 rounded-lg px-2 py-1 text-sm outline-none border border-border/30"
                />
                <button onClick={() => updateMember(member.id)}>
                  <Save className="w-4 h-4 text-secondary" />
                </button>
                <button onClick={() => setEditId(null)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    #{member.member_order}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="text-[11px]">{member.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditId(member.id); setForm({ name: member.name, phone: member.phone }); setShowAdd(false); }}>
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteMember(member.id)}>
                    <Trash2 className="w-4 h-4 text-destructive/70" />
                  </button>
                  {getStatus(member.id) === "lunas" ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <Clock className="w-5 h-5 text-accent" />
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
