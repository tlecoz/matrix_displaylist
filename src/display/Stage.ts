import { DisplayGroup } from "./DisplayGroup";

export class Stage extends DisplayGroup {

    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;

    constructor(w: number, h: number, appendOnBody: boolean = true) {
        super();
        this._stage = this;
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._canvas.width = w;
        this._canvas.height = h;
        this._canvas.style.position = "absolute";
        if (appendOnBody) document.body.appendChild(this._canvas);
    }

    public get canvas(): HTMLCanvasElement { return this._canvas; }
    public get context(): CanvasRenderingContext2D { return this._context; }

    public get globalAlpha(): number { return this.alpha; }
    public get globalX(): number { return this.x };
    public get globalY(): number { return this.y };
    public get globalScaleX(): number { return this.scaleX };
    public get globalScaleY(): number { return this.scaleY };
    public get globalRotation(): number { return this.rotation };

    public drawElements(): void {
        this._canvas.width = this._canvas.width;
        super.update(this._context);
    }
}