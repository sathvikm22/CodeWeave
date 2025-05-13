
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface AlgorithmCodeTabsProps {
  code: {
    javascript: string;
    python: string;
    cpp: string;
  };
}

const AlgorithmCodeTabs: React.FC<AlgorithmCodeTabsProps> = ({ code }) => {
  const [language, setLanguage] = useState<string>('javascript');
  
  return (
    <div className="w-full">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
        <Tabs defaultValue="javascript" value={language} onValueChange={setLanguage} className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none bg-transparent">
            <TabsTrigger 
              value="javascript"
              className={`py-3 rounded-none border-b-2 font-medium text-base ${language === 'javascript' ? 'border-primary text-primary' : 'border-transparent'}`}
            >
              JavaScript
            </TabsTrigger>
            <TabsTrigger 
              value="python"
              className={`py-3 rounded-none border-b-2 font-medium text-base ${language === 'python' ? 'border-primary text-primary' : 'border-transparent'}`}
            >
              Python
            </TabsTrigger>
            <TabsTrigger 
              value="cpp"
              className={`py-3 rounded-none border-b-2 font-medium text-base ${language === 'cpp' ? 'border-primary text-primary' : 'border-transparent'}`}
            >
              C++
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="javascript">
            <div className="bg-zinc-950 p-6 rounded-b-lg overflow-auto max-h-96 shadow-inner">
              <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                {code.javascript}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="python">
            <div className="bg-zinc-950 p-6 rounded-b-lg overflow-auto max-h-96 shadow-inner">
              <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                {code.python}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="cpp">
            <div className="bg-zinc-950 p-6 rounded-b-lg overflow-auto max-h-96 shadow-inner">
              <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">
                {code.cpp}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlgorithmCodeTabs;
