
import React from 'react';
import type { TimelineEvent } from '../types';

interface DetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  // Render special visualization for "Trước 1986" period
  const renderPre1986Content = () => {
    return (
      <div className="space-y-8">
        {/* Hero Section - Inflation Rate */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 text-center border-2 border-red-200">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Đỉnh Điểm Khủng Hoảng</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Cuộc cải cách "Giá - Lương - Tiền" năm 1985 thất bại đã đẩy lạm phát lên mức phi mã, 
            chính thức đưa nền kinh tế vào trạng thái khủng hoảng toàn diện và sâu sắc.
          </p>
          <div className="text-8xl font-bold text-red-600 mb-2">
            774.7%
          </div>
          <p className="text-xl font-semibold text-gray-800">Tỷ lệ lạm phát năm 1986</p>
        </div>

        {/* Economic Model Flow */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Mô Hình Kinh Tế "Bao Cấp"
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Giai đoạn này được đặc trưng bởi cơ chế kế hoạch hóa tập trung, quan liêu, bao cấp. 
            Nhà nước quyết định mọi thứ từ sản xuất đến phân phối, triệt tiêu động lực phát triển.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-blue-50 w-full md:w-3/4 rounded-lg p-6 text-center border-2 border-blue-300 shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Nhà nước</h3>
              <p className="text-gray-700">Lập kế hoạch sản xuất, ấn định giá, và kiểm soát toàn bộ lưu thông hàng hóa.</p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">↓</div>
            
            <div className="bg-blue-50 w-full md:w-3/4 rounded-lg p-6 text-center border-2 border-blue-300 shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Doanh nghiệp Nhà nước</h3>
              <p className="text-gray-700">Sản xuất theo chỉ tiêu, không quan tâm đến chi phí hay hiệu quả. Lỗ đã có nhà nước bù.</p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">↓</div>
            
            <div className="bg-blue-50 w-full md:w-3/4 rounded-lg p-6 text-center border-2 border-blue-300 shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Hệ thống Tem Phiếu</h3>
              <p className="text-gray-700">Hàng hóa thiết yếu được phân phối qua tem phiếu, không đủ đáp ứng nhu cầu tối thiểu.</p>
            </div>
            
            <div className="text-4xl font-bold text-blue-600">↓</div>
            
            <div className="bg-red-50 w-full md:w-3/4 rounded-lg p-6 text-center border-2 border-red-300 shadow-md">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Người Dân & Xã Hội</h3>
              <p className="text-gray-700">Đời sống khó khăn, thiếu thốn. Nảy sinh hiện tượng "xếp hàng" và tâm lý ỷ lại, thiếu động lực.</p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">Lạm Phát Phi Mã (1980-1986)</h3>
            <p className="text-gray-700 mb-6 text-center">
              Việc liên tục bù lỗ cho doanh nghiệp nhà nước và chính sách tiền tệ sai lầm đã khiến lạm phát tăng vọt.
            </p>
            <div className="space-y-3">
              {[
                { year: '1980', rate: 25.1 },
                { year: '1981', rate: 69.1 },
                { year: '1982', rate: 95.4 },
                { year: '1983', rate: 49.3 },
                { year: '1984', rate: 100.5 },
                { year: '1985', rate: 385.0 },
                { year: '1986', rate: 774.7 }
              ].map(({ year, rate }) => (
                <div key={year} className="flex items-center">
                  <span className="w-16 font-semibold text-gray-700">{year}:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min((rate / 800) * 100, 100)}%` }}
                    >
                      <span className="text-white text-xs font-bold">{rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">Tăng Trưởng Kinh Tế Trì Trệ</h3>
            <p className="text-gray-700 mb-6 text-center">
              Tốc độ tăng trưởng chung là rất thấp và không bền vững, không đủ để giải quyết các vấn đề xã hội.
            </p>
            <div className="space-y-3">
              {[
                { period: 'TB 1976-1980', rate: 0.4 },
                { period: '1981', rate: 5.1 },
                { period: '1982', rate: 8.8 },
                { period: '1983', rate: 7.7 },
                { period: '1984', rate: 8.3 },
                { period: '1985', rate: 5.3 }
              ].map(({ period, rate }) => (
                <div key={period} className="flex items-center">
                  <span className="w-24 font-semibold text-gray-700 text-sm">{period}:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(rate / 10) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">Nông Nghiệp: Thiếu Lương Thực</h3>
            <p className="text-gray-700 mb-6 text-center">
              Mô hình hợp tác xã cứng nhắc làm mất động lực sản xuất. Dù là nước nông nghiệp, Việt Nam vẫn phải nhập khẩu lương thực.
            </p>
            <div className="flex justify-around items-end h-48">
              <div className="text-center">
                <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 w-24 rounded-t-lg mx-auto mb-2" style={{ height: '100px' }}>
                  <div className="pt-4 text-white font-bold text-lg">13.4</div>
                </div>
                <p className="text-sm font-semibold text-gray-700">TB 1976-1980</p>
                <p className="text-xs text-gray-600">Triệu tấn</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-t from-yellow-600 to-yellow-500 w-24 rounded-t-lg mx-auto mb-2" style={{ height: '140px' }}>
                  <div className="pt-4 text-white font-bold text-lg">17.0</div>
                </div>
                <p className="text-sm font-semibold text-gray-700">TB 1981-1985</p>
                <p className="text-xs text-gray-600">Triệu tấn</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">Công Nghiệp: Hoạt Động Cầm Chừng</h3>
            <p className="text-gray-700 mb-6 text-center">
              Các doanh nghiệp nhà nước thiếu vốn, công nghệ lạc hậu và quản lý kém hiệu quả.
            </p>
            <div className="flex justify-center items-center h-48">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20"/>
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="20"
                    strokeDasharray="125.6 251.2"
                    transform="rotate(-90 50 50)"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#EF4444" 
                    strokeWidth="20"
                    strokeDasharray="125.6 251.2"
                    strokeDashoffset="-125.6"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">50%</div>
                    <div className="text-xs text-gray-600">công suất</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Hoạt động hiệu quả (50%)</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Hoạt động cầm chừng (50%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-300">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Con Đường Dẫn Đến Đổi Mới</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
            Sự thất bại của mô hình cũ và thực tế khủng hoảng gay gắt đã tạo ra sức ép khổng lồ. 
            Yêu cầu <span className="font-bold text-red-600">"Đổi mới hay là chết"</span> trở nên cấp thiết, 
            trực tiếp dẫn đến các quyết sách mang tính bước ngoặt tại Đại hội Đảng VI (tháng 12 năm 1986), 
            mở ra thời kỳ Đổi Mới cho đất nước.
          </p>
        </div>
      </div>
    );
  };

  // Enhanced formatter for other periods
  const formatDetails = (details: string) => {
    const lines = details.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let currentSection = '';

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
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

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
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

    if (listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="mb-4 ml-6 space-y-2">
          {listItems}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-modal-enter"
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          
          <div className="prose prose-lg max-w-none">
            {event.period === "Trước 1986" ? renderPre1986Content() : formatDetails(event.details)}
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
