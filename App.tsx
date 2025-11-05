import React, { useState, useEffect, useCallback } from 'react';
import type { TimelineEvent } from './types';
import { fetchTimelineData } from './services/geminiService';
import TimelineItem from './components/TimelineItem';
import DetailModal from './components/DetailModal';
import LoadingSpinner from './components/LoadingSpinner';
import QuizModal from './components/QuizModal';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedStates, setUnlockedStates] = useState<Record<string, boolean[]>>({});
  const [activeQuiz, setActiveQuiz] = useState<{ event: TimelineEvent; questionIndex: number } | null>(null);

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
    setUnlockedStates(prevStates => {
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
            Dòng Thời Gian<span className="text-red-600"> Thành Tựu Việt Nam</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Giải đố để mở khóa những cột mốc lịch sử và khám phá thành tựu nổi bật của Việt Nam thời kỳ Đổi Mới.
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
              unlockedState={unlockedStates[event.period] || [false, false, false, false]}
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
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-yellow-50 to-red-50 py-20 mt-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMzksMzIsNDEsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <span className="font-bold text-gray-800">Hành Trình Vẫn Tiếp Nối</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Từ Đổi Mới Đến <span className="text-red-600">Tương Lai</span>
            </h2>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Gần bốn thập kỷ Đổi Mới là một chặng đường đầy thử thách nhưng cũng vô cùng tự hào của dân tộc Việt Nam. Từ một quốc gia bị tàn phá bởi chiến tranh, Việt Nam đã vươn lên mạnh mẽ, hội nhập sâu rộng với thế giới và khẳng định vị thế của mình trên trường quốc tế.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Những thành tựu đã đạt được là nền tảng vững chắc, là động lực to lớn để chúng ta tiếp tục con đường phía trước, hiện thực hóa khát vọng xây dựng một Việt Nam hùng cường, thịnh vượng.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-red-600 mb-2">2045</div>
                <p className="text-gray-700 font-semibold">Tầm nhìn</p>
                <p className="text-sm text-gray-600 mt-2">Nước công nghiệp phát triển</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-yellow-600 mb-2">∞</div>
                <p className="text-gray-700 font-semibold">Khát vọng</p>
                <p className="text-sm text-gray-600 mt-2">Dân giàu, nước mạnh</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">★</div>
                <p className="text-gray-700 font-semibold">Giá trị</p>
                <p className="text-sm text-gray-600 mt-2">Dân chủ, công bằng, văn minh</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Đoàn kết
              </span>
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Sáng tạo
              </span>
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Phát triển bền vững
              </span>
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
      
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo_bgrm_1762119474497.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain opacity-80"
              />
              <div className="text-left">
                <p className="font-bold text-lg">Dòng Thời Gian Thành Tựu Việt Nam</p>
                <p className="text-gray-400 text-sm">Một sản phẩm học tập tương tác về Lịch sử Việt Nam</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                Giáo dục
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                Tương tác
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                2024
              </span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>© 2024 Dòng Thời Gian Thành Tựu Việt Nam. Được phát triển với ❤️ cho giáo dục lịch sử.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default App;