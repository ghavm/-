import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Sun, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mission } from '../types';
import { soundFx } from '../utils/audio';
import { getRandomQuote } from '../data/quotesData';

interface ActiveMissionModalProps {
  mission: Mission;
  onClose: () => void;
  onComplete: (missionId: string) => void;
}

export const ActiveMissionModal: React.FC<ActiveMissionModalProps> = ({
  mission,
  onClose,
  onComplete
}) => {
  const initialSeconds = mission.durationSeconds || 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'들숨 (들이쉬기)' | '머무르기' | '날숨 (내쉬기)'>('들숨 (들이쉬기)');
  const [courageQuote] = useState(() => 
    getRandomQuote(mission.level === 1 ? 'room' : mission.level <= 3 ? 'doorstep' : 'challenge')
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing cadence cycle
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === '들숨 (들이쉬기)') return '머무르기';
        if (prev === '머무르기') return '날숨 (내쉬기)';
        return '들숨 (들이쉬기)';
      });
    }, 3500);
    return () => clearInterval(breathInterval);
  }, []);

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      handleMissionDone();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, isCompleted]);

  const handleMissionDone = () => {
    setIsCompleted(true);
    setIsRunning(false);
    soundFx.playSuccessChime();

    // Trigger gentle confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#f97316', '#10b981']
      });
    } catch {
      // Ignored if canvas unsupported
    }
  };

  const handleFinalClaim = () => {
    onComplete(mission.id);
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round(((initialSeconds - timeLeft) / initialSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] sm:rounded-[36px] bg-[#FEF6E4] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[12px_12px_0px_0px_#001858] p-4 sm:p-7">
        {/* Close Button */}
        <button
          id="close-mission-modal"
          onClick={() => {
            soundFx.playSoftTap();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="닫기"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6 pr-10 sm:pr-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BD3DD] text-[#001858] border border-[#001858] text-xs font-black mb-2 shadow-[2px_2px_0px_0px_#001858]">
                <Sun className="w-3.5 h-3.5 fill-[#001858]" />
                <span>Level {mission.level} 마이크로 미션 가이드</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#001858] tracking-tight break-keep">
                {mission.title}
              </h2>
              <p className="text-sm text-[#001858]/80 font-bold mt-1 max-w-md mx-auto break-keep">
                {mission.description}
              </p>
            </div>

            {/* Visual Guided Breathing & Timer Circle */}
            <div className="relative flex flex-col items-center justify-center my-6">
              {/* Outer pulsing ring for breathing */}
              <div 
                className={`w-48 h-48 rounded-full border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase === '들숨 (들이쉬기)' 
                    ? 'bg-[#F582AE]/40 scale-105' 
                    : breathPhase === '머무르기'
                    ? 'bg-[#F3D2C1] scale-100'
                    : 'bg-[#8BD3DD]/40 scale-95'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-black text-[#001858] tracking-wider">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs font-black text-[#001858] mt-1 px-3 py-0.5 rounded-full bg-white border-2 border-[#001858] shadow-[1px_1px_0px_0px_#001858]">
                  {breathPhase}
                </span>
                <span className="text-[11px] text-[#001858] font-black mt-2">
                  +{mission.rewardSunlight} 온기 획득 예정 ✨
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full max-w-xs bg-white h-3 rounded-full mt-5 overflow-hidden border-2 border-[#001858]">
                <div 
                  className="h-full bg-[#F582AE] border-r-2 border-[#001858] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step-by-Step Gentle Prompts */}
            {mission.actionGuide && mission.actionGuide.length > 0 && (
              <div className="bg-white rounded-[24px] p-4 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858] mb-6">
                <div className="text-xs font-black text-[#001858] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#001858]" />
                  <span>마음이 편해지는 실천 팁</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#001858]/90 font-bold">
                  {mission.actionGuide.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#8BD3DD] text-[#001858] border border-[#001858] font-black flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Controller Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                id="timer-reset-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  setTimeLeft(initialSeconds);
                  setIsRunning(false);
                }}
                className="p-3 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
                title="처음부터 다시"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 시작</span>
              </button>

              <button
                id="timer-toggle-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  setIsRunning(!isRunning);
                }}
                className="px-6 py-3 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white font-black text-sm flex items-center gap-2 border-2 border-[#001858] shadow-[4px_4px_0px_0px_#F582AE] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 stroke-[3]" />
                    <span>잠시 멈춤</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 stroke-[3] fill-white" />
                    <span>계속하기</span>
                  </>
                )}
              </button>

              <button
                id="instant-complete-btn"
                onClick={handleMissionDone}
                className="p-3 rounded-2xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 border-2 border-[#001858] text-[#001858] font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
                title="이미 행동을 완료하셨다면 바로 성공으로 인정해요!"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>바로 완료</span>
              </button>
            </div>

            {/* Courage Quote Banner */}
            <div className="bg-[#FEF6E4] rounded-2xl p-3 border-2 border-[#001858] text-xs text-[#001858] mt-4 flex items-start gap-2 text-left shadow-[2px_2px_0px_0px_#001858]">
              <span className="text-base shrink-0">📖</span>
              <div>
                <p className="font-black leading-snug">"{courageQuote.text}"</p>
                <span className="text-[10px] text-[#001858]/70 font-bold block mt-0.5">— {courageQuote.author}</span>
              </div>
            </div>

            <p className="text-center text-[11px] text-[#001858]/80 font-bold mt-3">
              ✨ 완벽하게 하지 않아도 괜찮아요. 시도하려 했던 마음 자체가 큰 한 걸음입니다.
            </p>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-[#F582AE] border-3 border-[#001858] text-[#001858] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#001858]">
              <Sun className="w-8 h-8 fill-[#001858]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#8BD3DD] text-[#001858] border-2 border-[#001858] text-xs font-black mb-2 shadow-[2px_2px_0px_0px_#001858]">
              미션 완수! 훌륭해요 👏
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-[#001858] mb-2">
              따뜻한 한 걸음을 내딛으셨어요!
            </h3>

            <p className="text-sm text-[#001858]/80 font-bold max-w-sm mx-auto mb-5 leading-relaxed">
              "{mission.title}"을(를) 성공적으로 해냈습니다. 오늘의 햇살 온기{' '}
              <strong className="text-[#001858] font-black">+{mission.rewardSunlight}점</strong>이 당신의 마음에 채워졌습니다.
            </p>

            <div className="bg-white rounded-[24px] p-4 border-3 border-[#001858] text-xs text-[#001858] font-bold mb-6 flex items-center gap-2 text-left shadow-[4px_4px_0px_0px_#001858]">
              <HeartHandshake className="w-6 h-6 stroke-[2.5] shrink-0" />
              <span>
                오늘의 작은 승리를 기억해 주세요. 세상은 언제나 당신의 발걸음을 따뜻하게 기다립니다.
              </span>
            </div>

            <button
              id="claim-sunlight-btn"
              onClick={handleFinalClaim}
              className="w-full py-3.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white font-black text-base border-2 border-[#001858] shadow-[4px_4px_0px_0px_#F582AE] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              햇살 온기 받고 정원에 심기 🌻
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
