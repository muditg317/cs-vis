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

import { default as BruteForceVisualizer } from 'components/string-searching/brute-force';
import { default as BoyerMooreVisualizer } from 'components/string-searching/boyer-moore';
import { default as KMPVisualizer } from 'components/string-searching/kmp';
import { default as RabinKarpVisualizer } from 'components/string-searching/rabin-karp';

import { default as BFSVisualizer } from 'components/graph-algorithms/bfs';
import { default as DFSVisualizer } from 'components/graph-algorithms/dfs';
import { default as DijkstrasVisualizer } from 'components/graph-algorithms/dijkstras';
import { default as PrimsVisualizer } from 'components/graph-algorithms/prims';
import { default as KruskalsVisualizer } from 'components/graph-algorithms/kruskals';

import { default as LCSVisualizer } from 'components/dynamic-programming/lcs';
import { default as FloydWarshallVisualizer } from 'components/dynamic-programming/floyd-warshall';

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
                classes: [
                    {
                        link: "arraylist",
                        title_text: "ArrayList",
                        component: ArrayListVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["add", "remove", "get"],
                                cols: ["Front", "AtIndex(i)", "Back"],
                                col1Name: "Operation",
                                add_Front: {
                                    average: "O(n)",
                                },
                                add_AtIndex: {
                                    average: "O(n)",
                                },
                                add_Back: {
                                    amortized: "O(1)",
                                    worst: "O(n)",
                                },
                                remove_Front: {
                                    average: "O(n)",
                                },
                                remove_AtIndex: {
                                    average: "O(n)",
                                },
                                remove_Back: {
                                    average: "O(1)",
                                },
                                get: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "sll",
                        title_text: "Singly LinkedList",
                        component: SinglyLinkedListVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["add", "remove", "get"],
                                cols: ["Front", "AtIndex(i)", "Back"],
                                col1Name: "Operation",
                                add_Front: {
                                    average: "O(1)",
                                },
                                add_AtIndex: {
                                    average: "O(n)",
                                },
                                add_Back: {
                                    average: "O(n)",
                                },
                                remove_Front: {
                                    average: "O(1)",
                                },
                                remove_AtIndex: {
                                    average: "O(n)",
                                },
                                remove_Back: {
                                    average: "O(n)",
                                },
                                get_Front: {
                                    average: "O(1)",
                                },
                                get_AtIndex: {
                                    average: "O(n)",
                                },
                                get_Back: {
                                    average: "O(n)",
                                },
                            },
                            withTailConfig: {
                                name: "With Tail Pointer",
                                add_Back: {
                                    newBigO: "O(1)",
                                },
                                get_Back: {
                                    newBigO: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "dll",
                        title_text: "Doubly LinkedList",
                        component: DoublyLinkedListVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["add", "remove", "get"],
                                cols: ["Front", "AtIndex(i)", "Back"],
                                col1Name: "Operation",
                                add_Front: {
                                    average: "O(1)",
                                },
                                add_AtIndex: {
                                    average: "O(n)",
                                },
                                add_Back: {
                                    average: "O(n)",
                                },
                                remove_Front: {
                                    average: "O(1)",
                                },
                                remove_AtIndex: {
                                    average: "O(n)",
                                },
                                remove_Back: {
                                    average: "O(n)",
                                },
                                get_Front: {
                                    average: "O(1)",
                                },
                                get_AtIndex: {
                                    average: "O(n)",
                                },
                                get_Back: {
                                    average: "O(n)",
                                },
                            },
                            withTailConfig: {
                                name: "With Tail Pointer",
                                Back: {
                                    newBigO: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "c-sll",
                        title_text: "Circular Singly LinkedList",
                        component: CircularSinglyLinkedListVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["add", "remove", "get"],
                                cols: ["Front", "AtIndex(i)", "Back"],
                                col1Name: "Operation",
                                add_Front: {
                                    average: "O(1)",
                                },
                                add_AtIndex: {
                                    average: "O(n)",
                                },
                                add_Back: {
                                    average: "O(1)",
                                },
                                remove_Front: {
                                    average: "O(1)",
                                },
                                remove_AtIndex: {
                                    average: "O(n)",
                                },
                                remove_Back: {
                                    average: "O(n)",
                                },
                                get_Front: {
                                    average: "O(1)",
                                },
                                get_AtIndex: {
                                    average: "O(n)",
                                },
                                get_Back: {
                                    average: "O(n)",
                                },
                            },
                            withTailConfig: {
                                name: "With Tail Pointer",
                                get_Back: {
                                    newBigO: "O(1)",
                                },
                            },
                        },
                    },
                ],
            },
            {
                link: "stacks-queues-deques",
                title_text: "Stacks/Queues/Deques",
                bigOOverride: "ADT_INFOS",
                bigOData: [
                    {
                        title_text: "Stack",
                        class: "stack-array"
                    },
                    {
                        title_text: "Queue",
                        class: "queue-array"
                    },
                    {
                        title_text: "Deque",
                        class: "deque-array"
                    },
                ],
                classes: [
                    {
                        link: "stack-array",
                        title_text: "Stack (Array)",
                        component: StackArrayVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Array", "LinkedList"],
                                cols: ["push", "pop", "peek"],
                                col1Name: "Backing Structure",
                                Array_push: {
                                    amortized: "O(1)",
                                    worst: "O(n)",
                                },
                                Array_pop: {
                                    average: "O(1)",
                                },
                                Array_peek: {
                                    average: "O(1)",
                                },
                                LinkedList: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "stack-linkedlist",
                        title_text: "Stack (LinkedList)",
                        component: StackLinkedListVisualizer,
                        bigOData: ["datastructures", "stacks-queues-deques", "stack-array"],
                    },
                    {
                        link: "queue-array",
                        title_text: "Queue (Array)",
                        component: QueueArrayVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Circular Array", "SinglyLinkedList", "DoublyLinkedList"],
                                cols: ["enqueue", "dequeue", "peek"],
                                col1Name: "Backing Structure",
                                Circular_enqueue: {
                                    amortized: "O(1)",
                                    worst: "O(n)",
                                },
                                Circular_dequeue: {
                                    average: "O(1)",
                                },
                                Circular_peek: {
                                    average: "O(1)",
                                },
                                SinglyLinkedList_enqueue: {
                                    average: "O(n)",
                                },
                                SinglyLinkedList_dequeue: {
                                    average: "O(1)",
                                },
                                SinglyLinkedList_peek: {
                                    average: "O(1)",
                                },
                                DoublyLinkedList_enqueue: {
                                    average: "O(n)",
                                },
                                DoublyLinkedList_dequeue: {
                                    average: "O(1)",
                                },
                                DoublyLinkedList_peek: {
                                    average: "O(1)",
                                },
                            },
                            withTailConfig: {
                                name: "With Tail Pointer",
                                SinglyLinkedList_enqueue: {
                                    newBigO: "O(1)",
                                },
                                DoublyLinkedList_enqueue: {
                                    newBigO: "O(1)",
                                },
                            }
                        },
                    },
                    {
                        link: "queue-linkedlist",
                        title_text: "Queue (LinkedList)",
                        component: QueueLinkedListVisualizer,
                        bigOData: ["datastructures", "stacks-queues-deques", "queue-array"],
                    },
                    {
                        link: "deque-array",
                        title_text: "Deque (Array)",
                        component: DequeArrayVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Circular Array", "DLL w/ Tail Pointer"],
                                cols: ["addFirst", "addLast", "removeFirst", "removeLast"],
                                col1Name: "Backing Structure",
                                Circular_addFirst: {
                                    amortized: "O(1)",
                                    worst: "O(n)",
                                },
                                Circular_addLast: {
                                    amortized: "O(1)",
                                    worst: "O(n)",
                                },
                                Circular_removeFirst: {
                                    average: "O(1)",
                                },
                                Circular_removeLast: {
                                    average: "O(1)",
                                },
                                DLL: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "deque-linkedlist",
                        title_text: "Deque (LinkedList)",
                        component: DequeLinkedListVisualizer,
                        bigOData: ["datastructures", "stacks-queues-deques", "deque-array"],
                    },
                ],
            },
            {
                link: "trees-skiplist",
                title_text: "Trees and SkipList",
                classes: [
                    {
                        link: "bst",
                        title_text: "Binary Search Tree",
                        component: BSTVisualizer,
                        description: "A BST is a binary tree (each node has 0-2 children) in which the left child is less than the parent and the right child is greater than the parent.",
                        examples: [
                            {
                                exampleText: "To get a degenerate BST, add ascending/descending data, such as 1,2,3,...",
                                tryItText: "Add 100,200,300",
                                operationList: [
                                    { methodName: "insert", params: [100], },
                                    { methodName: "insert", params: [200], },
                                    { methodName: "insert", params: [300], },
                                ],
                                needsReset: true,
                            },
                            {
                                exampleText: "To get a full BST, you can add 2,1,4,3,5, in that order",
                                tryItText: "Add 200,100,400,300,500",
                                operationList: [
                                    { methodName: "insert", params: [200], },
                                    { methodName: "insert", params: [100], },
                                    { methodName: "insert", params: [400], },
                                    { methodName: "insert", params: [300], },
                                    { methodName: "insert", params: [500], },
                                ],
                                needsReset: true,
                            },
                            {
                                exampleText: "To get a complete BST, you can add 3,2,4,1, in that order",
                                tryItText: "Add 300,200,400,100",
                                operationList: [
                                    { methodName: "insert", params: [300], },
                                    { methodName: "insert", params: [200], },
                                    { methodName: "insert", params: [400], },
                                    { methodName: "insert", params: [100], },
                                ],
                                needsReset: true,
                            },
                            {
                                exampleText: "To get a full and complete BST, you can add 4,2,5,1,3, in that order",
                                tryItText: "Add 400,200,500,100,300",
                                operationList: [
                                    { methodName: "insert", params: [400], },
                                    { methodName: "insert", params: [200], },
                                    { methodName: "insert", params: [500], },
                                    { methodName: "insert", params: [100], },
                                    { methodName: "insert", params: [300], },
                                ],
                                needsReset: true,
                            },
                        ],
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search", "height", "traversal"],
                                col1Name: "",
                                add: {
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                remove: {
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                search: {
                                    best: "O(1)",
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                height: {
                                    average: "O(n)",
                                },
                                traversal: {
                                    average: "O(n)",
                                },
                            },
                        },
                    },
                    {
                        link: "heap-pq",
                        title_text: "Heap / Priority Queue",
                        component: HeapVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search", "upHeap", "downHeap", "buildHeap"],
                                col1Name: "",
                                add: {
                                    best: "O(1)",
                                    amortized: "O(log(n))",
                                    worst: "O(n)",
                                },
                                remove: {
                                    best: "O(1)",
                                    average: "O(log(n))",
                                },
                                search: {
                                    average: "O(n)",
                                },
                                upHeap: {
                                    average: "O(log(n))",
                                },
                                downHeap: {
                                    average: "O(log(n))",
                                },
                                buildHeap: {
                                    average: "O(n)",
                                },
                            },
                        },
                    },
                    {
                        link: "avl",
                        title_text: "AVL",
                        component: AVLVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search", "single rotation", "double rotation"],
                                col1Name: "",
                                add: {
                                    average: "O(log(n))",
                                },
                                remove: {
                                    average: "O(log(n))",
                                },
                                search: {
                                    best: "O(1)",
                                    average: "O(log(n))",
                                },
                                single: {
                                    average: "O(1)",
                                },
                                double: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "24-tree",
                        title_text: "2-4 Tree",
                        component: BTreeVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search"],
                                col1Name: "",
                                add: {
                                    average: "O(log(n))",
                                },
                                remove: {
                                    average: "O(log(n))",
                                },
                                search: {
                                    best: "O(1)",
                                    average: "O(log(n))",
                                },
                            },
                        },
                    },
                    {
                        link: "splaytree",
                        title_text: "SplayTree",
                        component: SplayTreeVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search"],
                                col1Name: "",
                                add: {
                                    average: "O(log(n))",
                                },
                                remove: {
                                    average: "O(log(n))",
                                },
                                search: {
                                    average: "O(log(n))",
                                },
                            },
                        },
                    },
                    {
                        link: "skiplist",
                        title_text: "SkipList",
                        component: SkipListVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Efficiency"],
                                cols: ["add", "remove", "search", "Space"],
                                col1Name: "",
                                add: {
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                remove: {
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                search: {
                                    best: "O(1)",
                                    average: "O(log(n))",
                                    worst: "O(n)",
                                },
                                Space: {
                                    average: "O(n)",
                                    worst: "O(n log(n))",
                                },
                            },
                        },
                    },
                ],
            },
            {
                link: "hashmaps",
                title_text: "HashMaps",
                classes: [
                    {
                        link: "hashmap-probing",
                        title_text: "HashMap (Probing)",
                        component: HashMapProbingVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["linear/quadratic", "double hash"],
                                cols: ["put", "remove", "search"],
                                col1Name: "Probing Method",
                                explanation: "requires good hash function and tolerant load factor",
                                put: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                    unamortized: "O(n²)",
                                },
                                remove: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                },
                                search: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                },
                            },
                        },
                    },
                    {
                        link: "hashmap-chaining",
                        title_text: "HashMap (Chaining)",
                        component: HashMapChainingVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["LinkedList Chaining", "AVL Chaining"],
                                cols: ["put", "remove", "search"],
                                col1Name: "External Chain Type",
                                explanation: "requires good hash function and tolerant load factor",
                                LinkedList_put: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                },
                                LinkedList_remove: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                },
                                LinkedList_search: {
                                    average: "O(1)",
                                    worst: "O(n)",
                                },
                                AVL_put: {
                                    average: "O(1)",
                                    worst: "O(log(n))",
                                },
                                AVL_remove: {
                                    average: "O(1)",
                                    worst: "O(log(n))",
                                },
                                AVL_search: {
                                    average: "O(1)",
                                    worst: "O(log(n))",
                                },
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        link: "algorithms",
        icon: ["fas","code-branch"],
        title_text: "Algorithms",
        types: [
            {
                link: "sorting-quickselect",
                title_text: "Sorting and QuickSelect",
                bigOOverride: "MERGE_ROWS",
                classes: [
                    {
                        link: "bubble-sort",
                        title_text: "Bubble Sort",
                        component: BubbleSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    best: "O(n)",
                                    average: "O(n²)",
                                },
                                Stable: ["fas", "check-circle"],
                                Adaptive: ["fas", "check-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "cocktail-shaker-sort",
                        title_text: "Cocktail Shaker Sort",
                        component: CocktailShakerSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    best: "O(n)",
                                    average: "O(n²)",
                                },
                                Stable: ["fas", "check-circle"],
                                Adaptive: ["fas", "check-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "insertion-sort",
                        title_text: "Insertion Sort",
                        component: InsertionSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    best: "O(n)",
                                    average: "O(n²)",
                                },
                                Stable: ["fas", "check-circle"],
                                Adaptive: ["fas", "check-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "selection-sort",
                        title_text: "Selection Sort",
                        component: SelectionSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(n²)",
                                },
                                Stable: ["fas", "times-circle"],
                                Adaptive: ["fas", "times-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "quick-sort",
                        title_text: "Quick Sort",
                        component: QuickSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(n log(n))",
                                    worst: "O(n)",
                                    explanation: "worst O(n): pivot always @ min/max",
                                },
                                Stable: ["fas", "times-circle"],
                                Adaptive: ["fas", "times-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "kth-select",
                        title_text: "kᵗʰ Select / Quick Select",
                        component: QuickSelectVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(n log(n))",
                                    worst: "O(n)",
                                    explanation: "worst O(n): pivot always @ min/max",
                                },
                                Stable: ["fas", "times-circle"],
                                Extra: {
                                    average: "O(1)",
                                },
                            },
                        },
                    },
                    {
                        link: "merge-sort",
                        title_text: "Merge Sort",
                        component: MergeSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(n log(n))",
                                },
                                Stable: ["fas", "check-circle"],
                                Adaptive: ["fas", "times-circle"],
                                Extra: {
                                    average: "O(n)",
                                },
                            },
                        },
                    },
                    {
                        link: "lsd-radix-sort",
                        title_text: "LSD Radix Sort",
                        component: LSDRadixSortVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Stable", "Adaptive", "Extra Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(nk)",
                                },
                                Stable: ["fas", "check-circle"],
                                Adaptive: ["fas", "times-circle"],
                                Extra: {
                                    average: "O(n+k)",
                                },
                            },
                        },
                    },
                ],
            },
            {
                link: "string-searching",
                title_text: "String Searching",
                bigOOverride: "MERGE_ROWS",
                classes: [
                    {
                        link: "brute-force",
                        title_text: "Brute Force",
                        component: BruteForceVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["No Matches", "Single Occurrence", "All Occurrences", "General"],
                                col1Name: "",
                                No: {
                                    best: "O(n)",
                                    explanation: "mismatches always at first character of pattern",
                                },
                                Single: {
                                    best: "O(m)",
                                    explanation: "match at beginning of text",
                                },
                                All: {
                                    best: "O(mn)",
                                },
                                General: {
                                    average: "O(mn)",
                                    worst: "O(mn)",
                                    explanation: "mismatches always at last character of pattern",
                                },
                            },
                        },
                    },
                    {
                        link: "boyer-moore",
                        title_text: "Boyer Moore",
                        component: BoyerMooreVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Single Occurrence", "All Occurrences", "General"],
                                col1Name: "",
                                No: {
                                    worst: "O(m+n)",
                                },
                                Single: {
                                    best: "O(m)",
                                    explanation: "match at beginning of text",
                                },
                                All: {
                                    best: "O(m+n/m)",
                                    explanation: "O(m): building last occurrence table\nO(n/m): best case tracing",
                                    tier: 3,
                                },
                                General: {
                                    worst: "O(mn)",
                                    explanation: "average: implementation dependent\nworst O(mn): mismatches always at first character of pattern",
                                },
                            },
                        },
                    },
                    {
                        link: "kmp",
                        title_text: "KMP",
                        component: KMPVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Single Occurrence", "All Occurrences", "General"],
                                col1Name: "",
                                No: {
                                    average: "O(m+n)",
                                },
                                Single: {
                                    best: "O(m)",
                                    explanation: "match at beginning of text",
                                },
                                All: {
                                    best: "O(m+n)",
                                },
                                General: {
                                    average: "O(m+n)",
                                    explanation: "best = average = worst\nO(m) creating failure table\nO(n) tracing",
                                },
                            },
                        },
                    },
                    {
                        link: "rabin-karp",
                        title_text: "Rabin Karp",
                        component: RabinKarpVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Single Occurrence", "All Occurrences", "General"],
                                col1Name: "",
                                No: {
                                    best: "O(m+n)",
                                },
                                Single: {
                                    best: "O(m)",
                                    explanation: "match at beginning of text",
                                },
                                All: {
                                    best: "O(m+n)",
                                },
                                General: {
                                    average: "O(m+n)",
                                    worst: "O(mn)",
                                    explanation: "O(m) calculate intial hash\nO(n) tracing",
                                },
                            },
                        },
                    },
                ],
            },
            {
                link: "graphs",
                title_text: "Graph Algorithms",//do custom big o data ----- each gets time and space
                bigOOverride: "MERGE_COLS|EXTRA_TABLES",
                bigOData: [
                    {
                        title_text: "Graph Structure Performance",
                        data: {
                            rows: ["Space", "incidentEdges(u)", "areAdjacent(u,w)", "insertVertex(data)", "insertEdge(u,w,f)", "removeVertex(u)", "removeEdge(f)"],
                            cols: ["AdjacencyList", "AdjacencyMatrix", "EdgeList"],
                            col1Name: "Operation",
                            insertEdge: {
                                average: "O(1)",
                            },
                            removeEdge: {
                                average: "O(1)",
                            },
                            AdjacencyMatrix: {
                                average: "O(v²)",
                                tier: 5,
                            },
                            EdgeList: {
                                average: "O(e)",
                                tier: 3,
                            },
                            Space_AdjacencyList: {
                                average: "O(v+e)",
                                tier: 4,
                            },
                            Space_EdgeList: {
                                average: "O(v+e)",
                                tier: 4,
                            },
                            incidentEdges_AdjacencyList: {
                                average: "O(deg(u))",
                                tier: 2,
                            },
                            incidentEdges_AdjacencyMatrix: {
                                average: "O(v)",
                                tier: 3,
                            },
                            areAdjacent_AdjacencyList: {
                                average: "O(min(deg(u),deg(w)))",
                                tier: 2,
                            },
                            areAdjacent_AdjacencyMatrix: {
                                average: "O(1)",
                            },
                            insertVertex_AdjacencyList: {
                                average: "O(1)",
                            },
                            insertVertex_EdgeList: {
                                average: "O(1)",
                            },
                            removeVertex_AdjacencyList: {
                                average: "O(deg(v))",
                                tier: 2,
                            },
                        }
                    }
                ],
                classes: [
                    {
                        link: "bfs",
                        title_text: "Breadth-First Search",
                        component: BFSVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    worst: "O(v+e)",
                                    tier: 3,
                                },
                            },
                        },
                    },
                    {
                        link: "dfs",
                        title_text: "Depth-First Search",
                        component: DFSVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    worst: "O(v+e)",
                                    tier: 3,
                                },
                            },
                        },
                    },
                    {
                        link: "dijkstras",
                        title_text: "Dijkstra's",
                        component: DijkstrasVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    worst: "O((v+e)log(v))",
                                    tier: 4,
                                },
                            },
                        },
                    },
                    {
                        link: "prims",
                        title_text: "Prim's",
                        component: PrimsVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    worst: "O((v+e)log(v))",
                                    tier: 4,
                                },
                            },
                        },
                    },
                    {
                        link: "kruskals",
                        title_text: "Kruskal's",
                        component: KruskalsVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    worst: "O(e log(v))",
                                    tier: 4,
                                },
                            },
                        },
                    },
                ],
            },
            {
                link: "dynamic",
                title_text: "Dynamic Programming",
                classes: [
                    {
                        link: "lcs",
                        title_text: "LCS",
                        component: LCSVisualizer,
                        bigOData: {//do time and space
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time"],
                                col1Name: "",
                                Time: {
                                    average: "O(mn)",
                                },
                            },
                        },
                    },
                    {
                        link: "floyd-warshall",
                        title_text: "Floyd-Warshall",
                        component: FloydWarshallVisualizer,
                        bigOData: {
                            defaultConfig: {
                                rows: ["Specs"],
                                cols: ["Time", "Space"],
                                col1Name: "",
                                Time: {
                                    average: "O(v³)",
                                },
                                Space: {
                                    average: "O(v²)",
                                },
                            },
                        },
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
