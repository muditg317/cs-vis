import { ChainingVisualizer } from '../';
import { HashMapChaining } from 'animation';
import './hashmap-chaining.scss';


export default class HashMapChainingVisualizer extends ChainingVisualizer {
    static VISUALIZATION_CLASS = HashMapChaining;
    static DIV_CLASS = "hashmap-chaining";
    static NAME = "HashMap (Chaining)";
}
