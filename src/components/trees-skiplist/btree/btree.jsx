import { TreeVisualizer } from '../';
import { BTree } from 'animation';
import './btree.scss';


export default class BTreeVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = BTree;
    static DIV_CLASS = "btree";
    static NAME = "2-4 Tree";
}
