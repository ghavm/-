import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, HeartHandshake, Smile, RefreshCw, Sun, BookOpen } from 'lucide-react';
import { EmpathyChatMessage, Mission, MoodType } from '../types';
import { soundFx } from '../utils/audio';

interface EmpathyAIChatProps {
  userMood: MoodType;
  onStartMissionByTitle?: (title: string) => void;
  onOpenQuoteBook?: () => void;
}

const QUICK_PROMPTS = [
  '문밖으로 나가는 게 너무 무섭고 심장이 뛰어요.',
  '오늘도 하루 종일 누워만 있어서 자책감이 들어요.',
  '📖 지금 내 마음에 와닿는 위로와 용기의 명언을 하나 들려줘.',
  '사람들과 대화할 때 무슨 말을 해야 할지 막막해요.',
  '오늘 작은 용기를 낸 나에게 칭찬 한마디 듣고 싶어요.',
  '아무 의욕이 없는데 지금 당장 방 안에서 할 수 있는 게 있을까요?'
];

export const EmpathyAIChat: React.FC<EmpathyAIChatProps> = ({
  userMood,
  onStartMissionByTitle,
  onOpenQuoteBook
}) => {
  const [messages, setMessages] = useState<EmpathyChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '안녕하세요, 저는 당신의 따뜻한 동행자 [햇살 지기]입니다. ☀️\n\n밖으로 나가지 않아도, 완벽하지 않아도 괜찮아요. 지금 마음에 품고 있는 두려움이나 작은 생각들을 편안하게 들려주세요. 온전히 당신의 편에서 귀 기울일게요.',
      timestamp: '방금 전'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const activeStreamController = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isStreaming]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading || isStreaming) return;

    soundFx.playSoftTap();
    const userMsg: EmpathyChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    const aiMsgId = 'ai-' + (Date.now() + 1);
    const controller = new AbortController();
    activeStreamController.current = controller;

    try {
      const res = await fetch('/api/empathy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(-6),
          userMood,
          stream: true
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Check if response is an SSE stream
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let accumulatedText = '';
        let isFirstToken = true;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;

                if (isFirstToken) {
                  isFirstToken = false;
                  setIsLoading(false);
                  setIsStreaming(true);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: aiMsgId,
                      sender: 'ai',
                      text: accumulatedText,
                      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                } else {
                  setMessages(prev =>
                    prev.map(m => (m.id === aiMsgId ? { ...m, text: accumulatedText } : m))
                  );
                }
              }
            } catch {
              // Ignore partial JSON parse errors
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim().startsWith('data:')) {
          const dataStr = buffer.trim().slice(5).trim();
          if (dataStr !== '[DONE]') {
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages(prev =>
                  prev.map(m => (m.id === aiMsgId ? { ...m, text: accumulatedText } : m))
                );
              }
            } catch {}
          }
        }

        if (!accumulatedText.trim()) {
          throw new Error('Empty streamed response');
        }
      } else {
        // Fallback standard JSON
        const data = await res.json();
        const aiReply = data.reply || '당신의 곁에서 항상 응원하고 있어요. 천천히 숨을 쉬어보세요.';
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: aiReply,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Empathy chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: '당신의 마음이 얼마나 무거웠을지 깊이 공감해요. 혼자 삼키지 않고 이렇게 나눠줘서 정말 고마워요. 천천히 깊게 숨을 한번 내쉬어 볼까요? 🌿',
          timestamp: '방금 전'
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      activeStreamController.current = null;
    }
  };

  useEffect(() => {
    return () => {
      activeStreamController.current?.abort();
    };
  }, []);

  const handleResetChat = () => {
    soundFx.playSoftTap();
    activeStreamController.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: '새로운 마음으로 대화를 시작해 볼까요? 어떤 이야기든 괜찮습니다. 편안하게 들려주세요. ☀️',
        timestamp: '방금 전'
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[620px] bg-[#FEF6E4] rounded-[36px] border-4 border-[#001858] shadow-[8px_8px_0px_0px_#001858] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-[#8BD3DD] border-b-3 border-[#001858] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F582AE] text-[#001858] border-2 border-[#001858] flex items-center justify-center shadow-[2px_2px_0px_0px_#001858]">
            <Sun className="w-5 h-5 fill-[#001858]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-[#001858]">햇살 지기</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#001858] border border-[#001858] text-[10px] font-black shadow-[1px_1px_0px_0px_#001858]">
                실시간 빠른 공감
              </span>
            </div>
            <p className="text-xs text-[#001858]/80 font-bold">당신의 모든 감정을 있는 그대로 수용하는 AI 공감 친구</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQuoteBook && (
            <button
              onClick={() => {
                soundFx.playSoftTap();
                onOpenQuoteBook();
              }}
              className="px-2.5 py-1.5 rounded-2xl bg-[#FFD166] border-2 border-[#001858] text-[#001858] hover:bg-[#FFD166]/80 transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 text-xs font-black cursor-pointer"
              title="용기 충전 명언 북 (25편) 열기"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">명언 북 📖</span>
            </button>
          )}

          <button
            onClick={handleResetChat}
            className="p-2 rounded-2xl bg-white border-2 border-[#001858] text-[#001858] hover:bg-[#F3D2C1] transition-all shadow-[2px_2px_0px_0px_#001858] active:translate-x-[1px] active:translate-y-[1px]"
            title="대화 초기화"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, idx) => {
          const isAI = msg.sender === 'ai';
          const isLatestAIMsg = isAI && idx === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-2xl bg-[#F582AE] text-[#001858] border-2 border-[#001858] flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-[2px_2px_0px_0px_#001858]">
                  <Sun className="w-4 h-4 fill-[#001858]" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-[24px] p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-2 border-[#001858] ${
                  isAI
                    ? 'bg-[#FEF6E4] text-[#001858] shadow-[3px_3px_0px_0px_#001858] rounded-tl-xs font-bold'
                    : 'bg-[#001858] text-white shadow-[3px_3px_0px_0px_#F582AE] rounded-tr-xs font-bold'
                }`}
              >
                <p>
                  {msg.text}
                  {isLatestAIMsg && isStreaming && (
                    <span className="inline-block w-2 h-3.5 ml-1 bg-[#F582AE] animate-pulse align-middle rounded-xs" />
                  )}
                </p>
                <span
                  className={`block text-[10px] mt-2 text-right font-black ${
                    isAI ? 'text-[#001858]/60' : 'text-[#8BD3DD]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-2xl bg-[#8BD3DD] text-[#001858] border-2 border-[#001858] flex items-center justify-center text-xs font-black shrink-0 mt-1 shadow-[2px_2px_0px_0px_#001858]">
                  <User className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#001858] font-black bg-[#8BD3DD]/30 p-3.5 rounded-2xl w-fit border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858]">
            <Sparkles className="w-4 h-4 animate-spin text-[#001858]" />
            <span>햇살 지기가 따뜻하게 귀 기울이고 있어요...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 bg-[#FEF6E4] border-t-2 border-[#001858] overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-black text-[#001858] shrink-0 flex items-center gap-1 pl-1">
          <Smile className="w-3.5 h-3.5" /> 추천 질문:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading || isStreaming}
            className="px-3.5 py-1 rounded-full bg-white hover:bg-[#F3D2C1] border-2 border-[#001858] text-[#001858] text-xs font-bold whitespace-nowrap shadow-[2px_2px_0px_0px_#001858] transition-all disabled:opacity-50 active:translate-x-[1px] active:translate-y-[1px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-[#FEF6E4] border-t-2 border-[#001858] flex items-center gap-2">
        <input
          type="text"
          placeholder="솔직한 마음을 편안하게 적어보세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading || isStreaming}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#001858] text-xs sm:text-sm font-bold text-[#001858] shadow-[2px_2px_0px_0px_#001858] focus:outline-hidden focus:shadow-[4px_4px_0px_0px_#001858]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading || isStreaming}
          className="p-3 rounded-2xl bg-[#F582AE] hover:bg-[#F582AE]/80 disabled:opacity-40 text-[#001858] border-2 border-[#001858] font-black shadow-[3px_3px_0px_0px_#001858] transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
