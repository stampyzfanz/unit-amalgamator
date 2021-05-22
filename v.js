let app;
// <div v-if="unit" v-bind:style="{ fontSize: () => unitAbbrevSize(Array.isArray(unit) ? unit[1] : '') }" v-html="Array.isArray(unit) ? unit[1] : ''"></div>
function loadVue() {
	console.log("Vue loaded")
	Vue.component('unit-place', {
		props: ["unit", "location", "slotnum"],
		template: `
		<button style="position: relative;"
			class="box center" 
			:class="unit ? 'full' : 'empty'"
			v-on:click="function() {clickedUnit(unit, location, slotnum)}">
			<div v-if="unit" style="position: absolute; right: 14%; top: 14%;"> {{ units.map(u => u[0]).indexOf(unit[0])+1 }} </div>
			<div v-if="unit" v-bind:style="{ fontSize: unitAbbrevSize(Array.isArray(unit) ? unit[1] : '') }" v-html="Array.isArray(unit) ? unit[1] : ''"></div>
			<div v-if="unit" style="letter-spacing: 1px" v-html="Array.isArray(unit) ? unit[0] : ''"></div>
		</button>
		`,
		data: function () {
			return {
				player,
				units,
			};
		},
		methods: {
			clickedUnit,
			unitAbbrevSize,
		}
	});
	app = new Vue({
		el: "#app",
		data: {
			player,
			units,
		},
	})
}