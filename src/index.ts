import PJSKMapDraw from "./PJSKMapDraw";
import convertor from '@fannithm/sus-fannithm-convertor';
import './style.css'

(function () {
	document.addEventListener('DOMContentLoaded', ready);
	let mapDraw = null as null | PJSKMapDraw;
	async function ready() {
		console.log('ready');
		const $id = document.getElementById('id') as HTMLInputElement;
		const $diff = document.getElementById('diff') as HTMLSelectElement;
		const $load = document.getElementById('load') as HTMLButtonElement;
		const $bottom = document.getElementById('bottom') as HTMLInputElement;
		const $scroll = document.getElementById('scroll') as HTMLButtonElement;
		const $input = document.getElementById('input') as HTMLButtonElement;
		const $container = document.getElementById('container') as HTMLDivElement;
		const $text = document.getElementById('text') as HTMLTextAreaElement;
		const $draw = document.getElementById('draw') as HTMLButtonElement;
		$input.addEventListener('click', () => {
			$container.style.display = $container.style.display === 'none' ? 'block' : 'none';
		});
		$draw.addEventListener('click', () => {
			$container.style.display = 'none';
			const map = convertor($text.value);
			if (mapDraw !== null) {
				mapDraw.destroy();
				mapDraw = null;
			}
			mapDraw = new PJSKMapDraw(document.getElementById('app'), map, 2);
			mapDraw.event.addEventListener('scroll', (event: CustomEvent) => {
				$bottom.value = event.detail.scrollBottom;
			});
			mapDraw.scrollTo(0);
		});
		await PJSKMapDraw.loadResource((loader, resource) => {
			console.log(`${loader.progress}% loading: ${resource.url}`);
		}, err => {
			console.error(err);
		});
		$scroll.addEventListener('click', () => {
			const bottom = parseInt($bottom.value);
			mapDraw && mapDraw.scrollTo(bottom);
		});
		$load.addEventListener('click', async () => {
			const res = await fetch(`https://assets.pjsek.ai/file/pjsekai-assets/startapp/music/music_score/${$id.value.padStart(4, '0')}_01/${$diff.value}`);
			const map = convertor(await res.text());
			// const res = await fetch('map/test.json');
			// const map = await res.json();
			if (mapDraw !== null) {
				mapDraw.destroy();
				mapDraw = null;
			}
			mapDraw = new PJSKMapDraw(document.getElementById('app'), map, 180);
			mapDraw.event.addEventListener('scroll', (event: CustomEvent) => {
				$bottom.value = event.detail.scrollBottom;
			});
			mapDraw.scrollTo(0);
		});
		$id.value = '135';
		$load.click();
	}
})();

