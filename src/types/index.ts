
export interface Resume {
  id: string;
  fileName: string;
  uploadDate: Date;
  content: string;
  analyzed: boolean;
}

export interface Skill {
  name: string;
  relevance: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ResumeAnalysis {
  resumeId: string;
  score: number; // 0-100
  skills: Skill[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallAssessment: string;
  javaExpertise: number; // 0-100
}
