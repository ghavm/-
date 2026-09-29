import React, { useState } from 'react';
import { Sparkles, RefreshCw, Volume2, Share2, Check, Smile, CloudRain, Sun, Zap, Coffee, Moon, BookOpen } from 'lucide-react';
import { MoodType } from '../types';
import { soundFx } from '../utils/audio';

interface DailyCheerCardProps {
  onSelectMood?: (mood: MoodType) => void;
  selectedMood: MoodType;
  onOpenEmpathyChat?: () => void;
  onOpenQuoteBook?: () => void;
}

const MOOD_OPTIONS: { type: MoodType; label: string; icon: React.ReactNode; color: string; prompt: string }[] = [
  { type: 'heavy', label: '마음이 무거워요', icon: <Moon className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '침대에서 일어나기조차 힘들고 마음이 한없이 무겁습니다.' },
  { type: 'anxious', label: '불안하고 초조해요', icon: <CloudRain className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '세상 밖으로 나가는 것이 두렵고 미래가 불안합니다.' },
  { type: 'tired', label: '에너지가 방전됐어요', icon: <Coffee className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '모든 의욕이 떨어지고 기운이 나지 않아요.' },
  { type: 'neutral', label: '그냥 담담해요', icon: <Smile className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '큰 감정 없이 평온하고 담담한 상태입니다.' },
  { type: 'curious', label: '조금 움직여볼까 싶어요', icon: <Zap className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '오늘은 아주 사소한 거라도 하나 해보고 싶은 마음이 듭니다.' },
  { type: 'hopeful', label: '작은 희망이 느껴져요', icon: <Sun className="w-3.5 h-3.5" />, color: 'bg-white border-[#001858] text-[#001858]', prompt: '나도 다시 세상으로 나아갈 수 있을 것 같다는 따뜻한 용기가 듭니다.' },
];

export const DailyCheerCard: React.FC<DailyCheerCardProps> = ({
  onSelectMood,
  selectedMood,
  onOpenEmpathyChat,
  onOpenQuoteBook
}) => {
  const [cheerMessage, setCheerMessage] = useState<string>(
    '모두가 뛰어가고 있을 때, 당신이 잠시 멈추어 숨을 고르는 것도 삶의 중요한 한 페이지예요. 오늘의 당신을 있는 그대로 안아주세요.'
  );
  const [author, setAuthor] = useState<string>('햇살 멘토');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Fetch AI cheer tailored to mood
  const handleGenerateAICheer = async (mood: MoodType) => {
    soundFx.playSoftTap();
    setIsLoading(true);
    try {
      const option = MOOD_OPTIONS.find(o => o.type === mood);
      const res = await fetch('/api/cheer/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: option?.label || '무기력함',
          currentSituation: option?.prompt || '조금 지쳐있어요'
        })
      });
      const data = await res.json();
      if (data.cheer) {
        setCheerMessage(data.cheer);
        setAuthor('AI 햇살 지기');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech (TTS) for gentle audio reading
  const handleReadAloud = () => {
    soundFx.playSoftTap();
    if (!('speechSynthesis' in window)) {
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cheerMessage);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88; // Gentle, slower pace
    utterance.pitch = 1.05;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    soundFx.playSoftTap();
    navigator.clipboard.writeText(`"${cheerMessage}" - [life outside]`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-[36px] bg-[#F3D2C1] p-5 sm:p-7 border-4 border-[#001858] shadow-[8px_8px_0px_0px_#001858] transition-all">
      {/* Mood Selector Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-[#001858] animate-ping" />
            <h2 className="text-xs sm:text-sm font-black text-[#001858] uppercase tracking-wider">
              오늘 나의 마음 날씨는 어떤가요?
            </h2>
          </div>
          <span className="text-[11px] text-[#001858] font-black px-2.5 py-0.5 rounded-full bg-white/70 border-2 border-[#001858]">
            맞춤 위로 도착 💌
          </span>
        </div>

        {/* Mood Chips Grid */}
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.type;
            return (
              <button
                key={mood.type}
                id={`mood-btn-${mood.type}`}
                onClick={() => {
                  if (onSelectMood) onSelectMood(mood.type);
                  handleGenerateAICheer(mood.type);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black border-2 border-[#001858] transition-all duration-200 active:translate-x-[1px] active:translate-y-[1px] ${
                  isSelected
                    ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE] scale-105'
                    : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/40 hover:scale-102'
                }`}
              >
                {mood.icon}
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Cheer Card Content */}
      <div className="relative z-10 bg-white rounded-3xl p-5 sm:p-6 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#8BD3DD] border-2 border-[#001858] flex items-center justify-center text-[#001858] shadow-[2px_2px_0px_0px_#001858]">
              <Sun className="w-5 h-5 text-[#001858] fill-yellow-300" />
            </div>
            <div>
              <div className="text-xs font-black text-[#001858]">{author}의 다정한 편지</div>
              <div className="text-[11px] text-[#001858]/80 font-bold">죄책감 없이 편안한 오늘을 위해</div>
            </div>
          </div>

          {/* AI Refresh Button */}
          <button
            id="regenerate-cheer-btn"
            onClick={() => handleGenerateAICheer(selectedMood)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
            title="새로운 응원 문장 받기"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">다른 위로</span>
          </button>
        </div>

        {/* The Cheer Quote Text */}
        <blockquote className="my-4 text-[#001858] font-bold text-base sm:text-lg leading-relaxed sm:leading-loose">
          "{cheerMessage}"
        </blockquote>

        {/* Action Controls & Empathy Link */}
        <div className="flex items-center justify-between pt-3.5 border-t-2 border-[#001858]/20 mt-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Read Aloud TTS */}
            <button
              id="tts-cheer-btn"
              onClick={handleReadAloud}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                isSpeaking
                  ? 'bg-[#F582AE] text-[#001858] animate-pulse'
                  : 'bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 text-[#001858]'
              }`}
              title="따뜻한 목소리로 읽어주기"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isSpeaking ? '읽는 중...' : '소리로 듣기'}</span>
            </button>

            {/* Copy Button */}
            <button
              id="copy-cheer-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FEF6E4] hover:bg-white text-[#001858] text-xs font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="문장 복사"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? '복사됨' : '저장/공유'}</span>
            </button>

            {/* Quote Book Button */}
            {onOpenQuoteBook && (
              <button
                id="open-quote-book-cheer-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  onOpenQuoteBook();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFD166]/80 text-[#001858] text-xs font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                title="용기 충전 명언 북 열기"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">명언 북 📖</span>
              </button>
            )}
          </div>

          {/* Direct Empathy Talk Trigger */}
          {onOpenEmpathyChat && (
            <button
              id="talk-empathy-quick-btn"
              onClick={() => {
                soundFx.playSoftTap();
                onOpenEmpathyChat();
              }}
              className="flex items-center gap-1 text-xs text-[#001858] font-black underline underline-offset-4 decoration-4 decoration-[#F582AE] hover:text-[#F582AE] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#001858]" />
              <span>마음 털어놓고 대화하기 &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
