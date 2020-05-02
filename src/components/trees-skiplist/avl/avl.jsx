import { BinarySearchingTreeVisualizer } from '../';
import { AVL } from 'animation';
import './avl.scss';


export default class AVLVisualizer extends BinarySearchingTreeVisualizer {
    static VISUALIZATION_CLASS = AVL;
    static DIV_CLASS = "avl";
    static NAME = "AVL";
}
