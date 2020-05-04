import { SearchVisualizer } from '../';
import { BruteForce } from 'animation';
import './brute-force.scss';


export default class BruteForceVisualizer extends SearchVisualizer {
    static VISUALIZATION_CLASS = BruteForce;
    static DIV_CLASS = "brute-force";
    static NAME = "Brute Force Search";
}
