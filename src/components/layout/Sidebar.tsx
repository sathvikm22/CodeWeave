import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  FolderTree, 
  LineChart, 
  List, 
  Files, 
  LayoutGrid, 
  Network, 
  History, 
  FileVideo,
  ArrowLeftToLine,
  ArrowRightToLine,
  Home,
  Search,
  GitBranch,
  GitMerge,
  Code,
  Sparkles,
  ListTree,
  Layers,
  Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  path: string;
  children?: { name: string; path: string }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon, path, children }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const isCurrentPath = location.pathname === path;
  const hasChildren = children && children.length > 0;
  
  return (
    <div>
      <Link
        to={path}
        className={cn(
          "flex items-center justify-between py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
          isCurrentPath && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        )}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{name}</span>
        </div>
        {hasChildren && (
          <span className="text-muted-foreground">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        )}
      </Link>
      
      {hasChildren && expanded && (
        <div className="ml-6 mt-1 space-y-1 border-l pl-2 border-sidebar-border/50">
          {children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={cn(
                "block py-1.5 px-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
                location.pathname === child.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  return (
    <aside className={cn(
      "flex flex-col bg-sidebar border-r transition-all h-full overflow-y-auto",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-end p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleCollapse}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {collapsed ? <ArrowRightToLine size={18} /> : <ArrowLeftToLine size={18} />}
        </Button>
      </div>
      
      {collapsed ? (
        <div className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
          <Link to="/" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <Home size={22} />
          </Link>
          <Link to="/codecraft" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <Code size={22} />
          </Link>
          <Link to="/visualize/array" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <List size={22} />
          </Link>
          <Link to="/visualize/stack" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <Files size={22} />
          </Link>
          <Link to="/visualize/tree" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <FolderTree size={22} />
          </Link>
          <Link to="/algorithms" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <Search size={22} />
          </Link>
          <Link to="/resources" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <LayoutGrid size={22} />
          </Link>
          <Link to="/videos" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <FileVideo size={22} />
          </Link>
          <Link to="/compare" className="flex justify-center py-2 hover:bg-sidebar-accent/50 rounded-md">
            <History size={22} />
          </Link>
        </div>
      ) : (
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors mb-4"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2 pl-3">
            Tools
          </p>
          <Link
            to="/codecraft"
            className="flex items-center gap-2 py-2 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors mb-4"
          >
            <Code size={18} />
            <span>CodeCraft</span>
          </Link>
        
          <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2 pl-3">
            Data Structures
          </p>
          <SidebarItem 
            name="Linear Structures" 
            icon={<List size={18} />} 
            path="/visualize/linear"
            children={[
              { name: "Array", path: "/visualize/array" },
              { name: "Stack", path: "/visualize/stack" },
              { name: "Queue", path: "/visualize/queue" },
              { name: "Circular Queue", path: "/visualize/circular-queue" },
              { name: "Linked List", path: "/visualize/linked-list" },
              { name: "Doubly Linked List", path: "/visualize/doubly-linked-list" },
            ]}
          />
          <SidebarItem 
            name="Tree Structures" 
            icon={<FolderTree size={18} />} 
            path="/visualize/tree"
            children={[
              { name: "Binary Tree", path: "/visualize/binary-tree" },
              { name: "BST", path: "/visualize/bst" },
              { name: "AVL Tree", path: "/visualize/avl-tree" },
              { name: "Heap", path: "/visualize/heap" },
            ]}
          />
          
          <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2 mt-6 pl-3">
            Algorithms
          </p>
          <SidebarItem 
            name="Sorting Algorithms" 
            icon={<LineChart size={18} />} 
            path="/algorithms/sorting"
            children={[
              { name: "Bubble Sort", path: "/algorithms/bubble-sort" },
              { name: "Selection Sort", path: "/algorithms/selection-sort" },
              { name: "Insertion Sort", path: "/algorithms/insertion-sort" },
              { name: "Merge Sort", path: "/algorithms/merge-sort" },
              { name: "Quick Sort", path: "/algorithms/quick-sort" },
            ]}
          />
          <SidebarItem 
            name="Searching Algorithms" 
            icon={<Search size={18} />} 
            path="/algorithms/searching"
            children={[
              { name: "Linear Search", path: "/algorithms/linear-search" },
              { name: "Binary Search", path: "/algorithms/binary-search" },
            ]}
          />
          <SidebarItem 
            name="Greedy Algorithms" 
            icon={<Sparkles size={18} />} 
            path="/algorithms/greedy"
            children={[
              { name: "Dijkstra's Algorithm", path: "/algorithms/dijkstra" },
              { name: "Fractional Knapsack", path: "/algorithms/fractional-knapsack" },
              { name: "Prim's MST", path: "/algorithms/prims-mst" },
            ]}
          />
          <SidebarItem 
            name="Dynamic Programming" 
            icon={<Workflow size={18} />} 
            path="/algorithms/dp"
            children={[
              { name: "Floyd-Warshall", path: "/algorithms/floyd-warshall" },
              { name: "Bellman-Ford", path: "/algorithms/bellman-ford" },
            ]}
          />
          
          <p className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2 mt-6 pl-3">
            Resources
          </p>
          <SidebarItem name="Learning Resources" icon={<LayoutGrid size={18} />} path="/resources" />
          <SidebarItem name="Video Tutorials" icon={<FileVideo size={18} />} path="/videos" />
          <SidebarItem name="Compare Algorithms" icon={<History size={18} />} path="/compare" />
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
