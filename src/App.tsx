import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MainLandingPage } from './components/MainLandingPage';
import { DailyCheerCard } from './components/DailyCheerCard';
import { MicroMissionsView } from './components/MicroMissionsView';
import { GardenProgress } from './components/GardenProgress';
import { EmpathyAIChat } from './components/EmpathyAIChat';
import { ActiveMissionModal } from './components/ActiveMissionModal';
import { SupportDirectoryModal } from './components/SupportDirectoryModal';
import { JournalModal } from './components/JournalModal';
import { SettingsModal } from './components/SettingsModal';
import { QuoteBookModal } from './components/QuoteBookModal';
import { INITIAL_MISSIONS } from './data/initialData';
import { Mission, MissionLevel, MoodType, JournalEntry, ViewMode, QuoteCategory } from './types';
import { soundFx } from './utils/audio';
import { Smartphone, Monitor, Settings } from 'lucide-react';

const STORAGE_KEY = 'life_outside_data_v1';
const VIEW_MODE_KEY = 'life_outside_view_mode_v1';
const FONT_SIZE_KEY = 'life_outside_font_size_v1';
const SOUND_KEY = 'life_outside_sound_enabled_v1';

export default function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'missions' | 'garden' | 'empathy'>('missions');
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');

  // View Mode & Preferences state
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return (saved === 'desktop' || saved === 'mobile' || saved === 'auto') ? saved : 'auto';
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large'>(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved === 'large' ? 'large' : 'normal';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(SOUND_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  // App core state
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.missions && Array.isArray(parsed.missions)) {
          // Merge newly added INITIAL_MISSIONS so the user immediately gets new high difficulty missions
          const savedMap = new Map<string, Mission>(parsed.missions.map((m: Mission) => [m.id, m]));
          // Custom missions created by user
          const customMissions = parsed.missions.filter((m: Mission) => m.isCustom);
          // Reconcile initial missions preserving completed state
          const reconciledInitial = INITIAL_MISSIONS.map(m => {
            const existing = savedMap.get(m.id);
            return existing ? { ...m, completed: existing.completed, completedAt: existing.completedAt } : m;
          });
          return [...reconciledInitial, ...customMissions];
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_MISSIONS;
  });

  const [totalSunlight, setTotalSunlight] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.totalSunlight === 'number') {
          // If stored value was legacy initial 20 with no missions done, start at 0
          const hasDoneMissions = parsed.missions && parsed.missions.some((m: Mission) => m.completed);
          const hasJournals = parsed.journalEntries && parsed.journalEntries.length > 0;
          if (parsed.totalSunlight === 20 && !hasDoneMissions && !hasJournals) {
            return 0;
          }
          return parsed.totalSunlight;
        }
      } catch {
        // Fallback
      }
    }
    return 0;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.journalEntries || [];
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Modals state
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [showJournalModal, setShowJournalModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showQuoteBook, setShowQuoteBook] = useState<boolean>(false);
  const [quoteBookCategory, setQuoteBookCategory] = useState<QuoteCategory | undefined>(undefined);

  const handleOpenQuoteBook = (category?: QuoteCategory) => {
    setQuoteBookCategory(category);
    setShowQuoteBook(true);
  };

  // Compute current level based on totalSunlight
  const currentLevel: MissionLevel = 
    totalSunlight >= 400 ? 6 :
    totalSunlight >= 280 ? 5 :
    totalSunlight >= 180 ? 4 :
    totalSunlight >= 100 ? 3 :
    totalSunlight >= 40 ? 2 : 1;

  // Persist core state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        missions,
        totalSunlight,
        journalEntries
      })
    );
  }, [missions, totalSunlight, journalEntries]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  // Handle mission completion from interactive modal or checkbox
  const handleCompleteMission = (missionId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId && !m.completed) {
          setTotalSunlight(s => s + m.rewardSunlight);
          return { ...m, completed: true, completedAt: new Date().toISOString() };
        }
        return m;
      })
    );
  };

  // Toggle mission completion
  const handleToggleComplete = (missionId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          const nextCompleted = !m.completed;
          if (nextCompleted) {
            if (soundEnabled) soundFx.playSuccessChime();
            setTotalSunlight(s => s + m.rewardSunlight);
          } else {
            setTotalSunlight(s => Math.max(0, s - m.rewardSunlight));
          }
          return {
            ...m,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return m;
      })
    );
  };

  // Add custom mission
  const handleAddCustomMission = (newMissionData: Omit<Mission, 'id' | 'completed'>) => {
    const newMission: Mission = {
      ...newMissionData,
      id: 'custom-' + Date.now(),
      completed: false
    };
    setMissions(prev => [newMission, ...prev]);
  };

  // Save journal entry
  const handleSaveJournal = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
    setTotalSunlight(s => s + entry.sunlightGained);
  };

  // Reset all data to fresh start
  const handleResetData = () => {
    setMissions(INITIAL_MISSIONS);
    setTotalSunlight(0);
    setJournalEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const completedMissionsCount = missions.filter(m => m.completed).length;

  // Main App Content component to allow wrapping inside phone frame or full width
  const renderAppContent = () => (
    <div className={`flex flex-col flex-1 ${fontSize === 'large' ? 'text-[1.08rem]' : ''}`}>
      {!isStarted ? (
        /* 1. START SCREEN (전면 시작 화면) */
        <div className="flex-1 flex flex-col justify-center">
          <MainLandingPage
            currentLevel={currentLevel}
            totalSunlight={totalSunlight}
            completedMissionsCount={completedMissionsCount}
            totalMissionsCount={missions.length}
            viewMode={viewMode}
            onStart={(targetTab = 'missions') => {
              setIsStarted(true);
              setActiveTab(targetTab);
            }}
            onOpenSupport={() => setShowSupportModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenQuoteBook={() => handleOpenQuoteBook()}
          />
        </div>
      ) : (
        /* 2. MAIN APP DASHBOARD (시작하기 클릭 후 진입: [미션], [공감AI], [정원]) */
        <>
          {/* Top Navigation Bar: 3 Tabs (미션 / 공감AI / 정원) */}
          <Navbar
            currentLevel={currentLevel}
            totalSunlight={totalSunlight}
            onOpenSupport={() => setShowSupportModal(true)}
            onOpenJournal={() => setShowJournalModal(true)}
            onOpenQuoteBook={() => handleOpenQuoteBook()}
            onOpenEmpathyChat={() => setActiveTab('empathy')}
            onOpenSettings={() => setShowSettingsModal(true)}
            onGoToStart={() => setIsStarted(false)}
            viewMode={viewMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content Area */}
          <main className={`flex-1 w-full mx-auto py-4 sm:py-8 space-y-7 ${
            viewMode === 'mobile' ? 'max-w-md px-3.5' : 'max-w-6xl px-4 sm:px-6'
          }`}>
            {/* Tab 1: Behavioral Micro-Missions */}
            {activeTab === 'missions' && (
              <>
                <DailyCheerCard
                  selectedMood={selectedMood}
                  onSelectMood={setSelectedMood}
                  onOpenEmpathyChat={() => setActiveTab('empathy')}
                  onOpenQuoteBook={() => handleOpenQuoteBook()}
                />
                <MicroMissionsView
                  missions={missions}
                  onStartMission={(m) => setActiveMission(m)}
                  onToggleComplete={handleToggleComplete}
                  onAddCustomMission={handleAddCustomMission}
                />
              </>
            )}

            {/* Tab 2: Empathy AI Chat */}
            {activeTab === 'empathy' && (
              <EmpathyAIChat
                userMood={selectedMood}
                onStartMissionByTitle={(title) => {
                  const matched = missions.find(m => m.title.includes(title));
                  if (matched) setActiveMission(matched);
                }}
                onOpenQuoteBook={() => handleOpenQuoteBook('comfort')}
              />
            )}

            {/* Tab 3: Garden Progress & Journey */}
            {activeTab === 'garden' && (
              <GardenProgress
                totalSunlight={totalSunlight}
                currentLevel={currentLevel}
                completedMissionsCount={completedMissionsCount}
                totalMissionsCount={missions.length}
                history={[]}
              />
            )}
          </main>

          {/* Vibrant Palette Footer */}
          <footer className="mt-auto py-6 border-t-4 border-[#001858] bg-[#FEF6E4] text-center text-xs text-[#001858] font-bold">
            <div className={`mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 ${
              viewMode === 'mobile' ? 'max-w-md px-3.5' : 'max-w-6xl px-4'
            }`}>
              <button
                onClick={() => setIsStarted(false)}
                className="flex items-center gap-1.5 text-center sm:text-left hover:underline cursor-pointer"
                title="시작 화면으로 돌아가기"
              >
                <span className="w-6 h-6 rounded-full bg-[#8BD3DD] border-2 border-[#001858] flex items-center justify-center text-xs shrink-0">⚡</span>
                <strong>폭풍을 부르는! 방구석 탈출 대작전</strong> ~ A급 인생 서바이벌 ~
              </button>
              <span className="text-[11px] px-3 py-1 bg-white border-2 border-[#001858] rounded-full shadow-[2px_2px_0px_0px_#001858]">
                위기상담: 129 / 1577-0199
              </span>
            </div>
          </footer>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEF6E4] text-[#001858] font-sans selection:bg-[#F582AE] selection:text-[#001858] flex flex-col overflow-x-hidden">
      {/* If Mobile view mode is active on PC/Large screens, frame it cleanly; on actual mobile screens it fits 100% full width edge-to-edge */}
      {viewMode === 'mobile' ? (
        <div className="min-h-screen bg-[#F3D2C1]/30 sm:py-6 sm:px-4 flex flex-col items-center justify-start overflow-x-hidden">
          {/* Quick View Control Banner */}
          <div className="w-full max-w-md mb-2.5 flex items-center justify-between px-3 py-1 text-xs font-black text-[#001858]">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#001858]" />
              <span>📱 스마트폰 모드</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playSoftTap();
                  setViewMode('desktop');
                }}
                className="px-2.5 py-1 rounded-xl bg-white border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] text-[11px] flex items-center gap-1 hover:bg-[#8BD3DD]/30 transition-all font-bold active:translate-x-[1px] active:translate-y-[1px]"
                title="컴퓨터 넓은 화면 모드로 전환"
              >
                <Monitor className="w-3 h-3" />
                <span>PC 뷰</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playSoftTap();
                  setShowSettingsModal(true);
                }}
                className="p-1 rounded-xl bg-white border-2 border-[#001858] shadow-[2px_2px_0px_0px_#001858] hover:bg-[#FEF6E4] active:translate-x-[1px] active:translate-y-[1px]"
                title="설정 열기"
                aria-label="설정 열기"
              >
                <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Clean Mobile Container (100% fluid on real phones, neatly bounded on desktop screens) */}
          <div className="w-full max-w-md bg-[#FEF6E4] rounded-none sm:rounded-[36px] border-0 sm:border-4 border-[#001858] shadow-none sm:shadow-[8px_8px_0px_0px_#001858] flex flex-col overflow-x-hidden min-h-screen sm:min-h-0">
            {renderAppContent()}
          </div>
        </div>
      ) : (
        /* Desktop or Auto Layout */
        renderAppContent()
      )}

      {/* Interactive Active Mission Modal */}
      {activeMission && (
        <ActiveMissionModal
          mission={activeMission}
          onClose={() => setActiveMission(null)}
          onComplete={handleCompleteMission}
        />
      )}

      {/* Support Network Directory Modal */}
      {showSupportModal && (
        <SupportDirectoryModal onClose={() => setShowSupportModal(false)} />
      )}

      {/* Daily Journal Modal */}
      {showJournalModal && (
        <JournalModal
          onClose={() => setShowJournalModal(false)}
          entries={journalEntries}
          onSaveEntry={handleSaveJournal}
          completedMissionsCount={completedMissionsCount}
        />
      )}

      {/* Settings Modal (폰/컴퓨터 뷰 선택 및 환경 설정) */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          fontSize={fontSize}
          onSelectFontSize={setFontSize}
          soundEnabled={soundEnabled}
          onToggleSound={setSoundEnabled}
          onResetData={handleResetData}
          totalSunlight={totalSunlight}
          completedMissionsCount={completedMissionsCount}
        />
      )}

      {/* Quote Book Modal (용기 충전 명언 북 - 25편) */}
      {showQuoteBook && (
        <QuoteBookModal
          onClose={() => setShowQuoteBook(false)}
          initialCategory={quoteBookCategory}
        />
      )}
    </div>
  );
}

