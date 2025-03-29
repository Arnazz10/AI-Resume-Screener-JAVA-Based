
import { Resume, ResumeAnalysis, Skill } from '@/types';
import { updateResume } from './resumeParser';

// Mock skills for Java developers that would be detected
const javaSkills = [
  'Java', 'Spring Boot', 'Spring Framework', 'Hibernate', 'JPA', 
  'JUnit', 'Maven', 'Gradle', 'Microservices', 'REST API', 
  'JDBC', 'Servlet', 'JSP', 'Design Patterns', 'Multithreading',
  'Collections', 'Stream API', 'Lambda Expressions', 'SOLID Principles',
  'JDBC', 'SQL', 'JVM', 'Garbage Collection', 'Jackson', 'JSON',
  'XML', 'Git', 'CI/CD', 'Jenkins', 'Docker', 'AWS', 'Azure',
  'Agile', 'Scrum', 'TDD', 'JMeter', 'Log4j', 'SLF4J'
];

/**
 * Mock AI evaluation of a resume
 * In a real application, this would call an AI service API
 */
export const evaluateResume = async (resume: Resume): Promise<ResumeAnalysis> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const content = resume.content.toLowerCase();
  
  // Detect skills in resume
  const detectedSkills: Skill[] = [];
  let totalRelevance = 0;
  
  javaSkills.forEach(skill => {
    // Check if skill is mentioned in resume
    const skillLower = skill.toLowerCase();
    
    if (content.includes(skillLower)) {
      // Count occurrences to determine relevance
      const regex = new RegExp(skillLower, 'g');
      const matches = content.match(regex);
      const occurrences = matches ? matches.length : 0;
      
      // Calculate relevance based on occurrences and context
      const relevance = Math.min(Math.floor(occurrences * 20 + Math.random() * 30), 100);
      totalRelevance += relevance;
      
      // Determine skill level based on context clues
      let level: Skill['level'] = 'beginner';
      
      if (content.includes(`advanced ${skillLower}`) || 
          content.includes(`expert in ${skillLower}`) ||
          content.includes(`${skillLower} expert`)) {
        level = 'expert';
      } else if (content.includes(`intermediate ${skillLower}`) ||
                content.includes(`experienced ${skillLower}`)) {
        level = 'intermediate';
      } else if (content.includes(`proficient in ${skillLower}`) ||
                content.includes(`strong ${skillLower}`)) {
        level = 'advanced';
      }
      
      detectedSkills.push({
        name: skill,
        relevance,
        level
      });
    }
  });
  
  // Sort skills by relevance
  detectedSkills.sort((a, b) => b.relevance - a.relevance);
  
  // Calculate overall score
  const javaExpertise = detectedSkills.length > 0 ? 
    Math.min(Math.floor(totalRelevance / detectedSkills.length), 100) : 0;
  
  // Generate assessment based on skills
  const overallScore = calculateOverallScore(detectedSkills, content);
  
  // Generate strengths
  const strengths = generateStrengths(detectedSkills);
  
  // Generate weaknesses
  const weaknesses = generateWeaknesses(detectedSkills, javaSkills);
  
  // Generate recommendations
  const recommendations = generateRecommendations(detectedSkills, javaSkills);
  
  const analysis: ResumeAnalysis = {
    resumeId: resume.id,
    score: overallScore,
    skills: detectedSkills.slice(0, 10), // Top 10 skills
    strengths,
    weaknesses,
    recommendations,
    overallAssessment: generateOverallAssessment(overallScore, detectedSkills),
    javaExpertise
  };
  
  // Mark the resume as analyzed
  const updatedResume = { ...resume, analyzed: true };
  updateResume(updatedResume);
  
  return analysis;
};

/**
 * Calculate overall score based on detected skills and content
 */
const calculateOverallScore = (skills: Skill[], content: string): number => {
  if (skills.length === 0) return 20;
  
  // Base score from detected skills
  let score = Math.min(skills.length * 5, 50);
  
  // Add points for relevant experience
  const experienceLevel = getExperienceLevel(content);
  score += experienceLevel * 10;
  
  // Add points for education
  if (content.includes('computer science') || 
      content.includes('software engineering') ||
      content.includes('information technology')) {
    score += 10;
  }
  
  // Add points for advanced Java skills
  const hasAdvancedJava = skills.some(s => 
    (s.name === 'Java' && s.level === 'advanced') || 
    s.name === 'Spring Boot' || 
    s.name === 'Microservices'
  );
  
  if (hasAdvancedJava) score += 10;
  
  return Math.min(Math.max(score, 10), 100);
};

/**
 * Estimate years of experience from resume content
 */
const getExperienceLevel = (content: string): number => {
  const yearsRegex = /(\d+)(?:\+)?\s*(?:year|yr)s?(?:\s+of\s+experience)?/i;
  const match = content.match(yearsRegex);
  
  if (match && match[1]) {
    const years = parseInt(match[1], 10);
    return Math.min(years, 5);
  }
  
  return 1;
};

/**
 * Generate list of strengths based on skills
 */
const generateStrengths = (skills: Skill[]): string[] => {
  const strengths = [];
  
  const topSkills = skills.filter(s => s.relevance > 70).slice(0, 3);
  
  if (topSkills.length > 0) {
    strengths.push(`Strong proficiency in ${topSkills.map(s => s.name).join(', ')}`);
  }
  
  const hasJava = skills.some(s => s.name === 'Java' && s.relevance > 60);
  if (hasJava) {
    strengths.push('Core Java development expertise');
  }
  
  const hasFrameworks = skills.some(s => 
    ['Spring Boot', 'Spring Framework', 'Hibernate'].includes(s.name)
  );
  if (hasFrameworks) {
    strengths.push('Experience with enterprise Java frameworks');
  }
  
  const hasTestingSkills = skills.some(s => 
    ['JUnit', 'TDD', 'Testing'].includes(s.name)
  );
  if (hasTestingSkills) {
    strengths.push('Knowledge of testing methodologies');
  }
  
  if (strengths.length === 0) {
    strengths.push('Basic understanding of programming concepts');
  }
  
  return strengths;
};

/**
 * Generate list of weaknesses based on missing important skills
 */
const generateWeaknesses = (skills: Skill[], allSkills: string[]): string[] => {
  const weaknesses = [];
  const detectedSkillNames = skills.map(s => s.name);
  
  const missingCoreSkills = ['Spring Boot', 'REST API', 'Microservices']
    .filter(skill => !detectedSkillNames.includes(skill));
  
  if (missingCoreSkills.length > 1) {
    weaknesses.push(`Limited experience with ${missingCoreSkills.join(', ')}`);
  }
  
  const hasWeakJava = skills.some(s => s.name === 'Java' && s.relevance < 50);
  if (hasWeakJava) {
    weaknesses.push('Needs to strengthen core Java fundamentals');
  }
  
  const missingTesting = !detectedSkillNames.includes('JUnit');
  const missingCICD = !detectedSkillNames.some(name => 
    ['CI/CD', 'Jenkins', 'Docker'].includes(name)
  );
  
  if (missingTesting && missingCICD) {
    weaknesses.push('No demonstrated experience with testing and CI/CD');
  } else if (missingTesting) {
    weaknesses.push('Limited experience with automated testing');
  } else if (missingCICD) {
    weaknesses.push('Limited experience with CI/CD pipelines');
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push('Resume could highlight project outcomes and impacts more clearly');
  }
  
  return weaknesses;
};

/**
 * Generate recommendations for improvement
 */
const generateRecommendations = (skills: Skill[], allSkills: string[]): string[] => {
  const recommendations = [];
  const detectedSkillNames = skills.map(s => s.name);
  
  // Check for important missing skills
  const missingSkills = [
    'Spring Boot', 'Microservices', 'REST API', 'JUnit',
    'Docker', 'CI/CD', 'Cloud (AWS/Azure)'
  ].filter(skill => !detectedSkillNames.includes(skill));
  
  if (missingSkills.length > 0) {
    recommendations.push(`Develop experience with key technologies: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  
  const hasWeakJava = skills.some(s => s.name === 'Java' && s.relevance < 60);
  if (hasWeakJava) {
    recommendations.push('Strengthen core Java fundamentals with personal projects');
  }
  
  recommendations.push('Highlight specific contributions and impacts in previous roles');
  recommendations.push('Add quantifiable achievements and metrics for past projects');
  
  return recommendations;
};

/**
 * Generate overall assessment based on score and skills
 */
const generateOverallAssessment = (score: number, skills: Skill[]): string => {
  if (score >= 80) {
    return 'Strong Java developer candidate with comprehensive skills across the Java ecosystem. Shows expertise in key technologies and frameworks.';
  } else if (score >= 60) {
    return 'Solid Java developer with good foundation. Some areas could be strengthened, but overall a promising candidate.';
  } else if (score >= 40) {
    return 'Developing Java programmer with basic skill set. Would benefit from more experience with enterprise Java frameworks and modern development practices.';
  } else {
    return 'Entry-level candidate with limited Java experience. Requires significant training and mentoring.';
  }
};

/**
 * Save analysis result to local storage
 */
export const saveAnalysis = (analysis: ResumeAnalysis): void => {
  const savedAnalyses = getAnalyses();
  savedAnalyses.push(analysis);
  
  localStorage.setItem('resumeAnalyses', JSON.stringify(savedAnalyses));
};

/**
 * Get all saved analyses from local storage
 */
export const getAnalyses = (): ResumeAnalysis[] => {
  const analysesJson = localStorage.getItem('resumeAnalyses');
  if (!analysesJson) return [];
  
  try {
    return JSON.parse(analysesJson);
  } catch (error) {
    console.error('Error parsing analyses from localStorage:', error);
    return [];
  }
};

/**
 * Get analysis for a specific resume
 */
export const getAnalysisForResume = (resumeId: string): ResumeAnalysis | undefined => {
  const analyses = getAnalyses();
  return analyses.find(analysis => analysis.resumeId === resumeId);
};
