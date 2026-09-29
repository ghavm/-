import React from 'react';
import { Play, Sparkles, Sun, ShieldCheck, Heart, Footprints, MessageCircleHeart, Award, Flame, ShieldAlert, Settings, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { MissionLevel, ViewMode } from '../types';
import { LEVEL_INFO } from '../data/initialData';

interface MainLandingPageProps {
  currentLevel: MissionLevel;
  totalSunlight: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  viewMode: ViewMode;
  onStart: (targetTab?: 'missions' | 'garden' | 'empathy') => void;
  onOpenSupport?: () => void;
  onOpenSettings?: () => void;
  onOpenQuoteBook?: () => void;
}

export const MainLandingPage: React.FC<MainLandingPageProps> = ({
  currentLevel,
  totalSunlight,
  completedMissionsCount,
  totalMissionsCount,
  viewMode,
  onStart,
  onOpenSupport,
  onOpenSettings,
  onOpenQuoteBook,
}) => {
  const levelInfo = LEVEL_INFO[currentLevel];

  const handleStartGame = (targetTab: 'missions' | 'garden' | 'empathy' = 'missions') => {
    soundFx.playGameStart();
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#F582AE', '#8BD3DD', '#FFD166', '#001858', '#06D6A0']
      });
    } catch {
      // Confetti fallback
    }
    setTimeout(() => {
      onStart(targetTab);
    }, 280);
  };

  return (
    <div className={`w-full mx-auto py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-center ${
      viewMode === 'mobile' ? 'max-w-md' : 'max-w-4xl'
    }`}>
      {/* Top Quick Utility Row for Start Screen */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black text-[#001858]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>시작 화면</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQuoteBook && (
            <button
              onClick={() => {
                soundFx.playSoftTap();
                onOpenQuoteBook();
              }}
              className="px-3 py-1 rounded-xl bg-white hover:bg-[#FFD166]/40 border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black text-[#001858] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              title="용기 충전 명언 북 열기"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#001858]" />
              <span>명언 북 📖</span>
            </button>
          )}
          {onOpenSupport && (
            <button
              onClick={() => {
                soundFx.playSoftTap();
                onOpenSupport();
              }}
              className="px-3 py-1 rounded-xl bg-white hover:bg-[#F582AE]/30 border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black text-[#001858] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
              title="위기 상담 및 도움 창구"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">안심 지원</span>
            </button>
          )}
          {onOpenSettings && (
            <button
              onClick={() => {
                soundFx.playSoftTap();
                onOpenSettings();
              }}
              className="p-1.5 rounded-xl bg-white hover:bg-[#8BD3DD]/40 border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black text-[#001858] active:translate-x-[1px] active:translate-y-[1px]"
              title="설정"
              aria-label="설정"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Dramatic Retro-Comic Main Title Banner */}
      <div className="w-full text-center space-y-4 mb-8 sm:mb-12">
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD166] border-2 border-[#001858] shadow-[3px_3px_0px_0px_#001858] text-[#001858] text-xs sm:text-sm font-black transform -rotate-2 hover:rotate-0 transition-transform">
          <Flame className="w-4 h-4 fill-[#F582AE] text-[#001858] animate-bounce" />
          <span>본격 A급 힐링 & 인생 퀘스트 프로젝트</span>
          <span className="bg-[#001858] text-white px-2 py-0.5 rounded-full text-[10px] font-black">START</span>
        </div>

        {/* Explosive Hero Title */}
        <div className="relative py-2">
          {/* Angled Sub-burst */}
          <div className="inline-block transform -rotate-3 bg-[#F582AE] text-white px-4 py-1.5 rounded-2xl border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858] mb-2 sm:mb-3">
            <span className="text-sm sm:text-xl font-black tracking-tight text-[#001858] drop-shadow-xs">
              ⚡ 폭풍을 부르는! ⚡
            </span>
          </div>

          {/* Huge Main Comic Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#001858] tracking-tight leading-tight sm:leading-none select-none">
            <span className="relative inline-block drop-shadow-[4px_4px_0px_#8BD3DD]">
              방구석 탈출 대작전
            </span>
          </h1>

          {/* Subtitle Banner */}
          <div className="mt-3 inline-block bg-[#8BD3DD] text-[#001858] px-5 py-1 rounded-full border-2 sm:border-3 border-[#001858] shadow-[3px_3px_0px_0px_#001858] transform rotate-1">
            <span className="text-xs sm:text-base font-black tracking-widest uppercase">
              ~ A급 인생 서바이벌 ~
            </span>
          </div>
        </div>

        {/* Comic Tagline */}
        <p className="text-sm sm:text-lg font-bold text-[#001858]/90 max-w-xl mx-auto leading-relaxed pt-2">
          &ldquo;침대 밖은 위험하다? 아니, 침대 밖은 조금 눈부실 뿐!&rdquo; <br className="hidden sm:inline" />
          무리한 도전은 사절! 창문 1cm 열기부터 시작하는 실패 확률 0%의 자립 생존 일기
        </p>
      </div>

      {/* 2. Hero Action Card with Big "시작하기" Button */}
      <div className="w-full bg-[#FEF6E4] rounded-[36px] border-4 border-[#001858] shadow-[8px_8px_0px_0px_#001858] p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
        {/* Background decorative sunshine */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#8BD3DD]/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#F582AE]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Current Survival Status Badge */}
          <div className="w-full max-w-md bg-white rounded-2xl border-3 border-[#001858] p-4 shadow-[4px_4px_0px_0px_#001858] flex items-center justify-around text-center">
            <div>
              <div className="text-[11px] font-black text-[#001858]/70">내 생존 계급</div>
              <div className="text-sm sm:text-base font-black text-[#001858] flex items-center justify-center gap-1 mt-0.5">
                <span>{levelInfo.badge}</span>
                <span>Lv.{currentLevel}</span>
              </div>
            </div>
            <div className="w-0.5 h-8 bg-[#001858]/20" />
            <div>
              <div className="text-[11px] font-black text-[#001858]/70">적립된 햇살 온기</div>
              <div className="text-sm sm:text-base font-black text-[#001858] flex items-center justify-center gap-1 mt-0.5">
                <Sun className="w-4 h-4 fill-yellow-400 text-[#001858]" />
                <span>{totalSunlight} P</span>
              </div>
            </div>
            <div className="w-0.5 h-8 bg-[#001858]/20" />
            <div>
              <div className="text-[11px] font-black text-[#001858]/70">완료한 미션</div>
              <div className="text-sm sm:text-base font-black text-[#001858] mt-0.5">
                <span>{completedMissionsCount} / {totalMissionsCount}</span>
              </div>
            </div>
          </div>

          {/* THE BIG "시작하기" BUTTON */}
          <div className="w-full max-w-md space-y-2">
            <button
              id="start-survival-btn"
              onClick={() => handleStartGame('missions')}
              className="w-full py-4 sm:py-5 px-6 rounded-[28px] bg-[#F582AE] hover:bg-[#F582AE]/90 text-[#001858] border-4 border-[#001858] text-xl sm:text-2xl font-black shadow-[6px_6px_0px_0px_#001858] transition-all transform hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#001858] text-[#001858] group-hover:scale-110 transition-transform" />
              <span>방구석 탈출 시작하기!</span>
              <Sparkles className="w-5 h-5 text-[#001858] animate-spin-slow" />
            </button>
            <p className="text-xs text-[#001858]/70 font-bold">
              누구나 부담 없이 클릭 한 번으로 바로 시작할 수 있어요 🚀
            </p>
          </div>

          {/* Sub-shortcuts to specific parts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => handleStartGame('garden')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FEF6E4] border-2 border-[#001858] text-xs font-black text-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              🌱 내 힐링 정원 구경하기
            </button>
            <button
              onClick={() => handleStartGame('empathy')}
              className="px-3.5 py-1.5 rounded-xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 border-2 border-[#001858] text-xs font-black text-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              💬 AI 햇살 지기와 대화하기
            </button>
          </div>
        </div>
      </div>

      {/* 3. Four B-Grade Survival Strategy Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl border-3 border-[#001858] p-5 shadow-[4px_4px_0px_0px_#001858] flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFD166] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center mb-3 text-lg font-black">
              🚪
            </div>
            <h3 className="text-base font-black text-[#001858] mb-1.5">
              1. 실패 0% 마이크로 미션
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold leading-relaxed">
              &ldquo;창문 1cm 열기&rdquo;, &ldquo;물 한 잔 마시기&rdquo;, &ldquo;기지개 켜기&rdquo; 등 1분이면 끝나는 초간단 행동으로 매일 조금씩 문턱을 향해 나아가요.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#001858]/15 text-[11px] font-black text-[#F582AE]">
            #부담제로 #작은성취감
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl border-3 border-[#001858] p-5 shadow-[4px_4px_0px_0px_#001858] flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#8BD3DD] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center mb-3 text-lg font-black">
              🌱
            </div>
            <h3 className="text-base font-black text-[#001858] mb-1.5">
              2. 방구석 온기 정원
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold leading-relaxed">
              미션을 클리어할 때마다 햇살 온기 포인트가 모여요. 작은 씨앗에서 싱그러운 꽃과 나무로 자라나는 나만의 비밀 정원을 확인하세요.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#001858]/15 text-[11px] font-black text-[#06D6A0]">
            #무한성장 #힐링사운드
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl border-3 border-[#001858] p-5 shadow-[4px_4px_0px_0px_#001858] flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#F582AE] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center mb-3 text-lg font-black">
              🤖
            </div>
            <h3 className="text-base font-black text-[#001858] mb-1.5">
              3. 실시간 AI 햇살 지기
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold leading-relaxed">
              비판과 잔소리는 0%! 어떤 외로움과 무기력함도 따뜻하게 품어주는 1초 초고속 AI 친구가 언제나 내 편이 되어 함께 대화해 줍니다.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#001858]/15 text-[11px] font-black text-[#001858]">
            #100%내편 #초고속스트리밍
          </div>
        </div>

        {/* Card 4: Quote Book */}
        <div 
          onClick={() => {
            soundFx.playSoftTap();
            if (onOpenQuoteBook) onOpenQuoteBook();
          }}
          className="bg-white rounded-3xl border-3 border-[#001858] p-5 shadow-[4px_4px_0px_0px_#001858] hover:shadow-[6px_6px_0px_0px_#001858] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFD166] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center mb-3 text-lg font-black group-hover:rotate-6 transition-transform">
              📖
            </div>
            <h3 className="text-base font-black text-[#001858] mb-1.5 flex items-center justify-between">
              <span>4. 용기 충전 명언 북</span>
              <span className="text-[10px] bg-[#FFD166] px-1.5 py-0.5 rounded font-black border border-[#001858]">HOT</span>
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold leading-relaxed">
              시작의 두려움(방 안), 팩트 폭격(문밖), 자책감 치유(위로), 꺾이지 않는 서사(재도전)까지 25가지 명언을 뽑아 읽어보세요.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#001858]/15 text-[11px] font-black text-[#001858] flex items-center justify-between">
            <span>#명언뽑기 #재도전서사</span>
            <span className="text-xs font-black underline">열기 →</span>
          </div>
        </div>
      </div>

      {/* 4. Safe Haven & Emergency Help Banner */}
      <div className="w-full bg-[#8BD3DD]/30 rounded-2xl border-2 border-[#001858] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#001858]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#001858] shrink-0" />
          <span>모든 활동 내역은 기기 안에 안전하게 보관되며 외부로 노출되지 않습니다.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] bg-white px-3 py-1 rounded-full border border-[#001858] shadow-[1px_1px_0px_0px_#001858] shrink-0">
          <Heart className="w-3.5 h-3.5 fill-[#F582AE] text-[#F582AE]" />
          <span>위기상담 전화: 129 / 1577-0199</span>
        </div>
      </div>
    </div>
  );
};
