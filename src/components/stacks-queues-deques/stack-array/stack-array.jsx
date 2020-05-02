import { StackVisualizer } from '../';
import { StackArray } from 'animation';
import './stack-array.scss';


export default class StackArrayVisualizer extends StackVisualizer {
    static VISUALIZATION_CLASS = StackArray;
    static DIV_CLASS = "stack-array";
    static NAME = "Stack (Array)";
}
