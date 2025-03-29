
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Resume } from '@/types';
import { format } from 'date-fns';

interface RecentUploadsProps {
  resumes: Resume[];
  onSelectResume: (resumeId: string) => void;
}

const RecentUploads: React.FC<RecentUploadsProps> = ({ resumes, onSelectResume }) => {
  // Sort resumes by upload date, newest first
  const sortedResumes = [...resumes].sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600" />
          Recent Uploads
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedResumes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No resumes uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResumes.slice(0, 5).map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">{resume.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(resume.uploadDate), 'MMM d, yyyy - h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {resume.analyzed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectResume(resume.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUploads;
