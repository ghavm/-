import { Mission } from '../types';

export const INITIAL_MISSIONS: Mission[] = [
  // LEVEL 1: 방 안에서 시작하는 작은 온기 (Inside the Room)
  {
    id: 'm-101',
    level: 1,
    title: '창문 열고 1분 햇빛 쬐기',
    description: '커튼과 창문을 살짝 열고 따스한 햇빛과 바깥바람을 1분 동안 느껴보세요.',
    category: 'sunlight',
    durationSeconds: 60,
    iconName: 'Sun',
    difficulty: '초초간단',
    completed: false,
    rewardSunlight: 10,
    actionGuide: [
      '방 안 창문으로 천천히 다가가 보세요.',
      '커튼을 걷고 창문을 살짝 열어 공기를 마십니다.',
      '1분 동안 눈을 편안하게 감거나 하늘을 바라보며 따뜻한 온도를 느껴보세요.'
    ]
  },
  {
    id: 'm-102',
    level: 1,
    title: '시원한 물 한 잔 천천히 마시기',
    description: '목을 축이며 시원한 물이 몸속으로 퍼져나가는 감각에 집중해 봅니다.',
    category: 'body',
    durationSeconds: 30,
    iconName: 'Droplets',
    difficulty: '초초간단',
    completed: false,
    rewardSunlight: 5,
    actionGuide: [
      '물 한 잔을 떠서 손에 쥐어보세요.',
      '한 모금씩 천천히 마시며 목넘김을 느껴봅니다.'
    ]
  },
  {
    id: 'm-103',
    level: 1,
    title: '기지개 켜고 어깨 3번 돌리기',
    description: '굳어있던 몸을 가볍게 늘려주며 깊게 숨을 들이쉬고 내쉽니다.',
    category: 'body',
    durationSeconds: 40,
    iconName: 'Smile',
    difficulty: '초초간단',
    completed: false,
    rewardSunlight: 5,
    actionGuide: [
      '양팔을 위로 쭉 뻗으며 기지개를 켜보세요.',
      '어깨를 뒤로 천천히 3바퀴 돌려 긴장을 풉니다.'
    ]
  },
  {
    id: 'm-104',
    level: 1,
    title: '내가 좋아하는 노래 1곡 끝까지 듣기',
    description: '마음이 편안해지거나 흥얼거릴 수 있는 노래 한 곡을 골라 귀 기울여보세요.',
    category: 'room',
    durationSeconds: 180,
    iconName: 'Music',
    difficulty: '초초간단',
    completed: false,
    rewardSunlight: 8,
    actionGuide: [
      '가장 좋아하는 플레이리스트에서 1곡을 선택합니다.',
      '다른 생각은 잠시 내려두고 멜로디에 몰입해 봅니다.'
    ]
  },
  {
    id: 'm-105',
    level: 1,
    title: '거울 속 나에게 "오늘도 괜찮아" 말해주기',
    description: '오늘 하루를 버텨내고 있는 소중한 나 자신을 따뜻한 눈빛으로 바라보세요.',
    category: 'room',
    durationSeconds: 20,
    iconName: 'Heart',
    difficulty: '초초간단',
    completed: false,
    rewardSunlight: 10,
    actionGuide: [
      '거울이나 카메라를 보고 조용히 나를 바라봅니다.',
      '속으로 혹은 작은 목소리로 "오늘도 잘 살아내고 있어, 괜찮아"라고 말해주세요.'
    ]
  },

  // LEVEL 2: 현관문과 집 앞 경계 넘기 (At the Threshold)
  {
    id: 'm-201',
    level: 2,
    title: '집 앞 쓰레기 배출하고 오기',
    description: '방에 모아둔 작은 쓰레기봉투를 묶어서 집 앞 수거 장소에 살포시 놓고 옵니다.',
    category: 'threshold',
    durationSeconds: 90,
    iconName: 'Trash2',
    difficulty: '초간단',
    completed: false,
    rewardSunlight: 15,
    actionGuide: [
      '작은 쓰레기봉투를 묶어 손에 듭니다.',
      '현관문을 열고 집 앞 지정된 배출 장소까지 걸어갑니다.',
      '쓰레기를 내려놓고 편안한 마음으로 돌아옵니다. 멋진 한 걸음이에요!'
    ]
  },
  {
    id: 'm-202',
    level: 2,
    title: '현관문 열고 10초 동안 바깥 공기 마시기',
    description: '도어락을 열고 문을 살짝 틈새만큼 열어 바깥의 신선한 바람을 맡아보세요.',
    category: 'threshold',
    durationSeconds: 30,
    iconName: 'DoorOpen',
    difficulty: '초간단',
    completed: false,
    rewardSunlight: 12,
    actionGuide: [
      '현관문 손잡이를 잡고 문을 반쯤 열어보세요.',
      '문 앞 계단이나 복도의 시원한 공기를 3번 크게 들이마십니다.',
      '언제든 돌아와도 안전하다는 것을 느끼며 문을 닫습니다.'
    ]
  },
  {
    id: 'm-203',
    level: 2,
    title: '우편함 확인하고 오기',
    description: '1층 또는 현관 옆 우편함으로 가볍게 걸어가 우편물이 있는지 확인해봅니다.',
    category: 'threshold',
    durationSeconds: 60,
    iconName: 'Mail',
    difficulty: '초간단',
    completed: false,
    rewardSunlight: 15,
    actionGuide: [
      '슬리퍼를 신고 우편함 쪽으로 조용히 다녀옵니다.',
      '우편물이 없어도 괜찮습니다. 문밖을 나섰다는 것 자체가 큰 성공입니다.'
    ]
  },
  {
    id: 'm-204',
    level: 2,
    title: '현관 신발 가지런히 정리하기',
    description: '어지럽혀져 있던 신발 코를 문쪽으로 향하게 정돈하며 외출 준비의 마음을 닦아봅니다.',
    category: 'threshold',
    durationSeconds: 40,
    iconName: 'Footprints',
    difficulty: '초간단',
    completed: false,
    rewardSunlight: 10,
    actionGuide: [
      '현관으로 나가 신발들을 가지런히 정렬해 봅니다.',
      '언제든 밖으로 나갈 수 있는 나만의 디딤돌을 만들어줍니다.'
    ]
  },

  // LEVEL 3: 동네 한 바퀴 탐험 (Neighborhood Exploration)
  {
    id: 'm-301',
    level: 3,
    title: '집 근처 3분 가볍게 산책하기',
    description: '집 주변 골목길이나 아파트 단지 화단을 한 바퀴 천천히 걷고 옵니다.',
    category: 'neighborhood',
    durationSeconds: 180,
    iconName: 'Compass',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 20,
    actionGuide: [
      '모자나 마스크, 편안한 옷을 착용합니다.',
      '이어폰으로 좋아하는 음악을 들어도 좋습니다.',
      '골목을 천천히 3분 동안 거닐며 바깥 풍경을 바라보고 돌아옵니다.'
    ]
  },
  {
    id: 'm-302',
    level: 3,
    title: '편의점 가서 좋아하는 음료 하나 사오기',
    description: '가까운 편의점에 들러 평소 마시고 싶었던 음료나 간식 하나를 골라 결제해 봅니다.',
    category: 'neighborhood',
    durationSeconds: 300,
    iconName: 'Coffee',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 25,
    actionGuide: [
      '가장 가까운 편의점으로 발걸음을 옮깁니다.',
      '음료 코너에서 마음에 드는 상품 하나를 고릅니다.',
      '바코드를 찍고 계산을 마친 후 맛있는 성취감을 느껴보세요.'
    ]
  },
  {
    id: 'm-303',
    level: 3,
    title: '지나가는 하늘 구름이나 나무 사진 1장 찍기',
    description: '바깥 세상의 푸르른 하늘, 구름, 혹은 길가에 핀 작은 풀꽃을 렌즈에 담아봅니다.',
    category: 'neighborhood',
    durationSeconds: 120,
    iconName: 'Camera',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 20,
    actionGuide: [
      '스마트폰 카메라를 켜고 바깥 자연물을 바라보세요.',
      '마음에 드는 구름이나 나무, 작은 꽃을 찰칵 찍어 기념으로 남깁니다.'
    ]
  },
  {
    id: 'm-304',
    level: 3,
    title: '공원 벤치에 2분 동안 조용히 앉아보기',
    description: '가까운 쉼터나 벤치에 앉아 사람들의 소리와 나뭇잎 흔들리는 소리를 들어봅니다.',
    category: 'neighborhood',
    durationSeconds: 120,
    iconName: 'TreePine',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 22,
    actionGuide: [
      '근처 벤치에 앉아 등을 기대어 봅니다.',
      '세상의 자연스러운 흐름을 관찰자로서 편안하게 바라보세요.'
    ]
  },
  {
    id: 'm-305',
    level: 3,
    title: '집 앞 횡단보도 건너 새로운 골목 5분 탐색하기',
    description: '늘 가던 길 대신 횡단보도를 건너 새로운 골목길을 호기심 어린 눈으로 걸어봅니다.',
    category: 'neighborhood',
    durationSeconds: 300,
    iconName: 'Compass',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 25,
    actionGuide: [
      '신호등 녹색 불을 기다려 안전하게 횡단보도를 건넙니다.',
      '처음 보는 가게 간판이나 골목 벽화를 구경하며 5분간 천천히 산책합니다.',
      '언제든 돌아올 수 있다는 안전함을 마음에 새깁니다.'
    ]
  },
  {
    id: 'm-306',
    level: 3,
    title: '동네 무인 점포나 작은 문구점 구경하고 오기',
    description: '사람 대면 부담이 적은 무인 매장에 들러 소소한 간식이나 필기구를 구경합니다.',
    category: 'neighborhood',
    durationSeconds: 300,
    iconName: 'Coffee',
    difficulty: '가벼움',
    completed: false,
    rewardSunlight: 25,
    actionGuide: [
      '동네 무인 아이스크림점이나 문구점에 들어가 봅니다.',
      '진열대를 천천히 둘러보며 마음에 드는 작은 간식 하나를 셀프 계산합니다.'
    ]
  },

  // LEVEL 4: 사람과 사회로 부드럽게 닿기 (Gentle Social Connection)
  {
    id: 'm-401',
    level: 4,
    title: '편의점 직원에게 가벼운 목례 또는 "감사합니다" 건네기',
    description: '결제 시 작은 목소리라도 "감사합니다"라고 말하거나 가볍게 고개를 끄덕여 봅니다.',
    category: 'social',
    durationSeconds: 30,
    iconName: 'MessageSquareHeart',
    difficulty: '용기내기',
    completed: false,
    rewardSunlight: 35,
    actionGuide: [
      '결제 후 영수증이나 물건을 받을 때 상대방을 살짝 인지합니다.',
      '작은 미소나 가벼운 "감사합니다" 한마디를 건네보세요. 세상과 연결되는 위대한 첫마디입니다.'
    ]
  },
  {
    id: 'm-402',
    level: 4,
    title: '동네 조용한 도서관이나 서점 둘러보기',
    description: '조용하고 편안한 공간에서 책 표지를 구경하며 10분 동안 머물러 봅니다.',
    category: 'social',
    durationSeconds: 600,
    iconName: 'BookOpen',
    difficulty: '용기내기',
    completed: false,
    rewardSunlight: 40,
    actionGuide: [
      '도서관이나 서점의 문을 열고 들어갑니다.',
      '소음이 적은 편안한 서가 사이를 거닐며 관심 있는 책 한 권을 꺼내보세요.'
    ]
  },
  {
    id: 'm-403',
    level: 4,
    title: '청년 고립·은둔 지원 프로그램 정보 조용히 살펴보기',
    description: '나와 같은 고민을 하는 사람들을 돕는 지원 센터와 동행 프로그램 정보를 탐색해 봅니다.',
    category: 'social',
    durationSeconds: 300,
    iconName: 'ShieldCheck',
    difficulty: '용기내기',
    completed: false,
    rewardSunlight: 30,
    actionGuide: [
      '앱 내 [지원 디렉토리] 또는 지원센터 웹사이트를 열어봅니다.',
      '나 혼자가 아니며, 안전하게 손잡아 줄 제도가 있다는 것을 확인합니다.'
    ]
  },
  {
    id: 'm-404',
    level: 4,
    title: '엘리베이터나 길에서 마주친 이웃에게 눈인사하기',
    description: '같은 건물 주민이나 지나가는 이웃을 마주쳤을 때 가볍게 고개 숙여 인사해봅니다.',
    category: 'social',
    durationSeconds: 30,
    iconName: 'Smile',
    difficulty: '용기내기',
    completed: false,
    rewardSunlight: 35,
    actionGuide: [
      '엘리베이터 문이 열리거나 계단에서 마주쳤을 때 상대방을 봅니다.',
      '가벼운 목례를 건네보세요. 짧은 순간이지만 온기가 오고 갑니다.'
    ]
  },
  {
    id: 'm-405',
    level: 4,
    title: '단골 카페나 식당에서 직접 포장 주문해 받아오기',
    description: '키오스크나 카운터에서 먹고 싶은 메뉴를 주문하고 픽업해 집으로 가져와 봅니다.',
    category: 'social',
    durationSeconds: 600,
    iconName: 'Coffee',
    difficulty: '용기내기',
    completed: false,
    rewardSunlight: 40,
    actionGuide: [
      '원하는 메뉴를 미리 마음속으로 정해둡니다.',
      '매장에 들어가 주문을 넣고 번호표를 받습니다.',
      '포장된 음식을 손에 쥐고 돌아오며 당당한 뿌듯함을 느껴봅니다.'
    ]
  },

  // LEVEL 5: 생활 반경의 과감한 확장 (Radius Expansion - 난이도 상승!)
  {
    id: 'm-501',
    level: 5,
    title: '대형마트/다이소에서 생필품 3가지 직접 골라 계산하기',
    description: '사람이 있는 매장에서 필요한 물품을 찾아 카트에 담고 직접 계산대를 통과해봅니다.',
    category: 'social',
    durationSeconds: 900,
    iconName: 'ShoppingBag',
    difficulty: '도전하기',
    completed: false,
    rewardSunlight: 45,
    actionGuide: [
      '필요한 물품 3가지(치약, 노트, 간식 등)를 메모장에 적습니다.',
      '매장 코너를 천천히 둘러보며 물건을 바구니에 담습니다.',
      '계산대에서 결제를 마치고 영수증을 챙깁니다. 일상 생활력이 한 단계 업그레이드되었습니다!'
    ]
  },
  {
    id: 'm-502',
    level: 5,
    title: '대중교통(지하철 또는 버스) 타고 2~3정거장 다녀오기',
    description: '교통카드를 찍고 버스나 전철을 타고 몇 정거장 이동했다가 다시 돌아옵니다.',
    category: 'neighborhood',
    durationSeconds: 1200,
    iconName: 'Bus',
    difficulty: '도전하기',
    completed: false,
    rewardSunlight: 50,
    actionGuide: [
      '이어폰으로 편안한 음악을 들으며 정류장이나 역으로 향합니다.',
      '교통카드를 단말기에 태그하고 창가 자리에 앉아 흘러가는 풍경을 봅니다.',
      '2~3정거장 후 내려서 반대편으로 돌아오거나 천천히 걸어옵니다.'
    ]
  },
  {
    id: 'm-503',
    level: 5,
    title: '코인세탁소나 무인 카페에서 20분 동안 조용히 머물러보기',
    description: '집 밖의 공공 공간에서 자리를 잡고 책을 읽거나 스마트폰을 보며 여유를 즐깁니다.',
    category: 'room',
    durationSeconds: 1200,
    iconName: 'Coffee',
    difficulty: '도전하기',
    completed: false,
    rewardSunlight: 45,
    actionGuide: [
      '읽을 책이나 이어폰을 챙겨 무인 카페나 세탁방으로 갑니다.',
      '편안한 자리에 앉아 20분 동안 온전히 머물러 봅니다.',
      '집 밖 공간에서도 내가 안전하고 편안할 수 있음을 느껴봅니다.'
    ]
  },
  {
    id: 'm-504',
    level: 5,
    title: '주민센터나 구청 방문해 안내 책자 챙기거나 둘러보기',
    description: '공공기관의 문을 열고 들어가 민원실 분위기를 살피고 청년/문화 안내 팸플릿을 가져옵니다.',
    category: 'social',
    durationSeconds: 900,
    iconName: 'ShieldCheck',
    difficulty: '도전하기',
    completed: false,
    rewardSunlight: 50,
    actionGuide: [
      '가까운 주민센터 민원실로 걸어 들어갑니다.',
      '비치된 주민 소식지나 청년 지원 안내 리플릿을 하나 집어 듭니다.',
      '공적인 공간에 자연스럽게 녹아든 나 자신을 칭찬해주세요.'
    ]
  },
  {
    id: 'm-505',
    level: 5,
    title: '평소 안 가보던 새로운 동네 공원이나 서점 원정 다녀오기',
    description: '도보 15분 이상의 낯선 장소로 목적지를 정하고 30분간 산책과 탐방을 진행합니다.',
    category: 'neighborhood',
    durationSeconds: 1800,
    iconName: 'Compass',
    difficulty: '도전하기',
    completed: false,
    rewardSunlight: 55,
    actionGuide: [
      '지도를 켜고 평소 가보지 않은 숲길이나 큰 서점을 목적지로 지정합니다.',
      '천천히 걸어가 새로운 풍경과 바람을 마주합니다.',
      '나의 생활 반경이 이렇게 넓어졌다는 사실을 만끽해보세요.'
    ]
  },

  // LEVEL 6: 폭풍 자립 실전 서바이벌 (Ultimate Independence - 최상위 실전 난이도!)
  {
    id: 'm-601',
    level: 6,
    title: '친구 또는 가족에게 먼저 "밥 잘 챙겨 먹어" 안부 문자 보내기',
    description: '오랫동안 연락하지 못했던 지인이나 가족에게 부담 없는 따뜻한 안부 톡을 건넵니다.',
    category: 'social',
    durationSeconds: 300,
    iconName: 'MessageSquareHeart',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 60,
    actionGuide: [
      '마음이 편안한 지인 한 명의 대화창을 엽니다.',
      '"날씨가 쌀쌀한데 밥 잘 챙겨 먹어, 생각나서 보냈어" 같은 짧은 한마디를 입력합니다.',
      '답장을 서두르지 않아도 괜찮습니다. 먼저 손을 내민 용기가 기적의 시작입니다.'
    ]
  },
  {
    id: 'm-602',
    level: 6,
    title: '청년 지원센터(청년재단/129) 온라인 자가진단 또는 1:1 상담 신청해보기',
    description: '고립·은둔 청년 맞춤 지원 프로그램에 접속해 자가진단을 작성하거나 상담을 예약합니다.',
    category: 'social',
    durationSeconds: 900,
    iconName: 'HeartHandshake',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 70,
    actionGuide: [
      '청년재단(kyf.or.kr) 또는 129 보건복지상담센터 홈페이지를 엽니다.',
      '고립은둔 청년 회복 지원 코너에서 자가진단 문항을 솔직하게 체크해봅니다.',
      '필요시 텍스트나 익명 1:1 상담을 신청해 든든한 사회적 안전망을 확보합니다.'
    ]
  },
  {
    id: 'm-603',
    level: 6,
    title: '관심 있는 취미 원데이 클래스나 동호회 커뮤니티 정보 찾아보기',
    description: '베이킹, 가죽공예, 독서모임, 운동 등 내가 흥미를 느끼는 오프라인 모임 정보를 검색해봅니다.',
    category: 'neighborhood',
    durationSeconds: 1200,
    iconName: 'Sparkles',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 65,
    actionGuide: [
      '포털이나 취미 플랫폼에서 평소 관심 있던 분야를 검색합니다.',
      '소규모 원데이 클래스 일정이나 후기를 읽어보며 마음에 드는 곳을 스크랩합니다.',
      '언제든 내가 원할 때 새로운 사람들과 연결될 준비를 마칩니다.'
    ]
  },
  {
    id: 'm-604',
    level: 6,
    title: '하루 6,000보 걷기 달성하고 나에게 맛있는 음식 선물하기',
    description: '스마트폰 만보기로 6,000보를 채우고, 오늘 하루를 멋지게 살아낸 나에게 맛있는 음식을 대접합니다.',
    category: 'body',
    durationSeconds: 2400,
    iconName: 'Footprints',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 70,
    actionGuide: [
      '만보기 앱을 켜고 동네를 여유롭게 산책하며 걸음 수를 채웁니다.',
      '6,000보를 달성한 후 좋아하는 음식점에 들르거나 맛있는 디저트를 구입합니다.',
      '"오늘 정말 고생 많았어, 대단해!"라고 스스로에게 진심 어린 축하를 전합니다.'
    ]
  },
  {
    id: 'm-605',
    level: 6,
    title: '이력서/자기소개서 양식 다운받아 내 장점과 경험 1줄 적어보기',
    description: '취업이나 알바의 부담을 내려놓고, 빈 이력서 서식에 내가 좋아하는 것과 강점을 1줄 적어봅니다.',
    category: 'social',
    durationSeconds: 1200,
    iconName: 'BookOpen',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 80,
    actionGuide: [
      '깔끔한 이력서 서식 파일을 컴퓨터나 스마트폰으로 엽니다.',
      '완벽하게 쓰려 하지 말고, 나의 소중한 특기나 좋아하는 일 1가지만 적어봅니다.',
      '사회로 향하는 첫 번째 밑그림을 그렸습니다.'
    ]
  },
  {
    id: 'm-606',
    level: 6,
    title: '미뤄뒀던 병원(치과/내과) 진료 예약하거나 건강검진 다녀오기',
    description: '몸과 마음의 건강을 위해 미뤄두었던 진료를 예약하고 의사 선생님과 상담을 나눕니다.',
    category: 'body',
    durationSeconds: 1800,
    iconName: 'ShieldCheck',
    difficulty: '폭풍돌파',
    completed: false,
    rewardSunlight: 75,
    actionGuide: [
      '가까운 치과나 내과에 전화 또는 네이버 예약으로 진료를 예약합니다.',
      '병원에 방문해 접수 후 진료실에서 불편한 곳을 편안하게 이야기합니다.',
      '스스로의 몸을 아끼고 돌볼 줄 아는 진정한 자립의 영웅입니다!'
    ]
  }
];

export const LEVEL_INFO = {
  1: {
    name: '방 안의 작은 온기',
    subname: 'Room Comfort',
    desc: '내 방 안에서 부담 없이 나를 돌보는 초초간단 루틴',
    targetMinSunlight: 0,
    badge: '🛏️',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-300'
  },
  2: {
    name: '문턱과 현관의 용기',
    subname: 'Threshold Courage',
    desc: '현관문과 문지방을 넘어 바깥 공기를 마주하는 발걸음',
    targetMinSunlight: 40,
    badge: '🚪',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-700 border-emerald-300'
  },
  3: {
    name: '동네 한 바퀴 탐험',
    subname: 'Neighborhood Walk',
    desc: '골목과 편의점, 자연을 관찰하며 세상의 온도를 체감하기',
    targetMinSunlight: 100,
    badge: '🌳',
    badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-700 border-sky-300'
  },
  4: {
    name: '세상과의 다정한 악수',
    subname: 'Social Connection',
    desc: '가벼운 눈인사와 소통으로 사회 속 내 자리를 찾아가는 여정',
    targetMinSunlight: 180,
    badge: '🤝',
    badgeColor: 'from-indigo-500/20 to-purple-500/20 text-indigo-700 border-indigo-300'
  },
  5: {
    name: '생활 반경의 과감한 확장',
    subname: 'Radius Expansion',
    desc: '대중교통, 마트 장보기, 무인 카페 등 일상 생활 공간 넓히기',
    targetMinSunlight: 280,
    badge: '🛒',
    badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-700 border-rose-300'
  },
  6: {
    name: '폭풍 자립 실전 서바이벌',
    subname: 'Ultimate Independence',
    desc: '지인 연락, 전문 상담, 취미 모임 등 사회적 자립을 향한 힘찬 도약',
    targetMinSunlight: 400,
    badge: '⚡',
    badgeColor: 'from-purple-500/20 to-violet-600/20 text-purple-700 border-purple-300'
  }
};

export const SUPPORT_SERVICES = [
  {
    name: '청년재단 고립·은둔 청년 맞춤형 지원',
    category: '통합 지원 & 커뮤니티',
    phone: '02-6731-2600',
    description: '고립 청년 발굴, 심리상담, 일상회복 프로그램, 사회진출 맞춤형 멘토링 지원',
    website: 'https://kyf.or.kr'
  },
  {
    name: '보건복지부 청년마음건강지원사업 & 희망의 전화',
    category: '긴급 심리상담',
    phone: '129',
    description: '보건복지상담센터(129) 및 전담 바우처를 통한 전문 1:1 심리상담 지원',
    website: 'https://www.129.go.kr'
  },
  {
    name: '정신건강위기상담전화',
    category: '24시간 위기 대응',
    phone: '1577-0199',
    description: '불안, 우울, 대인기피, 고립감으로 힘들 때 24시간 언제든 전문가와 무료 통화',
    website: 'https://www.ncmh.go.kr'
  },
  {
    name: '서울시 청년 고립은둔 지원사업 (청년 몽땅 정보통)',
    category: '서울 및 지자체 프로그램',
    phone: '02-120',
    description: '온라인 자가진단, 1:1 밀착 상담, 은둔청년 쉐어하우스 및 회복 아카데미',
    website: 'https://youth.seoul.go.kr'
  }
];
