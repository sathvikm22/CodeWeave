
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Compare: React.FC = () => {
  const [algorithm1, setAlgorithm1] = useState('bubble');
  const [algorithm2, setAlgorithm2] = useState('quick');
  
  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Compare Algorithms</h1>
      <p className="text-muted-foreground">
        Compare different algorithms side by side to understand their efficiency and characteristics.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm 1</CardTitle>
            <CardDescription>Select the first algorithm to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={algorithm1} onValueChange={setAlgorithm1}>
              <SelectTrigger>
                <SelectValue placeholder="Select an algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sorting Algorithms</SelectLabel>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Searching Algorithms</SelectLabel>
                  <SelectItem value="linear">Linear Search</SelectItem>
                  <SelectItem value="binary">Binary Search</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Algorithm 2</CardTitle>
            <CardDescription>Select the second algorithm to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={algorithm2} onValueChange={setAlgorithm2}>
              <SelectTrigger>
                <SelectValue placeholder="Select an algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sorting Algorithms</SelectLabel>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Searching Algorithms</SelectLabel>
                  <SelectItem value="linear">Linear Search</SelectItem>
                  <SelectItem value="binary">Binary Search</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comparison Result</CardTitle>
          <CardDescription>Side-by-side comparison of selected algorithms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Aspect</TableHead>
                <TableHead>{algorithm1 === 'bubble' ? 'Bubble Sort' : algorithm1 === 'quick' ? 'Quick Sort' : algorithm1}</TableHead>
                <TableHead>{algorithm2 === 'bubble' ? 'Bubble Sort' : algorithm2 === 'quick' ? 'Quick Sort' : algorithm2}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Time Complexity (Worst)</TableCell>
                <TableCell>{algorithm1 === 'bubble' ? 'O(n²)' : algorithm1 === 'quick' ? 'O(n²)' : '-'}</TableCell>
                <TableCell>{algorithm2 === 'bubble' ? 'O(n²)' : algorithm2 === 'quick' ? 'O(n²)' : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time Complexity (Average)</TableCell>
                <TableCell>{algorithm1 === 'bubble' ? 'O(n²)' : algorithm1 === 'quick' ? 'O(n log n)' : '-'}</TableCell>
                <TableCell>{algorithm2 === 'bubble' ? 'O(n²)' : algorithm2 === 'quick' ? 'O(n log n)' : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Space Complexity</TableCell>
                <TableCell>{algorithm1 === 'bubble' ? 'O(1)' : algorithm1 === 'quick' ? 'O(log n)' : '-'}</TableCell>
                <TableCell>{algorithm2 === 'bubble' ? 'O(1)' : algorithm2 === 'quick' ? 'O(log n)' : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stability</TableCell>
                <TableCell>{algorithm1 === 'bubble' ? 'Stable' : algorithm1 === 'quick' ? 'Unstable' : '-'}</TableCell>
                <TableCell>{algorithm2 === 'bubble' ? 'Stable' : algorithm2 === 'quick' ? 'Unstable' : '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">In-place</TableCell>
                <TableCell>{algorithm1 === 'bubble' ? 'Yes' : algorithm1 === 'quick' ? 'Yes' : '-'}</TableCell>
                <TableCell>{algorithm2 === 'bubble' ? 'Yes' : algorithm2 === 'quick' ? 'Yes' : '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {algorithm1 === 'bubble' ? 'Bubble Sort' : algorithm1 === 'quick' ? 'Quick Sort' : algorithm1.charAt(0).toUpperCase() + algorithm1.slice(1)}
              </h3>
              <div className="p-4 bg-muted/30 rounded-md">
                {algorithm1 === 'bubble' && (
                  <p className="text-sm">
                    Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, 
                    compares adjacent elements and swaps them if they are in the wrong order. The process 
                    is repeated until the list is sorted.
                  </p>
                )}
                {algorithm1 === 'quick' && (
                  <p className="text-sm">
                    Quick Sort is an efficient, divide-and-conquer sorting algorithm that works by 
                    selecting a 'pivot' element and partitioning the array around the pivot, placing 
                    smaller elements before it and larger elements after it.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">
                {algorithm2 === 'bubble' ? 'Bubble Sort' : algorithm2 === 'quick' ? 'Quick Sort' : algorithm2.charAt(0).toUpperCase() + algorithm2.slice(1)}
              </h3>
              <div className="p-4 bg-muted/30 rounded-md">
                {algorithm2 === 'bubble' && (
                  <p className="text-sm">
                    Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, 
                    compares adjacent elements and swaps them if they are in the wrong order. The process 
                    is repeated until the list is sorted.
                  </p>
                )}
                {algorithm2 === 'quick' && (
                  <p className="text-sm">
                    Quick Sort is an efficient, divide-and-conquer sorting algorithm that works by 
                    selecting a 'pivot' element and partitioning the array around the pivot, placing 
                    smaller elements before it and larger elements after it.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button>
          Visualize Comparison
        </Button>
      </div>
    </div>
  );
};

export default Compare;
