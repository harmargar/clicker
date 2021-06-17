import { loopRunnable } from '../utils';
import { removeRunnable } from '../utils/index';
import { ObservableModel } from './observable-model';

export enum FriendState {
    unknown,
    idle,
    action,
}

export class FriendModel extends ObservableModel {
    private _cost: number;
    private _damage: number;
    private _activationLevel: number;
    private _actionTime: number;
    private _name: string;
    private _isActive: boolean;
    private _state: FriendState = FriendState.unknown;
    private _actionRunnable: Runnable;

    public constructor(private _config: FriendConfig, private _index: number) {
        super('FriendModel');

        this._cost = _config.cost;
        this._damage = _config.damage;
        this._activationLevel = _config.activationLevel;
        this._actionTime = _config.actionTime;
        this._name = _config.name;

        this.makeObservable('_state', '_isActive', '_cost', '_damage');
    }

    public get index(): number {
        return this._index;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get cost(): number {
        return this._cost;
    }

    public set cost(value: number) {
        this._config.cost = this._cost = value;
    }

    public get damage(): number {
        return this._damage;
    }

    public set damage(value: number) {
        this._config.damage = this._damage = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._config.name = this._name = value;
    }

    public get activationLevel(): number {
        return this._activationLevel;
    }

    public set activationLevel(value: number) {
        this._config.activationLevel = this._activationLevel = value;
    }

    public get state(): FriendState {
        return this._state;
    }

    public set state(value: number) {
        this._state = value;
    }

    public setState(state: FriendState): void {
        this.state = state;
    }

    public updateConfig(): void {
        this._cost = this._config.cost;
        this._damage = this._config.damage;
        this._activationLevel = this._config.activationLevel;
        this._actionTime = this._config.actionTime;
    }

    public startAction(): void {
        this._actionRunnable = loopRunnable(this._actionTime, () => {
            this.setState(FriendState.idle);
            this.setState(FriendState.action);
        });
    }

    public stopAction(): void {
        removeRunnable(this._actionRunnable);
        this.setState(FriendState.idle);
    }
}