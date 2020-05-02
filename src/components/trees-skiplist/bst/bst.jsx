import { BinarySearchingTreeVisualizer } from '../';
import { BST } from 'animation';
import './bst.scss';


export default class BSTVisualizer extends BinarySearchingTreeVisualizer {
    static VISUALIZATION_CLASS = BST;
    static DIV_CLASS = "bst";
    static NAME = "Binary Search Tree";
}
