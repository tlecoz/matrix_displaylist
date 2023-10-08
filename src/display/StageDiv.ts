import { DivGroup } from "./DivGroup";

export class StageDiv extends DivGroup {


    constructor(w: number, h: number, appendOnBody: boolean = true) {
        super();
        this._stage = this;
        this.html = document.createElement("div");
        this.html.style.backgroundColor = "#000000"
        this.html.style.position = "absolute";
        this.html.style.width = w + "px";
        this.html.style.height = h + "px";
        this.html.style.top = "50px";
        this.html.style.left = "100px";
        if (appendOnBody) document.body.appendChild(this.html);


        /*
        var test = document.createElement("div");
        test.style.position = "absolute";
        test.style.backgroundColor = "#00ff00";
        test.style.width = "300px";
        test.style.height = "300px";
        test.style.left = 0 + "px";
        test.style.top = 0 + "px";
        this.html.appendChild(test);

        var test = document.createElement("div");
        test.style.position = "absolute";
        test.style.backgroundColor = "#000000";
        test.style.width = "10px";
        test.style.height = "10px";
        test.style.left = 422 + "px";
        test.style.top = 338 + "px";
        this.html.appendChild(test);
        */

    }

    public _x: number = 0;
    public _y: number = 0;
    public _xAxis: number = 0;
    public _yAxis: number = 0;
    public _rotation: number = 0;
    public _scaleX: number = 1;
    public _scaleY: number = 1;

    //public get html(): HTMLDivElement { return this.html; }
    public get globalX(): number { return this.x };
    public get globalY(): number { return this.y };
    public get globalScaleX(): number { return this.scaleX };
    public get globalScaleY(): number { return this.scaleY };
    public get globalRotation(): number { return this.rotation };

    public drawElements(): void {

        super.update();
    }
}