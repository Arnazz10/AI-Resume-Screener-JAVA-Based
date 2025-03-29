
import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-900 py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-white mr-2" />
            <h1 className="text-2xl font-bold text-white">AI Resume Screener</h1>
          </div>
          <div className="text-white text-sm">
            Java Developer Edition
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
