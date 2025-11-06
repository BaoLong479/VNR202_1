import React, { useState, useEffect, useCallback } from "react";
import type { TimelineEvent } from "./types";
import { fetchTimelineData } from "./services/geminiService";
import TimelineItem from "./components/TimelineItem";
import DetailModal from "./components/DetailModal";
import LoadingSpinner from "./components/LoadingSpinner";
import QuizModal from "./components/QuizModal";
import LandingPage from "./components/LandingPage";

const App: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null,
  );

  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedStates, setUnlockedStates] = useState<
    Record<string, boolean[]>
  >({});
  const [activeQuiz, setActiveQuiz] = useState<{
    event: TimelineEvent;
    questionIndex: number;
  } | null>(null);
  const [showAIUsageModal, setShowAIUsageModal] = useState(false);

  const initializeGameStates = (data: TimelineEvent[]) => {
    const initialStates: Record<string, boolean[]> = {};
    data.forEach((event, index) => {
      // Mở khóa mốc đầu tiên theo mặc định
      if (index === 0) {
        initialStates[event.period] = [true, true, true, true];
      } else {
        initialStates[event.period] = [false, false, false, false];
      }
    });
    setUnlockedStates(initialStates);
  };

  const loadTimelineData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTimelineData();
      setTimelineData(data);
      initializeGameStates(data);
    } catch (err) {
      console.error("Failed to load timeline data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gameStarted && timelineData.length === 0) {
      loadTimelineData();
    }
  }, [gameStarted, loadTimelineData, timelineData.length]);

  const handleSelectEvent = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDetailModal = () => {
    setSelectedEvent(null);
  };

  const handlePieceClick = (event: TimelineEvent, questionIndex: number) => {
    if (!unlockedStates[event.period][questionIndex]) {
      setActiveQuiz({ event, questionIndex });
    }
  };

  const handleCorrectAnswer = () => {
    if (!activeQuiz) return;
    const { event, questionIndex } = activeQuiz;
    setUnlockedStates((prevStates) => {
      const newStates = { ...prevStates };
      const eventStates = [...newStates[event.period]];
      eventStates[questionIndex] = true;
      newStates[event.period] = eventStates;
      return newStates;
    });
    setActiveQuiz(null); // Close modal on correct answer
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Dòng Thời Gian
            <span className="text-red-600"> Thành Tựu Việt Nam</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Giải đố để mở khóa những cột mốc lịch sử và khám phá thành tựu nổi
            bật của Việt Nam thời kỳ Đổi Mới.
          </p>
        </header>

        <div className="relative flex flex-col items-center">
          <div className="absolute top-0 left-1/2 w-1 bg-red-200 h-full -ml-0.5 hidden md:block"></div>
          {timelineData.map((event, index) => (
            <TimelineItem
              key={event.period}
              event={event}
              index={index}
              onSelect={handleSelectEvent}
              unlockedState={
                unlockedStates[event.period] || [false, false, false, false]
              }
              onPieceClick={handlePieceClick}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!gameStarted) {
    return <LandingPage onStart={() => setGameStarted(true)} />;
  }

  return (
    <main>
      {renderContent()}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50/30 to-red-50/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 pt-4">
              <h2
                className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-yellow-600 mb-3"
                style={{ lineHeight: "1.3" }}
              >
                Hành Trình Vẫn Tiếp Nối
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Gần bốn thập kỷ Đổi Mới là một chặng đường đầy thử thách nhưng
                cũng vô cùng tự hào của dân tộc Việt Nam. Từ một quốc gia bị tàn
                phá bởi chiến tranh, Việt Nam đã vươn lên mạnh mẽ, hội nhập sâu
                rộng với thế giới và khẳng định vị thế của mình trên trường quốc
                tế.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Những thành tựu đã đạt được là nền tảng vững chắc, là động lực
                to lớn để chúng ta tiếp tục con đường phía trước, hiện thực hóa
                khát vọng xây dựng một Việt Nam hùng cường, thịnh vượng,{" "}
                <span className="font-bold text-red-700">
                  "dân giàu, nước mạnh, dân chủ, công bằng, văn minh"
                </span>{" "}
                vào năm <span className="font-bold text-yellow-700">2045</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <DetailModal event={selectedEvent} onClose={handleCloseDetailModal} />
      {activeQuiz && (
        <QuizModal
          quizItem={activeQuiz.event.quiz[activeQuiz.questionIndex]}
          onClose={() => setActiveQuiz(null)}
          onCorrect={handleCorrectAnswer}
        />
      )}

      {/* Info Button */}
      <button
        onClick={() => setShowAIUsageModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center text-xl font-bold z-50"
        aria-label="AI Usage Information"
      >
        i
      </button>

      {/* AI Usage Modal */}
      {showAIUsageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">AI Usage</h2>
                <button
                  onClick={() => setShowAIUsageModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-bold text-blue-800 mb-2">
                    Google Gemini AI
                  </h3>
                  <p className="text-sm mb-2">
                    Ứng dụng này sử dụng Google Gemini AI để tổng hợp thông tin
                    về dòng thời gian lịch sử và tạo câu hỏi tương tác thành tựu
                    Đổi Mới của Việt Nam.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h3 className="font-bold text-purple-800 mb-2">
                    Replit AI Agent
                  </h3>
                  <p className="text-sm">
                    Ứng dụng web này được phát triển với sự hỗ trợ của Replit AI
                    Agent, giúp xây dựng giao diện tương tác và tối ưu trải
                    nghiệm người dùng.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAIUsageModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center py-6 bg-gray-100 border-t mt-12">
        <p className="text-gray-500">
          Một sản phẩm học tập tương tác về Lịch sử Việt Nam.
        </p>
      </footer>
    </main>
  );
};

export default App;
