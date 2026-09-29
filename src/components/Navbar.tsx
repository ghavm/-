import React, { useState, useRef, useEffect } from 'react';
import { Sun, Volume2, VolumeX, ShieldAlert, BookHeart, Sparkles, Settings, X, BookOpen } from 'lucide-react';
import { soundFx, AmbientTrack } from '../utils/audio';
import { LEVEL_INFO } from '../data/initialData';
import { MissionLevel, ViewMode } from '../types';

const SOUND_TRACKS: { id: AmbientTrack; label: string; desc: string; icon: string }[] = [
  { id: 'warmth', label: '따뜻한 햇살', desc: '아날로그 웜 패드 & 골든 드롭', icon: '☀️' },
  { id: 'waves', label: '잔잔한 푸른 파도', desc: '마음을 비우는 파도 숨결', icon: '🌊' },
  { id: 'campfire', label: '타닥타닥 모닥불', desc: '포근한 장작 타는 소리', icon: '🔥' },
  { id: 'bowl', label: '마음 정화 싱잉볼', desc: '136.1Hz 옴(Om) 명상 진동', icon: '🧘' },
  { id: 'forest', label: '피톤치드 숲속', desc: '상쾌한 숲바람 & 맑은 새소리', icon: '🌲' },
  { id: 'rain', label: '포근한 빗소리', desc: '차분하게 감싸는 자연의 비', icon: '🌧️' },
  { id: 'chimes', label: '맑은 바람종 차임', desc: '은은하게 울리는 풍경 소리', icon: '🎐' },
];

interface NavbarProps {
  currentLevel: MissionLevel;
  totalSunlight: number;
  onOpenSupport: () => void;
  onOpenJournal: () => void;
  onOpenQuoteBook?: () => void;
  onOpenEmpathyChat: () => void;
  onOpenSettings: () => void;
  onGoToStart?: () => void;
  viewMode: ViewMode;
  activeTab: 'missions' | 'garden' | 'empathy';
  setActiveTab: (tab: 'missions' | 'garden' | 'empathy') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  totalSunlight,
  onOpenSupport,
  onOpenJournal,
  onOpenQuoteBook,
  onOpenEmpathyChat,
  onOpenSettings,
  onGoToStart,
  viewMode,
  activeTab,
  setActiveTab
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(soundFx.isAmbientPlaying);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack>('warmth');
  const [volumePercent, setVolumePercent] = useState<number>(Math.round(soundFx.volume * 100));
  const soundMenuRef = useRef<HTMLDivElement>(null);

  // Close sound menu on click outside so it never intercepts clicks intended for settings or other buttons
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (soundMenuRef.current && !soundMenuRef.current.contains(event.target as Node)) {
        setSoundMenuOpen(false);
      }
    };
    if (soundMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [soundMenuOpen]);

  const toggleSound = (type?: AmbientTrack) => {
    soundFx.playSoftTap();
    const trackToToggle = type || currentTrack;
    const playing = soundFx.toggleAmbientSoundscape(trackToToggle);
    setIsPlayingSound(playing);
    if (type) {
      setCurrentTrack(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolumePercent(newVol);
    soundFx.setVolume(newVol / 100);
  };

  const levelInfo = LEVEL_INFO[currentLevel];

  return (
    <header className="sticky top-0 z-40 bg-[#FEF6E4] border-b-3 sm:border-b-4 border-[#001858] transition-all duration-300">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div 
              id="app-logo"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#F582AE] border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] sm:shadow-[3px_3px_0px_0px_#001858] flex items-center justify-center text-white font-bold cursor-pointer transition-transform hover:scale-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0"
              onClick={() => {
                soundFx.playSoftTap();
                if (onGoToStart) onGoToStart();
                else setActiveTab('missions');
              }}
              title="시작 화면으로 이동"
            >
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow text-[#001858]" />
            </div>
            <div 
              className="cursor-pointer min-w-0"
              onClick={() => {
                soundFx.playSoftTap();
                if (onGoToStart) onGoToStart();
                else setActiveTab('missions');
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-lg md:text-xl text-[#001858] tracking-tight truncate">
                  폭풍을 부르는! 방구석 탈출
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#FFD166] text-[#001858] border border-[#001858] hidden sm:inline-block shrink-0">
                  A급 서바이벌 💥
                </span>
              </div>
              <p className="text-[11px] text-[#001858]/80 font-bold hidden sm:block truncate">
                ~ A급 인생 서바이벌 ~ 실패율 0% 침대 탈출 프로젝트
              </p>
            </div>
          </div>

          {/* Right Action Icons & Status */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Sunlight Points Badge */}
            <div 
              id="sunlight-badge"
              className="flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#8BD3DD] border-2 border-[#001858] text-[#001858] shadow-[2px_2px_0px_0px_#001858] cursor-pointer hover:bg-[#8BD3DD]/80 transition-all font-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none h-8 sm:h-10 shrink-0"
              onClick={() => {
                soundFx.playSoftTap();
                setActiveTab('garden');
              }}
              title="누적된 햇살 온기"
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#001858] fill-yellow-300 shrink-0" />
              <span className="text-xs sm:text-sm font-black">{totalSunlight}</span>
              <span className="text-[10px] font-bold hidden xl:inline">온기</span>
            </div>

            {/* Quick Actions Group: Sound (소리), Journal (일기), Support (안내) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Ambient Soundscape Controller Trigger */}
              <button
                id="ambient-sound-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  setSoundMenuOpen(true);
                }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] flex items-center justify-center transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 cursor-pointer ${
                  isPlayingSound 
                    ? 'bg-[#F582AE] text-[#001858] animate-pulse' 
                    : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
                }`}
                title="힐링 사운드 (배경음악)"
                aria-label="사운드스케이프 제어"
              >
                {isPlayingSound ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
              </button>

              {/* Quick Journal Button (일기) */}
              <button
                id="open-journal-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  onOpenJournal();
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F3D2C1] border-2 border-[#001858] text-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#F3D2C1]/80 flex items-center justify-center transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0"
                title="오늘의 한 줄 일기"
                aria-label="일기 작성"
              >
                <BookHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>

              {/* Quote Book Button (명언 북) */}
              {onOpenQuoteBook && (
                <button
                  id="open-quotebook-btn"
                  onClick={() => {
                    soundFx.playSoftTap();
                    onOpenQuoteBook();
                  }}
                  className="h-8 sm:h-10 px-2 sm:px-2.5 rounded-xl sm:rounded-2xl bg-[#FFD166] border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] hover:bg-[#FFD166]/80 flex items-center gap-1 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 cursor-pointer"
                  title="용기 충전 명언 북 (25편)"
                  aria-label="명언 북 열기"
                >
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">명언</span>
                </button>
              )}

              {/* Support Network Directory Modal Trigger (안내) */}
              <button
                id="open-support-btn"
                onClick={() => {
                  soundFx.playSoftTap();
                  onOpenSupport();
                }}
                className="h-8 sm:h-10 px-2 sm:px-2.5 rounded-xl sm:rounded-2xl bg-[#F582AE] border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] hover:bg-[#F582AE]/80 flex items-center gap-1 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0"
                title="고립·은둔 전문 지원 센터 안내"
                aria-label="지원 센터 안내"
              >
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">안내</span>
              </button>
            </div>

            {/* Clear Visual Divider between utilities and Settings */}
            <div className="h-6 w-[2px] bg-[#001858]/30 mx-0.5 sm:mx-1 shrink-0" />

            {/* Settings Button (오른쪽 위 설정 버튼 - 넓은 터치 영역 & 선명한 노란색 강조) */}
            <button
              id="open-settings-btn"
              onClick={() => {
                soundFx.playSoftTap();
                onOpenSettings();
              }}
              className="h-8 sm:h-10 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-[#FFD166] hover:bg-[#FFD166]/85 border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] flex items-center gap-1 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 cursor-pointer"
              title="환경 설정 열기"
              aria-label="환경 설정 열기"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] text-[#001858]" />
              <span className="font-black text-xs">설정</span>
            </button>
          </div>
        </div>

        {/* Healing Soundscape Modal (절대 짤리지 않는 완벽한 반응형 모달 다이얼로그) */}
        {soundMenuOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSoundMenuOpen(false);
              }
            }}
          >
            <div 
              ref={soundMenuRef}
              className="relative w-full max-w-sm sm:max-w-md bg-[#FEF6E4] rounded-[28px] sm:rounded-[36px] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[10px_10px_0px_0px_#001858] p-4 sm:p-6 max-h-[88vh] overflow-y-auto animate-in zoom-in-95"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#001858]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#8BD3DD] border-2 border-[#001858] flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_#001858]">
                    🌿
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#001858] leading-none">
                      힐링 사운드스케이프
                    </h3>
                    <p className="text-[11px] text-[#001858]/70 font-bold mt-1">
                      마음을 차분하게 해주는 7가지 자연 & 명상 사운드
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playSoftTap();
                    setSoundMenuOpen(false);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                  aria-label="사운드 창 닫기"
                  title="닫기"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Tracks List */}
              <div className="space-y-2">
                {SOUND_TRACKS.map((track) => {
                  const isCurrent = isPlayingSound && currentTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => toggleSound(track.id)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                        isCurrent
                          ? 'bg-[#8BD3DD] text-[#001858] border-[#001858] font-black shadow-[3px_3px_0px_0px_#001858]'
                          : 'bg-white hover:bg-[#FEF6E4] text-[#001858] border-[#001858]/30 shadow-[1px_1px_0px_0px_#001858]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl sm:text-2xl shrink-0">{track.icon}</span>
                        <div className="min-w-0">
                          <div className="font-black text-xs sm:text-sm truncate text-[#001858] flex items-center gap-1.5">
                            <span>{track.label}</span>
                            {track.id === 'campfire' && (
                              <span className="text-[9px] bg-[#FFD166] text-[#001858] px-1.5 py-0.5 rounded-full border border-[#001858] font-black">
                                리얼 참나무
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#001858]/70 font-semibold truncate mt-0.5">
                            {track.desc}
                          </div>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-[10px] sm:text-xs bg-[#001858] text-white px-2 py-0.5 rounded-lg shrink-0 ml-2 font-black flex items-center gap-1">
                          <Volume2 className="w-3 h-3 animate-pulse" />
                          <span>재생 중</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#001858]/50 font-bold shrink-0 ml-1">
                          듣기
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider Section */}
              <div className="mt-3.5 pt-3 border-t-2 border-[#001858]/20 px-1">
                <div className="flex items-center justify-between text-xs font-black text-[#001858] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    <span>배경 사운드 볼륨</span>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border-2 border-[#001858] shadow-[1px_1px_0px_0px_#001858] font-black text-xs">
                    {volumePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={volumePercent}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full accent-[#001858] h-2.5 bg-white rounded-lg cursor-pointer border-2 border-[#001858]"
                  title="볼륨 조절"
                />
                <div className="flex items-center justify-between gap-1.5 mt-2">
                  {[50, 75, 90, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleVolumeChange(preset)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                        volumePercent === preset
                          ? 'bg-[#001858] text-white border-[#001858] shadow-[1px_1px_0px_0px_#001858]'
                          : 'bg-white text-[#001858] border-[#001858]/30 hover:bg-[#FEF6E4]'
                      }`}
                    >
                      {preset}%{preset === 100 ? ' (최대)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-2 flex items-center gap-2">
                {isPlayingSound ? (
                  <button
                    onClick={() => { 
                      soundFx.stopAmbient(); 
                      setIsPlayingSound(false); 
                    }}
                    className="flex-1 text-center py-2.5 rounded-2xl text-xs sm:text-sm text-[#001858] bg-[#F582AE] hover:bg-[#F582AE]/80 font-black border-2 border-[#001858] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                  >
                    사운드 끄기 🔇
                  </button>
                ) : (
                  <div className="flex-1 text-center text-xs text-[#001858]/70 font-bold py-1">
                    사운드를 선택하면 바로 재생됩니다
                  </div>
                )}
                <button
                  onClick={() => {
                    soundFx.playSoftTap();
                    setSoundMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-[#001858] bg-white hover:bg-[#FEF6E4] font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar: 3 tabs grid on mobile, flex on desktop */}
        <nav className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2.5 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t-2 border-[#001858]/20">
          <button
            id="tab-missions"
            onClick={() => { soundFx.playSoftTap(); setActiveTab('missions'); }}
            className={`py-2 px-1 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[#001858] ${
              activeTab === 'missions'
                ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE] sm:shadow-[3px_3px_0px_0px_#F582AE]'
                : 'bg-white text-[#001858] shadow-[1px_1px_0px_0px_#001858] sm:shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
            }`}
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-yellow-300 text-[#001858]" />
            <span className="truncate">미션</span>
          </button>

          <button
            id="tab-empathy"
            onClick={() => { soundFx.playSoftTap(); setActiveTab('empathy'); }}
            className={`py-2 px-1 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[#001858] ${
              activeTab === 'empathy'
                ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE] sm:shadow-[3px_3px_0px_0px_#F582AE]'
                : 'bg-white text-[#001858] shadow-[1px_1px_0px_0px_#001858] sm:shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#F582AE]" />
            <span className="truncate">공감AI</span>
          </button>

          <button
            id="tab-garden"
            onClick={() => { soundFx.playSoftTap(); setActiveTab('garden'); }}
            className={`py-2 px-1 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[#001858] ${
              activeTab === 'garden'
                ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE] sm:shadow-[3px_3px_0px_0px_#F582AE]'
                : 'bg-white text-[#001858] shadow-[1px_1px_0px_0px_#001858] sm:shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
            }`}
          >
            <span className="text-xs sm:text-sm shrink-0">🌱</span>
            <span className="truncate">정원</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

