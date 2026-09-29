import React from 'react';
import { Sun, Sparkles, Sprout, Flower2, Heart, Award, Shield, CheckCircle2 } from 'lucide-react';
import { LEVEL_INFO } from '../data/initialData';
import { MissionLevel } from '../types';
import { soundFx } from '../utils/audio';

interface GardenProgressProps {
  totalSunlight: number;
  currentLevel: MissionLevel;
  completedMissionsCount: number;
  totalMissionsCount: number;
  history: { date: string; count: number }[];
}

export const GardenProgress: React.FC<GardenProgressProps> = ({
  totalSunlight,
  currentLevel,
  completedMissionsCount,
  totalMissionsCount,
  history
}) => {
  // Garden growth stage calculation
  const getGrowthStage = () => {
    if (totalSunlight === 0) return { stage: 0, name: '0에서 시작하는 첫 새싹', emoji: '🌱', desc: '아직 미션을 하지 않아도 괜찮아요. 오늘의 작은 한 걸음으로 온기를 채워보세요.' };
    if (totalSunlight < 40) return { stage: 0, name: '파릇파릇 어린 새싹', emoji: '🌱', desc: '따뜻한 온기를 머금고 조금씩 자라나는 중이에요' };
    if (totalSunlight < 100) return { stage: 1, name: '어린 연두빛 줄기', emoji: '🌿', desc: '햇살을 향해 천천히 잎을 뻗고 있어요' };
    if (totalSunlight < 180) return { stage: 2, name: '단단한 꽃봉오리', emoji: '🪴', desc: '세상으로 향할 채비를 마쳐가고 있어요' };
    if (totalSunlight < 280) return { stage: 3, name: '활짝 핀 희망 해바라기', emoji: '🌻', desc: '당신의 따스함이 활짝 피어나 세상을 비춥니다' };
    if (totalSunlight < 400) return { stage: 4, name: '찬란한 오색 꽃밭', emoji: '🌸', desc: '일상의 모든 순간이 다채롭고 아름다운 결실을 맺고 있어요' };
    return { stage: 5, name: '완전 자립 서바이벌 마스터 나무', emoji: '🌳', desc: '어떤 폭풍이 불어도 흔들리지 않는 든든한 일상의 거목이 되었습니다!' };
  };

  const garden = getGrowthStage();
  const currentLevelData = LEVEL_INFO[currentLevel] || LEVEL_INFO[1];

  // Next level progress
  const nextTarget = currentLevel === 1 ? 40 : currentLevel === 2 ? 100 : currentLevel === 3 ? 180 : currentLevel === 4 ? 280 : currentLevel === 5 ? 400 : 550;
  const prevTarget = currentLevel === 1 ? 0 : currentLevel === 2 ? 40 : currentLevel === 3 ? 100 : currentLevel === 4 ? 180 : currentLevel === 5 ? 280 : 400;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((totalSunlight - prevTarget) / (nextTarget - prevTarget)) * 100)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Garden Visual Canvas Card */}
      <div className="relative overflow-hidden rounded-[36px] bg-[#8BD3DD]/30 p-6 sm:p-8 border-4 border-[#001858] shadow-[8px_8px_0px_0px_#001858]">
        {/* Sun & Cloud visual animation in background */}
        <div className="absolute top-4 right-6 flex items-center gap-1.5">
          <Sun className="w-12 h-12 text-[#001858] fill-[#F582AE] opacity-80" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#001858] text-[#001858] text-xs font-black mb-3 shadow-[2px_2px_0px_0px_#001858]">
            <Sparkles className="w-3.5 h-3.5 text-[#001858]" />
            <span>나의 햇살 치유 정원</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#001858] tracking-tight">
            {garden.name}
          </h2>
          <p className="text-sm text-[#001858]/80 font-bold mt-1 leading-relaxed">
            {garden.desc}
          </p>

          {/* Big Plant / Flower Avatar Display */}
          <div className="my-6 py-5 flex flex-col items-center justify-center bg-white rounded-[32px] border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="text-6xl sm:text-7xl animate-bounce-gentle">
              {garden.emoji}
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-black text-[#001858] bg-[#F582AE] px-3.5 py-1 rounded-full border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858]">
                누적 햇살 온기: {totalSunlight}점 ✨
              </span>
            </div>
          </div>

          {/* Level Progression Indicator */}
          <div className="bg-white rounded-3xl p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="flex items-center justify-between text-xs font-black text-[#001858] mb-2">
              <span className="flex items-center gap-1">
                <span>현재: Lv.{currentLevel} {currentLevelData.name}</span>
              </span>
              <span className="text-[#001858] font-black">{totalSunlight} / {nextTarget} 온기</span>
            </div>

            <div className="w-full bg-[#FEF6E4] h-3.5 rounded-full overflow-hidden border-2 border-[#001858]">
              <div 
                className="h-full bg-[#F582AE] border-r-2 border-[#001858] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-[#001858]/80 font-bold mt-2">
              💡 {nextTarget - totalSunlight > 0 ? `다음 단계(Lv.${Math.min(6, currentLevel + 1)})까지 ${nextTarget - totalSunlight} 온기가 남았어요.` : '최고 단계(Lv.6 폭풍 실전 서바이벌)에 도달하셨어요! 당신의 여정은 환하게 빛납니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* No-Guilt Safe Philosophy Banner */}
      <div className="bg-[#F3D2C1]/90 rounded-[32px] p-5 sm:p-6 border-3 border-[#001858] shadow-[6px_6px_0px_0px_#001858] flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#001858]">
          <Shield className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h4 className="text-sm font-black text-[#001858] mb-1 break-keep">
            폭풍을 부르는! 방구석 탈출의 안전한 쉼 원칙
          </h4>
          <p className="text-xs text-[#001858]/80 font-bold leading-relaxed break-keep">
            스트릭(연속 달성일)이 끊기더라도 아무런 불이익이 없습니다. 며칠을 쉬어가더라도 당신이 모은 햇살 온기는 사라지지 않습니다. 
            쉬는 날은 마음에 뿌리를 내리는 소중한 회복의 시간입니다.
          </p>
        </div>
      </div>

      {/* 6-Tier Journey Roadmap Cards */}
      <div>
        <h3 className="text-base font-black text-[#001858] mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#001858]" />
          <span>폭풍 탈출 6단계 로드맵</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((lvl) => {
            const info = LEVEL_INFO[lvl as MissionLevel];
            const isCurrent = currentLevel === lvl;
            const isUnlocked = currentLevel >= lvl;

            return (
              <div
                key={lvl}
                className={`rounded-[24px] p-4 border-3 border-[#001858] transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#F582AE]/30 shadow-[6px_6px_0px_0px_#001858] ring-2 ring-[#001858]'
                    : isUnlocked
                    ? 'bg-white shadow-[4px_4px_0px_0px_#001858]'
                    : 'bg-white/50 opacity-60 shadow-none'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#8BD3DD] text-[#001858] border border-[#001858] flex items-center gap-1">
                      <span>{info.badge || '✨'}</span>
                      <span>Step {lvl}</span>
                    </span>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-[#001858] stroke-[2.5]" />}
                  </div>
                  <h4 className="text-sm font-black text-[#001858] mb-1 break-keep">{info.name}</h4>
                  <p className="text-[11px] text-[#001858]/80 font-bold leading-relaxed mb-3 break-keep">{info.desc}</p>
                </div>
                <div>
                  <div className="text-[10px] font-black text-[#001858] bg-[#FEF6E4] px-2 py-0.5 rounded-md border border-[#001858] inline-block">
                    기준: {info.targetMinSunlight}점 이상
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
