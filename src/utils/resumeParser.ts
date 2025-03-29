
import { Resume } from '@/types';

/**
 * Parse the uploaded resume file content
 */
export const parseResumeContent = async (file: File): Promise<string> => {
  try {
    // For now, we'll just read the text content
    // In a real app, we'd use a proper PDF/DOCX parser
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume. Please check the file format.');
  }
};

/**
 * Save the parsed resume to local storage
 */
export const saveResume = (fileName: string, content: string): Resume => {
  const id = `resume_${Date.now()}`;
  const resume: Resume = {
    id,
    fileName,
    uploadDate: new Date(),
    content,
    analyzed: false
  };

  const savedResumes = getResumes();
  savedResumes.push(resume);

  localStorage.setItem('resumes', JSON.stringify(savedResumes));
  return resume;
};

/**
 * Get all saved resumes from local storage
 */
export const getResumes = (): Resume[] => {
  const resumesJson = localStorage.getItem('resumes');
  if (!resumesJson) return [];
  
  try {
    const resumes: Resume[] = JSON.parse(resumesJson);
    // Convert date strings back to Date objects
    return resumes.map(resume => ({
      ...resume,
      uploadDate: new Date(resume.uploadDate)
    }));
  } catch (error) {
    console.error('Error parsing resumes from localStorage:', error);
    return [];
  }
};

/**
 * Get a specific resume by ID
 */
export const getResumeById = (id: string): Resume | undefined => {
  const resumes = getResumes();
  return resumes.find(resume => resume.id === id);
};

/**
 * Update a resume in local storage
 */
export const updateResume = (updatedResume: Resume): void => {
  const resumes = getResumes();
  const index = resumes.findIndex(r => r.id === updatedResume.id);
  
  if (index !== -1) {
    resumes[index] = updatedResume;
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }
};
