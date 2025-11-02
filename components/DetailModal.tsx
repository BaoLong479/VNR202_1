
import React from 'react';
import type { TimelineEvent } from '../types';

interface DetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

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
        let content = trimmedLine.substring(2);
        
        // Check if it's a bold item (contains **)
        const boldMatch = content.match(/\*\*(.*?)\*\*/);
        if (boldMatch) {
          const beforeBold = content.substring(0, content.indexOf('**'));
          const boldText = boldMatch[1];
          const afterBold = content.substring(content.indexOf('**') + boldMatch[0].length);
          
          listItems.push(
            <li key={`item-${index}`} className="text-gray-700 leading-relaxed">
              <span className="text-red-500 font-bold mr-2">•</span>
              {beforeBold}
              <strong className="font-bold text-gray-900">{boldText}</strong>
              {afterBold}
            </li>
          );
        } else {
          listItems.push(
            <li key={`item-${index}`} className="text-gray-700 leading-relaxed">
              <span className="text-red-500 font-bold mr-2">•</span>
              {content}
            </li>
          );
        }
        return;
      }

      // Special stat highlight (emoji + bold percentage)
      const statMatch = trimmedLine.match(/^(🔴|⚠️|📊|📈|📉)\s+\*\*(.*?)\*\*\s+-\s+(.+)$/);
      if (statMatch) {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`list-${index}`} className="mb-4 ml-6 space-y-2">
              {listItems}
            </ul>
          );
          listItems = [];
        }
        
        const [, emoji, statValue, statDescription] = statMatch;
        elements.push(
          <div key={`stat-${index}`} className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{emoji}</span>
              <div>
                <div className="text-3xl font-bold text-red-600">{statValue}</div>
                <div className="text-sm text-gray-600 mt-1">{statDescription}</div>
              </div>
            </div>
          </div>
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
      
      // Handle inline bold text in paragraphs
      const boldInlineMatch = trimmedLine.match(/\*\*(.*?)\*\*/g);
      if (boldInlineMatch) {
        const parts = trimmedLine.split(/(\*\*.*?\*\*)/);
        elements.push(
          <p key={`para-${index}`} className="mb-3 text-gray-700 leading-relaxed">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      } else {
        elements.push(
          <p key={`para-${index}`} className="mb-3 text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-modal-enter"
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
          
          <div className="prose prose-lg max-w-none">
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
