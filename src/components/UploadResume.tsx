
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseResumeContent, saveResume } from '@/utils/resumeParser';
import { evaluateResume, saveAnalysis } from '@/utils/aiEvaluator';
import { Resume } from '@/types';

interface UploadResumeProps {
  onAnalysisComplete: (resumeId: string) => void;
}

const UploadResume: React.FC<UploadResumeProps> = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check file type - only accept pdf, docx or txt
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setFile(file);
    setIsUploading(true);

    // Process the file
    parseResumeContent(file)
      .then((content) => {
        setIsUploading(false);
        setIsAnalyzing(true);
        
        // Save the resume
        const savedResume = saveResume(file.name, content);
        
        // Analyze the resume
        return evaluateResume(savedResume).then((analysis) => {
          // Save the analysis
          saveAnalysis(analysis);
          setIsAnalyzing(false);
          
          // Notify parent component that analysis is complete
          onAnalysisComplete(savedResume.id);
          
          toast.success('Resume analyzed successfully!');
        });
      })
      .catch((error) => {
        setIsUploading(false);
        setIsAnalyzing(false);
        toast.error(error.message || 'Failed to process resume');
      });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div 
          className={`upload-area rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin">
                <Upload size={48} className="text-blue-600" />
              </div>
              <p className="text-lg font-medium">Uploading {file?.name}...</p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-pulse-slow">
                <FileText size={48} className="text-blue-600" />
              </div>
              <p className="text-lg font-medium">Analyzing resume with AI...</p>
              <p className="text-sm text-gray-500 max-w-md text-center">
                Our AI is scanning for Java skills, experience level, and overall fit.
              </p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle2 size={48} className="text-green-600" />
              <p className="text-lg font-medium">Resume processed successfully!</p>
              <Button onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }} variant="outline" className="mt-2">
                Upload another resume
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Upload size={48} className="text-blue-600" />
              <p className="text-lg font-medium">Drag & drop your resume here</p>
              <p className="text-sm text-gray-500 max-w-md text-center">
                Upload a PDF, DOCX or TXT file to analyze Java skills and experience.
              </p>
              <Button className="gradient-btn text-white">Upload Resume</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadResume;
