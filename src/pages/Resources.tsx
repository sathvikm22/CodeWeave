
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExternalResources from '@/components/ExternalResources';

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Explore our curated collection of resources to enhance your understanding of data structures, algorithms, and coding practices.
        </p>
        
        <Tabs defaultValue="linear" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="linear">Linear Structures</TabsTrigger>
            <TabsTrigger value="trees">Tree Structures</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Structures</TabsTrigger>
            <TabsTrigger value="sorting">Sorting Algorithms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="linear">
            <div className="grid gap-6">
              <ExternalResources filter="linear" />
            </div>
          </TabsContent>
          
          <TabsContent value="trees">
            <div className="grid gap-6">
              <ExternalResources filter="trees" />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid gap-6">
              <ExternalResources filter="advanced" />
            </div>
          </TabsContent>
          
          <TabsContent value="sorting">
            <div className="grid gap-6">
              <ExternalResources filter="sorting" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;
