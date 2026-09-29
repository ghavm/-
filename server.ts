import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-memory community cheer cards store
const communityCheers = [
  {
    id: 'c-1',
    content: '모두가 뛰어가고 있을 때, 당신이 잠시 멈추어 숨을 고르는 것도 삶의 중요한 한 페이지예요.',
    author: '햇살 친구',
    tag: '위로',
    likes: 42,
    createdAt: '오늘'
  },
  {
    id: 'c-2',
    content: '창문을 열고 바깥바람을 쐰 것만으로도, 당신은 이미 오늘 엄청난 한 걸음을 내딛은 거예요. 정말 자랑스러워요.',
    author: '바람소리',
    tag: '햇살',
    likes: 58,
    createdAt: '오늘'
  },
  {
    id: 'c-3',
    content: '세상은 당신이 문을 열 때까지 결코 서두르지 않고 묵묵히 기다려주고 있어요. 당신의 속도가 가장 정답입니다.',
    author: '숲속 나무',
    tag: '용기',
    likes: 37,
    createdAt: '어제'
  },
  {
    id: 'c-4',
    content: '오늘 쓰레기 버리고 왔어요! 심장이 쿵쾅거렸지만 들어오니 해냈다는 기쁨이 몽글몽글 피어나네요. 우리 같이 힘내요.',
    author: '한걸음씩',
    tag: '공감',
    likes: 89,
    createdAt: '어제'
  },
  {
    id: 'c-5',
    content: '아무것도 하지 못했다고 자책하지 마세요. 오늘 하루를 조용히 견뎌낸 것만으로도 당신은 충분히 강한 사람입니다.',
    author: '달빛 위로',
    tag: '휴식',
    likes: 64,
    createdAt: '2일 전'
  }
];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Life Outside API' });
});

// 2. Get community cheer cards
app.get('/api/cheer/list', (req, res) => {
  res.json({ cheers: communityCheers });
});

// 3. Post a warm anonymous cheer card
app.post('/api/cheer/create', (req, res) => {
  try {
    const { content, author, tag } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: '따뜻한 메시지 내용을 입력해주세요.' });
    }
    const newCheer = {
      id: 'c-' + Date.now(),
      content: content.slice(0, 200),
      author: (author && typeof author === 'string' && author.trim()) ? author.slice(0, 20) : '익명의 동행자',
      tag: tag || '공감',
      likes: 1,
      createdAt: '방금 전'
    };
    communityCheers.unshift(newCheer);
    res.json({ success: true, cheer: newCheer });
  } catch (err: any) {
    res.status(500).json({ error: err.message || '서버 오류가 발생했습니다.' });
  }
});

// 4. Like a cheer card
app.post('/api/cheer/like', (req, res) => {
  const { id } = req.body;
  const target = communityCheers.find(c => c.id === id);
  if (target) {
    target.likes += 1;
    res.json({ success: true, likes: target.likes });
  } else {
    res.status(404).json({ error: '메시지를 찾을 수 없습니다.' });
  }
});

// 5. Generate AI Personalized Cheer Message using Gemini (Fast low-latency)
app.post('/api/cheer/generate', async (req, res) => {
  try {
    const { mood, currentSituation } = req.body;
    const ai = getGeminiClient();

    const prompt = `
당신은 은둔형 외톨이 및 고립 청년을 위한 따뜻한 심리 치유 동행자 '햇살 지기'입니다.
사용자 상태: "${mood || '무기력함, 불안함'}" (${currentSituation || '방 밖으로 나가는 것이 두려워요'})

[지침]
- 훈계하거나 재촉하지 말고, 있는 그대로의 존재를 100% 품어주는 따뜻한 위로 1~2문장을 작성하세요.
- 친절한 한국어 존댓말(~해요, ~답니다). 100자 이내로 신속하게 답하세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const cheerText = response.text?.trim() || '오늘 하루도 당신만의 속도로 조용히 피어나길 바라요. 있는 그대로 충분히 소중합니다.';
    res.json({ cheer: cheerText });
  } catch (err: any) {
    console.error('Gemini cheer error:', err);
    const fallbacks = [
      '모두가 각자의 계절이 있듯, 당신의 봄도 당신만의 속도로 다가오고 있어요. 오늘도 숨 쉬어줘서 고마워요.',
      '문밖의 세상이 조금 무섭게 느껴질 때는, 그냥 창가에 비치는 햇살만 바라보아도 괜찮아요.',
      '아무것도 이루지 못한 날이란 없어요. 오늘 하루를 버텨낸 당신은 이미 강인한 사람입니다.'
    ];
    const randomCheer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json({ cheer: randomCheer, isFallback: true });
  }
});

// 6. AI Empathy Conversation Companion (Supports real-time SSE streaming for instant response)
app.post('/api/empathy/chat', async (req, res) => {
  const { messages, userMood, stream = true } = req.body;

  const formattedHistory = Array.isArray(messages)
    ? messages.map((m: any) => `${m.sender === 'user' ? '사용자' : '햇살 지기'}: ${m.text}`).join('\n')
    : '';

  const prompt = `
당신은 은둔과 고립으로 외로움과 두려움을 느끼는 사람들의 따뜻한 쉼터 [life outside]의 AI 공감 친구 '햇살 지기'입니다.

사용자의 현재 기분: ${userMood || '알 수 없음'}
대화 내역:
${formattedHistory}

[핵심 지침]
1. 사용자의 감정(외로움, 불안, 죄책감, 무기력)을 온전히 수용하고 어떤 판단이나 평가도 하지 마세요.
2. 해결책을 억지로 강요하지 말고, 먼저 진심 어린 공감과 편안한 위로의 말을 건네세요.
3. 사용자가 조금 힘을 내고 싶어한다면, 방 안에서 지금 당장 할 수 있는 초간단 행동 1가지(예: 기지개 켜기, 물 한 모금, 창문 살짝 열기)를 아주 다정하게 덧붙여주세요.
4. 긴 글은 읽기 버거울 수 있으니, 2~3문장 내외로 다정하고 따뜻하게 즉시 전해주세요.
`;

  // Real-time streaming response mode
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const ai = getGeminiClient();
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: any) {
      console.error('Gemini chat streaming error:', err);
      // Fallback message streamed instantly
      const fallbackText = '당신의 마음이 얼마나 무거웠을지 깊이 공감해요. 혼자 삼키지 않고 이렇게 나눠줘서 정말 고마워요. 지금은 그저 편안하게 숨을 한번 내쉬어 볼까요? 🌿';
      res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
    return;
  }

  // Non-streaming fallback mode
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const reply = response.text?.trim() || '당신의 이야기에 귀 기울이고 있어요. 언제든 편안할 때 이야기 나눠요.';
    res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat non-stream error:', err);
    res.json({
      reply: '당신의 마음이 얼마나 무거웠을지 느껴져요. 혼자 삼키지 않고 이렇게 나눠줘서 고마워요. 천천히 깊게 숨을 한번 내쉬어 볼까요?',
      isFallback: true
    });
  }
});

// 7. AI Tailored Micro-Mission Generator (Fast low-latency)
app.post('/api/missions/custom-suggest', async (req, res) => {
  try {
    const { energyLevel, preference } = req.body;
    const ai = getGeminiClient();

    const prompt = `
은둔형 외톨이 사용자를 위한 맞춤형 '초간단 마이크로 미션'을 1개 만들어주세요.
- 에너지 레벨: ${energyLevel || '20'}%
- 희망 영역: ${preference || '방 안에서 할 수 있는 것'}

[규칙]
- 부담감 제로 (1분 이내 완료 가능).
- JSON 형식으로만 출력:
{
  "title": "미션 제목 (15자 이내)",
  "description": "다정한 설명 (50자 이내)",
  "durationSeconds": 30,
  "difficulty": "초초간단",
  "category": "sunlight"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      res.json({ mission: parsed });
    } else {
      throw new Error('Empty JSON response');
    }
  } catch (err: any) {
    console.error('Mission suggest error:', err);
    res.json({
      mission: {
        title: '창문 틈새로 하늘 바라보기',
        description: '창문을 살짝 열고 구름의 모양을 30초 동안 가만히 관찰해 봅니다.',
        durationSeconds: 30,
        difficulty: '초초간단',
        category: 'sunlight'
      },
      isFallback: true
    });
  }
});

// Direct zip download endpoint
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'project-app.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="life-outside-app-code.zip"');
    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('ZIP file not found');
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Life Outside server running on http://localhost:${PORT}`);
  });
}

startServer();
