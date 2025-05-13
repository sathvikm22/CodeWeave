
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo } from 'lucide-react';

const VideoCard: React.FC<{ title: string; author: string; duration: string; thumbnail: string }> = ({
  title,
  author,
  duration,
  thumbnail
}) => (
  <Card className="overflow-hidden card-hover">
    <div className="aspect-video bg-muted/50 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <FileVideo className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <div className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded-md">
        {duration}
      </div>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{author}</CardDescription>
    </CardHeader>
  </Card>
);

const Videos: React.FC = () => {
  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Video Tutorials</h1>
      <p className="text-muted-foreground">
        Learn through visual explanations with our curated video content.
      </p>
      
      <Tabs defaultValue="arrays">
        <TabsList className="mb-4">
          <TabsTrigger value="arrays">Arrays</TabsTrigger>
          <TabsTrigger value="linkedlists">Linked Lists</TabsTrigger>
          <TabsTrigger value="trees">Trees</TabsTrigger>
          <TabsTrigger value="sorting">Sorting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arrays" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VideoCard 
              title="Arrays Explained Simply" 
              author="CS Fundamentals"
              duration="8:24"
              thumbnail=""
            />
            <VideoCard 
              title="Array Operations & Big O" 
              author="Algorithm Academy"
              duration="12:07"
              thumbnail=""
            />
            <VideoCard 
              title="Dynamic Arrays in Detail" 
              author="CodeCraft"
              duration="15:32"
              thumbnail=""
            />
            <VideoCard 
              title="Solving Array Problems" 
              author="Interview Prep"
              duration="22:15"
              thumbnail=""
            />
            <VideoCard 
              title="Multi-dimensional Arrays" 
              author="CS Fundamentals"
              duration="10:45"
              thumbnail=""
            />
          </div>
        </TabsContent>
        
        <TabsContent value="linkedlists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VideoCard 
              title="Linked List Basics" 
              author="Data Structure Tutorials"
              duration="11:42"
              thumbnail=""
            />
            <VideoCard 
              title="Singly vs Doubly Linked Lists" 
              author="CS with Examples"
              duration="14:05"
              thumbnail=""
            />
          </div>
        </TabsContent>
        
        <TabsContent value="trees">
          <p className="text-muted-foreground">Tree videos coming soon!</p>
        </TabsContent>
        
        <TabsContent value="sorting">
          <p className="text-muted-foreground">Sorting algorithm videos coming soon!</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Videos;
