// let unit_grid = [];
let units;
let player;
let new_player;

let slot1 = null;
let slot2 = null;
let product = null;

async function load() {
	await createVars();

	// try to load from local storage
	// if it doesnt work make new player
	player = {
		...new_player
	};
	updatePlayerUnitGrid();

	// offline progress if its old

	loadVue();

	// update the grid when the inventory is resized
	const ro = new ResizeObserver(entries => {
		for (let entry of entries) {
			updatePlayerUnitGrid();
		}
	});
	ro.observe(document.querySelector('#inventory'));
}

async function createVars() {
	// read json
	const r = await fetch('./units.json');
	units = await r.json();

	// make easily usable object of base units rather than the annoying (but compact) string
	for (let unit of units) {
		unit[3] = {};
		// for every unit, turn the base unit str into a base unit obj such that
		// kg m2 s-3 A-1 would become {kg:1, m:2, s:-3, A:-1}

		// split str into arr
		let base_units = unit[1].split(' ');
		// split into letter and number
		for (let i = 0; i < base_units.length; i++) {
			// ie if the base unit is kg-2 this'll give -, the first number
			let firstDigit = base_units[i].match(/ (\d|-) /);
			// eg in kg-2, itll give kg, 2. Just add the firstDigit to the latter and its split
			// the 2 is for max amount of segments, which is probably unnessessary,
			// but will fix it if its eg s-11 (which would be crazy)
			// if its just s then the number is assumed to be 1
			if (firstDigit == null) {
				unit[3][base_units[i]] = 1;
			} else {
				let segments = base_units.split(firstDigit, 2);
				unit[3][segments[0]] = parseInt(firstDigit + segments[1]);
			}
		}

	}



	// the starting save of a player
	new_player = {
		"units": [
			units[0],
			units[1],
			units[2],
		],
		"start_time": Date.now(),
	}
}

function updatePlayerUnitGrid() {
	console.log("player unit grid")
	player.unit_grid = [];

	// let cols = floor(inv width / (cell width + margin) + margin)
	let invWidth = document.getElementById('inventory').offsetWidth;
	let cellWidth = 100;
	// it was hardcoded in css

	// for square
	// let cols = Math.floor(Math.sqrt(units.length)); 
	// for dyanmic size
	let cols = Math.floor(invWidth / (cellWidth)) - 1;
	let rows = Math.ceil(units.length / cols);
	for (let j = 0; j < rows; j++) {
		player.unit_grid[j] = [];
		for (let i = 0; i < cols; i++) {
			let index = i + j * cols;
			if (index >= units.length) {
				break;
			}

			// if current unit is in player's units
			if (player.units.includes(units[index])) {
				player.unit_grid[j][i] = units[index];
			} else {
				player.unit_grid[j][i] = null;
			}
		}
	}
}

function clickedUnit(unit, location) {
	// if inventory clicked
	if (location == 'inventory') {
		// add into slot 1 if its empty
		if (slot1 == null) {
			slot1 = unit;
			// else move into slot 2 and draw the product if it exists
		} else if (slot2 == null) {
			slot2 == unit;

			// find product
			findProduct(slot1, slot2);

			// make product greyed out if already created
		}



	}


	// else fusion clicked
	// remove from slot 1
	// or remove from slot 2
	// remove product
}

function findProduct(a, b) {
	let a_keys = Object.keys(a);
	let b_keys = Object.keys(b);
	let product_base_units;
	let union = [...new Set([...a_keys, ...b_keys])];
	for (let base_unit of union) {
		product_base_units[base_unit] = (a_keys[base_unit] || 0) + (a_keys[base_unit] || 0);
	}

	for (let unit of units) {
		// fake way of determining equality of objs, why doesnt js just do this automatically
		// I should use lodash		
		if (JSON.stringify(units[3]) == JSON.stringify(unit)) {
			product = unit;
		}
	}
}

// export save
// import save