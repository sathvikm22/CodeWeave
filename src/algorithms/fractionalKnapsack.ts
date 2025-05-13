
import { KnapsackItem, AlgorithmStep, NodeStatus, EdgeStatus } from "../visualizations/VisualizationTypes";

export const runFractionalKnapsack = (items: KnapsackItem[], capacity: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const nodeStatuses: Record<string, NodeStatus> = {};
  const edgeStatuses: Record<string, EdgeStatus> = {};
  const selectedItems: KnapsackItem[] = [];
  
  // Initial step
  steps.push({
    description: "Initialize with all items unsorted",
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    selectedItems: []
  });
  
  // Calculate value-to-weight ratio for each item
  const itemsWithRatio = items.map(item => ({
    ...item,
    ratio: item.value / item.weight
  }));
  
  // Sort items by value-to-weight ratio in descending order
  itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
  
  steps.push({
    description: "Sort items by value-to-weight ratio (value/weight) in descending order",
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    selectedItems: [...itemsWithRatio.map(item => ({ ...item, fraction: 0 }))]
  });
  
  let remainingCapacity = capacity;
  let totalValue = 0;
  
  for (const item of itemsWithRatio) {
    // Mark current item as processing
    nodeStatuses[item.id] = NodeStatus.PROCESSING;
    
    steps.push({
      description: `Considering item ${item.id} with value ${item.value} and weight ${item.weight}`,
      nodeStatuses: { ...nodeStatuses },
      edgeStatuses: { ...edgeStatuses },
      selectedItems: [...selectedItems],
      totalValue
    });
    
    if (remainingCapacity >= item.weight) {
      // Take the whole item
      remainingCapacity -= item.weight;
      totalValue += item.value;
      
      nodeStatuses[item.id] = NodeStatus.FINALIZED;
      
      selectedItems.push({ ...item, fraction: 1 });
      
      steps.push({
        description: `Added entire item ${item.id}. Remaining capacity: ${remainingCapacity}`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        selectedItems: [...selectedItems],
        totalValue
      });
    } else if (remainingCapacity > 0) {
      // Take a fraction of the item
      const fraction = remainingCapacity / item.weight;
      const valueGained = item.value * fraction;
      totalValue += valueGained;
      
      nodeStatuses[item.id] = NodeStatus.FINALIZED;
      
      selectedItems.push({ ...item, fraction });
      
      steps.push({
        description: `Added ${(fraction * 100).toFixed(2)}% of item ${item.id}. Remaining capacity: 0`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        selectedItems: [...selectedItems],
        totalValue
      });
      
      remainingCapacity = 0;
    } else {
      // Skip this item
      nodeStatuses[item.id] = NodeStatus.REJECTED;
      
      steps.push({
        description: `Skipped item ${item.id} due to insufficient capacity`,
        nodeStatuses: { ...nodeStatuses },
        edgeStatuses: { ...edgeStatuses },
        selectedItems: [...selectedItems],
        totalValue
      });
    }
    
    if (remainingCapacity === 0) {
      break;
    }
  }
  
  steps.push({
    description: `Fractional Knapsack solution complete. Total value: ${totalValue.toFixed(2)}`,
    nodeStatuses: { ...nodeStatuses },
    edgeStatuses: { ...edgeStatuses },
    selectedItems: [...selectedItems],
    totalValue
  });
  
  return steps;
};

// Code snippets for the algorithm
export const fractionalKnapsackCodeSnippets = {
  javascript: `// Fractional Knapsack implementation in JavaScript
function fractionalKnapsack(items, capacity) {
  // Calculate value-to-weight ratio for each item
  const itemsWithRatio = items.map(item => ({
    ...item,
    ratio: item.value / item.weight
  }));
  
  // Sort items by value-to-weight ratio in descending order
  itemsWithRatio.sort((a, b) => b.ratio - a.ratio);
  
  let remainingCapacity = capacity;
  let totalValue = 0;
  const selectedItems = [];
  
  for (const item of itemsWithRatio) {
    if (remainingCapacity >= item.weight) {
      // Take the whole item
      selectedItems.push({ ...item, fraction: 1 });
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else if (remainingCapacity > 0) {
      // Take a fraction of the item
      const fraction = remainingCapacity / item.weight;
      selectedItems.push({ ...item, fraction });
      totalValue += item.value * fraction;
      remainingCapacity = 0;
    } else {
      // Skip this item
      break;
    }
  }
  
  return { selectedItems, totalValue };
}

// Example usage
const items = [
  { id: "A", value: 60, weight: 10 },
  { id: "B", value: 100, weight: 20 },
  { id: "C", value: 120, weight: 30 }
];
const capacity = 50;
const result = fractionalKnapsack(items, capacity);
console.log(\`Total value: \${result.totalValue}\`);
console.log("Selected items:", result.selectedItems);`,

  python: `# Fractional Knapsack implementation in Python
def fractional_knapsack(items, capacity):
    # Calculate value-to-weight ratio for each item
    for item in items:
        item['ratio'] = item['value'] / item['weight']
    
    # Sort items by value-to-weight ratio in descending order
    items.sort(key=lambda x: x['ratio'], reverse=True)
    
    remaining_capacity = capacity
    total_value = 0
    selected_items = []
    
    for item in items:
        if remaining_capacity >= item['weight']:
            # Take the whole item
            selected_items.append({**item, 'fraction': 1})
            total_value += item['value']
            remaining_capacity -= item['weight']
        elif remaining_capacity > 0:
            # Take a fraction of the item
            fraction = remaining_capacity / item['weight']
            selected_items.append({**item, 'fraction': fraction})
            total_value += item['value'] * fraction
            remaining_capacity = 0
        else:
            # Skip this item
            break
    
    return {'selected_items': selected_items, 'total_value': total_value}

# Example usage
items = [
    {'id': 'A', 'value': 60, 'weight': 10},
    {'id': 'B', 'value': 100, 'weight': 20},
    {'id': 'C', 'value': 120, 'weight': 30}
]
capacity = 50
result = fractional_knapsack(items, capacity)
print(f"Total value: {result['total_value']}")
print("Selected items:", result['selected_items'])`,

  cpp: `// Fractional Knapsack implementation in C++
#include <iostream>
#include <vector>
#include <algorithm>

struct Item {
    std::string id;
    double value;
    double weight;
    double ratio;
    double fraction;
};

struct Result {
    std::vector<Item> selectedItems;
    double totalValue;
};

Result fractionalKnapsack(std::vector<Item> items, double capacity) {
    // Calculate value-to-weight ratio for each item
    for (auto& item : items) {
        item.ratio = item.value / item.weight;
    }
    
    // Sort items by value-to-weight ratio in descending order
    std::sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
        return a.ratio > b.ratio;
    });
    
    double remainingCapacity = capacity;
    double totalValue = 0;
    std::vector<Item> selectedItems;
    
    for (const auto& item : items) {
        if (remainingCapacity >= item.weight) {
            // Take the whole item
            Item selectedItem = item;
            selectedItem.fraction = 1.0;
            selectedItems.push_back(selectedItem);
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else if (remainingCapacity > 0) {
            // Take a fraction of the item
            double fraction = remainingCapacity / item.weight;
            Item selectedItem = item;
            selectedItem.fraction = fraction;
            selectedItems.push_back(selectedItem);
            totalValue += item.value * fraction;
            remainingCapacity = 0;
        } else {
            // Skip this item
            break;
        }
    }
    
    return {selectedItems, totalValue};
}

int main() {
    std::vector<Item> items = {
        {"A", 60, 10, 0, 0},
        {"B", 100, 20, 0, 0},
        {"C", 120, 30, 0, 0}
    };
    double capacity = 50;
    
    Result result = fractionalKnapsack(items, capacity);
    
    std::cout << "Total value: " << result.totalValue << std::endl;
    std::cout << "Selected items:" << std::endl;
    for (const auto& item : result.selectedItems) {
        std::cout << "Item " << item.id << " - fraction: " << item.fraction << std::endl;
    }
    
    return 0;
}`
};
