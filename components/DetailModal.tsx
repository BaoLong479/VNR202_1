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

  // Check if this is the "1986" event
  const is1986 = event.period === "1986";

  // Check if this is the "1991" event
  const is1991 = event.period === "1991";

  // Check if this is the "Ngày nay" event
  const isNgayNay = event.period === "Ngày nay";

  // Helper function to parse inline markdown (bold text)
  const parseInlineMarkdown = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    // Match both **text** and *text* patterns
    const regex = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the bold part (match[1] for **, match[2] for *)
      const boldText = match[1] || match[2];
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-gray-900">
          {boldText}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

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

      // Headers (bold text with ** at start and end)
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
        const parsedContent = parseInlineMarkdown(content);
        listItems.push(
          <li key={`item-${index}`} className="text-gray-700 leading-relaxed">
            <span className="text-red-500 font-bold mr-2">•</span>
            {parsedContent}
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
          {parseInlineMarkdown(trimmedLine)}
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

  // Component for 1991 Visualization
  const Event1991Visualization = () => (
    <div className="space-y-8 mb-8">
      {/* Đại hội VII Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-100">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đại hội VII của Đảng
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold text-blue-700 mb-2">24-27/6/1991</div>
            <p className="text-gray-700 font-semibold">Thời gian diễn ra</p>
          </div>
          <div className="text-4xl font-bold text-blue-600 hidden md:block">→</div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-green-700 mb-2">Hà Nội</div>
            <p className="text-gray-700 font-semibold">Địa điểm</p>
          </div>
          <div className="text-4xl font-bold text-blue-600 hidden md:block">→</div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-lg font-bold text-red-700 mb-2">Đỗ Mười</div>
            <p className="text-gray-700 font-semibold">Tổng Bí thư</p>
          </div>
        </div>
      </div>

      {/* Economic Achievement */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Thành tựu Kinh tế
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">393.3% → 67.4%</div>
            <p className="text-gray-700 font-semibold">Lạm phát giảm mạnh (1988-1990)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-700 mb-2">Kinh tế thị trường</div>
            <p className="text-gray-700 font-semibold">Hàng hóa nhiều thành phần</p>
          </div>
        </div>
      </div>

      {/* Năm bài học lớn */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Năm Bài Học Lớn
        </h3>
        <div className="space-y-3">
          {[
            'Nắm vững ngọn cờ độc lập dân tộc và chủ nghĩa xã hội',
            'Sự nghiệp cách mạng là của nhân dân, do nhân dân, vì nhân dân',
            'Không ngừng củng cố, tăng cường đoàn kết: toàn Đảng, toàn dân, dân tộc, quốc tế',
            'Kết hợp sức mạnh dân tộc với sức mạnh thời đại',
            'Sự lãnh đạo đúng đắn của Đảng bảo đảm thắng lợi của cách mạng Việt Nam'
          ].map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500 flex items-center gap-3">
              <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sáu đặc trưng XHCN */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sáu Đặc Trưng Cơ Bản của Xã Hội XHCN
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <div className="bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-bold text-red-700 mb-1">Chính trị</h4>
                <p className="text-gray-700 text-sm">Do nhân dân lao động làm chủ</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-bold text-blue-700 mb-1">Kinh tế</h4>
                <p className="text-gray-700 text-sm">Nền kinh tế phát triển cao, lực lượng sản xuất hiện đại, công hữu về TLSX</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-bold text-green-700 mb-1">Văn hóa</h4>
                <p className="text-gray-700 text-sm">Nền văn hóa tiên tiến, đậm đà bản sắc dân tộc</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div>
                <h4 className="font-bold text-yellow-700 mb-1">Xã hội</h4>
                <p className="text-gray-700 text-sm">Con người được giải phóng, làm theo năng lực, hưởng theo lao động</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 shadow-md border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">5</div>
              <div>
                <h4 className="font-bold text-purple-700 mb-1">Đoàn kết dân tộc</h4>
                <p className="text-gray-700 text-sm">Các dân tộc bình đẳng, đoàn kết và giúp đỡ lẫn nhau cùng tiến bộ</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 shadow-md border-l-4 border-indigo-500">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">6</div>
              <div>
                <h4 className="font-bold text-indigo-700 mb-1">Quan hệ quốc tế</h4>
                <p className="text-gray-700 text-sm">Hữu nghị và hợp tác với nhân dân tất cả các nước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảy phương hướng lớn */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bảy Phương Hướng Lớn Xây Dựng CNXH
        </h3>
        <div className="space-y-3">
          {[
            'Xây dựng Nhà nước XHCN',
            'Công nghiệp hóa gắn liền với phát triển nông nghiệp toàn diện',
            'Thiết lập quan hệ sản xuất XHCN đa dạng về hình thức sở hữu',
            'Phát triển nền kinh tế hàng hóa nhiều thành phần theo định hướng XHCN',
            'Tiến hành cách mạng XHCN trên lĩnh vực tư tưởng, văn hóa',
            'Thực hiện chính sách đại đoàn kết dân tộc',
            'Thực hiện hai nhiệm vụ chiến lược xây dựng và bảo vệ Tổ quốc'
          ].map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-green-500 flex items-center gap-3">
              <div className="bg-green-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nhà nước pháp quyền */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-2 border-blue-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-blue-800">
          Nhà Nước Pháp Quyền XHCN
        </h3>
        <p className="text-gray-800 text-center mb-6 max-w-3xl mx-auto font-semibold">
          "Nhà nước của nhân dân, do nhân dân, vì nhân dân"
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-blue-700 mb-2">Quyền lực thống nhất</h4>
            <p className="text-gray-700 text-sm">Phân công và phối hợp ba quyền: lập pháp, hành pháp, tư pháp</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-blue-700 mb-2">Quản lý bằng pháp luật</h4>
            <p className="text-gray-700 text-sm">Kết hợp với giáo dục, nâng cao đạo đức xã hội</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-blue-700 mb-2">Kết hợp biện pháp</h4>
            <p className="text-gray-700 text-sm">Hành chính với giáo dục tư tưởng, nâng cao dân trí</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-blue-700 mb-2">Kết hợp sức mạnh</h4>
            <p className="text-gray-700 text-sm">Sức mạnh pháp luật với sức mạnh quần chúng</p>
          </div>
        </div>
      </div>

      {/* Bốn nguy cơ */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bốn Nguy Cơ Lớn (Hội nghị Giữa Nhiệm kỳ 1994)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <div className="bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-bold text-red-700 mb-1">Tụt hậu về kinh tế</h4>
                <p className="text-gray-700 text-sm">Nguy cơ tụt hậu xa hơn so với khu vực và thế giới</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 shadow-md border-l-4 border-orange-500">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-bold text-orange-700 mb-1">Chệch hướng XHCN</h4>
                <p className="text-gray-700 text-sm">Nếu không khắc phục lệch lạc trong chủ trương, chính sách</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-bold text-yellow-700 mb-1">Tham nhũng, quan liêu</h4>
                <p className="text-gray-700 text-sm">Nạn tham nhũng và tệ quan liêu</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 shadow-md border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div>
                <h4 className="font-bold text-purple-700 mb-1">Diễn biến hòa bình</h4>
                <p className="text-gray-700 text-sm">Các thế lực thù địch</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kết quả 1991-1995 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Kết Quả Giai Đoạn 1991-1995
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">8,2%</div>
            <p className="text-gray-700 font-semibold">Tăng trưởng GDP</p>
            <p className="text-gray-600 text-sm mt-1">(Kế hoạch: 5,5-6,5%)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-blue-700 mb-2">67,1% → 12,7%</div>
            <p className="text-gray-700 font-semibold">Lạm phát giảm</p>
            <p className="text-gray-600 text-sm mt-1">(1991-1995)</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-yellow-700 mb-2">Tích lũy nội bộ</div>
            <p className="text-gray-700 font-semibold">Bắt đầu có tích lũy</p>
            <p className="text-gray-600 text-sm mt-1">Từ nội bộ nền kinh tế</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-red-700 mb-2">28/7/1995</div>
            <p className="text-gray-700 font-semibold">Gia nhập ASEAN</p>
            <p className="text-gray-600 text-sm mt-1">Thành viên đầy đủ</p>
          </div>
        </div>
      </div>

      {/* Thành tựu đối ngoại */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Thành Tựu Đối Ngoại
        </h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white font-bold rounded-lg px-3 py-1 text-sm">11/1991</div>
              <p className="text-gray-800">Bình thường hóa quan hệ Việt Nam - Trung Quốc</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white font-bold rounded-lg px-3 py-1 text-sm">28/7/1995</div>
              <p className="text-gray-800">Gia nhập ASEAN (thành viên thứ 7)</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white font-bold rounded-lg px-3 py-1 text-sm">11/7/1995</div>
              <p className="text-gray-800">Thiết lập quan hệ ngoại giao Việt Nam - Hoa Kỳ</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 text-white font-bold rounded-lg px-3 py-1 text-sm">Cuối 1995</div>
              <p className="text-gray-800">Quan hệ ngoại giao với 160 nước, buôn bán trên 100 nước</p>
            </div>
          </div>
        </div>
      </div>

      {/* CNH-HĐH Highlight */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg p-6 border-2 border-indigo-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-indigo-800">
          Nhiệm Vụ Trọng Tâm
        </h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-700 mb-3">
            Công Nghiệp Hóa - Hiện Đại Hóa
          </div>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Con đường tất yếu để thoát khỏi nguy cơ tụt hậu, đưa đất nước phát triển
          </p>
        </div>
      </div>
    </div>
  );

  // Component for Ngày nay Visualization
  const NgayNayVisualization = () => (
    <div className="space-y-8 mb-8">
      {/* GDP Growth Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-100">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Tăng Trưởng GDP Vượt Bậc
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">1986</div>
            <div className="text-3xl font-bold text-red-700 mb-2">430,2 USD</div>
            <p className="text-gray-700 text-sm font-semibold">GDP/người</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold text-green-600">→</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">2023</div>
            <div className="text-3xl font-bold text-green-700 mb-2">4.282 USD</div>
            <p className="text-gray-700 text-sm font-semibold">Gấp hơn 10 lần</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-md text-center">
            <div className="text-4xl font-bold text-blue-700 mb-2">430 tỷ USD</div>
            <p className="text-gray-700 font-semibold">GDP 2023</p>
            <p className="text-gray-600 text-sm">Thứ 5 ASEAN, thứ 35 thế giới</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-md text-center">
            <div className="text-4xl font-bold text-yellow-700 mb-2">7,09%</div>
            <p className="text-gray-700 font-semibold">Tăng trưởng 2024</p>
            <p className="text-gray-600 text-sm">Cao nhất khu vực</p>
          </div>
        </div>
      </div>

      {/* Trade Achievement */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Thương Mại Quốc Tế
        </h3>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 shadow-md border-2 border-indigo-300 mb-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-700 mb-3">786,29 tỷ USD</div>
            <p className="text-gray-800 font-semibold text-lg">Tổng kim ngạch xuất nhập khẩu 2024</p>
            <p className="text-indigo-600 mt-2">Tăng 15,4% so với 2023</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">405,53 tỷ USD</div>
            <p className="text-gray-700 font-semibold">Xuất khẩu 2024</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">25,35 tỷ USD</div>
            <p className="text-gray-700 font-semibold">Vốn FDI thực hiện 2024</p>
            <p className="text-gray-600 text-sm mt-1">Cao nhất từ trước đến nay</p>
          </div>
        </div>
      </div>

      {/* Digital Economy */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border-2 border-purple-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-purple-800">
          Kinh Tế Số - Động Lực Tương Lai
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-4xl font-bold text-purple-700 mb-2">20%</div>
            <p className="text-gray-700 font-semibold">Tăng trưởng/năm</p>
            <p className="text-gray-600 text-sm">Gấp 3 lần GDP</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-4xl font-bold text-purple-700 mb-2">16,5%</div>
            <p className="text-gray-700 font-semibold">% GDP (2023)</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-purple-700 mb-2">Nhanh nhất</div>
            <p className="text-gray-700 font-semibold">Đông Nam Á</p>
            <p className="text-gray-600 text-sm">2022-2023</p>
          </div>
        </div>
      </div>

      {/* Innovation Index */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Chỉ Số Đổi Mới Sáng Tạo (GII)
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-sm text-gray-600 mb-1">2016</div>
            <div className="text-4xl font-bold text-red-700 mb-2">59</div>
            <p className="text-gray-700 font-semibold">Xếp hạng</p>
          </div>

          <div className="text-4xl font-bold text-green-600">→</div>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-sm text-gray-600 mb-1">2024</div>
            <div className="text-4xl font-bold text-green-700 mb-2">44</div>
            <p className="text-gray-700 font-semibold">Xếp hạng / 133 nước</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-green-500 text-center">
          <p className="text-gray-800 font-semibold">
            14 năm liên tiếp có thành tích đổi mới vượt trội so với mức phát triển
          </p>
        </div>
      </div>

      {/* Poverty Reduction */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Xóa Đói Giảm Nghèo Lịch Sử
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">1993</div>
            <div className="text-5xl font-bold text-red-700 mb-2">66,7%</div>
            <p className="text-gray-700 font-semibold">Hộ nghèo nông thôn</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">2024</div>
            <div className="text-5xl font-bold text-green-700 mb-2">4,06%</div>
            <p className="text-gray-700 font-semibold">Nghèo đa chiều</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500 text-center">
          <p className="text-gray-800">
            Nhiều địa phương như TP.HCM, Bà Rịa-Vũng Tàu đạt tỷ lệ nghèo 0%
          </p>
        </div>
      </div>

      {/* HDI Achievement */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-2 border-blue-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-blue-800">
          Chỉ Số Phát Triển Con Người (HDI)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">1990</div>
            <div className="text-4xl font-bold text-gray-700 mb-2">0,499</div>
            <p className="text-gray-700 font-semibold">Mức thấp</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">2023</div>
            <div className="text-4xl font-bold text-blue-700 mb-2">0,766</div>
            <p className="text-gray-700 font-semibold">Mức cao (≥0,700)</p>
          </div>
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold text-blue-700 mb-2">107/193</div>
          <p className="text-gray-800 font-semibold">Xếp hạng thế giới (2022)</p>
          <p className="text-blue-600">Tăng 8 bậc so với năm trước</p>
        </div>
      </div>

      {/* UNESCO Heritage */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Di Sản UNESCO
        </h3>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 shadow-md border-2 border-yellow-300 mb-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-700 mb-3">39</div>
            <p className="text-gray-800 font-semibold text-lg">Di sản được UNESCO vinh danh</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-700 mb-1">9</div>
            <p className="text-gray-700 text-sm">Di sản văn hóa và thiên nhiên thế giới</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-700 mb-1">16</div>
            <p className="text-gray-700 text-sm">Di sản văn hóa phi vật thể</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-700 mb-1">9</div>
            <p className="text-gray-700 text-sm">Khu dự trữ sinh quyển</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-700 mb-1">7</div>
            <p className="text-gray-700 text-sm">Di sản tư liệu</p>
          </div>
        </div>
      </div>

      {/* UN Security Council */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Vai Trò Tại Liên Hợp Quốc
        </h3>
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-blue-700 mb-1">HĐBA LHQ 2008-2009</h4>
                <p className="text-gray-700 text-sm">Ủy viên không thường trực - Nhiệm kỳ đầu</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-green-700 mb-1">HĐBA LHQ 2020-2021</h4>
                <p className="text-gray-700 text-sm">Được bầu với 192/193 phiếu</p>
              </div>
              <div className="bg-green-600 text-white font-bold rounded-lg px-4 py-2">
                192/193
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
            <h4 className="font-bold text-indigo-700 mb-2">Nghị quyết 2573</h4>
            <p className="text-gray-700 text-sm">Bảo vệ cơ sở hạ tầng thiết yếu - 15/15 nước đồng bảo trợ</p>
          </div>
        </div>
      </div>

      {/* Strategic Partnerships */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6 border-2 border-red-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-red-800">
          Đối Tác Chiến Lược Toàn Diện
        </h3>
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 text-center">
          <div className="text-5xl font-bold text-red-700 mb-2">14</div>
          <p className="text-gray-800 font-semibold">Quan hệ Đối tác Chiến lược Toàn diện</p>
          <p className="text-gray-600 text-sm mt-2">Bao gồm tất cả 5 Ủy viên thường trực HĐBA LHQ</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-3">
          <div className="bg-gradient-to-r from-yellow-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-800 font-semibold">Trung Quốc (5/2008)</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-800 font-semibold">Nga (7/2012)</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-green-500">
            <p className="text-gray-800 font-semibold">Ấn Độ (9/2016)</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-800 font-semibold">Hàn Quốc (12/2022)</p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-red-500">
            <p className="text-gray-800 font-semibold">Hoa Kỳ (9/2023)</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-indigo-500">
            <p className="text-gray-800 font-semibold">Nhật Bản (11/2023)</p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-orange-500">
            <p className="text-gray-800 font-semibold">Australia (3/2024)</p>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-pink-500">
            <p className="text-gray-800 font-semibold">Pháp (10/2024)</p>
          </div>
          <div className="bg-gradient-to-r from-cyan-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-cyan-500">
            <p className="text-gray-800 font-semibold">Malaysia (11/2024)</p>
          </div>
          <div className="bg-gradient-to-r from-lime-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-lime-500">
            <p className="text-gray-800 font-semibold">New Zealand (2/2025)</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-emerald-500">
            <p className="text-gray-800 font-semibold">Indonesia (10/3/2025)</p>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-teal-500">
            <p className="text-gray-800 font-semibold">Singapore (12/3/2025)</p>
          </div>
          <div className="bg-gradient-to-r from-fuchsia-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-fuchsia-500">
            <p className="text-gray-800 font-semibold">Thái Lan (16/5/2025)</p>
          </div>
          <div className="bg-gradient-to-r from-rose-50 to-white rounded-lg p-3 shadow-sm border-l-4 border-rose-500">
            <p className="text-gray-800 font-semibold">Anh (29/10/2025)</p>
          </div>
        </div>
      </div>

      {/* National Brand Value */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Thương Hiệu Quốc Gia
        </h3>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-md border-2 border-green-300 mb-4">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-2">Tăng trưởng giá trị 2019-2023</div>
            <div className="text-6xl font-bold text-green-700 mb-2">102%</div>
            <p className="text-gray-800 font-semibold text-lg">Nhanh nhất thế giới</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">2023</div>
            <div className="text-3xl font-bold text-blue-700 mb-2">498,13 tỷ USD</div>
            <p className="text-gray-700 font-semibold">Xếp thứ 33/121</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">2024</div>
            <div className="text-3xl font-bold text-indigo-700 mb-2">507 tỷ USD</div>
            <p className="text-gray-700 font-semibold">Xếp thứ 32</p>
          </div>
        </div>
      </div>

      {/* UN Peacekeeping */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Gìn Giữ Hòa Bình Liên Hợp Quốc
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">Bắt đầu</div>
            <div className="text-3xl font-bold text-blue-700 mb-2">5/2014</div>
            <p className="text-gray-700 font-semibold">Sĩ quan đầu tiên</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-sm text-gray-600 mb-1">Đến nay</div>
            <div className="text-3xl font-bold text-green-700 mb-2">1.083</div>
            <p className="text-gray-700 font-semibold">Lượt sĩ quan, quân nhân</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-500">
            <p className="text-gray-800">Triển khai Bệnh viện dã chiến cấp 2, Đội Công binh</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-800">Được LHQ đánh giá cao về chuyên nghiệp, tinh thần nhân văn</p>
          </div>
        </div>
      </div>

      {/* Military Power */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-6 border-2 border-gray-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Năng Lực Quốc Phòng
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-gray-700 mb-2">22/145</div>
            <p className="text-gray-700 font-semibold">Global Firepower 2024</p>
            <p className="text-gray-600 text-sm">Xếp hạng thế giới</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-gray-700 mb-2">Thứ 2</div>
            <p className="text-gray-700 font-semibold">Đông Nam Á</p>
            <p className="text-gray-600 text-sm">Nhóm vượt trội</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Component for 1986 Visualization
  const Event1986Visualization = () => (
    <div className="space-y-8 mb-8">
      {/* Đại hội VI Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-red-100">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đại hội VI của Đảng
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-3xl font-bold text-red-700 mb-2">15-18/12/1986</div>
            <p className="text-gray-700 font-semibold">Thời gian diễn ra</p>
          </div>
          <div className="text-4xl font-bold text-red-600 hidden md:block">→</div>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-700 mb-2">Hà Nội</div>
            <p className="text-gray-700 font-semibold">Địa điểm</p>
          </div>
          <div className="text-4xl font-bold text-red-600 hidden md:block">→</div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-md">
            <div className="text-lg font-bold text-green-700 mb-2">Nguyễn Văn Linh</div>
            <p className="text-gray-700 font-semibold">Tổng Bí thư</p>
          </div>
        </div>
      </div>

      {/* Bốn bài học quý báu */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bốn Bài Học Quý Báu
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <p className="text-gray-800 leading-relaxed">
                Quán triệt tư tưởng <span className="font-bold text-blue-700">"lấy dân làm gốc"</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <p className="text-gray-800 leading-relaxed">
                Xuất phát từ thực tế, tôn trọng <span className="font-bold text-green-700">quy luật khách quan</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <p className="text-gray-800 leading-relaxed">
                Kết hợp <span className="font-bold text-yellow-700">sức mạnh dân tộc</span> với <span className="font-bold text-yellow-700">sức mạnh thời đại</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <div className="bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <p className="text-gray-800 leading-relaxed">
                Xây dựng Đảng ngang tầm đảng <span className="font-bold text-red-700">cầm quyền lãnh đạo XHCN</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ba chương trình kinh tế lớn */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Ba Chương Trình Kinh Tế Lớn
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-5xl mb-3">🌾</div>
            <h4 className="text-xl font-bold text-green-700 mb-2">Lương thực - Thực phẩm</h4>
            <p className="text-gray-700 text-sm">Đảm bảo an ninh lương thực quốc gia</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-5xl mb-3">🏭</div>
            <h4 className="text-xl font-bold text-blue-700 mb-2">Hàng tiêu dùng</h4>
            <p className="text-gray-700 text-sm">Phát triển công nghiệp sản xuất hàng tiêu dùng</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 shadow-md text-center">
            <div className="text-5xl mb-3">📦</div>
            <h4 className="text-xl font-bold text-yellow-700 mb-2">Hàng xuất khẩu</h4>
            <p className="text-gray-700 text-sm">Mở rộng quan hệ kinh tế đối ngoại</p>
          </div>
        </div>
      </div>

      {/* Năm phương hướng phát triển */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Năm Phương Hướng Phát Triển Kinh Tế
        </h3>
        <div className="space-y-3">
          {[
            'Bố trí lại cơ cấu sản xuất',
            'Điều chỉnh cơ cấu đầu tư xây dựng và củng cố quan hệ sản xuất XHCN',
            'Sử dụng và cải tạo đúng đắn các thành phần kinh tế',
            'Đổi mới cơ chế quản lý kinh tế, phát huy động lực khoa học kỹ thuật',
            'Mở rộng và nâng cao hiệu quả kinh tế đối ngoại'
          ].map((item, index) => (
            <div key={index} className="bg-gradient-to-r from-red-50 to-white rounded-lg p-4 shadow-sm border-l-4 border-red-500 flex items-center gap-3">
              <div className="bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nghị quyết 10 - Highlight */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border-2 border-green-300">
        <h3 className="text-2xl font-bold text-center mb-4 text-green-800">
          Nghị quyết 10 - Khoán 10 (5/4/1988)
        </h3>
        <p className="text-gray-800 text-center mb-4 max-w-3xl mx-auto">
          Bước đột phá trong cải cách nông nghiệp, giải phóng sức sản xuất
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-green-700 mb-2">Khoán sản phẩm cuối cùng</h4>
            <p className="text-gray-700 text-sm">Đến nhóm hộ và hộ xã viên</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <h4 className="font-bold text-green-700 mb-2">Ổn định 15 năm</h4>
            <p className="text-gray-700 text-sm">Người nông dân được canh tác lâu dài</p>
          </div>
        </div>
      </div>

      {/* Kết quả ấn tượng */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Kết Quả Đến Năm 1991
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-4xl font-bold text-red-700 mb-2">774.7% → 67.1%</div>
            <p className="text-gray-700 font-semibold">Lạm phát giảm mạnh</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">1989</div>
            <p className="text-gray-700 font-semibold">Tự chủ lương thực, có xuất khẩu</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">1988</div>
            <p className="text-gray-700 font-semibold">Xóa bỏ chế độ tem phiếu</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 shadow-md text-center">
            <div className="text-2xl font-bold text-yellow-700 mb-2">Kinh tế thị trường</div>
            <p className="text-gray-700 font-semibold">Cơ chế mới hình thành</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-50 w-full h-full overflow-y-auto transform transition-all duration-300 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-8 border-b border-red-800 flex justify-between items-center shadow-md z-10">
          <div>
            <p className="text-base font-semibold text-red-100 mb-2">{event.period}</p>
            <h2 className="text-4xl font-bold">{event.title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-200 transition-colors p-3 hover:bg-red-800 rounded-full"
            aria-label="Đóng"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="px-12 py-10 max-w-7xl mx-auto">
          <div className="mb-10">
            <img 
              src={event.imageUrl}
              alt={event.title} 
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg bg-gray-100 mx-auto"
            />
            {event.image_description && (
              <p className="text-base text-gray-600 italic mt-3 text-center">
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

          {/* Show visualization for 1991 event */}
          {is1991 && <Event1991Visualization />}

          {/* Show visualization for Ngày nay event */}
          {isNgayNay && <NgayNayVisualization />}

          <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-6">
            {formatDetails(isPre1986 ? getVietnamContextAndRest(event.details) : event.details)}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 text-center shadow-lg">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-lg"
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