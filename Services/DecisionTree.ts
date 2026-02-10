import { TreeNode } from '../types';

export class DecisionTree {
  root: TreeNode | null = null;
  private maxDepth: number;
  private classWeights: Record<number, number> = {};

  constructor(maxDepth: number = 3) {
    this.maxDepth = maxDepth;
  }

  private calculateWeights(dataset: number[][]) {
    const labels = dataset.map(row => row[row.length - 1]);
    const total = labels.length;
    const fraudCount = labels.filter(l => l === 1).length;
    const legitCount = total - fraudCount;
    
    this.classWeights[1] = total / (2 * (fraudCount || 1));
    this.classWeights[0] = total / (2 * (legitCount || 1));
  }

  private gini(groups: number[][][], classes: number[]): number {
    const nInstances = groups.reduce((acc, g) => acc + g.length, 0);
    let giniValue = 0;
    
    for (const group of groups) {
      const size = group.length;
      if (size === 0) continue;
      
      let score = 0;
      for (const cls of classes) {
        const count = group.filter(row => row[row.length - 1] === cls).length;
        const p = count / size;
        const weight = this.classWeights[cls] || 1;
        score += (p * p) * weight;
      }
      giniValue += (1.0 - score) * (size / nInstances);
    }
    return giniValue;
  }

  private testSplit(index: number, threshold: number, dataset: number[][]) {
    const left: number[][] = [];
    const right: number[][] = [];
    for (const row of dataset) {
      if (row[index] < threshold) left.push(row);
      else right.push(row);
    }
    return [left, right];
  }

  private getBestSplit(dataset: number[][]) {
    const classValues = [0, 1];
    let bIndex = 0, bValue = 0, bScore = 999, bGroups: number[][][] = [];
    
    for (let index = 0; index < dataset[0].length - 1; index++) {
      for (const row of dataset) {
        const groups = this.testSplit(index, row[index], dataset);
        const gini = this.gini(groups, classValues);
        if (gini < bScore) {
          bIndex = index;
          bValue = row[index];
          bScore = gini;
          bGroups = groups;
        }
      }
    }
    return { index: bIndex, value: bValue, groups: bGroups };
  }

  private toTerminal(group: number[][]): number {
    const outcomes = group.map(row => row[row.length - 1]);
    if (outcomes.length === 0) return 0;
    const fraudCount = outcomes.filter(o => o === 1).length;
    return fraudCount / outcomes.length;
  }

  private split(node: TreeNode, depth: number) {
    if (!node.groups) return;
    const [left, right] = node.groups;
    delete node.groups;

    if (!left.length || !right.length) {
      const val = this.toTerminal([...left, ...right]);
      node.left = node.right = { value: val };
      return;
    }

    if (depth >= this.maxDepth) {
      node.left = { value: this.toTerminal(left) };
      node.right = { value: this.toTerminal(right) };
      return;
    }

    const leftSplit = this.getBestSplit(left);
    node.left = { featureIndex: leftSplit.index, threshold: leftSplit.value, groups: leftSplit.groups };
    this.split(node.left, depth + 1);

    const rightSplit = this.getBestSplit(right);
    node.right = { featureIndex: rightSplit.index, threshold: rightSplit.value, groups: rightSplit.groups };
    this.split(node.right, depth + 1);
  }

  train(dataset: number[][]) {
    this.calculateWeights(dataset);
    const rootSplit = this.getBestSplit(dataset);
    this.root = { featureIndex: rootSplit.index, threshold: rootSplit.value, groups: rootSplit.groups };
    this.split(this.root, 1);
  }

  predict(row: number[]): number {
    let node = this.root;
    while (node && node.value === undefined) {
      if (row[node.featureIndex!] < node.threshold!) {
        node = node.left!;
      } else {
        node = node.right!;
      }
    }
    return node?.value ?? 0;
  }
}
