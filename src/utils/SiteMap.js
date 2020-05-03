import { default as ArrayListVisualizer } from 'components/lists/arraylist';
import { default as SinglyLinkedListVisualizer } from 'components/lists/singly-linked-list';
import { default as DoublyLinkedListVisualizer } from 'components/lists/doubly-linked-list';
import { default as CircularSinglyLinkedListVisualizer } from 'components/lists/circular-singly-linked-list';

import { default as StackArrayVisualizer } from 'components/stacks-queues-deques/stack-array';
import { default as StackLinkedListVisualizer } from 'components/stacks-queues-deques/stack-linked-list';
import { default as QueueArrayVisualizer } from 'components/stacks-queues-deques/queue-array';
import { default as QueueLinkedListVisualizer } from 'components/stacks-queues-deques/queue-linked-list';
import { default as DequeArrayVisualizer } from 'components/stacks-queues-deques/deque-array';
import { default as DequeLinkedListVisualizer } from 'components/stacks-queues-deques/deque-linked-list';

import { default as BSTVisualizer } from 'components/trees-skiplist/bst';
import { default as HeapVisualizer } from 'components/trees-skiplist/heap';
import { default as AVLVisualizer } from 'components/trees-skiplist/avl';
import { default as SplayTreeVisualizer } from 'components/trees-skiplist/splaytree';
import { default as BTreeVisualizer } from 'components/trees-skiplist/btree';
import { default as SkipListVisualizer } from 'components/trees-skiplist/skiplist';

import { default as HashMapProbingVisualizer } from 'components/hashmaps/hashmap-probing';
import { default as HashMapChainingVisualizer } from 'components/hashmaps/hashmap-chaining';

import { default as BubbleSortVisualizer } from 'components/sorting-quickselect/bubble-sort';
import { default as CocktailShakerSortVisualizer } from 'components/sorting-quickselect/cocktail-shaker-sort';
import { default as InsertionSortVisualizer } from 'components/sorting-quickselect/insertion-sort';
import { default as SelectionSortVisualizer } from 'components/sorting-quickselect/selection-sort';
import { default as QuickSortVisualizer } from 'components/sorting-quickselect/quick-sort';
import { default as QuickSelectVisualizer } from 'components/sorting-quickselect/quick-select';
import { default as MergeSortVisualizer } from 'components/sorting-quickselect/merge-sort';
import { default as LSDRadixSortVisualizer } from 'components/sorting-quickselect/lsd-radix-sort';
//
// import { default as BruteForceVisualizer } from 'components/string-searching/BruteForce';
// import { default as BoyerMooreVisualizer } from 'components/string-searching/BoyerMoore';
// import { default as KMPVisualizer } from 'components/string-searching/KMP';
// import { default as RabinKarpVisualizer } from 'components/string-searching/RabinKarp';
//
// import { default as BFSVisualizer } from 'components/graph-algorithms/BFS';
// import { default as DFSVisualizer } from 'components/graph-algorithms/DFS';
// import { default as DijkstrasVisualizer } from 'components/graph-algorithms/Dijkstras';
// import { default as PrimsVisualizer } from 'components/graph-algorithms/Prims';
// import { default as KruskalsVisualizer } from 'components/graph-algorithms/Kruskals';
//
// import { default as LCSVisualizer } from 'components/dynamic-programming/LCS';
// import { default as FloydWarshallVisualizer } from 'components/dynamic-programming/FloydWarshall';

export const SiteMap =
[
    {
        link: "datastructures",
        icon: "sitemap",
        title_text: "Data Structures",
        types: [
            {
                link: "lists",
                title_text: "Lists",
                visualizers: [
                    {
                        link: "arraylist",
                        title_text: "ArrayList",
                        component: ArrayListVisualizer,
                    },
                    {
                        link: "sll",
                        title_text: "Singly LinkedList",
                        component: SinglyLinkedListVisualizer,
                    },
                    {
                        link: "dll",
                        title_text: "Doubly LinkedList",
                        component: DoublyLinkedListVisualizer,
                    },
                    {
                        link: "c-sll",
                        title_text: "Circular Singly LinkedList",
                        component: CircularSinglyLinkedListVisualizer,
                    },
                ],
            },
            {
                link: "stacks-queues-deques",
                title_text: "Stacks/Queues/Deques",
                visualizers: [
                    {
                        link: "stack-array",
                        title_text: "Stack (Array)",
                        component: StackArrayVisualizer,
                    },
                    {
                        link: "stack-linkedlist",
                        title_text: "Stack (LinkedList)",
                        component: StackLinkedListVisualizer,
                    },
                    {
                        link: "queue-array",
                        title_text: "Queue (Array)",
                        component: QueueArrayVisualizer,
                    },
                    {
                        link: "queue-linkedlist",
                        title_text: "Queue (LinkedList)",
                        component: QueueLinkedListVisualizer,
                    },
                    {
                        link: "deque-array",
                        title_text: "Deque (Array)",
                        component: DequeArrayVisualizer,
                    },
                    {
                        link: "deque-linkedlist",
                        title_text: "Deque (LinkedList)",
                        component: DequeLinkedListVisualizer,
                    },
                ],
            },
            {
                link: "trees-skiplist",
                title_text: "Trees and SkipList",
                visualizers: [
                    {
                        link: "bst",
                        title_text: "Binary Search Tree",
                        component: BSTVisualizer,
                    },
                    {
                        link: "heap-pq",
                        title_text: "Heap / Priority Queue",
                        component: HeapVisualizer,
                    },
                    {
                        link: "avl",
                        title_text: "AVL",
                        component: AVLVisualizer,
                    },
                    {
                        link: "24-tree",
                        title_text: "2-4 Tree",
                        component: BTreeVisualizer,
                    },
                    {
                        link: "splaytree",
                        title_text: "SplayTree",
                        component: SplayTreeVisualizer,
                    },
                    {
                        link: "skiplist",
                        title_text: "SkipList",
                        component: SkipListVisualizer,
                    },
                ],
            },
            {
                link: "hashmaps",
                title_text: "HashMaps",
                visualizers: [
                    {
                        link: "hashmap-probing",
                        title_text: "HashMap (Probing)",
                        component: HashMapProbingVisualizer,
                    },
                    {
                        link: "hashmap-chaining",
                        title_text: "HashMap (Chaining)",
                        component: HashMapChainingVisualizer,
                    },
                ],
            },
        ],
    },
    {
        link: "algorithms",
        icon: "stack-overflow",
        title_text: "Algorithms",
        types: [
            {
                link: "sorting-quickselect",
                title_text: "Sorting and QuickSelect",
                visualizers: [
                    {
                        link: "bubble-sort",
                        title_text: "Bubble Sort",
                        component: BubbleSortVisualizer,
                    },
                    {
                        link: "cocktail-shaker-sort",
                        title_text: "Cocktail Shaker Sort",
                        component: CocktailShakerSortVisualizer,
                    },
                    {
                        link: "insertion-sort",
                        title_text: "Insertion Sort",
                        component: InsertionSortVisualizer,
                    },
                    {
                        link: "selection-sort",
                        title_text: "Selection Sort",
                        component: SelectionSortVisualizer,
                    },
                    {
                        link: "quick-sort",
                        title_text: "Quick Sort",
                        component: QuickSortVisualizer,
                    },
                    {
                        link: "quick-select",
                        title_text: "Quick Select",
                        component: QuickSelectVisualizer,
                    },
                    {
                        link: "merge-sort",
                        title_text: "Merge Sort",
                        component: MergeSortVisualizer,
                    },
                    {
                        link: "lsd-radix-sort",
                        title_text: "LSD Radix Sort",
                        component: LSDRadixSortVisualizer,
                    },
                ],
            },
            {
                link: "string-searching",
                title_text: "String Searching",
                visualizers: [
                    {
                        link: "brute-force",
                        title_text: "Brute Force",
                        //component: BruteForceVisualizer,
                    },
                    {
                        link: "boyer-moore",
                        title_text: "Boyer Moore",
                        //component: BoyerMooreVisualizer,
                    },
                    {
                        link: "kmp",
                        title_text: "KMP",
                        //component: KMPVisualizer,
                    },
                    {
                        link: "rabin-karp",
                        title_text: "Rabin Karp",
                        //component: RabinKarpVisualizer,
                    },
                ],
            },
            {
                link: "graphs",
                title_text: "Graph Algorithms",
                visualizers: [
                    {
                        link: "breadth",
                        title_text: "Breadth-First Search",
                        //component: BFSVisualizer,
                    },
                    {
                        link: "depth",
                        title_text: "Depth-First Search",
                        //component: DFSVisualizer,
                    },
                    {
                        link: "dijkstra",
                        title_text: "Dijkstra's",
                        //component: DijkstrasVisualizer,
                    },
                    {
                        link: "prim",
                        title_text: "Prim's",
                        //component: PrimsVisualizer,
                    },
                    {
                        link: "kruskal",
                        title_text: "Kruskal's",
                        //component: KruskalsVisualizer,
                    },
                ],
            },
            {
                link: "dynamic",
                title_text: "Dynamic Programming",
                visualizers: [
                    {
                        link: "lcs",
                        title_text: "LCS",
                        //component: LCSVisualizer,
                    },
                    {
                        link: "floyd-warshall",
                        title_text: "Floyd-Warshall",
                        //component: FloydWarshallVisualizer,
                    },
                ],
            },
        ],
    },
    {
        link: "about",
        icon: "user",
        title_text: "About",
    },
];
