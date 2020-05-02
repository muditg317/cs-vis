import { ListVisualizer } from '../';
import { ArrayList } from 'animation';
import './arraylist.scss';


export default class ArrayListVisualizer extends ListVisualizer {
    static VISUALIZATION_CLASS = ArrayList;
    static DIV_CLASS = "arraylist";
    static NAME = "ArrayList";
}
