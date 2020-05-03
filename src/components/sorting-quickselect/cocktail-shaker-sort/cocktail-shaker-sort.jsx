import { BubblingVisualizer } from '../';
import { CocktailShakerSort } from 'animation';
import './cocktail-shaker-sort.scss';


export default class CocktailShakerSortVisualizer extends BubblingVisualizer {
    static VISUALIZATION_CLASS = CocktailShakerSort;
    static DIV_CLASS = "cocktail-shaker-sort";
    static NAME = "Cocktail Shaker Sort";
}
