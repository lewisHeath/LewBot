const manifest = require('./Destiny/manifest.js');

// Access the item definitions
const itemDefinitions = manifest.DestinyInventoryItemDefinition;

// Example: Accessing an item definition by its hash
const itemHash = 2715240478; // Replace with the desired item hash
const itemDefinition = itemDefinitions[itemHash];

console.log(itemDefinition);