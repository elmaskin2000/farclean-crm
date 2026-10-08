import { Sparkles } from 'lucide-react'

export default function AiInsightWidget({ lead }: { lead: any }) {
  let suggestion = '';
  let urgency = 'normal';

  const activities = lead.leadActivities || [];
  const activityCount = activities.length;
  const lastActivity = activityCount > 0 ? activities[0] : null;
  
  const chatHistoryText = activities.map((a: any) => a.description).join(' ').toLowerCase();
  const lastMessageText = lastActivity ? lastActivity.description.toLowerCase() : '';

  // Advanced Indonesian Intent Analysis
  const asksForPrice = /harga|price|pricelist|penawaran|quotation|berapa|biaya|ongkos/i.test(chatHistoryText);
  const complainsAboutPrice = /mahal|diskon|nego|kurangin|budget|turunin|kemahalan/i.test(chatHistoryText);
  const asksForMeeting = /meeting|ketemu|kunjungan|survei|survey|visit|zoom|lokasi/i.test(chatHistoryText);
  const asksForSpecs = /spek|spesifikasi|brosur|katalog|pdf|detail|ukuran|bahan|material/i.test(chatHistoryText);
  const studyingRequirement = /pelajari|gambar|menunggu|cek dulu|kalkulasi/i.test(lastMessageText);
  
  if (activityCount === 0) {
    suggestion = `Prospek baru masuk. Segera kirimkan pesan perkenalan (Intro) dan tanyakan kebutuhan spesifik mereka terkait ${lead.productInterest || 'produk kita'}.`;
    urgency = 'high';
  } else {
    // If there is active communication, ignore the 'NEW' status for the AI logic.
    if (studyingRequirement && lastActivity.direction === 'OUTBOUND') {
      urgency = 'normal';
      suggestion = 'Anda sedang mempelajari kebutuhan/gambar dari klien. Ingat untuk mem-follow up mereka kembali setelah tim Anda selesai menghitung estimasi atau mengecek spesifikasi.';
    } else if (complainsAboutPrice) {
      urgency = 'high';
      suggestion = 'Analisis Chat: Klien menyinggung soal harga/diskon. Coba berikan penawaran alternatif dengan spesifikasi berbeda, atau berikan diskon khusus agar tidak lepas.';
    } else if (asksForMeeting) {
      urgency = 'high';
      suggestion = 'Analisis Chat: Ada indikasi pembicaraan jadwal/lokasi/survei. Segera pastikan jadwal dan libatkan tim teknis jika diperlukan.';
    } else if (asksForPrice) {
      urgency = 'normal';
      suggestion = 'Analisis Chat: Pembicaraan mengarah ke harga/penawaran. Jika belum dikirim, segera buat dokumen Penawaran Resmi (Quotation).';
    } else if (asksForSpecs) {
      urgency = 'normal';
      suggestion = 'Analisis Chat: Membahas detail ukuran/bahan/katalog. Pastikan klien mengerti spesifikasi produk yang Anda tawarkan.';
    } else if (lastActivity.direction === 'INBOUND') {
      urgency = 'high';
      suggestion = 'Fast Response! Klien baru saja membalas atau memberikan info. Segera balas pertanyaan atau tanggapi pesan terakhir mereka.';
    } else {
      urgency = 'normal';
      suggestion = 'Lanjutkan komunikasi. Gali lebih dalam "Pain Point" mereka: kapan proyek ini dieksekusi dan siapa pengambil keputusannya.';
    }
  }

  // Final override for lost/converted
  if (lead.status === 'CONVERTED') {
    suggestion = 'Luar biasa! Prospek closing. Pastikan serah terima ke tim operasional berjalan lancar.';
    urgency = 'normal';
  } else if (lead.status === 'LOST') {
    suggestion = 'Prospek lepas. Fokus pada prospek lain.';
    urgency = 'normal';
  }

  return (
    <div className={`mt-6 rounded-xl border p-4 shadow-sm ${urgency === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-indigo-50 border-indigo-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className={`w-5 h-5 ${urgency === 'high' ? 'text-orange-600' : 'text-indigo-600'}`} />
        <h3 className={`font-semibold ${urgency === 'high' ? 'text-orange-800' : 'text-indigo-800'}`}>AI Smart Insight & Saran</h3>
      </div>
      <p className={`text-sm leading-relaxed ${urgency === 'high' ? 'text-orange-700' : 'text-indigo-700'}`}>
        {suggestion}
      </p>
    </div>
  )
}
