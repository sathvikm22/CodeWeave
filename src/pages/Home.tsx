
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Code, 
  BookOpen, 
  List, 
  LayoutList, 
  Layers, 
  GitFork, 
  Network,
  ArrowRight,
  PlayCircle,
  Brackets,
  BarChart,
  ChevronRight,
  Database,
  Binary,
  Lightbulb
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExternalResources from '@/components/ExternalResources';

const DataStructureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  complexity: string;
}> = ({ title, description, icon, link, complexity }) => {
  return (
    <Card className="data-structure-card h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-primary">{icon}</div>
          <div className="text-xs px-2 py-1 bg-muted inline-block rounded-full text-primary border border-primary/20">
            {complexity}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-24 flex items-center justify-center border rounded-md bg-muted/30 overflow-hidden">
          {title === "Array" && (
            <div className="flex gap-1">
              {[20, 15, 30, 45, 10, 25].map((value, index) => (
                <div key={index} className="ds-array-cell h-10 w-10 flex items-center justify-center">{value}</div>
              ))}
            </div>
          )}
          
          {title === "Stack" && (
            <div className="flex flex-col-reverse gap-1">
              {[10, 20, 30].map((value, index) => (
                <div key={index} className="ds-array-cell h-8 w-16 flex items-center justify-center">
                  {value}
                </div>
              ))}
            </div>
          )}
          
          {title === "Queue" && (
            <div className="flex gap-1">
              {[30, 20, 10].map((value, index) => (
                <div key={index} className="queue-item w-12">
                  {value}
                </div>
              ))}
              <div className="flex flex-col text-xs text-muted-foreground">
                <span>front</span>
                <span>→</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={link} className="w-full">
          <Button className="w-full flex justify-between">
            <span>Visualize</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Home: React.FC = () => {
  const { user, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [showResources, setShowResources] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to <span className="text-primary">CodeWeave</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Explore, visualize, and understand data structures through interactive visualizations and 
            real-time code execution. Enhance your learning experience with our comprehensive tools.
          </p>
          
          <div className="mt-6 flex gap-4">
            <Link to="/visualization">
              <Button className="px-6 py-6 text-lg">
                Start Exploring
                <ChevronRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" className="px-6 py-6 text-lg">
                <BookOpen size={20} className="mr-2" />
                Learning Resources
              </Button>
            </Link>
          </div>
        </div>
        
        <section className="mb-16 animate-fade-in" style={{animationDelay: "100ms"}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Data Structures</h2>
            <Link to="/visualization">
              <Button variant="ghost" className="flex items-center gap-1">
                <span>View all</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataStructureCard
              title="Array"
              description="A collection of elements stored at contiguous memory locations"
              icon={<List size={24} />}
              link="/visualization/array"
              complexity="O(1) access"
            />
            <DataStructureCard
              title="Stack"
              description="A linear data structure with Last-In-First-Out (LIFO) behavior"
              icon={<Layers size={24} />}
              link="/visualization/stack"
              complexity="O(1) operations"
            />
            <DataStructureCard
              title="Queue"
              description="A linear data structure with First-In-First-Out (FIFO) behavior"
              icon={<LayoutList size={24} />}
              link="/visualization/queue"
              complexity="O(1) operations"
            />
          </div>
        </section>
        
        <section className="mb-16 animate-fade-in" style={{animationDelay: "200ms"}}>
          <h2 className="text-2xl font-semibold mb-6">Quick Start</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/visualization">
              <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-2 p-4 border-2 transition-transform hover:scale-[1.02]">
                <PlayCircle size={24} className="text-primary" />
                <span className="font-medium text-lg">Visualization Mode</span>
                <span className="text-sm text-muted-foreground">Explore data structures visually with interactive demos</span>
              </Button>
            </Link>
            
            <Link to="/code">
              <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-2 p-4 border-2 transition-transform hover:scale-[1.02]">
                <Brackets size={24} className="text-primary" />
                <span className="font-medium text-lg">Code Mode</span>
                <span className="text-sm text-muted-foreground">Write and visualize algorithms in real-time</span>
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="mb-16 animate-fade-in" style={{animationDelay: "300ms"}}>
          <h2 className="text-2xl font-semibold mb-6">Learning Path</h2>
          
          <div className="bg-accent/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <div className="text-primary mb-2">
                    <List size={28} />
                  </div>
                  <CardTitle className="text-xl">1. Linear Structures</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Arrays
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Stacks
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Queues
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Linked Lists
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <div className="text-primary mb-2">
                    <GitFork size={28} />
                  </div>
                  <CardTitle className="text-xl">2. Tree Structures</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Binary Trees
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Binary Search Trees
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      AVL Trees
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Heaps
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <div className="text-primary mb-2">
                    <Network size={28} />
                  </div>
                  <CardTitle className="text-xl">3. Advanced Structures</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Graphs
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Hash Tables
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Tries
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-primary" />
                      Advanced Algorithms
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link to="/resources">
                <Button className="px-6">
                  <Lightbulb size={18} className="mr-2" />
                  Explore Learning Resources
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="animate-fade-in mt-16" style={{animationDelay: "400ms"}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Data Structure Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/visualization">
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-primary mb-2">
                    <Database size={24} />
                  </div>
                  <CardTitle className="text-xl">Linear Data Structures</CardTitle>
                  <CardDescription>Explore arrays, stacks, queues, and linked lists</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn about fundamental data structures that store elements in a sequential manner.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore Linear Structures</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/visualization">
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-primary mb-2">
                    <GitFork size={24} />
                  </div>
                  <CardTitle className="text-xl">Tree Data Structures</CardTitle>
                  <CardDescription>Binary trees, search trees, AVL trees and heaps</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Understand hierarchical data structures with nodes and relationships.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore Tree Structures</Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/sorting">
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="text-primary mb-2">
                    <BarChart size={24} />
                  </div>
                  <CardTitle className="text-xl">Sorting Algorithms</CardTitle>
                  <CardDescription>Bubble, insertion, selection, merge, and quick sort</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Visualize and compare different sorting algorithms and their efficiencies.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore Sorting Algorithms</Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
