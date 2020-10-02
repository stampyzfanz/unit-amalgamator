let units;
let player;
let new_player;

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
		// debugger;
		unit[3] = {};
		// for every unit, turn the base unit str into a base unit obj such that
		// kg m2 s-3 A-1 would become {kg:1, m:2, s:-3, A:-1}


		// split str into arr
		let base_units = unit[2].split(' ');
		// split into letter and number
		for (let i = 0; i < base_units.length; i++) {
			if (unit[2].includes('/')) {
				unit[3] = null;
				continue;
			}

			// ie if the base unit is kg-2 this'll give -, the first number
			let firstDigit = base_units[i].match(/(\d|-)/);
			// eg in kg-2, itll give kg, 2. Just add the firstDigit to the latter and its split
			// the 2 is for max amount of segments, which is probably unnessessary,
			// but will fix it if its eg s-11 (which would be crazy)
			// if its just s then the number is assumed to be 1
			console.log(base_units[i])
			if (firstDigit == null) {
				unit[3][base_units[i]] = 1;
			} else {
				// debugger;
				let segments = base_units[i].split(firstDigit[0], 2);
				unit[3][segments[0]] = parseInt(firstDigit[0] + segments[1]);
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
		"slot1": null,
		"slot2": null,
		"product": null
	}
}

function updatePlayerUnitGrid() {
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
		if (player.slot1 == null) {
			player.slot1 = unit;
			// else move into slot 2 and draw the product if it exists
		} else if (player.slot2 == null) {
			player.slot2 = unit;

			// find product
			findProduct(player.slot1, player.slot2);
		}
	}


	// else fusion clicked
	// remove from slot 1
	// or remove from slot 2
	// remove product
}

function findProduct(a, b) {

	let a_keys = Object.keys(a[3]);
	let b_keys = Object.keys(b[3]);
	let product_base_units = {};
	let union = [...new Set([...a_keys, ...b_keys])];
	for (let base_unit of union) {
		product_base_units[base_unit] = (a[3][base_unit] || 0) + (b[3][base_unit] || 0);
	}

	console.log(union)
	for (let unit of units) {
		// fake way of determining equality of objs, why doesnt js just do this automatically
		// I should use lodash
		// debugger;
		if (JSON.stringify(product_base_units) == JSON.stringify(unit[3])) {
			console.log(unit)
			player.product = unit;
		}
	}
}

// export save
// import save