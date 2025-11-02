
import React from 'react';
import type { TimelineEvent } from '../types';

interface DetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  // Check if this is the "Trước 1986" event
  const isPre1986 = event.period === "Trước 1986";

  // Enhanced formatter for better rendering
  const formatDetails = (details: string) => {
    const lines = details.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let currentSection = '';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="mb-4 ml-6 space-y-2">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        return;
      }

      // Headers (bold text with **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Close any open list
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="mb-4 ml-6 space-y-2">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        
        const headerText = trimmedLine.slice(2, -2);
        const isMainHeader = !currentSection;
        currentSection = headerText;
        
        elements.push(
          <h3 
            key={`header-${index}`} 
            className={`font-bold text-gray-900 mb-3 mt-6 ${
              isMainHeader ? 'text-xl border-b-2 border-red-500 pb-2' : 'text-lg text-red-700'
            }`}
          >
            {headerText}
          </h3>
        );
        return;
      }

      // List items
      if (trimmedLine.startsWith('- ')) {
        const content = trimmedLine.substring(2);
        listItems.push(
          <li key={`item-${index}`} className="text-gray-700 leading-relaxed">
            <span className="text-red-500 font-bold mr-2">•</span>
            {content}
          </li>
        );
        return;
      }

      // Regular paragraphs
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="mb-4 ml-6 space-y-2">
            {listItems}
          </ul>
        );
        listItems = [];
      }
      
      elements.push(
        <p key={`para-${index}`} className="mb-3 text-gray-700 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });

    // Close any remaining list
    if (listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="mb-4 ml-6 space-y-2">
          {listItems}
        </ul>
      );
    }

    return elements;
  };

  // Component for Pre-1986 Visualization
  const Pre1986Visualization = () => (
    <div className="space-y-8 mb-8">
      {/* Bối cảnh thế giới - Section đầu tiên */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-8">
        <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 border-b-4 border-purple-500 pb-3">
          🌍 Bối Cảnh Thế Giới
        </h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
            <h4 className="text-xl font-semibold text-purple-700 mb-3">
              ⚙️ Cách mạng Khoa học - Kỹ thuật
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Phát triển mạnh mẽ, thúc đẩy toàn cầu hóa và hội nhập kinh tế
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <h4 className="text-xl font-semibold text-blue-700 mb-3">
              ☮️ Đối thoại thay Đối đầu
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Chiến tranh Lạnh hạ nhiệt, xu thế hòa bình nổi lên
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-green-700 mb-3">
              🔄 Đổi mới - Xu thế thời đại
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Nhiều quốc gia tìm kiếm con đường phát triển mới
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-500">
            <h4 className="text-xl font-semibold text-red-700 mb-3">
              🏛️ Cải tổ CNXH
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Liên Xô và Đông Âu tiến hành cải tổ, tạo áp lực thay đổi
            </p>
          </div>
        </div>
      </div>

      {/* Bối cảnh Việt Nam - với các visualization */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-8">
        <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 border-b-4 border-red-500 pb-3">
          🇻🇳 Bối Cảnh Việt Nam
        </h3>
        
        {/* Bao vây cấm vận */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-orange-300">
          <h4 className="text-2xl font-bold text-orange-700 mb-4 text-center">
            🚫 Bao vây - Cấm vận toàn diện
          </h4>
          <p className="text-gray-700 text-center mb-4">
            Bị các đế quốc và thế lực thù địch cô lập về kinh tế và chính trị
          </p>
          <div className="flex justify-center items-center">
            <div className="relative">
              <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                VN
              </div>
              <div className="absolute -top-4 -left-4 w-40 h-40 border-4 border-red-300 rounded-full animate-pulse"></div>
              <div className="absolute -top-8 -left-8 w-48 h-48 border-4 border-red-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>

        {/* Inflation Highlight */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-red-100 mb-6">
          <h4 className="text-2xl font-bold mb-2 text-gray-800">📈 Đỉnh Điểm Khủng Hoảng</h4>
          <p className="text-gray-700 mb-4">
            Cuộc cải cách "Giá - Lương - Tiền" năm 1985 thất bại đã đẩy lạm phát lên mức phi mã
          </p>
          <div className="text-7xl font-bold text-red-600 my-4">
            774.7%
          </div>
          <p className="text-xl font-semibold text-gray-800">Tỷ lệ lạm phát năm 1986</p>
        </div>

        {/* Economic Crisis Indicators */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl mb-2">🍚</div>
            <div className="text-2xl font-bold text-red-700 mb-2">Thiếu lương thực</div>
            <p className="text-gray-700 font-semibold">Khan hiếm trầm trọng</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl mb-2">🎫</div>
            <div className="text-2xl font-bold text-yellow-700 mb-2">Tem phiếu</div>
            <p className="text-gray-700 font-semibold">Hệ thống phân phối</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-4xl mb-2">🚢</div>
            <div className="text-2xl font-bold text-blue-700 mb-2">Vượt biên</div>
            <p className="text-gray-700 font-semibold">Hiện tượng phổ biến</p>
          </div>
        </div>

        {/* Economic Model Diagram */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
            🏭 Mô Hình Kinh Tế "Bao Cấp"
          </h4>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Giai đoạn này được đặc trưng bởi cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp. 
            Nhà nước quyết định mọi thứ từ sản xuất đến phân phối, triệt tiêu động lực phát triển.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
              <h5 className="text-xl font-semibold text-blue-700 mb-2">🏛️ Nhà nước</h5>
              <p className="text-gray-700">
                Lập kế hoạch sản xuất, ấn định giá, và kiểm soát toàn bộ lưu thông hàng hóa
              </p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">↓</div>
            
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
              <h5 className="text-xl font-semibold text-green-700 mb-2">🏢 Doanh nghiệp / Hợp tác xã</h5>
              <p className="text-gray-700">
                Thực hiện theo mệnh lệnh, không có quyền tự chủ trong sản xuất và kinh doanh
              </p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">↓</div>
            
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
              <h5 className="text-xl font-semibold text-orange-700 mb-2">👥 Người dân</h5>
              <p className="text-gray-700">
                Nhận phân phối theo tem phiếu, thiếu hàng hóa, không có động lực lao động
              </p>
            </div>
          </div>
        </div>

        {/* Inflation Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
            📊 Diễn biến Lạm phát (1985-1986)
          </h4>
          <div className="flex items-end justify-around h-64">
            <div className="flex flex-col items-center">
              <div className="bg-orange-400 w-20 rounded-t-lg" style={{ height: '50%' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-orange-600">300%</div>
                <div className="text-sm text-gray-600">1985</div>
              </div>
            </div>
            
            <div className="text-4xl font-bold text-red-600 self-center">→</div>
            
            <div className="flex flex-col items-center">
              <div className="bg-red-600 w-20 rounded-t-lg animate-pulse" style={{ height: '100%' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-red-600">774.7%</div>
                <div className="text-sm text-gray-600">1986</div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-700 mt-6 font-semibold">
            ⚠️ Siêu lạm phát - Bài học xương máu về tôn trọng quy luật kinh tế
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 border-b border-red-800 flex justify-between items-center shadow-md z-10">
          <div>
            <p className="text-sm font-semibold text-red-100 mb-1">{event.period}</p>
            <h2 className="text-2xl font-bold">{event.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-200 transition-colors p-2 hover:bg-red-800 rounded-full"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <img 
              src={event.imageUrl}
              alt={event.title} 
              className="w-full h-80 object-cover rounded-lg shadow-lg bg-gray-200"
            />
          </div>

          {/* Show visualization for Pre-1986 event */}
          {isPre1986 && <Pre1986Visualization />}
          
          <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-6">
            {formatDetails(event.details)}
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DetailModal;
