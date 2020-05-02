import { SkipListADTVisualizer } from '../';
import { SkipList } from 'animation';
import './skiplist.scss';


export default class SkipListVisualizer extends SkipListADTVisualizer {
    static VISUALIZATION_CLASS = SkipList;
    static DIV_CLASS = "skiplist";
    static NAME = "SkipList";
}
