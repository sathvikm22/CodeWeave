
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResourceLink {
  title: string;
  url: string;
  description: string;
}

interface ResourceCategory {
  name: string;
  links: ResourceLink[];
  type: 'linear' | 'trees' | 'advanced' | 'sorting';
}

const ExternalResources: React.FC<{ filter?: string }> = ({ filter }) => {
  const resources: ResourceCategory[] = [
    {
      name: "Arrays",
      type: "linear",
      links: [
        {
          title: "GeeksforGeeks - Array Data Structure",
          url: "https://www.geeksforgeeks.org/array-data-structure/",
          description: "Comprehensive guide to array operations and implementations"
        },
        {
          title: "JavaScript Array Methods - MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
          description: "Complete documentation of JavaScript array methods"
        },
        {
          title: "Arrays in Computer Science - Khan Academy",
          url: "https://www.khanacademy.org/computing/computer-science/algorithms/sorting-algorithms/a/arrays-and-indexes",
          description: "Visual explanation of arrays with interactive exercises"
        }
      ]
    },
    {
      name: "Stacks",
      type: "linear",
      links: [
        {
          title: "Stack Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/stack-data-structure/",
          description: "Explanation of stack operations with real-world examples"
        },
        {
          title: "Stack Implementation in JavaScript - Programiz",
          url: "https://www.programiz.com/javascript/examples/stack-implementation",
          description: "Step-by-step guide to implementing stacks in JavaScript"
        },
        {
          title: "Stack Applications - Brilliant",
          url: "https://brilliant.org/wiki/stacks-and-queues/",
          description: "Practical applications of stacks in computing"
        }
      ]
    },
    {
      name: "Queues",
      type: "linear",
      links: [
        {
          title: "Queue Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/queue-data-structure/",
          description: "In-depth explanation of queue operations"
        },
        {
          title: "JavaScript Queue Implementation - JavaScript Tutorial",
          url: "https://www.javascripttutorial.net/javascript-queue/",
          description: "Different ways to implement queues in JavaScript"
        },
        {
          title: "Queue Applications - Carnegie Mellon",
          url: "https://www.cs.cmu.edu/~adamchik/15-121/lectures/Stacks%20and%20Queues/Stacks%20and%20Queues.html",
          description: "Academic explanation of queue applications"
        }
      ]
    },
    {
      name: "Circular Queues",
      type: "linear",
      links: [
        {
          title: "Circular Queue Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/",
          description: "Implementation and operations of circular queues"
        },
        {
          title: "Circular Queue in Data Structure - JavaTpoint",
          url: "https://www.javatpoint.com/ds-circular-queue",
          description: "Detailed explanation with diagrams and examples"
        },
        {
          title: "Circular Queue Operations - Programiz",
          url: "https://www.programiz.com/dsa/circular-queue",
          description: "Visual explanation of circular queue operations"
        }
      ]
    },
    {
      name: "Linked Lists",
      type: "linear",
      links: [
        {
          title: "Linked List Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
          description: "Comprehensive guide to linked list implementations"
        },
        {
          title: "Linked Lists in JavaScript - freeCodeCamp",
          url: "https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/",
          description: "Step-by-step tutorial for implementing linked lists"
        },
        {
          title: "Linked List vs Array - Baeldung",
          url: "https://www.baeldung.com/cs/array-vs-linked-list",
          description: "Detailed comparison between arrays and linked lists"
        }
      ]
    },
    {
      name: "Doubly Linked Lists",
      type: "linear",
      links: [
        {
          title: "Doubly Linked List - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/doubly-linked-list/",
          description: "Complete guide to doubly linked list operations"
        },
        {
          title: "JavaScript Doubly Linked List Implementation - Programiz",
          url: "https://www.programiz.com/javascript/examples/doubly-linked-list",
          description: "Implementation of doubly linked list in JavaScript"
        },
        {
          title: "Doubly Linked List Applications - TutorialsPoint",
          url: "https://www.tutorialspoint.com/data_structures_algorithms/doubly_linked_list_algorithm.htm",
          description: "Applications and advantages of doubly linked lists"
        }
      ]
    },
    {
      name: "Binary Trees",
      type: "trees",
      links: [
        {
          title: "Binary Tree Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
          description: "Comprehensive explanation of binary tree concepts"
        },
        {
          title: "Binary Trees - Visualgo",
          url: "https://visualgo.net/en/bst",
          description: "Interactive visualization of binary tree operations"
        },
        {
          title: "JavaScript Tree Implementation - Adrian Mejia",
          url: "https://adrianmejia.com/data-structures-for-beginners-trees-binary-search-tree-tutorial/",
          description: "Practical guide to implementing trees in JavaScript"
        }
      ]
    },
    {
      name: "Binary Search Trees",
      type: "trees",
      links: [
        {
          title: "Binary Search Tree - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
          description: "Complete guide to binary search tree operations"
        },
        {
          title: "BST Implementation in JavaScript - Medium",
          url: "https://medium.com/javascript-in-plain-english/binary-search-tree-implementation-in-javascript-a2a0f7b2e7d0",
          description: "JavaScript implementation with examples"
        },
        {
          title: "Tree Traversal Algorithms - HackerEarth",
          url: "https://www.hackerearth.com/practice/algorithms/searching/binary-search/tutorial/",
          description: "Different ways to traverse and search binary trees"
        }
      ]
    },
    {
      name: "AVL Trees",
      type: "trees",
      links: [
        {
          title: "AVL Tree - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/",
          description: "Balanced tree operations with rotations explained"
        },
        {
          title: "AVL Trees - Programiz",
          url: "https://www.programiz.com/dsa/avl-tree",
          description: "Visual guide to AVL tree balancing"
        },
        {
          title: "Self-balancing Binary Search Trees - YouTube",
          url: "https://www.youtube.com/watch?v=g4y2h70D6Nk",
          description: "Video tutorial on self-balancing trees"
        }
      ]
    },
    {
      name: "Heaps",
      type: "trees",
      links: [
        {
          title: "Heap Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/heap-data-structure/",
          description: "Complete guide to heap operations"
        },
        {
          title: "Binary Heap - Programiz",
          url: "https://www.programiz.com/dsa/heap-data-structure",
          description: "Heap implementation with visualizations"
        },
        {
          title: "Priority Queues and Heaps - Stanford CS Library",
          url: "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1176/handouts/190%20Assignment%205.pdf",
          description: "Academic explanation of heaps and priority queues"
        }
      ]
    },
    {
      name: "Graphs",
      type: "advanced",
      links: [
        {
          title: "Graph Data Structure - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
          description: "Comprehensive guide to graph implementations"
        },
        {
          title: "Graph Theory Basics - Brilliant",
          url: "https://brilliant.org/wiki/graph-theory/",
          description: "Mathematical foundations of graph theory"
        },
        {
          title: "Graph Algorithms - Visualgo",
          url: "https://visualgo.net/en/graphds",
          description: "Interactive visualization of graph algorithms"
        }
      ]
    },
    {
      name: "Hash Tables",
      type: "advanced",
      links: [
        {
          title: "Hash Table - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/hashing-data-structure/",
          description: "In-depth explanation of hash tables"
        },
        {
          title: "JavaScript Maps and Sets - MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections",
          description: "Hash map implementations in JavaScript"
        },
        {
          title: "Hash Tables Explained - CS.fyi",
          url: "https://cs.fyi/guide/hash-tables-explained",
          description: "Simplified explanation with examples"
        }
      ]
    },
    {
      name: "Tries",
      type: "advanced",
      links: [
        {
          title: "Trie (Prefix Tree) - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/trie-insert-and-search/",
          description: "Complete explanation of trie operations"
        },
        {
          title: "Implementing a Trie in JavaScript - Medium",
          url: "https://medium.com/basecs/implementing-a-trie-data-structure-in-javascript-2615dd641e0d",
          description: "Step-by-step implementation tutorial"
        },
        {
          title: "Applications of Trie - HackerEarth",
          url: "https://www.hackerearth.com/practice/data-structures/advanced-data-structures/trie-keyword-tree/tutorial/",
          description: "Practical applications of tries"
        }
      ]
    },
    {
      name: "Bubble Sort",
      type: "sorting",
      links: [
        {
          title: "Bubble Sort - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/bubble-sort/",
          description: "Algorithm explanation with examples"
        },
        {
          title: "Bubble Sort Visualization - Visualgo",
          url: "https://visualgo.net/en/sorting",
          description: "Interactive visualization of bubble sort"
        },
        {
          title: "Implementing Bubble Sort in JavaScript - Medium",
          url: "https://medium.com/javascript-algorithms/javascript-algorithms-bubble-sort-c2ff20e834dc",
          description: "JavaScript implementation with time complexity analysis"
        }
      ]
    },
    {
      name: "Insertion Sort",
      type: "sorting",
      links: [
        {
          title: "Insertion Sort - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/insertion-sort/",
          description: "Algorithm explanation with examples"
        },
        {
          title: "Insertion Sort - Programiz",
          url: "https://www.programiz.com/dsa/insertion-sort",
          description: "Step-by-step visualization"
        },
        {
          title: "When to Use Insertion Sort - InterviewCake",
          url: "https://www.interviewcake.com/concept/java/insertion-sort",
          description: "Practical applications and efficiency analysis"
        }
      ]
    },
    {
      name: "Selection Sort",
      type: "sorting",
      links: [
        {
          title: "Selection Sort - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/selection-sort/",
          description: "Algorithm explanation with examples"
        },
        {
          title: "Selection Sort - Programiz",
          url: "https://www.programiz.com/dsa/selection-sort",
          description: "Step-by-step visualization"
        },
        {
          title: "Selection Sort vs Bubble Sort - StackOverflow",
          url: "https://stackoverflow.com/questions/17270628/bubble-sort-vs-selection-sort",
          description: "Comparison between sorting algorithms"
        }
      ]
    },
    {
      name: "Merge Sort",
      type: "sorting",
      links: [
        {
          title: "Merge Sort - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/merge-sort/",
          description: "Divide and conquer algorithm explained"
        },
        {
          title: "Merge Sort Visualization - Visualgo",
          url: "https://visualgo.net/en/sorting",
          description: "Interactive visualization of merge sort"
        },
        {
          title: "Implementing Merge Sort in JavaScript - Medium",
          url: "https://medium.com/javascript-in-plain-english/javascript-merge-sort-3205891ac060",
          description: "JavaScript implementation with explanations"
        }
      ]
    },
    {
      name: "Quick Sort",
      type: "sorting",
      links: [
        {
          title: "Quick Sort - GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/quick-sort/",
          description: "Detailed explanation with partitioning"
        },
        {
          title: "Quick Sort Visualization - Visualgo",
          url: "https://visualgo.net/en/sorting",
          description: "Interactive visualization of quick sort"
        },
        {
          title: "Why is Quick Sort Efficient? - BaseCS",
          url: "https://medium.com/basecs/pivoting-to-understand-quicksort-part-1-75178dfb9313",
          description: "Deep dive into quick sort efficiency"
        }
      ]
    }
  ];

  // Filter resources based on the filter prop if provided
  const filteredResources = filter 
    ? resources.filter(category => category.type === filter)
    : resources;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-12 px-4">
      {!filter && (
        <>
          <h2 className="text-2xl font-bold mb-6">External Learning Resources</h2>
          <p className="text-muted-foreground mb-6">
            Explore these carefully selected external resources to deepen your understanding of data structures.
          </p>
        </>
      )}
      
      <Accordion type="single" collapsible className="w-full">
        {filteredResources.map((category, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-lg font-medium">
              {category.name} Resources
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 mt-2">
                {category.links.map((link, linkIdx) => (
                  <a 
                    key={linkIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <ExternalLink size={18} className="text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ExternalResources;
