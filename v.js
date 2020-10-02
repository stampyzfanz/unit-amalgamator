let app;

function loadVue() {
	console.log("Vue loaded")
	Vue.component('unit-place', {
		props: ["unit", "location", "slotnum"],
		template: `
		<button style="position: relative;"
			class="box" 
			:class="unit ? 'full' : 'empty'"
			v-on:click="function() {clickedUnit(unit, location, slotnum)}">
			<div v-if="unit" style="position: absolute; right: 14%; top: 14%;"> {{ units.indexOf(unit)+1 }} </div>
			<div v-if="unit" style="font-size: 300%">{{ Array.isArray(unit) ? unit[1] : "" }}</div>
			<div v-if="unit" style="letter-spacing: 1px">{{ Array.isArray(unit) ? unit[0] : "" }}</div>
		</button>
		`,
		data: function() {
			return {
				player,
				units,
			};
		},
		methods: {
			clickedUnit
		}
	});
	app = new Vue({
		el: "#app",
		data: {
			player,
			units,
		}
	})
}