import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Shuffle, 
  Heart,
  BookOpen
} from 'lucide-react';
import { Quote, QuoteCategory } from '../types';
import { QUOTES_DATA, QUOTE_CATEGORIES, getRandomQuote } from '../data/quotesData';
import { soundFx } from '../utils/audio';

interface QuoteBookModalProps {
  onClose: () => void;
  initialCategory?: QuoteCategory;
}

const FAVORITES_STORAGE_KEY = 'life_outside_favorite_quotes_v1';

// Chapter styling mapping aligned with the app's retro comic theme
const CHAPTER_CONFIG: Record<QuoteCategory, {
  chapterNum: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  pillColor: string;
  slogan: string;
}> = {
  room: {
    chapterNum: '제1권',
    badgeBg: 'bg-[#FFD166]',
    badgeText: 'text-[#001858]',
    cardBg: 'bg-white',
    pillColor: 'bg-[#FFD166]',
    slogan: '시작이 두려운 당신을 위한 부담 제로 비급'
  },
  doorstep: {
    chapterNum: '제2권',
    badgeBg: 'bg-[#8BD3DD]',
    badgeText: 'text-[#001858]',
    cardBg: 'bg-white',
    pillColor: 'bg-[#8BD3DD]',
    slogan: '작은 한 걸음을 내딛게 만드는 명쾌한 팩트 폭격'
  },
  comfort: {
    chapterNum: '제3권',
    badgeBg: 'bg-[#F582AE]',
    badgeText: 'text-[#001858]',
    cardBg: 'bg-white',
    pillColor: 'bg-[#F582AE]/30',
    slogan: '자책감과 과거의 상처를 따뜻하게 녹여주는 치유 처방'
  },
  challenge: {
    chapterNum: '제4권',
    badgeBg: 'bg-[#F3D2C1]',
    badgeText: 'text-[#001858]',
    cardBg: 'bg-white',
    pillColor: 'bg-[#FFD166]',
    slogan: '실패해도 괜찮아! 꺾이지 않고 다시 시작하는 불꽃 서사'
  }
};

export const QuoteBookModal: React.FC<QuoteBookModalProps> = ({
  onClose,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory | 'all' | 'favorites'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [featuredQuote, setFeaturedQuote] = useState<Quote>(() => getRandomQuote(initialCategory));
  const [isShuffling, setIsShuffling] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    soundFx.playSoftTap();
    setFavorites(prev => {
      const exists = prev.includes(id);
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  // Copy quote text
  const handleCopyQuote = (quote: Quote) => {
    soundFx.playSoftTap();
    const formatted = `"${quote.text}"\n— ${quote.author}${quote.source ? ` (${quote.source})` : ''}\n\n[폭풍을 부르는! 방구석 탈출 대작전 ~ 서바이벌 명언 비급서 ~]`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // TTS speak quote
  const handleSpeakQuote = (quote: Quote) => {
    soundFx.playSoftTap();
    if (!('speechSynthesis' in window)) return;

    if (speakingId === quote.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${quote.text}. ${quote.author}.`);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.93;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(quote.id);
    window.speechSynthesis.speak(utterance);
  };

  // Random shuffle spotlight quote
  const handleShuffleQuote = () => {
    soundFx.playSoftTap();
    setIsShuffling(true);
    setTimeout(() => {
      const cat = selectedCategory !== 'all' && selectedCategory !== 'favorites' ? selectedCategory : undefined;
      setFeaturedQuote(getRandomQuote(cat));
      setIsShuffling(false);
    }, 200);
  };

  // Filter quotes
  const filteredQuotes = QUOTES_DATA.filter(quote => {
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(quote.id)) return false;
    } else if (selectedCategory !== 'all') {
      if (quote.category !== selectedCategory) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inText = quote.text.toLowerCase().includes(q);
      const inAuthor = quote.author.toLowerCase().includes(q);
      const inSource = quote.source ? quote.source.toLowerCase().includes(q) : false;
      const inSituation = quote.situation.toLowerCase().includes(q);
      const inTags = quote.tags.some(t => t.toLowerCase().includes(q));
      return inText || inAuthor || inSource || inSituation || inTags;
    }

    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl h-[94vh] sm:h-[90vh] max-h-[860px] bg-[#FEF6E4] rounded-[24px] sm:rounded-[36px] border-3 sm:border-4 border-[#001858] shadow-[6px_6px_0px_0px_#001858] sm:shadow-[12px_12px_0px_0px_#001858] flex flex-col text-[#001858] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Modal Header (Fixed at top - never scrolls away or clips) */}
        <div className="p-3.5 sm:p-5 pb-3 bg-[#FEF6E4] border-b-2 sm:border-b-3 border-[#001858]/20 shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFD166] text-[#001858] border-2 sm:border-3 border-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858] sm:shadow-[3px_3px_0px_0px_#001858] text-lg sm:text-2xl shrink-0">
              📖
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#001858] text-[#FFD166] border border-[#001858] shadow-[1px_1px_0px_0px_#001858]">
                  방구석 탈출 서바이벌 비급
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#8BD3DD] text-[#001858] border border-[#001858]">
                  총 25편
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#001858] tracking-tight mt-0.5 truncate">
                용기 충전 명언 비급서
              </h2>
            </div>
          </div>

          {/* Close Button (Aligned with other modals, firmly anchored in header) */}
          <button
            onClick={() => {
              soundFx.playSoftTap();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] shrink-0 cursor-pointer"
            aria-label="닫기"
            title="닫기"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 2. Controls / Filter Navigation Bar (Fixed under header) */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#FEF6E4] border-b-2 border-[#001858]/15 shrink-0 space-y-2">
          {/* Keyword Search Input */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#001858] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="문장, 인물, 처방 검색 (예: 완벽, 시작, 에디슨, 두려움...)"
              className="w-full pl-8 sm:pl-9 pr-8 py-2 rounded-xl sm:rounded-2xl bg-white border-2 border-[#001858] text-xs sm:text-sm font-black text-[#001858] placeholder:text-[#001858]/45 shadow-[2px_2px_0px_0px_#001858] focus:outline-none focus:ring-2 focus:ring-[#8BD3DD]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#001858] hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Chapters Navigation Tabs with comfortable padding so shadows never clip */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none">
            {/* All */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('all');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#001858] text-white border-[#001858] shadow-[2px_2px_0px_0px_#F582AE]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#FEF6E4]'
              }`}
            >
              전체 ({QUOTES_DATA.length})
            </button>

            {/* Category 1: 방 안 */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('room');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'room'
                  ? 'bg-[#FFD166] text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#FFD166]/30'
              }`}
            >
              <span>🚪 제1권: 방 안</span>
              <span className="text-[10px] px-1 rounded-full bg-white border border-[#001858]">
                {QUOTES_DATA.filter(q => q.category === 'room').length}
              </span>
            </button>

            {/* Category 2: 문밖 */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('doorstep');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'doorstep'
                  ? 'bg-[#8BD3DD] text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#8BD3DD]/30'
              }`}
            >
              <span>☀️ 제2권: 문밖으로</span>
              <span className="text-[10px] px-1 rounded-full bg-white border border-[#001858]">
                {QUOTES_DATA.filter(q => q.category === 'doorstep').length}
              </span>
            </button>

            {/* Category 3: 위로 */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('comfort');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'comfort'
                  ? 'bg-[#F582AE] text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#F582AE]/30'
              }`}
            >
              <span>🫂 제3권: 온기 치유</span>
              <span className="text-[10px] px-1 rounded-full bg-white border border-[#001858]">
                {QUOTES_DATA.filter(q => q.category === 'comfort').length}
              </span>
            </button>

            {/* Category 4: 재도전 */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('challenge');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'challenge'
                  ? 'bg-[#F3D2C1] text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#F3D2C1]/40'
              }`}
            >
              <span>🔥 제4권: 불꽃 재도전</span>
              <span className="text-[10px] px-1 rounded-full bg-white border border-[#001858]">
                {QUOTES_DATA.filter(q => q.category === 'challenge').length}
              </span>
            </button>

            {/* Favorites */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSoftTap();
                setSelectedCategory('favorites');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-xs font-black shrink-0 border-2 transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'favorites'
                  ? 'bg-rose-500 text-white border-[#001858] shadow-[2px_2px_0px_0px_#001858]'
                  : 'bg-white text-[#001858] border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-rose-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'favorites' ? 'fill-white' : 'text-rose-500'}`} />
              <span>내 찜목록 ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* 3. Main Scrollable Content Body (Dedicated scroll container with generous bottom breathing room) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-4">
          {/* Spotlight: 오늘의 즉석 처방 포춘 명언 카드 */}
          <div className="relative rounded-[22px] sm:rounded-[26px] bg-white border-3 sm:border-4 border-[#001858] shadow-[4px_4px_0px_0px_#001858] sm:shadow-[5px_5px_0px_0px_#001858] p-3.5 sm:p-5 overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#001858] text-[#FFD166] text-xs font-black flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#001858]">
                  <Sparkles className="w-3.5 h-3.5 fill-[#FFD166]" />
                  <span>오늘의 즉석 처방 명언</span>
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border-2 border-[#001858] ${CHAPTER_CONFIG[featuredQuote.category].badgeBg}`}>
                  {QUOTE_CATEGORIES[featuredQuote.category].badge}
                </span>
              </div>

              <button
                type="button"
                onClick={handleShuffleQuote}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#8BD3DD] hover:bg-[#8BD3DD]/80 border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-xs font-black text-[#001858] flex items-center gap-1.5 transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>🎲 다른 비급 뽑기</span>
              </button>
            </div>

            {/* Quote Bubble */}
            <div className={`p-3.5 sm:p-4 rounded-2xl bg-[#FEF6E4] border-2 border-[#001858] transition-opacity duration-150 ${isShuffling ? 'opacity-30' : 'opacity-100'}`}>
              <blockquote className="text-sm sm:text-lg font-black text-[#001858] leading-relaxed break-keep break-words">
                &ldquo;{featuredQuote.text}&rdquo;
              </blockquote>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t-2 border-[#001858]/15">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#001858] min-w-0">
                  <span className="truncate">— {featuredQuote.author}</span>
                  {featuredQuote.source && (
                    <span className="text-[11px] font-bold text-[#001858]/60 truncate">({featuredQuote.source})</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSpeakQuote(featuredQuote)}
                    className="px-2 py-1 rounded-xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#8BD3DD]/40 text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    title="음성으로 듣기"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${speakingId === featuredQuote.id ? 'text-rose-500 animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{speakingId === featuredQuote.id ? '낭독 중...' : '소리'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(featuredQuote.id)}
                    className={`px-2 py-1 rounded-xl border-2 border-[#001858] text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors ${
                      favorites.includes(featuredQuote.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-[#001858] hover:bg-rose-50'
                    }`}
                    title={favorites.includes(featuredQuote.id) ? '찜 해제' : '비급서에 담기'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(featuredQuote.id) ? 'fill-white' : ''}`} />
                    <span className="hidden sm:inline">{favorites.includes(featuredQuote.id) ? '보관됨' : '찜'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyQuote(featuredQuote)}
                    className="px-2.5 py-1 rounded-xl bg-[#FFD166] hover:bg-[#FFD166]/80 border-2 border-[#001858] text-xs font-black text-[#001858] flex items-center gap-1 shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    title="명언 복사"
                  >
                    {copiedId === featuredQuote.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Situation Prescription Tag */}
              <div className="mt-2 text-[11px] font-bold text-[#001858] bg-white px-3 py-1.5 rounded-xl border border-[#001858]/30 flex items-start gap-1.5 break-keep break-words">
                <span className="shrink-0">💊 <strong>처방 순간:</strong></span>
                <span className="text-[#001858]/80">{featuredQuote.situation}</span>
              </div>
            </div>
          </div>

          {/* Active Chapter Intro Banner */}
          {selectedCategory !== 'all' && selectedCategory !== 'favorites' && (
            <div className={`p-3 rounded-2xl border-2 sm:border-3 border-[#001858] shadow-[3px_3px_0px_0px_#001858] text-xs font-bold flex items-center gap-2.5 ${CHAPTER_CONFIG[selectedCategory].badgeBg}`}>
              <span className="text-lg leading-none">{QUOTE_CATEGORIES[selectedCategory].icon}</span>
              <div className="min-w-0">
                <strong className="text-[#001858] font-black">
                  {CHAPTER_CONFIG[selectedCategory].chapterNum}: {QUOTE_CATEGORIES[selectedCategory].title}
                </strong>
                <span className="text-[#001858]/80 font-bold ml-1.5 hidden sm:inline break-keep">
                  — {CHAPTER_CONFIG[selectedCategory].slogan}
                </span>
              </div>
            </div>
          )}

          {/* Quotes Card Grid (Ample gap, never cut off horizontally or vertically) */}
          {filteredQuotes.length === 0 ? (
            <div className="py-10 px-4 text-center rounded-3xl bg-white border-3 border-[#001858] shadow-[4px_4px_0px_0px_#001858]">
              <div className="text-3xl mb-2">🍃</div>
              <h4 className="text-base font-black text-[#001858]">해당하는 명언을 찾지 못했어요</h4>
              <p className="text-xs text-[#001858]/70 font-bold mt-1">
                {selectedCategory === 'favorites'
                  ? '아직 찜한 명언이 없습니다. 명언 카드의 하트(❤️)를 눌러보세요!'
                  : '다른 키워드로 검색하거나 전체 비급을 확인해 보세요.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#001858] text-white text-xs font-black border-2 border-[#001858] shadow-[2px_2px_0px_0px_#F582AE] cursor-pointer"
              >
                전체 명언 비급 보기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pb-6">
              {filteredQuotes.map((quote) => {
                const chap = CHAPTER_CONFIG[quote.category];
                const catMeta = QUOTE_CATEGORIES[quote.category];
                const isFav = favorites.includes(quote.id);
                const isCopied = copiedId === quote.id;

                return (
                  <div
                    key={quote.id}
                    className="p-3.5 sm:p-4.5 rounded-[20px] sm:rounded-[24px] bg-white border-3 border-[#001858] shadow-[3px_3px_0px_0px_#001858] sm:shadow-[4px_4px_0px_0px_#001858] hover:shadow-[5px_5px_0px_0px_#001858] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Chapter Badge & Tags */}
                      <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-[#001858] shrink-0 ${chap.badgeBg}`}>
                          {catMeta.badge}
                        </span>

                        <div className="flex items-center gap-1 flex-wrap">
                          {quote.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-[10px] text-[#001858] font-black bg-[#FEF6E4] px-1.5 py-0.5 rounded-md border border-[#001858]/30">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Main Quote Typography */}
                      <blockquote className="text-sm sm:text-base font-black text-[#001858] leading-snug sm:leading-relaxed mb-2 break-keep break-words">
                        &ldquo;{quote.text}&rdquo;
                      </blockquote>

                      {/* Author Tag */}
                      <div className="text-xs font-black text-[#001858] mb-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#8BD3DD]/30 border border-[#001858]/20">
                          {quote.author}
                        </span>
                        {quote.source && (
                          <span className="text-[11px] font-bold text-[#001858]/60">
                            ({quote.source})
                          </span>
                        )}
                      </div>

                      {/* Situation Prescription */}
                      <div className="text-[11px] text-[#001858] font-bold bg-[#FEF6E4] px-2.5 py-1.5 rounded-xl border-2 border-[#001858]/20 mb-2.5 leading-relaxed break-keep break-words">
                        💊 <strong>처방:</strong> {quote.situation}
                      </div>
                    </div>

                    {/* Card Actions Row */}
                    <div className="pt-2.5 border-t-2 border-[#001858]/10 flex items-center justify-between gap-2 text-xs flex-wrap">
                      <span className="text-[10px] text-[#001858]/60 font-black shrink-0">
                        {chap.chapterNum}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Audio TTS */}
                        <button
                          type="button"
                          onClick={() => handleSpeakQuote(quote)}
                          className="p-1.5 rounded-xl border-2 border-[#001858] bg-white hover:bg-[#8BD3DD]/30 text-[#001858] shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                          title="소리로 듣기"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${speakingId === quote.id ? 'text-rose-500 animate-pulse' : ''}`} />
                        </button>

                        {/* Favorite */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(quote.id)}
                          className={`p-1.5 rounded-xl border-2 border-[#001858] shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors ${
                            isFav
                              ? 'bg-rose-500 text-white'
                              : 'bg-white hover:bg-rose-50 text-[#001858]'
                          }`}
                          title={isFav ? '보관 해제' : '마음에 담기'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                        </button>

                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopyQuote(quote)}
                          className="px-2 py-1.5 rounded-xl bg-[#FEF6E4] hover:bg-[#FFD166] border-2 border-[#001858] text-[11px] font-black text-[#001858] flex items-center gap-1 shadow-[1px_1px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                          title="명언 복사하기"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                              <span>복사됨!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>복사</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Modal Footer (Fixed at bottom - guaranteed visible, never clipped) */}
        <div className="p-3 sm:p-4 border-t-2 sm:border-t-3 border-[#001858]/20 bg-[#FEF6E4] shrink-0 flex items-center justify-between gap-3 text-xs font-black">
          <p className="text-[#001858]/70 text-[11px] font-bold truncate">
            ✨ 오늘 마음에 와닿은 한 줄을 마음에 품어보세요.
          </p>
          <button
            type="button"
            onClick={() => {
              soundFx.playSoftTap();
              onClose();
            }}
            className="px-5 py-2 rounded-xl sm:rounded-2xl bg-[#001858] hover:bg-[#001858]/90 text-white font-black text-xs border-2 border-[#001858] shadow-[2px_2px_0px_0px_#F582AE] sm:shadow-[3px_3px_0px_0px_#F582AE] transition-all active:translate-x-[1px] active:translate-y-[1px] shrink-0 cursor-pointer"
          >
            확인하고 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
