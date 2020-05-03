import { SelectVisualizer } from '../';
import { QuickSelect } from 'animation';
import './quick-select.scss';


export default class QuickSelectVisualizer extends SelectVisualizer {
    static VISUALIZATION_CLASS = QuickSelect;
    static DIV_CLASS = "quick-select";
    static NAME = "Quick Select";
}
