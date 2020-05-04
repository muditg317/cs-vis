import { SearchWithTableVisualizer } from '../';
import { KMP } from 'animation';
import './kmp.scss';


export default class KMPVisualizer extends SearchWithTableVisualizer {
    static VISUALIZATION_CLASS = KMP;
    static DIV_CLASS = "kmp";
    static NAME = "Knuth–Morris–Pratt Algorithm";

    static TABLE_NAME = "failure";
}
