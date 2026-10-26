import { PresetContact } from "@/types/alibi";

export const PRESET_CONTACTS: PresetContact[] = [
  {
    id: "mama",
    label: "Mama",
    callerName: "Mama",
    callerNumber: "+62 812-8899-2310",
    defaultScript:
      "Halo nak, Kamu lagi dimana? bisa pulang sebentar bantu mama dirumah",
    audioPath: "/audio/presets/mama.mp3",
    themeColor:
      "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
  },
  {
    id: "kantor",
    label: "Kantor",
    callerName: "Pak Bos",
    callerNumber: "+62 821-4455-8890",
    defaultScript:
      "Halo, maaf mengganggu waktu istirahatnya, file deck presentasi ada revisi mendadak, Tolong buka laptop sebentar ya saya tunggu di email",
    audioPath: "/audio/presets/kantor.mp3",
    themeColor:
      "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400",
  },
  {
    id: "kurir",
    label: "Kurir",
    callerName: "Sicepat",
    callerNumber: "+62 857-1122-3344",
    defaultScript:
      "Permisi kak, paket COD Tokopedia sudah sampai di depan pagar rumah. Ada orang di dalam nggak ya?",
    audioPath: "/audio/presets/kurir.mp3",
    themeColor:
      "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400",
  },
  {
    id: "klinik",
    label: "Klinik",
    callerName: "Klinik",
    callerNumber: "+62 811-9988-7766",
    defaultScript:
      "halo, kami dari bagian administrasi klinik. Mau mengabarkan hasil pemeriksaan medis tadi pagi sudah selesai dan perlu diambil segera ya.",
    audioPath: "/audio/presets/klinik.mp3",
    themeColor:
      "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
  },
];
