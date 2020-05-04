import { SearchVisualizer } from './';


export default class SearchWithTableVisualizer extends SearchVisualizer {
    static VISUALIZATION_METHODS = ["buildTable"];

    addControls() {
        super.addControls(this.constructor.TABLE_NAME);
    }
}
