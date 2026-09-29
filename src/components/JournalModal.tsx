import React, { useState } from 'react';
import { X, BookHeart, Sparkles, Sun, Check, Smile } from 'lucide-react';
import { JournalEntry, MoodType } from '../types';
import { soundFx } from '../utils/audio';

interface JournalModalProps {
  onClose: () => void;
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
  completedMissionsCount: number;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  onClose,
  entries,
  onSaveEntry,
  completedMissionsCount
}) => {
  const [content, setContent] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    soundFx.playSuccessChime();
    const newEntry: JournalEntry = {
      id: 'j-' + Date.now(),
      date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
      mood: selectedMood,
      content: content.trim(),
      completedMissionTitles: [],
      sunlightGained: 10
    };

    onSaveEntry(newEntry);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const moods: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'heavy', emoji: '🌧️', label: '무거움' },
    { type: 'anxious', emoji: '💨', label: '불안함' },
    { type: 'tired', emoji: '☕', label: '지침' },
    { type: 'neutral', emoji: '🌱', label: '보통' },
    { type: 'curious', emoji: '✨', label: '기대' },
    { type: 'hopeful', emoji: '☀️', label: '희망' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FEF6E4] rounded-[28px] sm:rounded-[36px] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[12px_12px_0px_0px_#001858] p-4 sm:p-7 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            soundFx.playSoftTap();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="닫기"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-12">
          <div className="w-10 h-10 rounded-2xl bg-[#F582AE] text-[#001858] border-2 border-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858] shrink-0">
            <BookHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#001858] break-keep">
              오늘의 작은 한 줄 일기
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold break-keep">나 자신에게 건네는 따뜻한 칭찬과 기록</p>
          </div>
        </div>

        {/* Writing Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#001858] mb-2">
              오늘의 마음 날씨
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {moods.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => {
                    soundFx.playSoftTap();
                    setSelectedMood(m.type);
                  }}
                  className={`p-2 rounded-2xl text-center border-2 border-[#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                    selectedMood === m.type
                      ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE] font-black'
                      : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30 font-bold'
                  }`}
                >
                  <div className="text-lg">{m.emoji}</div>
                  <div className="text-[10px] mt-0.5">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#001858] mb-1">
              오늘 나에게 해주고 싶은 말 (또는 작게 시도한 것)
            </label>
            <textarea
              rows={3}
              required
              placeholder="예: 오늘 창문을 열고 1분 동안 바깥 공기를 맡았다. 별것 아닌 것 같아도 나에겐 큰 용기였다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white border-2 border-[#001858] text-sm font-bold text-[#001858] shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden focus:shadow-[4px_4px_0px_0px_#001858] leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-[#001858] font-black flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 fill-[#001858]" />
              <span>기록 시 햇살 온기 +10점 ✨</span>
            </div>

            <button
              type="submit"
              disabled={isSaved || !content.trim()}
              className="px-5 py-2.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[3px_3px_0px_0px_#F582AE] transition-all flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
            >
              {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? '저장 완료!' : '일기 저장하기'}</span>
            </button>
          </div>
        </form>

        {/* Previous Entries List */}
        {entries.length > 0 && (
          <div className="mt-6 pt-5 border-t-2 border-[#001858]/20">
            <h4 className="text-xs font-black text-[#001858] mb-3">최근 남긴 한 줄들</h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-white border-2 border-[#001858] text-xs shadow-[2px_2px_0px_0px_#001858]"
                >
                  <div className="flex items-center justify-between text-[#001858]/60 font-black mb-1 text-[11px]">
                    <span>{entry.date}</span>
                    <span className="text-[#001858] font-black">+{entry.sunlightGained} 온기</span>
                  </div>
                  <p className="text-[#001858] font-bold leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
