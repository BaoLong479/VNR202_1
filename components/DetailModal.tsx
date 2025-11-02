
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

  // Extract world context section from details for Pre-1986
  const getWorldContext = (details: string) => {
    const lines = details.split('\n');
    const worldContextLines: string[] = [];
    let inWorldContext = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '**Bối cảnh thế giới:**') {
        inWorldContext = true;
        worldContextLines.push(line);
        continue;
      }
      if (trimmedLine.startsWith('**Bối cảnh Việt Nam:**')) {
        break;
      }
      if (inWorldContext) {
        worldContextLines.push(line);
      }
    }
    
    return worldContextLines.join('\n');
  };

  // Get Vietnam context and remaining details (excluding world context)
  const getVietnamContextAndRest = (details: string) => {
    const lines = details.split('\n');
    const filteredLines: string[] = [];
    let skipWorldContext = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '**Bối cảnh thế giới:**') {
        skipWorldContext = true;
        continue;
      }
      if (trimmedLine.startsWith('**Bối cảnh Việt Nam:**')) {
        skipWorldContext = false;
      }
      if (!skipWorldContext) {
        filteredLines.push(line);
      }
    }
    
    return filteredLines.join('\n');
  };

  // Component for Pre-1986 Visualization
  const Pre1986Visualization = () => (
    <div className="space-y-8 mb-8">
      {/* Inflation Highlight */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-red-100">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">Đỉnh Điểm Khủng Hoảng</h3>
        <p className="text-gray-700 mb-4">
          Cuộc cải cách "Giá - Lương - Tiền" năm 1985 thất bại đã đẩy lạm phát lên mức phi mã
        </p>
        <div className="text-7xl font-bold text-red-600 my-4">
          774.7%
        </div>
        <p className="text-xl font-semibold text-gray-800">Tỷ lệ lạm phát năm 1986</p>
      </div>

      {/* Economic Model Diagram */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Mô Hình Kinh Tế "Bao Cấp"
        </h3>
        <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
          Giai đoạn này được đặc trưng bởi cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp. 
          Nhà nước quyết định mọi thứ từ sản xuất đến phân phối, triệt tiêu động lực phát triển.
        </p>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
            <h4 className="text-xl font-semibold text-blue-700 mb-2">Nhà nước</h4>
            <p className="text-gray-700">
              Lập kế hoạch sản xuất, ấn định giá, và kiểm soát toàn bộ lưu thông hàng hóa
            </p>
          </div>
          
          <div className="text-4xl font-bold text-blue-600">↓</div>
          
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
            <h4 className="text-xl font-semibold text-green-700 mb-2">Doanh nghiệp / Hợp tác xã</h4>
            <p className="text-gray-700">
              Thực hiện theo mệnh lệnh, không có quyền tự chủ trong sản xuất và kinh doanh
            </p>
          </div>
          
          <div className="text-4xl font-bold text-blue-600">↓</div>
          
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 w-full md:w-3/4 text-center shadow-md">
            <h4 className="text-xl font-semibold text-orange-700 mb-2">Người dân</h4>
            <p className="text-gray-700">
              Nhận phân phối theo tem phiếu, thiếu hàng hóa, không có động lực lao động
            </p>
          </div>
        </div>
      </div>

      {/* Key Crisis Indicators */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-red-700 mb-2">300% → 774%</div>
          <p className="text-gray-700 font-semibold">Lạm phát tăng vọt (1985-1986)</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-yellow-700 mb-2">Tem phiếu</div>
          <p className="text-gray-700 font-semibold">Hệ thống phân phối hàng hóa</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-blue-700 mb-2">Vượt biên</div>
          <p className="text-gray-700 font-semibold">Hiện tượng xã hội phổ biến</p>
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

          {/* Show world context first for Pre-1986 event */}
          {isPre1986 && (
            <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-6 mb-8">
              {formatDetails(getWorldContext(event.details))}
            </div>
          )}

          {/* Show visualization for Pre-1986 event */}
          {isPre1986 && <Pre1986Visualization />}
          
          <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-6">
            {formatDetails(isPre1986 ? getVietnamContextAndRest(event.details) : event.details)}
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
