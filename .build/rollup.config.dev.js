import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import html2 from 'rollup-plugin-html2';
import spritesmith from 'rollup-plugin-sprite';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';

export default {
	input: 'src/test/test.ts',
	watch: {
		include: 'src/**/*'
	},
	output: {
		file: 'build/bundle.js',
		format: 'iife',
		globals: {
			'pixi.js': 'PIXI'
		}
	},
	external: ['pixi.js'],
	plugins: [
		resolve(),
		commonjs(),
		html2({
			template: 'src/test/index.html',
			externals: {
				before: [
					{ tag: 'script', src: 'https://unpkg.com/pixi.js@6.0.4/dist/browser/pixi.js' }
				]
			}
		}),
		spritesmith({
			src: {
				cwd: 'src/pjsk/images/',
				glob: '*.png'
			},
			target: {
				image: 'build/images/pjsk_sprite.png',
				css: 'build/images/pjsk_sprite.json',
				format: 'json_texture'
			},
			cssImageRef: './pjsk_sprite.png',
			spritesmithOptions: {
				padding: 4
			}
		}),
		postcss(),
		typescript(),
		serve({
			contentBase: ['build', 'public'],
			host: '0.0.0.0',
			port: 8081
		}),
		livereload()
	]
};
