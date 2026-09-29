import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Sliders, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Eye, 
  ShieldCheck,
  Download 
} from 'lucide-react';
import { ViewMode } from '../types';
import { soundFx } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  fontSize: 'normal' | 'large';
  onSelectFontSize: (size: 'normal' | 'large') => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onResetData: () => void;
  totalSunlight: number;
  completedMissionsCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  viewMode,
  onSelectViewMode,
  fontSize,
  onSelectFontSize,
  soundEnabled,
  onToggleSound,
  onResetData,
  totalSunlight,
  completedMissionsCount
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FEF6E4] rounded-[28px] sm:rounded-[36px] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[12px_12px_0px_0px_#001858] p-4 sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-settings-modal"
          onClick={() => {
            soundFx.playSoftTap();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
          aria-label="닫기"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6 pr-12 sm:pr-14">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#8BD3DD] text-[#001858] border-2 border-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858] sm:shadow-[3px_3px_0px_0px_#001858] shrink-0">
            <Sliders className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#001858] tracking-tight break-keep">
              앱 환경 설정
            </h3>
            <p className="text-[11px] sm:text-xs text-[#001858]/80 font-bold break-keep">
              기기별 보기 모드와 편의 기능을 취향에 맞게 설정하세요.
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Section 1: Device View Mode (컴퓨터 vs 스마트폰 뷰 선택) */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black text-[#001858] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#001858]" />
                <span>화면 보기 모드 (디바이스 최적화)</span>
              </label>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#8BD3DD] text-[#001858] border border-[#001858]">
                실시간 적용
              </span>
            </div>
            <p className="text-xs text-[#001858]/70 font-bold mb-3.5">
              현재 사용 중인 환경(스마트폰 또는 PC)에 맞춰 가장 편안한 비율로 화면을 볼 수 있습니다.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Desktop / PC Mode */}
              <button
                id="select-view-desktop"
                onClick={() => {
                  soundFx.playSoftTap();
                  onSelectViewMode('desktop');
                }}
                className={`p-4 rounded-2xl border-3 border-[#001858] flex flex-col items-center text-center transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-[#001858] text-white shadow-[4px_4px_0px_0px_#F582AE]'
                    : 'bg-[#FEF6E4] text-[#001858] hover:bg-[#8BD3DD]/30 shadow-[3px_3px_0px_0px_#001858]'
                }`}
              >
                <div className={`p-2.5 rounded-xl border-2 border-[#001858] mb-2 ${
                  viewMode === 'desktop' ? 'bg-[#F582AE] text-[#001858]' : 'bg-white text-[#001858]'
                }`}>
                  <Monitor className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black mb-0.5">💻 컴퓨터 모드</span>
                <span className={`text-[10px] font-bold ${viewMode === 'desktop' ? 'text-white/80' : 'text-[#001858]/70'}`}>
                  넓은 와이드 데스크톱 화면
                </span>
                {viewMode === 'desktop' && (
                  <span className="mt-2 text-[10px] font-black px-2 py-0.5 bg-[#8BD3DD] text-[#001858] rounded-full border border-[#001858] flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> 선택됨
                  </span>
                )}
              </button>

              {/* Mobile Phone Mode */}
              <button
                id="select-view-mobile"
                onClick={() => {
                  soundFx.playSoftTap();
                  onSelectViewMode('mobile');
                }}
                className={`p-4 rounded-2xl border-3 border-[#001858] flex flex-col items-center text-center transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-[#001858] text-white shadow-[4px_4px_0px_0px_#F582AE]'
                    : 'bg-[#FEF6E4] text-[#001858] hover:bg-[#8BD3DD]/30 shadow-[3px_3px_0px_0px_#001858]'
                }`}
              >
                <div className={`p-2.5 rounded-xl border-2 border-[#001858] mb-2 ${
                  viewMode === 'mobile' ? 'bg-[#F582AE] text-[#001858]' : 'bg-white text-[#001858]'
                }`}>
                  <Smartphone className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black mb-0.5">📱 스마트폰 모드</span>
                <span className={`text-[10px] font-bold ${viewMode === 'mobile' ? 'text-white/80' : 'text-[#001858]/70'}`}>
                  한손 터치 최적화 폰 뷰
                </span>
                {viewMode === 'mobile' && (
                  <span className="mt-2 text-[10px] font-black px-2 py-0.5 bg-[#8BD3DD] text-[#001858] rounded-full border border-[#001858] flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> 선택됨
                  </span>
                )}
              </button>
            </div>

            {/* Quick Auto Switch button */}
            <div className="mt-3 pt-3 border-t-2 border-[#001858]/10 flex justify-end">
              <button
                onClick={() => {
                  soundFx.playSoftTap();
                  onSelectViewMode('auto');
                }}
                className={`text-[11px] font-black px-3 py-1 rounded-xl border border-[#001858] transition-all ${
                  viewMode === 'auto'
                    ? 'bg-[#001858] text-white shadow-[2px_2px_0px_0px_#F582AE]'
                    : 'bg-white text-[#001858] hover:bg-[#FEF6E4]'
                }`}
              >
                🔄 기기 해상도 자동 맞춤
              </button>
            </div>
          </div>

          {/* Section 2: Font Size Accessibility */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <label className="text-sm font-black text-[#001858] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#001858]" />
              <span>글자 크기 (시각적 편안함)</span>
            </label>
            <p className="text-xs text-[#001858]/70 font-bold mb-3">
              텍스트를 더 큼직하게 보고 싶으실 때 선택하세요.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  soundFx.playSoftTap();
                  onSelectFontSize('normal');
                }}
                className={`flex-1 py-2.5 px-3 rounded-2xl border-2 border-[#001858] text-xs font-black transition-all ${
                  fontSize === 'normal'
                    ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
                    : 'bg-[#FEF6E4] text-[#001858] hover:bg-[#8BD3DD]/30 shadow-[2px_2px_0px_0px_#001858]'
                }`}
              >
                기본 크기 (100%)
              </button>

              <button
                onClick={() => {
                  soundFx.playSoftTap();
                  onSelectFontSize('large');
                }}
                className={`flex-1 py-2.5 px-3 rounded-2xl border-2 border-[#001858] text-sm font-black transition-all ${
                  fontSize === 'large'
                    ? 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE]'
                    : 'bg-[#FEF6E4] text-[#001858] hover:bg-[#8BD3DD]/30 shadow-[2px_2px_0px_0px_#001858]'
                }`}
              >
                크게 보기 (112%) 🔍
              </button>
            </div>
          </div>

          {/* Section 3: Sound & Audio Feedback */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-black text-[#001858] flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#001858]" /> : <VolumeX className="w-4 h-4 text-[#001858]" />}
                  <span>마음 안정 효과음 및 터치음</span>
                </label>
                <p className="text-xs text-[#001858]/70 font-bold mt-0.5">
                  버튼 터치 및 미션 완수 시 부드러운 차임벨 효과음을 재생합니다.
                </p>
              </div>

              <button
                onClick={() => {
                  const next = !soundEnabled;
                  onToggleSound(next);
                  if (next) soundFx.playSuccessChime();
                }}
                className={`px-4 py-2 rounded-2xl border-2 border-[#001858] font-black text-xs transition-all shadow-[2px_2px_0px_0px_#001858] ${
                  soundEnabled ? 'bg-[#8BD3DD] text-[#001858]' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {soundEnabled ? '켜짐 🔊' : '꺼짐 🔇'}
              </button>
            </div>
          </div>

          {/* Section 4: Data Status & Safe Reset */}
          <div className="bg-[#F3D2C1]/60 rounded-[28px] p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-black text-[#001858] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#001858]" />
                <span>데이터 보관 현황</span>
              </label>
              <span className="text-xs font-black text-[#001858]">
                누적 온기: {totalSunlight}점 / 완료 {completedMissionsCount}개
              </span>
            </div>

            <p className="text-xs text-[#001858]/80 font-bold leading-relaxed mb-3">
              진행 상태는 브라우저 로컬 저장소에 안전하게 보관됩니다. 처음부터 다시 시작하고 싶으신 경우 초기화할 수 있습니다.
            </p>

            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => {
                  soundFx.playSoftTap();
                  setShowConfirmReset(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#001858] text-[#001858] text-xs font-black shadow-[2px_2px_0px_0px_#001858] hover:bg-[#FEF6E4] transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>진행 데이터 초기화...</span>
              </button>
            ) : (
              <div className="p-3 bg-white rounded-2xl border-2 border-[#001858] space-y-2">
                <p className="text-xs font-black text-rose-600">
                  정말로 모든 미션과 일기, 햇살 온기를 초기 상태로 되돌릴까요?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playSoftTap();
                      onResetData();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black border border-[#001858] shadow-[2px_2px_0px_0px_#001858]"
                  >
                    네, 초기화합니다
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#001858] text-xs font-bold border border-[#001858]"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Code ZIP Download */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
              <div>
                <label className="text-sm font-black text-[#001858] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#001858]" />
                  <span>전체 코드 압축파일 (ZIP)</span>
                </label>
                <p className="text-xs text-[#001858]/70 font-bold mt-0.5">
                  앱의 전체 소스 코드(React, Tailwind, Node 서버)를 ZIP 파일로 다운로드합니다.
                </p>
              </div>

              <a
                href="/api/download-zip"
                download="life-outside-app-code.zip"
                onClick={() => soundFx.playSoftTap()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 text-[#001858] border-2 border-[#001858] font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>ZIP 다운로드</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t-2 border-[#001858]/20 flex justify-end">
          <button
            onClick={() => {
              soundFx.playSoftTap();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[3px_3px_0px_0px_#F582AE] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
