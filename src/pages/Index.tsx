
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload, List } from 'lucide-react';
import Header from '@/components/Header';
import UploadResume from '@/components/UploadResume';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import RecentUploads from '@/components/RecentUploads';
import { getResumes, getResumeById } from '@/utils/resumeParser';
import { getAnalysisForResume } from '@/utils/aiEvaluator';
import { Resume, ResumeAnalysis as ResumeAnalysisType } from '@/types';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisType | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  // Load resumes from local storage
  useEffect(() => {
    const loadedResumes = getResumes();
    setResumes(loadedResumes);

    // If there are analyzed resumes, select the most recent one
    const analyzedResumes = loadedResumes.filter((resume) => resume.analyzed);
    if (analyzedResumes.length > 0) {
      analyzedResumes.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      handleSelectResume(analyzedResumes[0].id);
    }
  }, []);

  // Handle resume selection
  const handleSelectResume = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    const analysis = getAnalysisForResume(resumeId);
    const resume = getResumeById(resumeId);
    
    if (analysis) {
      setAnalysis(analysis);
      setSelectedResume(resume || null);
      setActiveTab('analysis');
    }
  };

  // Handle analysis completion
  const handleAnalysisComplete = (resumeId: string) => {
    // Reload resumes to get the updated list
    setResumes(getResumes());
    handleSelectResume(resumeId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </TabsTrigger>
              <TabsTrigger value="analysis" disabled={!analysis} className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                Analysis Results
              </TabsTrigger>
            </TabsList>
            
            {resumes.length > 0 && (
              <div className="hidden sm:block">
                <Button variant="outline" onClick={() => setActiveTab('upload')}>
                  Upload Another Resume
                </Button>
              </div>
            )}
          </div>

          <Separator />
          
          <TabsContent value="upload" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Upload Resume for Java Developer Position</h2>
                  <p className="text-gray-600">
                    Our AI will analyze the resume for Java skills, experience, and overall fit for a Java developer position. 
                    Upload a PDF, DOCX, or TXT file to get started.
                  </p>
                </div>
                
                <div className="mt-6">
                  <UploadResume onAnalysisComplete={handleAnalysisComplete} />
                </div>
              </div>
              
              <div>
                <RecentUploads 
                  resumes={resumes}
                  onSelectResume={handleSelectResume}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            {analysis && (
              <ResumeAnalysis 
                analysis={analysis}
                resumeName={selectedResume?.fileName}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          AI Resume Screener - Java Developer Edition © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
