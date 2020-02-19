import React from 'react';
import './app-header.scss';
import NavBar from '../nav-bar';


export default function AppHeader() {
    return (
            <header className="app-header">
                <NavBar nav_items={[
                    {
                        link: "datastructures",
                        icon: "sitemap",
                        title_text: "Data Structures",
                        drop_down_items: [
                            {
                                link: "lists",
                                title_text: "Lists",
                                side_pane_items: [
                                    {
                                        link: "arraylist",
                                        title_text: "ArrayList",
                                    },
                                    {
                                        link: "sll",
                                        title_text: "Singly LinkedList",
                                    },
                                    {
                                        link: "dll",
                                        title_text: "Doubly LinkedList",
                                    },
                                    {
                                        link: "c-sll",
                                        title_text: "Circular Singly LinkedList",
                                    },
                                ],
                            },
                            {
                                link: "stacks-queues-deques",
                                title_text: "Stacks/Queues/Deques",
                                side_pane_items: [
                                    {
                                        link: "stack-array",
                                        title_text: "Stack (Array)"
                                    },
                                    {
                                        link: "stack-linkedlist",
                                        title_text: "Stack (LinkedList)"
                                    },
                                    {
                                        link: "queue-array",
                                        title_text: "Queue (Array)"
                                    },
                                    {
                                        link: "queue-linkedlist",
                                        title_text: "Queue (LinkedList)"
                                    },
                                    {
                                        link: "deque-array",
                                        title_text: "Deque (Array)"
                                    },
                                    {
                                        link: "deque-linkedlist",
                                        title_text: "Deque (LinkedList)"
                                    },
                                ],
                            },
                            {
                                link: "trees-skiplist",
                                title_text: "Trees and SkipList",
                                side_pane_items: [
                                    {
                                        link: "bst",
                                        title_text: "Binary Search Tree"
                                    },
                                    {
                                        link: "heap-pq",
                                        title_text: "Heap / Priority Queue"
                                    },
                                    {
                                        link: "avl",
                                        title_text: "AVL"
                                    },
                                    {
                                        link: "24-tree",
                                        title_text: "2-4 Tree"
                                    },
                                    {
                                        link: "splaytree",
                                        title_text: "Deque (Array)"
                                    },
                                    {
                                        link: "skiplist",
                                        title_text: "SkipList"
                                    },
                                ],
                            },
                            {
                                link: "hashmaps",
                                title_text: "HashMaps",
                                side_pane_items: [
                                    {
                                        link: "hashmap-probing",
                                        title_text: "HashMap (Probing)"
                                    },
                                    {
                                        link: "hashmap-chaining",
                                        title_text: "HashMap (Chaining)"
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        link: "algorithms",
                        icon: "stack-overflow",
                        title_text: "Algorithms",
                        drop_down_items: [
                            {
                                link: "sorting",
                                title_text: "Sorting",
                                side_pane_items: [
                                    {
                                        link: "bubble",
                                        title_text: "Bubble Sort"
                                    },
                                    {
                                        link: "cocktail",
                                        title_text: "Cocktail Shaker Sort"
                                    },
                                    {
                                        link: "insertion",
                                        title_text: "Insertion Sort"
                                    },
                                    {
                                        link: "selection",
                                        title_text: "Selection Sort"
                                    },
                                    {
                                        link: "quicksort",
                                        title_text: "Quick Sort"
                                    },
                                    {
                                        link: "quickselect",
                                        title_text: "Quick Select"
                                    },
                                    {
                                        link: "merge",
                                        title_text: "Merge Sort"
                                    },
                                    {
                                        link: "lsd-radix",
                                        title_text: "LSD Radix Sort"
                                    },
                                ],
                            },
                            {
                                link: "string-searching",
                                title_text: "String Searching",
                                side_pane_items: [
                                    {
                                        link: "brute-force",
                                        title_text: "Brute Force"
                                    },
                                    {
                                        link: "boyer-moore",
                                        title_text: "Boyer Moore"
                                    },
                                    {
                                        link: "kmp",
                                        title_text: "KMP"
                                    },
                                    {
                                        link: "rabin-karp",
                                        title_text: "Rabin Karp"
                                    },
                                ],
                            },
                            {
                                link: "graphs",
                                title_text: "Graph Algorithms",
                                side_pane_items: [
                                    {
                                        link: "breadth",
                                        title_text: "Breadth-First Search"
                                    },
                                    {
                                        link: "depth",
                                        title_text: "Depth-First Search"
                                    },
                                    {
                                        link: "dijkstra",
                                        title_text: "Dijkstra's"
                                    },
                                    {
                                        link: "prim",
                                        title_text: "Prim's"
                                    },
                                    {
                                        link: "kruskal",
                                        title_text: "Kruskal's"
                                    },
                                ],
                            },
                            {
                                link: "dynamic",
                                title_text: "Dynamic Programming",
                                side_pane_items: [
                                    {
                                        link: "lcs",
                                        title_text: "LCS"
                                    },
                                    {
                                        link: "floyd-warshall",
                                        title_text: "Floyd-Warshall"
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
                ]} />
            </header>
        );
}
