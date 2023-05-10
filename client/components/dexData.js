import itemsData from '../../items-data.json';
import movesData from '../../moves-data.json';
const calculator = require('pokemon-stat-calculator')

const allItemsJSON = itemsData;
const allMovesJSON = movesData;
const natureArray = calculator.getNatureNames;

const statusArray = ['healthy', 'poisoned', 'badly poisoned', 'burned', 'paralyzed', 'asleep', 'frozen']




const Data = {allItemsJSON: allItemsJSON, allMovesJSON: allMovesJSON, natureArray: natureArray, statusArray: statusArray}



export default Data;