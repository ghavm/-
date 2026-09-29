import { Quote, QuoteCategory } from '../types';

export interface QuoteCategoryMeta {
  id: QuoteCategory;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}

export const QUOTE_CATEGORIES: Record<QuoteCategory, QuoteCategoryMeta> = {
  room: {
    id: 'room',
    title: '방 안',
    subtitle: '시작의 두려움 극복',
    description: '움직일 엄두조차 안 나거나 "내가 과연 할 수 있을까?" 고민하는 분을 위한 부담 제로 명언',
    badge: '🚪 초기 진입용',
    icon: '🚪',
    bgColor: 'bg-[#8BD3DD]/30',
    borderColor: 'border-[#8BD3DD]',
    accentColor: '#8BD3DD',
  },
  doorstep: {
    id: 'doorstep',
    title: '집 앞 / 문밖',
    subtitle: '팩트 폭격 & 행동 동기부여',
    description: '밖으로 나가는 명분을 만들어주고 작더라도 일단 몸을 움직이게 만드는 직관적 명언',
    badge: '☀️ 실천 동기부여',
    icon: '☀️',
    bgColor: 'bg-[#FFD166]/35',
    borderColor: 'border-[#FFD166]',
    accentColor: '#FFD166',
  },
  comfort: {
    id: 'comfort',
    title: '위로 & 공감',
    subtitle: '자책감과 상처 치유',
    description: '"왜 나는 이 모양일까" 자책하는 지친 마음을 따뜻하게 감싸주는 온기 가득한 명언',
    badge: '🫂 자책감 안아주기',
    icon: '🫂',
    bgColor: 'bg-[#F3D2C1]/40',
    borderColor: 'border-[#F3D2C1]',
    accentColor: '#F3D2C1',
  },
  challenge: {
    id: 'challenge',
    title: '도전 & 성장',
    subtitle: '꺾이지 않는 재도전 서사',
    description: '미션을 실패했거나 다시 은둔하고 싶어질 때 용기를 주는 강렬한 서브컬처·게임·철학 명언',
    badge: '🔥 재도전 불꽃',
    icon: '🔥',
    bgColor: 'bg-[#F582AE]/25',
    borderColor: 'border-[#F582AE]',
    accentColor: '#F582AE',
  },
};

export const QUOTES_DATA: Quote[] = [
  // 1. 🚪 [방 안] 시작조차 두려워 눈치 보는 사람에게 (초기 진입용)
  {
    id: 'q-room-1',
    category: 'room',
    text: '완벽함을 기다리지 마라. 지금 시작하는 것이 완벽한 내일보다 낫다.',
    author: '작자 미상',
    situation: '움직일 엄두조차 나지 않고 첫걸음이 막막할 때',
    tags: ['시작', '완벽주의 극복', '지금 이 순간'],
  },
  {
    id: 'q-room-2',
    category: 'room',
    text: '천 리 길도 한 걸음부터.',
    author: '노자',
    source: '도덕경(道德經)',
    situation: '갈 길이 너무 멀어 보여서 아예 멈춰 서 있을 때',
    tags: ['한 걸음', '인내', '기초'],
  },
  {
    id: 'q-room-3',
    category: 'room',
    text: '시작하는 방법은 말하기를 그만두고 행동하는 것이다.',
    author: '월트 디즈니',
    source: 'Walt Disney',
    situation: '생각과 걱정만 꼬리를 물고 이어질 때',
    tags: ['행동', '실천', '몰입'],
  },
  {
    id: 'q-room-4',
    category: 'room',
    text: '완벽할 필요는 없다. 그저 어제보다 조금 더 용기를 내면 된다.',
    author: '브레네 브라운',
    source: 'Brené Brown',
    situation: '"남들보다 뒤처졌다"는 불안감이 엄습할 때',
    tags: ['용기', '자존감', '성장'],
  },
  {
    id: 'q-room-5',
    category: 'room',
    text: '아직 위대한 일을 할 수 없다면, 작은 일을 위대하게 해라.',
    author: '마틴 루터 킹',
    source: 'Martin Luther King Jr.',
    situation: '이불 개기나 물 한 잔 마시기가 사소해 보일 때',
    tags: ['작은 실천', '일상의 가치', '위대함'],
  },
  {
    id: 'q-room-6',
    category: 'room',
    text: '자기 자신에게 한계를 두지 마라. 자신이 할 수 있다고 생각한 만큼만 행할 수 있으니까 말이다.',
    author: '메리 케이 애시',
    source: 'Mary Kay Ash',
    situation: '"난 어차피 안 돼"라고 미리 선을 긋고 싶어질 때',
    tags: ['한계 극복', '가능성', '믿음'],
  },

  // 2. ☀️ [집 앞/문밖] 작지만 한 걸음 내딛게 만드는 팩트 폭격 & 동기부여
  {
    id: 'q-door-1',
    category: 'doorstep',
    text: '어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기 증세이다.',
    author: '알베르트 아인슈타인',
    source: 'Albert Einstein',
    situation: '방 안에서 변함없는 일상이 답답하면서도 관성에 젖어있을 때',
    tags: ['팩트 폭격', '변화', '동기부여'],
  },
  {
    id: 'q-door-2',
    category: 'doorstep',
    text: '인생은 자전거 타기와 같다. 균형을 잡으려면 움직여야 한다.',
    author: '알베르트 아인슈타인',
    source: 'Albert Einstein',
    situation: '가만히 멈춰 있어서 오히려 마음의 균형이 무너질 때',
    tags: ['균형', '움직임', '삶의 태도'],
  },
  {
    id: 'q-door-3',
    category: 'doorstep',
    text: '아무것도 하지 않으면 아무 일도 일어나지 않는다.',
    author: '기시미 이치로',
    source: '『미움받을 용기』',
    situation: '창밖을 보며 망설이고 있을 때',
    tags: ['시작', '용기', '행동'],
  },
  {
    id: 'q-door-4',
    category: 'doorstep',
    text: '가장 큰 실수는 아무것도 하지 않는 것이다.',
    author: '에드먼드 버크',
    source: 'Edmund Burke',
    situation: '실패가 두려워 아예 발을 묶어두고 있을 때',
    tags: ['실수', '행동', '결단'],
  },
  {
    id: 'q-door-5',
    category: 'doorstep',
    text: '완벽하게 준비될 때까지 기다리지 마라. 지금 있는 곳에서 시작하라.',
    author: '아서 애시',
    source: 'Arthur Ashe',
    situation: '충분한 준비나 확신이 서지 않아 문고리를 잡지 못할 때',
    tags: ['현재', '출발', '결단'],
  },
  {
    id: 'q-door-6',
    category: 'doorstep',
    text: '동굴에 들어가기를 두려워한다면, 당신이 찾는 보물은 바로 그 동굴 안에 있다.',
    author: '조셉 캠벨',
    source: '『천의 얼굴을 가진 영웅』',
    situation: '현관문 밖 세상이 마치 어두운 동굴처럼 낯설고 무서울 때',
    tags: ['보물', '모험', '두려움 극복'],
  },

  // 3. 🫂 [위로 & 공감] 자책감과 상처에 눌려있는 사람에게 (AI 우체통용)
  {
    id: 'q-comfort-1',
    category: 'comfort',
    text: '당신이 보낸 어두운 시간은 결코 낭비가 아니다. 그것은 당신이 더 단단해지기 위한 거름이다.',
    author: '오프라 윈프리',
    source: 'Oprah Winfrey',
    situation: '지나간 방황과 은둔의 시간이 후회스럽고 아까워 눈물 날 때',
    tags: ['위로', '시간의 의미', '거름과 뿌리'],
  },
  {
    id: 'q-comfort-2',
    category: 'comfort',
    text: '세상이 당신을 거부하는 것이 아니다. 당신이 잠시 숨을 고르고 있을 뿐이다.',
    author: '장 폴 사르트르',
    source: 'Jean-Paul Sartre',
    situation: '온 세상이 나를 배척하고 외톨이가 된 기분이 들 때',
    tags: ['안식', '숨고르기', '존재'],
  },
  {
    id: 'q-comfort-3',
    category: 'comfort',
    text: '인생은 동굴이 아니라 터널이다. 반드시 끝이 있다.',
    author: '헨리 포드',
    source: 'Henry Ford',
    situation: '이 어둠이 평생 끝나지 않을 것 같은 막막함에 짓눌릴 때',
    tags: ['터널', '희망', '빛'],
  },
  {
    id: 'q-comfort-4',
    category: 'comfort',
    text: '세상은 고통으로 가득하지만, 그것을 극복하는 사람들로도 가득하다.',
    author: '헬렌 켈러',
    source: 'Helen Keller',
    situation: '나만 아프고 나만 비참한 것 같아 고립감이 깊어질 때',
    tags: ['공감', '연대', '극복'],
  },
  {
    id: 'q-comfort-5',
    category: 'comfort',
    text: '歲寒然後 知松栢之後彫也 (겨울이 되어 날씨가 추워진 연후에라야 비로소 소나무와 전나무가 얼마나 푸르른가를 알 수가 있다)',
    author: '논어(論語) 자한편(子罕篇)',
    source: '공자(孔子)',
    situation: '혹독한 시련을 겪으며 내면의 단단함을 의심할 때',
    tags: ['지혜', '소나무', '시련의 가치'],
  },
  {
    id: 'q-comfort-6',
    category: 'comfort',
    text: '더는 자신의 선택에 이어진 결과에 대한 절망을 겪고… 혼자서는 해낼 수 없는 것을 채움으로서, 더 풍족한 인간의 삶을 살 수 있는 거지.',
    author: '얀 비스모크',
    source: '서사 & 철학 명대사',
    situation: '나 혼자 모든 짐을 짊어지려다 부러질 것 같을 때',
    tags: ['연결', '도움받기', '인간의 삶'],
  },

  // 4. 🔥 [도전 & 성장] 미션 수행 중 꺾이거나 실패했을 때 (재도전용)
  {
    id: 'q-challenge-1',
    category: 'challenge',
    text: '넘어진 곳에서 다시 일어설 필요는 없다. 그냥 그 자리에서 한 발짝만 앞으로 가라.',
    author: '프리드리히 니체',
    source: 'Friedrich Nietzsche',
    situation: '미션 수행 중 실패하거나 중도 포기해 주저앉았을 때',
    tags: ['재기', '한 발짝', '자유'],
  },
  {
    id: 'q-challenge-2',
    category: 'challenge',
    text: '가장 위대한 영광은 한 번도 넘어지지 않는 것이 아니라, 넘어질 때마다 다시 일어나는 것이다.',
    author: '공자',
    source: 'Confucius',
    situation: '또다시 작심삼일이 된 것 같아 자괴감이 들 때',
    tags: ['회복탄력성', '영광', '재도전'],
  },
  {
    id: 'q-challenge-3',
    category: 'challenge',
    text: '중요한 건 진실을 똑바로 마주보려는 의지라고 난 생각해.',
    author: '작자 미상',
    source: '서사적 다짐',
    situation: '현실을 회피하고 다시 도망치고 싶어질 때',
    tags: ['진실', '의지', '정면돌파'],
  },
  {
    id: 'q-challenge-4',
    category: 'challenge',
    text: "난 아직 '마이너스'야... '제로'를 향해 가고 싶어... 나의 '마이너스'를 '제로'로 돌리고 싶다고!",
    author: '죠니 죠스타',
    source: '『죠죠의 기묘한 모험』 Part 7 스틸 볼 런',
    situation: '남들과 비교해 밑바닥에 처해 있다고 느껴질 때, 내 첫걸음을 정당화할 때',
    tags: ['제로를 향해', '재기', '간절함'],
  },
  {
    id: 'q-challenge-5',
    category: 'challenge',
    text: '약하다든가, 운이 나쁘다던가, 아무것도 모른다고 해도, 그건 아무것도 하지 않았을 때의 변명이 될 수 없어.',
    author: '노가미 료타로',
    source: '『가면라이더 덴오』',
    situation: '조건과 환경 탓을 하며 슬그머니 물러서고 싶을 때',
    tags: ['각성', '변명 없는 삶', '순수한 용기'],
  },
  {
    id: 'q-challenge-6',
    category: 'challenge',
    text: '공포를 직면하여 미래를 창조하라.',
    author: '로보토미 코퍼레이션',
    source: '게임 『Lobotomy Corporation』 격언',
    situation: '미지의 상황과 불안한 미래가 나를 짓누를 때',
    tags: ['공포 직면', '미래 창조', '돌파'],
  },
  {
    id: 'q-challenge-7',
    category: 'challenge',
    text: '떠나간 이들에게서 이어받은 자들은 한층 더 『앞』으로 나아가야만 해!',
    author: '죠르노 죠바나',
    source: '『죠죠의 기묘한 모험』 Part 5 황금의 바람',
    situation: '과거의 아픔과 지지해 준 사람들의 응원을 떠올리며 나아갈 때',
    tags: ['계승', '황금의 의지', '앞으로'],
  },
];

// Helper to get random quote, optionally by category
export function getRandomQuote(category?: QuoteCategory): Quote {
  const pool = category 
    ? QUOTES_DATA.filter(q => q.category === category)
    : QUOTES_DATA;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || QUOTES_DATA[0];
}
