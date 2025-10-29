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
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [unlockedStates, setUnlockedStates] = useState<Record<string, boolean[]>>({});
  const [activeQuiz, setActiveQuiz] = useState<{ event: TimelineEvent; questionIndex: number } | null>(null);
  const [userFlag, setUserFlag] = useState("");

  /** 🚀 Khởi tạo trạng thái mở khóa **/
  const initializeGameStates = (data: TimelineEvent[]) => {
    const initialStates: Record<string, boolean[]> = {};
    data.forEach((event, index) => {
      if (index === 0) {
        // Mốc đầu tiên mở sẵn
        initialStates[event.period] = [true, true, true, true];
      } else if (index === 2) {
        // Một số mốc đặc biệt chỉ có 3 quiz
        initialStates[event.period] = [false, false, false];
      }
      else if (index === 3) {
        // Một số mốc đặc biệt chỉ có 1 quiz
        initialStates[event.period] = [false];
      } else {
        initialStates[event.period] = [false, false, false, false];
      }
    });
    setUnlockedStates(initialStates);
  };

  /** 📥 Tải dữ liệu timeline **/
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

  /** ⚡ Chạy khi game bắt đầu **/
  useEffect(() => {
    if (gameStarted && timelineData.length === 0) {
      loadTimelineData();
    }
  }, [gameStarted, loadTimelineData, timelineData.length]);

  /** 🧭 Modal chi tiết **/
  const handleSelectEvent = (event: TimelineEvent) => setSelectedEvent(event);
  const handleCloseDetailModal = () => setSelectedEvent(null);

  /** 🎯 Khi click mảnh khóa => mở quiz **/
  const handlePieceClick = (event: TimelineEvent, questionIndex: number) => {
    if (!unlockedStates[event.period][questionIndex]) {
      setActiveQuiz({ event, questionIndex });
      setUserFlag(""); // reset input mỗi lần mở quiz
    }
  };

  /** 🧩 Xử lý nộp flag **/
  const handleSubmitFlag = (flag: string) => {
    if (!activeQuiz) return;
    const { event, questionIndex } = activeQuiz;
    const correctFlag = event.quiz[questionIndex].flagAnswer.trim().toLowerCase();

    if (flag.trim().toLowerCase() === correctFlag) {
      setUnlockedStates((prev) => {
        const updated = { ...prev };
        const eventStates = [...updated[event.period]];
        eventStates[questionIndex] = true;
        updated[event.period] = eventStates;
        return updated;
      });
      alert("🎉 Chính xác! Flag hợp lệ.");
      setActiveQuiz(null);
    } else {
      alert("❌ Sai flag! Thử lại nhé.");
    }
  };


  /** 🖼️ Render nội dung timeline **/
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;

    return (
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Dòng Thời Gian <span className="text-red-600">Thành Tựu Việt Nam</span>
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

  /** 🕹️ Giao diện landing trước khi bắt đầu **/
  if (!gameStarted) {
    return <LandingPage onStart={() => setGameStarted(true)} />;
  }

  /** 📜 Giao diện chính **/
  return (
    <main>
      {renderContent()}

      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Hành Trình Vẫn Tiếp Nối</h2>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          Hơn ba thập kỷ Đổi Mới là một chặng đường đầy thử thách nhưng cũng vô cùng tự hào của dân tộc Việt Nam.
          Từ một quốc gia bị tàn phá bởi chiến tranh, Việt Nam đã vươn lên mạnh mẽ, hội nhập sâu rộng với thế giới
          và khẳng định vị thế của mình trên trường quốc tế.
        </p>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed mt-4">
          Những thành tựu đã đạt được là nền tảng vững chắc, là động lực to lớn để chúng ta tiếp tục con đường phía
          trước, hiện thực hóa khát vọng xây dựng một Việt Nam hùng cường, thịnh vượng, "dân giàu, nước mạnh, dân
          chủ, công bằng, văn minh" vào năm 2045.
        </p>
      </section>

      <DetailModal event={selectedEvent} onClose={handleCloseDetailModal} />

      {/* Modal quiz flag nhập tay */}
      {activeQuiz && (
        <QuizModal
          quizItem={activeQuiz.event.quiz[activeQuiz.questionIndex]}
          onClose={() => setActiveQuiz(null)}
          onSubmitFlag={handleSubmitFlag} // ✅ trực tiếp truyền vào đây
        />
      )}



      <footer className="text-center py-6 bg-gray-100 border-t mt-12">
        <p className="text-gray-500">
          Một sản phẩm học tập tương tác về Lịch sử Đảng Cộng sản Việt Nam.
        </p>
      </footer>
    </main>
  );
};

export default App;
