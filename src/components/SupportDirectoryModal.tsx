import React from 'react';
import { X, ShieldAlert, Phone, ExternalLink, HeartHandshake, Info } from 'lucide-react';
import { SUPPORT_SERVICES } from '../data/initialData';
import { soundFx } from '../utils/audio';

interface SupportDirectoryModalProps {
  onClose: () => void;
}

export const SupportDirectoryModal: React.FC<SupportDirectoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#FEF6E4] rounded-[28px] sm:rounded-[36px] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[12px_12px_0px_0px_#001858] p-4 sm:p-8">
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

        <div className="flex items-center gap-3 mb-4 pr-12 sm:pr-14">
          <div className="w-10 h-10 rounded-2xl bg-[#8BD3DD] text-[#001858] border-2 border-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black text-[#001858] tracking-tight break-keep">
              고립·은둔 청년 안심 지원 센터 안내
            </h3>
            <p className="text-xs text-[#001858]/80 font-bold break-keep mt-0.5">
              혼자 모든 무게를 짊어지지 않아도 됩니다. 국가와 전문 기관의 다정한 지원망이 함께합니다.
            </p>
          </div>
        </div>

        {/* Reassurance Box */}
        <div className="bg-white rounded-[24px] p-4 border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858] mb-6 text-xs text-[#001858] font-bold leading-relaxed flex items-start gap-2.5 break-keep">
          <Info className="w-4 h-4 text-[#001858] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#001858] font-black">상담 시 부담을 갖지 않으셔도 됩니다:</strong> 익명 상담이 가능하며, 전화 통화가 부담스러울 경우 대부분 카카오톡이나 온라인 텍스트 상담 창구를 제공하고 있습니다.
          </div>
        </div>

        {/* Directory List */}
        <div className="space-y-3.5">
          {SUPPORT_SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[24px] bg-white border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858] hover:translate-y-[-2px] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#F3D2C1] text-[#001858] border border-[#001858] whitespace-nowrap">
                    {srv.category}
                  </span>
                  <h4 className="text-sm font-black text-[#001858] mt-1 break-keep">{srv.name}</h4>
                </div>

                <a
                  href={`tel:${srv.phone}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#F582AE] transition-all active:translate-x-[1px] active:translate-y-[1px] shrink-0 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{srv.phone}</span>
                </a>
              </div>

              <p className="text-xs text-[#001858]/80 font-bold mb-2 leading-relaxed break-keep">
                {srv.description}
              </p>

              {srv.website && (
                <a
                  href={srv.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#001858] underline decoration-2 decoration-[#F582AE] hover:text-[#001858]/80"
                >
                  <span>공식 사이트 정보 확인</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-[#001858]/20 flex justify-end">
          <button
            onClick={() => {
              soundFx.playSoftTap();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white text-xs font-black border-2 border-[#001858] shadow-[3px_3px_0px_0px_#F582AE] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
