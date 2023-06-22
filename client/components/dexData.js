import itemsData from '../../items-data.json';
import movesData from '../../moves-data.json';
import monsData from '../../mons-data.json';
const calculator = require('pokemon-stat-calculator')

const allItemsJSON = itemsData;
const allMovesJSON = movesData;
const allMonsJSON = new Map(monsData);
const natureArray = calculator.getNatureNames;

const statusArray = ['healthy', 'poisoned', 'badly poisoned', 'burned', 'paralyzed', 'asleep', 'frozen'];
const typesArray = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];

const specialMovesObj = {
  'hazard setting': {'Spikes': true, 'Stealth Rock': true, 'Sticky Web': true, 'Stone Axe': true, 'Toxic Spikes': true, },
  'hazard removal': {'Defog': true, 'Rapid Spin': true, 'Mortal Spin': true, 'Tidy Up': true},
  'healing moves': {'Wish': true, 'Healing Wish': true, 'Jungle Healing': true, 'Lunar Dance': true, 'Revival Blessing': true, },
  'momentum': {'Banton Pass': true, 'U-turn': true, 'U-Turn': true, 'u-turn': true, 'U Turn': true, 'Chilly Reception': true, 'Flip Turn': true, 'Momento': true, 'Parting Shot': true, 'Teleport': true, 'Shed Tail': true, 'Volt Switch': true},
  'item removal': {'Knock Off': true, 'Trick': true, 'Switcheroo': true},
  'status': {'Toxic': true, 'Glare': true, 'Nuzzle': true, 'Nuzzle': true, 'Thunderwave': true, 'Will-O-Wisp': true, 'Will O-Wisp': true, 'Yawn': true},
  'priority': {'Accelerock': true, 'Aqua Jet': true, 'Quick Attack': true, 'Sucker Punch': true, 'Bullet Punch': true, 'Extreme Speed': true, 'Fake Out': true, 'First Impression': true, 'Ice Shard': true, 'Jet Punch': true, 'Shadow Sneak': true, },
  'disruption': {'Circle Throw': true, 'Clear Smog': true, 'Dragon Tail': true, 'Encore': true, 'Haze': true, 'Roar': true, 'Taunt': true, 'Whirlwind': true}
}




const Data = {allItemsJSON: allItemsJSON, allMovesJSON: allMovesJSON, allMonsJSON: allMonsJSON, natureArray: natureArray, statusArray: statusArray, specialMovesObj: specialMovesObj, typesArray: typesArray}



export default Data;