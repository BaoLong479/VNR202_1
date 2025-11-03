
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
  const is1986 = event.period === "1986";

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

  // Component for 1986 Visualization
  const Event1986Visualization = () => (
    <div className="space-y-8 mb-8">
      {/* Đại hội VI Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-center text-white">
        <div className="text-sm font-semibold mb-2 text-red-100">15 - 18 tháng 12, 1986</div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">ĐẠI HỘI ĐẠI BIỂU TOÀN QUỐC LẦN THỨ VI</h3>
        <p className="text-xl mb-3">Đại hội của sự Đổi Mới</p>
        <div className="inline-block bg-white text-red-700 px-6 py-3 rounded-lg font-bold text-lg">
          Tổng Bí thư: Nguyễn Văn Linh
        </div>
      </div>

      {/* Bốn bài học quý báu */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-500 pb-3">
          Bốn Bài Học Quý Báu
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start">
              <span className="text-3xl font-bold text-blue-600 mr-4">1</span>
              <div>
                <h4 className="font-bold text-blue-800 mb-2">Lấy dân làm gốc</h4>
                <p className="text-gray-700 text-sm">Trong toàn bộ hoạt động của mình, Đảng phải quán triệt tư tưởng "lấy dân làm gốc"</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-start">
              <span className="text-3xl font-bold text-green-600 mr-4">2</span>
              <div>
                <h4 className="font-bold text-green-800 mb-2">Tôn trọng quy luật</h4>
                <p className="text-gray-700 text-sm">Đảng phải luôn xuất phát từ thực tế, tôn trọng và hành động theo quy luật khách quan</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-start">
              <span className="text-3xl font-bold text-purple-600 mr-4">3</span>
              <div>
                <h4 className="font-bold text-purple-800 mb-2">Kết hợp hai sức mạnh</h4>
                <p className="text-gray-700 text-sm">Phải biết kết hợp sức mạnh dân tộc với sức mạnh thời đại trong điều kiện mới</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-start">
              <span className="text-3xl font-bold text-orange-600 mr-4">4</span>
              <div>
                <h4 className="font-bold text-orange-800 mb-2">Xây dựng Đảng</h4>
                <p className="text-gray-700 text-sm">Chăm lo xây dựng Đảng ngang tầm một đảng cầm quyền lãnh đạo nhân dân tiến hành cách mạng XHCN</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ba chương trình kinh tế lớn */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-500 pb-3">
          Ba Chương Trình Kinh Tế Lớn
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-b from-green-50 to-green-100 rounded-lg shadow-md">
            <div className="text-5xl mb-3">🌾</div>
            <h4 className="font-bold text-green-800 mb-2">Lương thực - Thực phẩm</h4>
            <p className="text-sm text-gray-700">Đảm bảo an ninh lương thực quốc gia</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-md">
            <div className="text-5xl mb-3">🏭</div>
            <h4 className="font-bold text-blue-800 mb-2">Hàng tiêu dùng</h4>
            <p className="text-sm text-gray-700">Phát triển sản xuất hàng tiêu dùng</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg shadow-md">
            <div className="text-5xl mb-3">📦</div>
            <h4 className="font-bold text-yellow-800 mb-2">Hàng xuất khẩu</h4>
            <p className="text-sm text-gray-700">Tăng cường xuất khẩu, mở rộng thị trường</p>
          </div>
        </div>
      </div>

      {/* Năm phương hướng phát triển */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-500 pb-3">
          Năm Phương Hướng Lớn Phát Triển Kinh Tế
        </h3>
        <div className="space-y-3">
          {[
            { icon: '📊', title: 'Bố trí lại cơ cấu sản xuất', color: 'blue' },
            { icon: '🏗️', title: 'Điều chỉnh cơ cấu đầu tư xây dựng và củng cố quan hệ sản xuất XHCN', color: 'green' },
            { icon: '🔄', title: 'Sử dụng và cải tạo đúng đắn các thành phần kinh tế', color: 'purple' },
            { icon: '⚙️', title: 'Đổi mới cơ chế quản lý kinh tế, phát huy mạnh mẽ động lực khoa học kỹ thuật', color: 'orange' },
            { icon: '🌍', title: 'Mở rộng và nâng cao hiệu quả kinh tế đối ngoại', color: 'red' }
          ].map((item, index) => (
            <div key={index} className={`flex items-center bg-gradient-to-r from-${item.color}-50 to-white p-4 rounded-lg border-l-4 border-${item.color}-500`}>
              <span className="text-3xl mr-4">{item.icon}</span>
              <p className={`text-${item.color}-900 font-semibold`}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline 1987-1991 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-500 pb-3">
          Triển Khai Thực Hiện (1987-1991)
        </h3>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-300"></div>
          <div className="space-y-8">
            {[
              { year: '1987', title: 'Hội nghị TW 2', content: 'Biện pháp cấp bách về phân phối lưu thông, thực hiện "bốn giảm"' },
              { year: '11/1987', title: 'Quyết định 217-HĐBT', content: 'Trao quyền tự chủ cho các doanh nghiệp' },
              { year: '4/1988', title: 'Nghị quyết 10', content: 'Khoán sản phẩm đến hộ nông dân (Khoán 10)' },
              { year: '1989', title: 'Đột phá lương thực', content: 'Từ nhập khẩu 450,000 tấn gạo → xuất khẩu' },
              { year: '1991', title: 'Kết quả ấn tượng', content: 'Lạm phát giảm còn 67.1%, xóa bỏ tem phiếu' }
            ].map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-md border-2 border-red-200">
                    <div className="font-bold text-red-700 mb-1">{milestone.year}</div>
                    <div className="font-semibold text-gray-800 mb-1">{milestone.title}</div>
                    <p className="text-sm text-gray-700">{milestone.content}</p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả so sánh */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-500 pb-3">
          Thành Tựu Nổi Bật Đến 1991
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 shadow-md">
            <h4 className="font-bold text-red-800 mb-3 text-center">Lạm phát</h4>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">774.7%</div>
                <p className="text-sm text-gray-700 mt-1">1986</p>
              </div>
              <div className="text-3xl text-gray-400">→</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">67.1%</div>
                <p className="text-sm text-gray-700 mt-1">1991</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-md">
            <h4 className="font-bold text-green-800 mb-3 text-center">Lương thực</h4>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">Nhập khẩu</div>
                <p className="text-sm text-gray-700 mt-1">450K tấn (1988)</p>
              </div>
              <div className="text-3xl text-gray-400">→</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">Xuất khẩu</div>
                <p className="text-sm text-gray-700 mt-1">(1989)</p>
              </div>
            </div>
          </div>
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
              className="w-full h-auto object-contain rounded-lg shadow-lg bg-gray-100"
            />
            {event.image_description && (
              <p className="text-sm text-gray-600 italic mt-2 text-center">
                {event.image_description}
              </p>
            )}
          </div>

          {/* Show world context first for Pre-1986 event */}
          {isPre1986 && (
            <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-6 mb-8">
              {formatDetails(getWorldContext(event.details))}
            </div>
          )}

          {/* Show visualization for Pre-1986 event */}
          {isPre1986 && <Pre1986Visualization />}

          {/* Show visualization for 1986 event */}
          {is1986 && <Event1986Visualization />}
          
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
