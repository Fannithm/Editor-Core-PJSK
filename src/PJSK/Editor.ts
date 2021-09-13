import { IMap, MapBeat } from '@fannithm/const/dist/pjsk';
import { Fraction } from '@fannithm/utils';
import { EventHandler } from '.';
import { AudioManager } from './AudioManager';
import { Calculator } from './Calculator';
import { ColorTheme } from './ColorTheme';
import { Constants } from './Constants';
import { EventEmitter } from './EventEmitter';
import { Parser } from './Parser';
import { Renderer } from './Renderer';
import { ScrollController } from './ScrollController';
import { TimeLineManager } from './TimeLineManager';


export class Editor {
	private _map: IMap;
	private _beatSlice = 1;
	public event: EventEmitter;
	public handler: EventHandler;
	public const: Constants;
	public renderer: Renderer;
	public parser: Parser;
	public calculator: Calculator;
	public scrollController: ScrollController;
	public audioManager: AudioManager;
	public timeLineManager: TimeLineManager;
	private _color: Record<string, number>;

	constructor(public container: HTMLElement) {
		this._color = ColorTheme;
		this.const = new Constants(this);
		this.event = new EventEmitter();
		this.handler = new EventHandler(this);
		this.parser = new Parser(this);
		this.calculator = new Calculator(this);
		this.scrollController = new ScrollController(this);
		this.audioManager = new AudioManager(this);
		this.renderer = new Renderer(this);
		this.timeLineManager = new TimeLineManager(this);
		this.start();
	}

	private start(): void {
		this.handler.listen();
		this.renderer.parseAndRender();
		this.renderer.renderOnce();
	}

	destroy(): void {
		this.event.dispatchDestroyEvent();
		this.renderer.destroyContainers();
		this.renderer.app.destroy(true, {
			children: true
		});
	}

	set map(map: IMap) {
		this._map = map;
		if (this.timeLineManager.visible.length === 0) {
			this.timeLineManager.visible = [this.map.timelines[0].id];
		}
		this.renderer.parseAndRender();
	}

	get map(): IMap {
		return this._map;
	}

	set beatSlice(slice: number) {
		this._beatSlice = slice;
		this.renderer.parseAndRender();
	}

	get beatSlice(): number {
		return this._beatSlice;
	}

	public get color(): Record<string, number> {
		return this._color;
	}

	public set color(color: Record<string, number>) {
		this._color = color;
		// update color theme
		this.renderer.updateColorTheme();
		this.renderer.parseAndRender();
	}

	fraction(beat: MapBeat): Fraction {
		return new Fraction([1, ...beat]);
	}
}