
import React, { useState, useEffect } from 'react';
import { generateYouTubeContent } from './services/geminiService';
import { YouTubeContent, LoadingStatus } from './types';

const COUNTRIES = [
  { code: 'ID', name: 'Indonesia 🇮🇩' },
  { code: 'US', name: 'USA 🇺🇸' },
  { code: 'BR', name: 'Brazil 🇧🇷' },
  { code: 'JP', name: 'Japan 🇯🇵' },
];

const CATEGORIES = [
  { id: 'Seni dan Hiburan', name: 'Seni & Hiburan 🎭', catId: '3' },
  { id: 'Musik', name: 'Musik & Audio 🎵', catId: '35' },
];

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${copied ? 'bg-green-500 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}>
      {copied ? 'Tersalin!' : 'Salin'}
    </button>
  );
};

const PlatformScoreBar: React.FC<{ name: string; score: number; color: string }> = ({ name, score, color }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-slate-400">
      <span>{name}</span>
      <span className="text-slate-600">{score}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

const ResultCard: React.FC<{ title: string; content: string; helpText: string; colorClass: string }> = ({ title, content, helpText, colorClass }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white overflow-hidden flex flex-col h-full transition-all hover:shadow-2xl group">
    <div className={`px-8 py-5 bg-gradient-to-r ${colorClass} border-b border-white/50 flex justify-between items-center`}>
      <h3 className="font-black text-slate-800 flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-rose-500">{title}</span>
        <span className="text-[9px] font-bold text-slate-400 mt-0.5">{content.length} karakter</span>
      </h3>
      <CopyButton text={content} />
    </div>
    <div className="p-8">
      <p className="text-[10px] text-rose-400 mb-4 italic font-bold leading-tight opacity-80">🌸 {helpText}</p>
      <div className="w-full h-48 overflow-y-auto bg-slate-50/50 rounded-2xl p-5 text-xs text-slate-600 font-medium leading-relaxed border border-rose-50/50 scrollbar-hide select-all">
        {content}
      </div>
    </div>
  </div>
);

export default function App() {
  const [topic, setTopic] = useState('');
  const [country, setCountry] = useState('ID');
  const [category, setCategory] = useState('Seni dan Hiburan');
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [result, setResult] = useState<YouTubeContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Menghubungkan ke Google Trends...",
    "Menganalisis pencarian populer di Indonesia...",
    "Validasi tren di TikTok & Snack Video...",
    "Menyusun judul dengan SEO tinggi...",
    "Finalisasi aset viral..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === LoadingStatus.LOADING) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setStatus(LoadingStatus.LOADING);
    setError(null);
    try {
      const data = await generateYouTubeContent(topic, country, category);
      setResult(data);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError('Gagal sinkronisasi data Google Search. Coba beberapa saat lagi.');
      setStatus(LoadingStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#fcfaff]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-rose-100/30 sticky top-0 z-50 px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-rose-200">V</div>
          <h1 className="text-lg font-black bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">ViralTube Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[8px] font-black text-green-600 uppercase">Live Engine Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Main Input Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Buat Judul Video yang <span className="text-rose-500">Pasti Viral</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">Masukan topik Anda dan biarkan AI kami melakukan browsing Google Search secara realtime untuk menemukan kata kunci yang sedang meledak.</p>
        </section>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-rose-100/50 border border-slate-50 mb-16 max-w-3xl mx-auto">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Lokasi Target</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-rose-200 transition-all">
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Kategori Konten</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-rose-200 transition-all">
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Topik atau Kata Kunci Utama</label>
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="Contoh: Review iPhone 16 Pro Max atau Vlog Korea..." 
                className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold text-lg placeholder:text-slate-300 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all"
              />
            </div>

            <button disabled={status === LoadingStatus.LOADING} className="w-full py-5 rounded-2xl font-black text-white bg-slate-900 hover:bg-rose-600 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
              {status === LoadingStatus.LOADING ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm tracking-widest">{loadingMessages[loadingStep]}</span>
                </>
              ) : (
                <span className="text-sm tracking-widest uppercase">Analisis Tren & Buat Judul</span>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-10 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        {/* Results Area */}
        {status === LoadingStatus.SUCCESS && result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-xl font-black text-slate-800">Judul Rekomendasi AI</h3>
                  <span className="text-[10px] font-black text-rose-500 uppercase px-3 py-1 bg-rose-50 rounded-full border border-rose-100">Analisis Realtime</span>
                </div>
                
                {result.titles.map((title, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all group">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-slate-300">OPSI {idx + 1}</span>
                          <span className="text-[8px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{title.length} Karakter</span>
                        </div>
                        <p className="text-lg font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">{title}</p>
                      </div>
                      <CopyButton text={title} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Potensi Viral</span>
                        <span className="text-xl font-black text-rose-500">{result.titlePercentages[idx]}%</span>
                      </div>
                      <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-4">
                        <PlatformScoreBar name="YouTube Trends" score={result.platformScores.youtube} color="bg-red-500" />
                        <PlatformScoreBar name="TikTok Trends" score={result.platformScores.tiktok} color="bg-slate-900" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                  <h4 className="font-black text-sm uppercase tracking-widest mb-6">Radar Pencarian</h4>
                  <div className="space-y-5">
                    <PlatformScoreBar name="Google Search" score={result.platformScores.google} color="bg-blue-400" />
                    <PlatformScoreBar name="DeepSeek" score={result.platformScores.deepseek} color="bg-indigo-400" />
                    <PlatformScoreBar name="DuckDuckGo" score={result.platformScores.duckduckgo} color="bg-orange-400" />
                    <PlatformScoreBar name="SnackVideo" score={result.platformScores.snackvideo} color="bg-yellow-400" />
                  </div>
                  <p className="mt-8 text-[9px] text-slate-400 leading-relaxed italic">Data di atas disinkronkan secara otomatis melalui pencarian web realtime untuk memastikan akurasi tren hari ini.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <ResultCard 
                  title="Deskripsi SEO Tinggi" 
                  content={result.description} 
                  colorClass="from-slate-50 to-white" 
                  helpText="Deskripsi panjang (2500+ karakter) untuk menaikan ranking video Anda." 
                />
              </div>
              <div className="space-y-8">
                <ResultCard 
                  title="Tags Viral" 
                  content={result.platformTags} 
                  colorClass="from-rose-50 to-white" 
                  helpText="Gunakan di kolom tag YouTube dan deskripsi." 
                />
                <ResultCard 
                  title="Metadata Rahasia" 
                  content={result.metadataTags} 
                  colorClass="from-indigo-50 to-white" 
                  helpText="Copy paste ke kolom keyword metadata." 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 py-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">ViralTube Technology ● Powered by Gemini Search Engine</p>
      </footer>
    </div>
  );
}
