import { ProbingVisualizer } from '../';
import { HashMapProbing } from 'animation';
import './hashmap-probing.scss';


export default class HashMapProbingVisualizer extends ProbingVisualizer {
    static VISUALIZATION_CLASS = HashMapProbing;
    static DIV_CLASS = "hashmap-probing";
    static NAME = "HashMap (Probing)";
}
