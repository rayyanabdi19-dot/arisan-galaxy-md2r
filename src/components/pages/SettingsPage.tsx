import { motion } from "framer-motion";
import { Info, HelpCircle, BookOpen, ChevronRight, Sparkles, Shield, Code, Heart } from "lucide-react";
import { useState } from "react";
import { APP_VERSION, BUILD_DATE } from "@/lib/version";

type SubPage = "main" | "about" | "helpdesk" | "tutorial";

const SettingsPage = () => {
  const [subPage, setSubPage] = useState<SubPage>("main");

  const menuItems = [
    { id: "about" as SubPage, icon: Info, label: "Tentang Aplikasi", desc: "Versi, info & lisensi" },
    { id: "helpdesk" as SubPage, icon: HelpCircle, label: "Helpdesk", desc: "Bantuan & FAQ" },
    { id: "tutorial" as SubPage, icon: BookOpen, label: "Tutorial Penggunaan", desc: "Panduan lengkap" },
  ];

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

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">Arisan Galaxy v{APP_VERSION}</p>
      </div>
    </div>
  );
};

const BackButton = ({ onBack }: { onBack: () => void }) => (
  <button
    onClick={onBack}
    className="text-sm text-accent hover:text-accent/80 transition-colors mb-4 flex items-center gap-1"
  >
    ← Kembali
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

export default SettingsPage;
