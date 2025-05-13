import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BookOpen, 
  FolderTree, 
  List, 
  Files,
  Network,
  FileVideo,
  History,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl space-y-12 py-6">
      {/* Hero Section */}
      <section className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Welcome to CodeWeave
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          An interactive platform for visualizing data structures and algorithms.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/visualize/array">
              Start Exploring
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/resources">
              Learning Resources
              <BookOpen size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Data Structures */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Featured Data Structures</h2>
          <Link to="/visualize/linear" className="text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Array Card */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="text-primary" />
                Array
              </CardTitle>
              <CardDescription>
                A collection of elements stored at contiguous memory locations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Arrays offer constant-time access to elements using indices.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild className="mt-auto">
                <Link to="/visualize/array">Visualize</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Files className="h-5 w-5 text-primary" />
                Stack
              </CardTitle>
              <CardDescription>
                A linear data structure that follows the LIFO principle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Elements are added and removed from the same end.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild className="mt-auto">
                <Link to="/visualize/stack">Visualize</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                Binary Tree
              </CardTitle>
              <CardDescription>
                A hierarchical structure with a root node and at most two children per node.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Used for efficient searching and sorting operations.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild className="mt-auto">
                <Link to="/visualize/binary-tree">Visualize</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Graph
              </CardTitle>
              <CardDescription>
                A non-linear structure of vertices connected by edges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ideal for representing networks and relationships.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild className="mt-auto">
                <Link to="/visualize/graph">Visualize</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Learning Path */}
      <section className="space-y-6 bg-muted/50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold">Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Start with Basics</CardTitle>
              <CardDescription>Fundamental data structures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Arrays and Lists</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Stacks and Queues</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Linked Lists</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" asChild className="w-full">
                <Link to="/visualize/array">Continue Learning</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Intermediate</CardTitle>
              <CardDescription>Trees and advanced structures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>Binary Trees</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>BST and AVL Trees</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>Hash Tables</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/visualize/binary-tree">Explore</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Advanced</CardTitle>
              <CardDescription>Complex algorithms and optimizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>Graphs and Networks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>Advanced Sorting</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <span>Path Finding Algorithms</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/visualize/graph">Explore</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5 text-accent" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Watch step-by-step video explanations of data structures and algorithms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/videos">Watch Videos</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Compare Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compare different algorithms side by side to understand their efficiency.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/compare">Compare Now</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access curated learning resources and reference materials.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Home;
