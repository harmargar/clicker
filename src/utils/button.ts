import { InteractionEvent } from '@pixi/interaction';
import { Rectangle } from '@pixi/math';
import { fitText, makeNineSlice, makeSprite, makeText } from '.';
import { Container } from './container';

abstract class AbstractButton extends Container {
    protected states: ButtonStates;

    public constructor({ states, input }: ButtonConfig) {
        super();

        this._createStates(states);
        this._createHitArea(input);

        this.switchEnable(true);
    }

    public get enabled(): boolean {
        return this.interactive;
    }

    public switchInput(value: boolean): void {
        this.interactive = value;
    }

    public switchEnable(value: boolean): void {
        this.switchInput(value);

        this._setState('up');
        if (value === false) {
            this._setState('disable');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onDown(e: InteractionEvent): void {
        this._setState('down');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onUp(e: InteractionEvent): void {
        this._setState('up');
        this.emit('click');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onUpOutside(e: InteractionEvent): void {
        this._setState('up');
    }

    private _createStates({ up, down, disable }: ButtonStatesConfig = {}): void {
        this.states = {
            up: up && this.createState(up),
            down: down && this.createState(down),
            disable: disable && this.createState(disable),
        };
    }

    private _createHitArea(input: ButtonInputConfig = {}): void {
        const { area } = input;

        this.hitArea = area || new Rectangle(0, 0, this.width, this.height);

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointerupoutside', this.onUpOutside, this);
    }

    private _setState(key: ButtonStateKey): void {
        if (!this.states[key]) {
            return;
        }

        for (const prop in this.states) {
            if (this.states.hasOwnProperty(prop) && this.states[prop as ButtonStateKey]) {
                this.states[prop as ButtonStateKey].visible = false;
            }
        }

        this.states[key].visible = true;
    }

    protected abstract createState(config: ButtonStateConfig): ButtonState;
}

export class Button extends AbstractButton {
    protected createState({ bg, label }: ButtonStateConfig): ButtonState {
        const state = new Container();

        // BG
        const { width, height } = bg as NineSliceConfig;
        const bgObj = width && height ? makeNineSlice(bg as NineSliceConfig) : makeSprite(bg as SpriteConfig);
        state.addChild(bgObj);

        // LABEL
        if (label) {
            const labelObj = makeText(label);
            labelObj.x += bgObj.x + bgObj.width / 2;
            labelObj.y += bgObj.y + bgObj.height / 2;

            state.addChild(labelObj);
            fitText(labelObj, bgObj.width * 0.9, bgObj.height * 0.9);
        }

        this.addChild(state);

        return state;
    }
}
