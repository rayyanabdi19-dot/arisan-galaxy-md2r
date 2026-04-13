import { motion } from "framer-motion";
import { Info, HelpCircle, BookOpen, ChevronRight, Sparkles, Shield, Code, Heart, Banknote, Save, ArrowLeft, RotateCcw, Trash2, AlertTriangle, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { APP_VERSION, BUILD_DATE } from "@/lib/version";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SubPage = "main" | "about" | "helpdesk" | "tutorial" | "nominal" | "reset";

const SettingsPage = () => {
  const [subPage, setSubPage] = useState<SubPage>("main");
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains("light"));

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const menuItems = [
    { id: "nominal" as SubPage, icon: Banknote, label: "Atur Nominal Arisan", desc: "Iuran bulanan & hadiah" },
    { id: "reset" as SubPage, icon: RotateCcw, label: "Reset Data", desc: "Hapus data arisan" },
    { id: "about" as SubPage, icon: Info, label: "Tentang Aplikasi", desc: "Versi, info & lisensi" },
    { id: "helpdesk" as SubPage, icon: HelpCircle, label: "Helpdesk", desc: "Bantuan & FAQ" },
    { id: "tutorial" as SubPage, icon: BookOpen, label: "Tutorial Penggunaan", desc: "Panduan lengkap" },
  ];

  if (subPage === "nominal") return <NominalPage onBack={() => setSubPage("main")} />;
  if (subPage === "reset") return <ResetDataPage onBack={() => setSubPage("main")} />;
  if (subPage === "about") return <AboutPage onBack={() => setSubPage("main")} />;
  if (subPage === "helpdesk") return <HelpdeskPage onBack={() => setSubPage("main")} />;
  if (subPage === "tutorial") return <TutorialPage onBack={() => setSubPage("main")} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola preferensi aplikasi</p>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSubPage(item.id)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
          </motion.button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            {isDark ? <Moon className="w-5 h-5 text-accent-foreground" /> : <Sun className="w-5 h-5 text-accent-foreground" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Tema Aplikasi</p>
            <p className="text-xs text-muted-foreground">{isDark ? "Mode Gelap" : "Mode Terang"}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative w-12 h-7 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">Arisan Galaxy v{APP_VERSION}</p>
      </div>
    </div>
  );
};

const NominalPage = ({ onBack }: { onBack: () => void }) => {
  const [iuran, setIuran] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("arisan_settings")
        .select("value")
        .eq("key", "iuran_per_bulan")
        .single();
      if (data) setIuran(data.value);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("arisan_settings")
      .update({ value: iuran })
      .eq("key", "iuran_per_bulan");
    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan nominal");
    } else {
      toast.success("Nominal iuran berhasil disimpan!");
    }
  };

  const nominal = Number(iuran) || 0;

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Atur Nominal Arisan</h1>
        <p className="text-muted-foreground text-sm mt-1">Sesuaikan iuran bulanan arisan</p>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-6 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Iuran Per Bulan (Rp)</label>
              <Input
                type="number"
                value={iuran}
                onChange={(e) => setIuran(e.target.value)}
                placeholder="500000"
                className="text-lg font-bold"
              />
            </div>
            <div className="text-center py-3">
              <p className="text-xs text-muted-foreground">Preview nominal</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                Rp {nominal.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">per bulan per anggota</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Ringkasan</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Iuran bulanan</span>
                <span className="font-medium text-foreground">Rp {nominal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Iuran tahunan (12 bulan)</span>
                <span className="font-medium text-foreground">Rp {(nominal * 12).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving || !iuran} className="w-full rounded-2xl h-12 text-sm font-semibold">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Nominal"}
          </Button>
        </>
      )}
    </div>
  );
};

const BackButton = ({ onBack }: { onBack: () => void }) => (
  <button
    onClick={onBack}
    className="text-sm text-accent hover:text-accent/80 transition-colors mb-4 flex items-center gap-1"
  >
    <ArrowLeft className="w-4 h-4" />
    Kembali
  </button>
);

const AboutPage = ({ onBack }: { onBack: () => void }) => (
  <div className="space-y-6">
    <BackButton onBack={onBack} />

    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-3xl gradient-hero mx-auto mb-4 flex items-center justify-center glow-primary"
      >
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </motion.div>
      <h1 className="text-2xl font-bold text-foreground">Arisan Galaxy</h1>
      <p className="text-muted-foreground text-sm mt-1">Aplikasi Manajemen Arisan Digital</p>
    </div>

    <div className="glass-card rounded-2xl p-5 space-y-4">
      <InfoRow icon={Code} label="Versi" value={`v${APP_VERSION}`} />
      <InfoRow icon={Shield} label="Build Date" value={BUILD_DATE} />
      <InfoRow icon={Heart} label="Developer" value="Arisan Galaxy Team" />
      <InfoRow icon={Info} label="Platform" value="Web Application (PWA)" />
    </div>

    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-2">Deskripsi</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Arisan Galaxy adalah aplikasi manajemen arisan digital yang memudahkan pengelolaan anggota, 
        pembayaran iuran, undian/guncang arisan, dan riwayat transaksi. Dilengkapi dengan 
        penyimpanan data cloud yang aman dan antarmuka modern.
      </p>
    </div>

    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-2">Fitur Utama</h3>
      <ul className="space-y-2 text-xs text-muted-foreground">
        {["Manajemen anggota (CRUD)", "Pembayaran iuran bulanan", "Guncang arisan (anti-duplikat)", "Jadwal arisan otomatis", "Riwayat transaksi lengkap", "Penyimpanan data cloud"].map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <span className="text-xs font-medium text-foreground">{value}</span>
  </div>
);

const HelpdeskPage = ({ onBack }: { onBack: () => void }) => {
  const faqs = [
    { q: "Bagaimana cara menambah anggota?", a: "Buka menu Anggota → klik tombol + Tambah Anggota → isi data → simpan." },
    { q: "Bagaimana cara bayar iuran?", a: "Buka menu Bayar → pilih anggota → pilih metode pembayaran → konfirmasi." },
    { q: "Apa itu Guncang Arisan?", a: "Fitur undian acak untuk menentukan pemenang arisan. Sistem menjamin tidak ada pemenang duplikat." },
    { q: "Data saya aman?", a: "Ya! Semua data tersimpan di cloud dengan enkripsi dan hanya bisa diakses setelah login." },
    { q: "Bagaimana cara logout?", a: "Klik tombol 'Keluar' di pojok kanan atas halaman utama." },
  ];

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Helpdesk</h1>
        <p className="text-muted-foreground text-sm mt-1">Pertanyaan yang sering diajukan</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-2xl p-4"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent shrink-0" />
              {faq.q}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 ml-6 leading-relaxed">{faq.a}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-5 text-center">
        <p className="text-sm font-semibold text-foreground mb-1">Masih butuh bantuan?</p>
        <p className="text-xs text-muted-foreground">Hubungi admin arisan untuk informasi lebih lanjut</p>
      </div>
    </div>
  );
};

const TutorialPage = ({ onBack }: { onBack: () => void }) => {
  const steps = [
    { step: 1, title: "Daftar & Login", desc: "Buat akun dengan email dan password, lalu login untuk mengakses aplikasi." },
    { step: 2, title: "Tambah Anggota", desc: "Buka menu Anggota dan tambahkan semua peserta arisan dengan nama dan nomor HP." },
    { step: 3, title: "Catat Pembayaran", desc: "Setiap bulan, catat iuran yang masuk melalui menu Bayar. Pilih anggota dan metode pembayaran." },
    { step: 4, title: "Guncang Arisan", desc: "Gunakan fitur Guncang untuk mengundi pemenang secara acak. Sistem mencegah pemenang ganda." },
    { step: 5, title: "Lihat Riwayat", desc: "Pantau semua transaksi dan hasil undian di menu Riwayat untuk transparansi penuh." },
    { step: 6, title: "Cek Jadwal", desc: "Lihat jadwal arisan mendatang dan siapa yang belum bayar di menu Jadwal." },
  ];

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tutorial Penggunaan</h1>
        <p className="text-muted-foreground text-sm mt-1">Panduan langkah demi langkah</p>
      </div>

      <div className="space-y-3">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-4 flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground shrink-0">
              {item.step}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ResetDataPage = ({ onBack }: { onBack: () => void }) => {
  const [resetting, setResetting] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const resetOptions = [
    { key: "payments", label: "Data Pembayaran", desc: "Hapus semua riwayat pembayaran iuran", icon: Banknote, table: "arisan_payments" as const },
    { key: "draws", label: "Data Undian", desc: "Hapus semua hasil guncang/undian arisan", icon: Sparkles, table: "arisan_draws" as const },
    { key: "members", label: "Data Anggota", desc: "Hapus semua data anggota arisan", icon: Trash2, table: "arisan_members" as const },
    { key: "all", label: "Semua Data", desc: "Hapus seluruh data (anggota, pembayaran, undian)", icon: AlertTriangle, table: "all" as const },
  ];

  const handleReset = async (key: string) => {
    setResetting(key);
    try {
      if (key === "all") {
        await supabase.from("arisan_payments").delete().gte("created_at", "1970-01-01");
        await supabase.from("arisan_draws").delete().gte("created_at", "1970-01-01");
        await supabase.from("arisan_members").delete().gte("created_at", "1970-01-01");
      } else {
        const table = resetOptions.find(o => o.key === key)!.table;
        if (table !== "all") {
          await supabase.from(table).delete().gte("created_at", "1970-01-01");
        }
      }
      toast.success("Data berhasil direset!");
    } catch {
      toast.error("Gagal mereset data");
    }
    setResetting(null);
    setConfirmTarget(null);
  };

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reset Data</h1>
        <p className="text-muted-foreground text-sm mt-1">Hapus data arisan secara selektif</p>
      </div>

      <div className="glass-card rounded-2xl p-4 flex items-start gap-3 border-destructive/30">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-destructive">Peringatan:</span> Data yang sudah dihapus tidak dapat dikembalikan. Pastikan Anda yakin sebelum melanjutkan.
        </p>
      </div>

      <div className="space-y-3">
        {resetOptions.map((opt, i) => (
          <motion.div
            key={opt.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${opt.key === "all" ? "bg-destructive/20" : "bg-muted"}`}>
                <opt.icon className={`w-5 h-5 ${opt.key === "all" ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </div>

            {confirmTarget === opt.key ? (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 rounded-xl text-xs"
                  disabled={resetting === opt.key}
                  onClick={() => handleReset(opt.key)}
                >
                  {resetting === opt.key ? "Menghapus..." : "Ya, Hapus"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs"
                  onClick={() => setConfirmTarget(null)}
                >
                  Batal
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setConfirmTarget(opt.key)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Reset {opt.label}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
