import { HashMapVisualizer } from '../';
import { HashMapChaining } from 'animation';
import './hashmap-chaining.scss';


export default class HashMapChainingVisualizer extends HashMapVisualizer {
    static VISUALIZATION_CLASS = HashMapChaining;
    static DIV_CLASS = "hashmap-chaining";
    static NAME = "HashMap (Chaining)";
}
