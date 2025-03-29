
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ResumeAnalysis as ResumeAnalysisType } from '@/types';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeAnalysisProps {
  analysis: ResumeAnalysisType;
  resumeName?: string;
}

const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ analysis, resumeName }) => {
  // Helper function to get score color class
  const getScoreColorClass = (score: number): string => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get badge class
  const getScoreBadgeClass = (score: number): string => {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Resume Analysis</h2>
          {resumeName && (
            <p className="text-gray-500">{resumeName}</p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className={cn("score-badge", getScoreBadgeClass(analysis.score))}>
            {analysis.score}
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Overall Score</p>
            <p className={cn("text-xl font-bold", getScoreColorClass(analysis.score))}>
              {analysis.score >= 75 ? 'Excellent' : 
               analysis.score >= 60 ? 'Good' : 
               analysis.score >= 40 ? 'Average' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Assessment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{analysis.overallAssessment}</p>
          </CardContent>
        </Card>

        {/* Java Expertise */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Star className="mr-2 h-5 w-5 text-blue-600" />
              Java Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Expertise Level</span>
              <span className={cn("font-medium", getScoreColorClass(analysis.javaExpertise))}>
                {analysis.javaExpertise >= 80 ? 'Expert' : 
                analysis.javaExpertise >= 60 ? 'Advanced' : 
                analysis.javaExpertise >= 40 ? 'Intermediate' : 'Beginner'}
              </span>
            </div>
            <Progress value={analysis.javaExpertise} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-600">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-600">{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-600">{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Award className="mr-2 h-5 w-5 text-blue-600" />
            Detected Java Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.skills.map((skill, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-gray-500 capitalize">{skill.level}</span>
                </div>
                <Progress value={skill.relevance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysis;
