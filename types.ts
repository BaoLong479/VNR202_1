export interface QuizItem {
  question: string;
  flagAnswer: string; // đáp án đúng, ví dụ "flag{doimoi1986}"
}

export interface DetailSection {
  heading: string;
  points: string[];
}

export interface TimelineEvent {
  period: string;
  title: string;
  summary: string;
  details: DetailSection[];
  image_description: string;
  imageUrl: string;
  quiz: QuizItem[];
}
