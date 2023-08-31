import itemsData from '../../items-data.json';
import movesData from '../../moves-data.json';
import monsData from '../../mons-data.json';

import bugPNG from '../../assets/types-images/bug.png';
import darkPNG from '../../assets/types-images/dark.png';
import dragonPNG from '../../assets/types-images/dragon.png';
import electricPNG from '../../assets/types-images/electric.png';
import fairyPNG from '../../assets/types-images/fairy.png';
import fightingPNG from '../../assets/types-images/fighting.png';
import firePNG from '../../assets/types-images/fire.png';
import flyingPNG from '../../assets/types-images/flying.png';
import ghostPNG from '../../assets/types-images/ghost.png';
import grassPNG from '../../assets/types-images/grass.png';
import groundPNG from '../../assets/types-images/ground.png';
import icePNG from '../../assets/types-images/ice.png';
import normalPNG from '../../assets/types-images/normal.png';
import poisonPNG from '../../assets/types-images/poison.png';
import psychicPNG from '../../assets/types-images/psychic.png';
import rockPNG from '../../assets/types-images/rock.png';
import steelPNG from '../../assets/types-images/steel.png';
import waterPNG from '../../assets/types-images/water.png';
const calculator = require('pokemon-stat-calculator');

const allTypeImageObj = {
  bug: bugPNG,
  dark: darkPNG,
  dragon: dragonPNG,
  electric: electricPNG,
  fairy: fairyPNG,
  fighting: fightingPNG,
  fire: firePNG,
  flying: flyingPNG,
  ghost: ghostPNG,
  grass: grassPNG,
  ground: groundPNG,
  ice: icePNG,
  normal: normalPNG,
  poison: poisonPNG,
  psychic: psychicPNG, 
  rock: rockPNG,
  steel: steelPNG,
  water: waterPNG
};




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






const Data = {allItemsJSON: allItemsJSON, allMovesJSON: allMovesJSON, allMonsJSON: allMonsJSON, natureArray: natureArray, statusArray: statusArray, specialMovesObj: specialMovesObj, typesArray: typesArray, allTypeImageObj: allTypeImageObj}



export default Data;
