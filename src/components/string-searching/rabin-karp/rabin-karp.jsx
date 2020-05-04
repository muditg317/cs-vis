import { SearchVisualizer } from '../';
import { RabinKarp } from 'animation';
import './rabin-karp.scss';


export default class RabinKarpVisualizer extends SearchVisualizer {
    static VISUALIZATION_CLASS = RabinKarp;
    static DIV_CLASS = "rabin-karp";
    static NAME = "Rabin Karp Algorithm";
}
