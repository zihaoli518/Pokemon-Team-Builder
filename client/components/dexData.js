import itemsData from '../../items-data.json';
import movesData from '../../moves-data.json';
const calculator = require('pokemon-stat-calculator')

const allItemsJSON = itemsData;
const allMovesJSON = movesData;
const natureArray = calculator.getNatureNames;





const Data = {allItemsJSON: allItemsJSON, allMovesJSON: allMovesJSON, natureArray: natureArray}



export default Data;