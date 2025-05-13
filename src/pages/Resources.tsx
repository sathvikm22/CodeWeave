
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from 'lucide-react';
import ExternalResources from '@/components/resources/ExternalResources';

const Resources: React.FC = () => {
  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Learning Resources</h1>
      <p className="text-muted-foreground">
        Explore curated resources to deepen your understanding of data structures and algorithms.
      </p>
      
      <Tabs defaultValue="linear">
        <TabsList className="mb-4">
          <TabsTrigger value="linear">Linear Structures</TabsTrigger>
          <TabsTrigger value="trees">Trees</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="linear" className="space-y-4">
          <ExternalResources filter="linear" />
        </TabsContent>
        
        <TabsContent value="trees" className="space-y-4">
          <ExternalResources filter="trees" />
        </TabsContent>
        
        <TabsContent value="graphs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Graph Theory</CardTitle>
              <CardDescription>Vertices and edges</CardDescription>
            </CardHeader>
            <CardContent>
              <ExternalResources filter="advanced" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="algorithms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sorting & Searching</CardTitle>
              <CardDescription>Common algorithmic approaches</CardDescription>
            </CardHeader>
            <CardContent>
              <ExternalResources filter="sorting" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
