import React, { useState } from 'react';
import type { QuizItem } from '../types';
import { linkifyText } from '../linkify';

interface QuizModalProps {
  quizItem: QuizItem;
  onClose: () => void;
  onSubmitFlag: (flag: string) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quizItem, onClose, onSubmitFlag }) => {
  const [flagInput, setFlagInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleSubmit = () => {
    if (!flagInput.trim()) return;
    onSubmitFlag(flagInput); // logic kiểm tra flag nằm ở App.tsx
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🧩 Nhập flag để mở khóa
        </h3>
        <p className="text-gray-700 mb-4">
          {linkifyText(quizItem.question)}
        </p>

        <input
          type="text"
          value={flagInput}
          onChange={(e) => setFlagInput(e.target.value)}
          placeholder="VNR{example_flag}"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100"
          >
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!flagInput.trim()}
          >
            Gửi flag
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuizModal;
