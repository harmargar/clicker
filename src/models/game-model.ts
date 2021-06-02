import { LevelModel } from './level-model';
import { ObservableModel } from './observable-model';

export class GameModel extends ObservableModel {
    private _level: LevelModel = null;
    private _levelIndex = -1;

    public constructor(private _levelConfigs: LevelConfig[]) {
        super('GameModel');
        this.makeObservable('_level');
    }

    public get level(): LevelModel {
        return this._level;
    }

    public get levelIndex(): number {
        return this._levelIndex;
    }

    public initialize(): void {
        this.nextLevel();
    }

    public hasNextLevel(): boolean {
        return this._levelIndex < this._levelConfigs.length - 1;
    }

    public nextLevel(): void {
        this._level && this._level.destroy();
        this._level = null;
        this._levelIndex += 1;
        const levelsConfig = this._levelConfigs[this._levelIndex];
        this._level = new LevelModel(levelsConfig);
        this._level.initialize();
    }
}