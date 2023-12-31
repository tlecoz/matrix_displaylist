import { Align } from "../geom/Align";
import { DivMatrix2D } from "../geom/DivMatrix2D";
import { Pt2D } from "../geom/Pt2D";
import { StageDiv } from "./StageDiv";

export class DivElement extends DivMatrix2D {

    protected _stage: StageDiv;

    public inverseW: number;//used for filling process;
    public inverseH: number;//used for filling process;
    public alpha: number = 1;
    //public parent: ;
    public currentTransform: DOMMatrix;



    public render: () => void = null;

    constructor(tag: string = "div", style?: any) {
        super(tag, {
            position: "absolute",
            ...style
        });


        //this.html = document.createElement("div");

        //this.html.style.position = "absolute";
    }

    public test(w: number, h: number) {

        this.width = w;
        this.height = h;
        this.html.style.backgroundColor = "rgba(255,0,0,0.5)";
        this.html.style.width = this.width + "px";
        this.html.style.height = this.height + "px";

        let p = document.createElement("p");
        p.style.position = "relative";
        p.style.width = this.width + "px"
        p.innerText = "aaaaa aaaaaaa aaaaaa aaaaaa aaaaaa aaaa aaaaaaa aaaa aa aaaaaaa aaaa aaaaaa aaa"

        this.html.appendChild(p);
    }


    public get style() { return this.html.style }

    //public get html(): HTMLDivElement { return this.html }

    public align(displayAlign: Pt2D = Align.CENTER): void {
        this.xAxis = this.width * displayAlign.x;
        this.yAxis = this.height * displayAlign.y;
    }

    public get stage(): StageDiv { return this._stage; }
    public set stage(s: StageDiv) { this._stage = s; }

    /*
    public get globalAlpha(): number { return this.parent.globalAlpha * this.alpha; }

    public get globalX(): number {
        const px = this.x * this.parent.scaleX;
        const py = this.y * this.parent.scaleY;
        const d = Math.sqrt(px * px + py * py);
        const a = Math.atan2(py, px);
        const rota = a + (this.parent.rotation % 360) / 360 * Math.PI * 2;

        return this.parent.globalX + Math.cos(rota) * d;
    };

    public get globalY(): number {
        const px = this.x * this.parent.scaleX;
        const py = this.y * this.parent.scaleY;
        const d = Math.sqrt(px * px + py * py);
        const a = Math.atan2(py, px);
        const rota = a + (this.parent.rotation % 360) / 360 * Math.PI * 2;

        return this.parent.globalY + Math.sin(rota) * d;
    };

    public get globalScaleX(): number { return this.parent.globalScaleX * this.scaleX };
    public get globalScaleY(): number { return this.parent.globalScaleY * this.scaleY };
    public get globalRotation(): number { return this.parent.globalRotation + this.rotation };
    */
    public update() {


        this.identity();
        this.inverseW = 1 / this.width;
        this.inverseH = 1 / this.height;
        let m: DOMMatrix = this.currentTransform = this.applyTransform();
        this.html.style.transform = m.toString();//"matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";

    }

    public noScale: boolean = false;

    public applyTransform(): DOMMatrix {
        const m: DOMMatrix = this.matrix;
        const sx: number = this.noScale ? 1 : this._scaleX;
        const sy: number = this.noScale ? 1 : this._scaleY;

        /*
        if (this.width > 100) {
            console.log(this.scaleX, this._scaleX, this.parent.scaleX, this.parent._scaleX)
        }
        */

        m.translateSelf(this._x - this.xAxis - this.width * 0.5, this._y - this.yAxis - this.height * 0.5)
        m.rotateSelf(this._rotation);
        m.translateSelf(this.width * this._scaleX * 0.5, this.height * this._scaleY * 0.5)


        if (this.noScale) m.scaleSelf(1, 1);
        else {
            m.scaleSelf(this.scaleX * this._scaleX, this.scaleY * this._scaleY);
        }
        return m;
    }
}