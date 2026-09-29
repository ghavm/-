import React, { useState } from 'react';
import { 
  Sun, Droplets, Smile, Music, Heart, Trash2, DoorOpen, Mail, Footprints, 
  Compass, Coffee, Camera, TreePine, MessageSquareHeart, BookOpen, ShieldCheck, 
  CheckCircle2, Play, Plus, Sparkles, Filter, Check, ShoppingBag, Bus, HeartHandshake, Zap
} from 'lucide-react';
import { Mission, MissionLevel } from '../types';
import { LEVEL_INFO } from '../data/initialData';
import { soundFx } from '../utils/audio';

interface MicroMissionsViewProps {
  missions: Mission[];
  onStartMission: (mission: Mission) => void;
  onToggleComplete: (missionId: string) => void;
  onAddCustomMission: (newMission: Omit<Mission, 'id' | 'completed'>) => void;
}

// Icon mapper for dynamic mission icons
const renderMissionIcon = (iconName: string, completed: boolean) => {
  const className = `w-5 h-5 ${completed ? 'text-[#001858]' : 'text-[#001858]'}`;
  switch (iconName) {
    case 'Sun': return <Sun className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Music': return <Music className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Trash2': return <Trash2 className={className} />;
    case 'DoorOpen': return <DoorOpen className={className} />;
    case 'Mail': return <Mail className={className} />;
    case 'Footprints': return <Footprints className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Camera': return <Camera className={className} />;
    case 'TreePine': return <TreePine className={className} />;
    case 'MessageSquareHeart': return <MessageSquareHeart className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Bus': return <Bus className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const MicroMissionsView: React.FC<MicroMissionsViewProps> = ({
  missions,
  onStartMission,
  onToggleComplete,
  onAddCustomMission
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');
  const [selectedEnergyFilter, setSelectedEnergyFilter] = useState<'all' | 'low' | 'mid' | 'high' | 'challenge'>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customLevel, setCustomLevel] = useState<MissionLevel>(1);
  const [customDuration, setCustomDuration] = useState<number>(60);
  const [isSuggestingAI, setIsSuggestingAI] = useState<boolean>(false);

  // Filtered missions list
  const filteredMissions = missions.filter(m => {
    if (selectedLevelFilter !== 'all' && m.level !== selectedLevelFilter) return false;
    if (selectedEnergyFilter === 'low' && m.level !== 1) return false;
    if (selectedEnergyFilter === 'mid' && m.level !== 2) return false;
    if (selectedEnergyFilter === 'high' && (m.level !== 3 && m.level !== 4)) return false;
    if (selectedEnergyFilter === 'challenge' && (m.level !== 5 && m.level !== 6)) return false;
    return true;
  });

  const completedCount = missions.filter(m => m.completed).length;

  const handleAISuggest = async () => {
    soundFx.playSoftTap();
    setIsSuggestingAI(true);
    try {
      const res = await fetch('/api/missions/custom-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energyLevel: customLevel === 1 ? 15 : customLevel === 2 ? 35 : 60,
          preference: customLevel === 1 ? '방 안에서 1분 이내' : customLevel === 2 ? '현관문과 문턱' : '동네와 바깥'
        })
      });
      const data = await res.json();
      if (data.mission) {
        setCustomTitle(data.mission.title || '');
        setCustomDesc(data.mission.description || '');
        setCustomDuration(data.mission.durationSeconds || 60);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggestingAI(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    soundFx.playSoftTap();
    onAddCustomMission({
      level: customLevel,
      title: customTitle.trim(),
      description: customDesc.trim() || '나만의 소중한 한 걸음 미션',
      category: customLevel === 1 ? 'room' : customLevel === 2 ? 'threshold' : customLevel === 3 ? 'neighborhood' : 'social',
      durationSeconds: customDuration,
      iconName: 'Sparkles',
      difficulty: customLevel === 1 ? '초초간단' : customLevel === 2 ? '초간단' : customLevel === 3 ? '가벼움' : customLevel === 4 ? '용기내기' : customLevel === 5 ? '도전하기' : '폭풍돌파',
      rewardSunlight: customLevel * 12,
      isCustom: true,
      actionGuide: [
        '무리하지 말고 편안한 호흡으로 준비합니다.',
        '스스로를 격려하며 천천히 행동해봅니다.'
      ]
    });

    setCustomTitle('');
    setCustomDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[36px] border-4 border-[#001858] shadow-[8px_8px_0px_0px_#001858]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-[#001858] uppercase tracking-tight">
              오늘의 부담 없는 마이크로 행동
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#8BD3DD] text-[#001858] border-2 border-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858]">
              {completedCount}/{missions.length} 완수 ✨
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#001858]/80 font-bold mt-1">
            "창문 열기", "물 마시기", "쓰레기 버리기" 처럼 심리적 저항감이 전혀 없는 0.1보부터 시작하세요.
          </p>
        </div>

        {/* Action Button: Create Custom Mission */}
        <div className="flex items-center gap-2">
          <button
            id="open-custom-mission-modal"
            onClick={() => {
              soundFx.playSoftTap();
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F582AE] hover:bg-[#F582AE]/80 text-[#001858] text-xs font-black border-2 border-[#001858] shadow-[4px_4px_0px_0px_#001858] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>나만의 미션 추가</span>
          </button>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter('all'); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 'all'
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          전체 보기 ({missions.length})
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(1); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 1
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>🛏️ Lv.1 방 안의 온기</span>
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(2); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 2
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>🚪 Lv.2 문턱과 현관</span>
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(3); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 3
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>🌳 Lv.3 동네 탐험</span>
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(4); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 4
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>🤝 Lv.4 사회와 연결</span>
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(5); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 5
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>🛒 Lv.5 생활 반경 확장</span>
        </button>

        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedLevelFilter(6); }}
          className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#001858] flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
            selectedLevelFilter === 6
              ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
              : 'bg-white text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
          }`}
        >
          <span>⚡ Lv.6 폭풍 실전 서바이벌</span>
        </button>
      </div>

      {/* Energy Quick Filters */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="text-[#001858] font-black flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> 에너지 레벨:
        </span>
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedEnergyFilter('all'); }}
          className={`px-3 py-1 rounded-full font-bold border-2 border-[#001858] transition-all whitespace-nowrap ${
            selectedEnergyFilter === 'all' ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]' : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
          }`}
        >
          상관없음
        </button>
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedEnergyFilter('low'); }}
          className={`px-3 py-1 rounded-full font-bold border-2 border-[#001858] transition-all whitespace-nowrap ${
            selectedEnergyFilter === 'low' ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]' : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
          }`}
        >
          🔋 10% (방 안 초간단)
        </button>
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedEnergyFilter('mid'); }}
          className={`px-3 py-1 rounded-full font-bold border-2 border-[#001858] transition-all whitespace-nowrap ${
            selectedEnergyFilter === 'mid' ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]' : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
          }`}
        >
          🚪 30% (현관/문턱)
        </button>
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedEnergyFilter('high'); }}
          className={`px-3 py-1 rounded-full font-bold border-2 border-[#001858] transition-all whitespace-nowrap ${
            selectedEnergyFilter === 'high' ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]' : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
          }`}
        >
          🚶 50% (동네/사회)
        </button>
        <button
          onClick={() => { soundFx.playSoftTap(); setSelectedEnergyFilter('challenge'); }}
          className={`px-3 py-1 rounded-full font-bold border-2 border-[#001858] transition-all whitespace-nowrap ${
            selectedEnergyFilter === 'challenge' ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]' : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
          }`}
        >
          🔥 80%+ (생활확장 & 폭풍돌파)
        </button>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.completed;
          const levelData = LEVEL_INFO[mission.level];

          return (
            <div
              key={mission.id}
              id={`mission-card-${mission.id}`}
              className={`relative rounded-[28px] p-4 sm:p-5 border-3 border-[#001858] transition-all duration-200 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-[#8BD3DD]/40 text-[#001858] shadow-[4px_4px_0px_0px_#001858]'
                  : 'bg-white hover:bg-[#FEF6E4] shadow-[6px_6px_0px_0px_#001858] hover:translate-y-[-2px]'
              }`}
            >
              {/* Card Header Info */}
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-yellow-300 border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center text-[#001858] shrink-0 mt-0.5">
                      {renderMissionIcon(mission.iconName, isCompleted)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[#8BD3DD] text-[#001858] border border-[#001858] whitespace-nowrap shrink-0">
                          Lv.{mission.level} {levelData ? levelData.name.split(' ')[0] : ''}
                        </span>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border border-[#001858] whitespace-nowrap shrink-0 ${
                          mission.difficulty === '폭풍돌파' ? 'bg-[#F582AE] text-[#001858]' :
                          mission.difficulty === '도전하기' ? 'bg-[#FFD166] text-[#001858]' :
                          'bg-[#F3D2C1] text-[#001858]'
                        }`}>
                          {mission.difficulty}
                        </span>
                        {mission.isCustom && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#F582AE] text-[#001858] border border-[#001858] whitespace-nowrap shrink-0">
                            나만의 미션
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm sm:text-base font-black mt-1 tracking-tight break-keep leading-snug ${
                        isCompleted ? 'line-through text-[#001858]/60' : 'text-[#001858]'
                      }`}>
                        {mission.title}
                      </h3>
                    </div>
                  </div>

                  {/* Sunlight Reward Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F582AE] text-[#001858] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black shrink-0">
                    <Sun className="w-3.5 h-3.5 fill-[#001858] text-[#001858]" />
                    <span>+{mission.rewardSunlight}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#001858]/80 font-bold mb-4 leading-relaxed break-keep pl-1">
                  {mission.description}
                </p>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-[#001858]/20 mt-2 gap-2 flex-wrap sm:flex-nowrap">
                <div className="text-[11px] text-[#001858] font-black whitespace-nowrap">
                  ⏱️ 약 {mission.durationSeconds ? `${Math.round(mission.durationSeconds / 60) || 1}분` : '1분'}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Start Interactive Guide Button */}
                  {!isCompleted ? (
                    <button
                      id={`start-mission-btn-${mission.id}`}
                      onClick={() => {
                        soundFx.playSoftTap();
                        onStartMission(mission);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[3px_3px_0px_0px_#F582AE] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>가이드 시작</span>
                    </button>
                  ) : (
                    <span className="text-xs font-black text-[#001858] flex items-center gap-1 px-2.5 py-1 bg-white rounded-full border border-[#001858] whitespace-nowrap">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 완수됨
                    </span>
                  )}

                  {/* Toggle Complete Checkbox */}
                  <button
                    id={`toggle-complete-btn-${mission.id}`}
                    onClick={() => {
                      soundFx.playSoftTap();
                      onToggleComplete(mission.id);
                    }}
                    className={`p-1.5 rounded-2xl border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-300 text-[#001858]'
                        : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
                    }`}
                    title={isCompleted ? '완료 취소' : '체크하여 완료'}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border-3 border-[#001858] shadow-[6px_6px_0px_0px_#001858]">
          <p className="text-sm font-bold text-[#001858] mb-2">선택한 조건에 해당하는 미션이 없습니다.</p>
          <button
            onClick={() => { setSelectedLevelFilter('all'); setSelectedEnergyFilter('all'); }}
            className="text-xs font-black text-[#001858] underline decoration-2"
          >
            필터 초기화하기
          </button>
        </div>
      )}

      {/* Custom Mission Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#FEF6E4] rounded-[36px] border-4 border-[#001858] shadow-[12px_12px_0px_0px_#001858] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F582AE] border-2 border-[#001858] text-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858]">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#001858]">나만의 마이크로 미션 만들기</h3>
                  <p className="text-xs text-[#001858]/80 font-bold">스스로에게 알맞은 작은 행동을 정해보세요</p>
                </div>
              </div>

              {/* AI Auto Suggest Button */}
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={isSuggestingAI}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] transition-all disabled:opacity-50"
                title="AI가 부담 없는 미션을 대신 작성해줍니다"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#001858] ${isSuggestingAI ? 'animate-spin' : ''}`} />
                <span>{isSuggestingAI ? '생각 중...' : 'AI 추천'}</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#001858] mb-1">
                  미션 제목 <span className="text-[#F582AE]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 창문 틈으로 하늘 쳐다보기, 물 한 잔 마시기"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] text-sm font-bold shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden focus:shadow-[4px_4px_0px_0px_#001858]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#001858] mb-1">
                  다정한 설명
                </label>
                <input
                  type="text"
                  placeholder="예: 천천히 숨을 쉬며 기분을 정리해봅니다"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] text-sm font-bold shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden focus:shadow-[4px_4px_0px_0px_#001858]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#001858] mb-1">단계 선택</label>
                  <select
                    value={customLevel}
                    onChange={(e) => setCustomLevel(Number(e.target.value) as MissionLevel)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden"
                  >
                    <option value={1}>Lv.1 방 안 (초초간단)</option>
                    <option value={2}>Lv.2 문턱 & 현관 (초간단)</option>
                    <option value={3}>Lv.3 동네 탐험 (가벼움)</option>
                    <option value={4}>Lv.4 사회 연결 (용기내기)</option>
                    <option value={5}>Lv.5 생활 반경 확장 (도전하기)</option>
                    <option value={6}>Lv.6 폭풍 실전 서바이벌 (폭풍돌파)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#001858] mb-1">소요 시간</label>
                  <select
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden"
                  >
                    <option value={30}>30초</option>
                    <option value={60}>1분</option>
                    <option value={120}>2분</option>
                    <option value={180}>3분</option>
                    <option value={300}>5분</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-[#001858]/20">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-2xl text-xs font-black text-[#001858] bg-white border-2 border-[#001858] hover:bg-[#FEF6E4]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[3px_3px_0px_0px_#F582AE] transition-all"
                >
                  미션 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
