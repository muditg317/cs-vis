import { TreeVisualizer } from '../';
import { SplayTree } from 'animation';
import './splaytree.scss';


export default class SplayTreeVisualizer extends TreeVisualizer {
    static VISUALIZATION_CLASS = SplayTree;
    static DIV_CLASS = "splaytree";
    static NAME = "SplayTree";
}
