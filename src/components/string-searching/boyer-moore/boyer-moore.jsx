import { SearchWithTableVisualizer } from '../';
import { BoyerMoore } from 'animation';
import './boyer-moore.scss';


export default class BoyerMooreVisualizer extends SearchWithTableVisualizer {
    static VISUALIZATION_CLASS = BoyerMoore;
    static DIV_CLASS = "boyer-moore";
    static NAME = "Boyer-Moore Algorithm";

    static TABLE_NAME = "last occurence";
}
