import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Sparkles, Star, Download } from 'lucide-react';
import { NUMBER_DATA } from './constants';
import { NumberData, ViewState, AIContentResponse, GameQuestion } from './types';
import { fetchNumberContent } from './services/geminiService';
import { DrawingPad } from './components/DrawingPad';

// --- Sub-components (Internal to avoid too many files for simple UI) ---

const NumberCard: React.FC<{ 
  item: NumberData; 
  onClick: (id: number) => void 
}> = ({ item, onClick }) => (
  <button 
    onClick={() => onClick(item.id)}
    className={`${item.twColor} group relative w-full aspect-square rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden border-4 border-white/30`}
  >
    <div className="absolute top-2 right-2 opacity-50 text-2xl group-hover:opacity-100 group-hover:scale-125 transition-all">
      {item.icon}
    </div>
    <span className="text-8xl font-display text-white drop-shadow-md group-hover:animate-wiggle">
      {item.value}
    </span>
    <span className="mt-2 text-white/90 font-bold text-lg bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm">
      {item.shapeMetaphor}
    </span>
  </button>
);

const DetailView: React.FC<{ 
  item: NumberData; 
  onBack: () => void;
}> = ({ item, onBack }) => {
  const [aiContent, setAiContent] = useState<AIContentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadAI = async () => {
      setLoading(true);
      const data = await fetchNumberContent(item.value);
      if (mounted) {
        setAiContent(data);
        setLoading(false);
      }
    };
    loadAI();
    return () => { mounted = false; };
  }, [item.value]);

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Header */}
      <div className={`relative h-64 ${item.twColor} rounded-b-[3rem] shadow-xl flex items-center justify-center overflow-hidden`}>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/50 transition-colors z-10"
        >
          <ArrowLeft size={32} />
        </button>
        
        {/* Decorative Background Circles */}
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-xl" />

        <div className="flex flex-col items-center z-10 animate-pop">
           <span className="text-[10rem] font-display text-white leading-none drop-shadow-2xl">
             {item.value}
           </span>
           <span className="text-2xl text-white font-bold tracking-wider mt-2 bg-black/20 px-6 py-2 rounded-full">
             {item.staticRhyme}
           </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
        
        {/* AI Story Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl text-white shadow-md">
               <Sparkles size={24} />
             </div>
             <h3 className="text-xl font-bold text-gray-800">神奇故事</h3>
           </div>
           
           {loading ? (
             <div className="animate-pulse space-y-3">
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
             </div>
           ) : aiContent ? (
             <div className="space-y-4">
               <p className="text-lg text-gray-700 leading-relaxed font-sans">
                 {aiContent.story}
               </p>
               <div className="flex gap-3">
                 <div className="flex-1 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                   <span className="text-amber-500 font-bold block mb-1 text-sm">💡 小知识</span>
                   <p className="text-gray-700 text-sm">{aiContent.funFact}</p>
                 </div>
                 <div className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100">
                   <span className="text-green-600 font-bold block mb-1 text-sm">🏃 动一动</span>
                   <p className="text-gray-700 text-sm">{aiContent.actionPrompt}</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="text-gray-400 text-center py-4">加载中...</div>
           )}
        </div>

        {/* Drawing Section */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6 w-full">
             <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl text-white shadow-md">
               <span className="text-xl">✍️</span>
             </div>
             <h3 className="text-xl font-bold text-gray-800">跟我一起写</h3>
           </div>
           <DrawingPad color={item.color} />
        </div>

      </div>
    </div>
  );
};

const GameView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<GameQuestion | null>(null);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = () => {
    const target = Math.floor(Math.random() * 9) + 1;
    const items = ['🍎', '🍌', '🚗', '🐶', '🐱', '🌟', '🎈'];
    const item = items[Math.floor(Math.random() * items.length)];
    
    // Generate distinct options including target
    const options = new Set([target]);
    while(options.size < 3) {
      options.add(Math.floor(Math.random() * 9) + 1);
    }

    setQuestion({
      targetNumber: target,
      options: Array.from(options).sort(() => Math.random() - 0.5),
      items: Array(target).fill(item)
    });
    setShowResult(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (selected: number) => {
    if (!question) return;
    if (selected === question.targetNumber) {
      setScore(s => s + 10);
      setShowResult('correct');
      setTimeout(generateQuestion, 1500);
    } else {
      setShowResult('wrong');
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow text-gray-600">
          <ArrowLeft />
        </button>
        <div className="bg-white px-6 py-2 rounded-full shadow-md flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-xl text-indigo-900">{score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-display text-indigo-800 mb-6 text-center">
          数一数，有多少个 {question.items[0]}?
        </h2>

        <div className="bg-white p-8 rounded-[3rem] shadow-xl w-full min-h-[300px] flex flex-wrap gap-4 justify-center items-center mb-10 border-4 border-indigo-100">
          {question.items.map((it, idx) => (
             <div key={idx} className="text-6xl animate-pop" style={{animationDelay: `${idx * 0.1}s`}}>
               {it}
             </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full">
          {question.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={showResult === 'correct'}
              className={`
                h-24 rounded-2xl text-4xl font-display shadow-lg transition-all transform hover:scale-105 active:scale-95
                ${showResult === 'correct' && opt === question.targetNumber ? 'bg-green-500 text-white' : ''}
                ${showResult === 'wrong' && opt !== question.targetNumber ? 'bg-gray-200 text-gray-400' : ''}
                ${!showResult ? 'bg-white text-indigo-600 hover:bg-indigo-50' : ''}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {showResult === 'correct' && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
             <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('GALLERY');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, so it can't be used again.
    setInstallPrompt(null);
  };

  const handleCardClick = (id: number) => {
    setSelectedId(id);
    setView('DETAIL');
  };

  const selectedItem = NUMBER_DATA.find(n => n.id === selectedId);

  return (
    <div className="font-sans text-gray-800 select-none">
      {view === 'GALLERY' && (
        <div className="min-h-screen bg-[#F0F9FF] p-6">
          <header className="mb-8 flex justify-between items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-5xl font-display text-candy-blue drop-shadow-sm">
                数字动物园
              </h1>
              <p className="text-gray-500 mt-2 font-medium">认识你的一生挚友 1-9</p>
            </div>
            <div className="flex gap-3">
              {installPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-candy-green text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-green-500 transition-all flex items-center gap-2 font-bold animate-bounce-slow"
                  title="下载 APP"
                >
                  <Download size={24} />
                  <span className="hidden md:inline">下载 APP</span>
                </button>
              )}
              <button 
                onClick={() => setView('GAME')}
                className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-candy-yellow text-candy-orange hover:text-white transition-all transform hover:rotate-6"
                title="数字游戏"
              >
                <Gamepad2 size={32} />
              </button>
            </div>
          </header>

          <main className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
            {NUMBER_DATA.map((item) => (
              <NumberCard 
                key={item.id} 
                item={item} 
                onClick={handleCardClick} 
              />
            ))}
          </main>
          
          <footer className="text-center text-gray-400 text-sm pb-6">
            © 2024 NumberZoo | 让学习充满乐趣
          </footer>
        </div>
      )}

      {view === 'DETAIL' && selectedItem && (
        <DetailView 
          item={selectedItem} 
          onBack={() => setView('GALLERY')} 
        />
      )}

      {view === 'GAME' && (
        <GameView onBack={() => setView('GALLERY')} />
      )}
    </div>
  );
}
