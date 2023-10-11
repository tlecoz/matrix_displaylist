import { UIElement } from "../UIElement";


export class Axis {
    public static TOP_LEFT: DOMPoint = new DOMPoint(0, 0);
    public static LEFT: DOMPoint = new DOMPoint(0, 0.5);
    public static BOTTOM_LEFT: DOMPoint = new DOMPoint(0, 1);
    public static CENTER: DOMPoint = new DOMPoint(0.5, 0.5);
    public static TOP_RIGHT: DOMPoint = new DOMPoint(1, 0);
    public static RIGHT: DOMPoint = new DOMPoint(1, 0.5);
    public static BOTTOM_RIGHT: DOMPoint = new DOMPoint(1, 1);
}



export class UIMatrix extends UIElement {


    private _stage: UIMatrixStage = null;

    public axis: DOMPoint;
    public align: DOMPoint;
    public alignFromContainer: DOMPoint;

    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;

    public childs: UIMatrix[] = [];
    protected matrix: DOMMatrix;
    public onUpdate: () => void;

    private boundingBox: DOMRect = new DOMRect();

    constructor(tag: string = "div", style?: any) {
        super(tag, {
            position: "absolute",
            width: "1px",
            height: "1px",
            ...style
        })
        this.align = new DOMPoint();
        this.alignFromContainer = new DOMPoint();
        this.axis = new DOMPoint();
        this.matrix = new DOMMatrix()


    }

    public get stage(): UIMatrixStage {
        return this._stage;
    }
    public set stage(s: UIMatrixStage) {
        this._stage = s;
        for (let i = 0; i < this.childs.length; i++) this.childs[i].stage = s;
    }

    public get mouseX(): number {
        let cx = this.boundingBox.x + this.boundingBox.width * 0.5;

        let cornerX = this.width * (this.align.x - 0.5) * this.globalScaleX;
        let cornerY = this.height * (this.align.y - 0.5) * this.globalScaleY;
        let cornerAngle = Math.atan2(cornerY, cornerX);
        let cornerDist = Math.sqrt(cornerX * cornerX + cornerY * cornerY);

        let px = cx + Math.cos(this.globalRotation * Math.PI / 180 + cornerAngle) * cornerDist;
        return this.stage.mouseX - px;
    }
    public get mouseY(): number {

        let cy = this.boundingBox.y + this.boundingBox.height * 0.5;
        let cornerX = this.width * (this.align.x - 0.5) * this.globalScaleX;
        let cornerY = this.height * (this.align.y - 0.5) * this.globalScaleY;
        let cornerAngle = Math.atan2(cornerY, cornerX);
        let cornerDist = Math.sqrt(cornerX * cornerX + cornerY * cornerY);
        let py = cy + Math.sin(this.globalRotation * Math.PI / 180 + cornerAngle) * cornerDist;

        return this.stage.mouseY - py;
    }



    private _x: number = 0;
    private _y: number = 0;
    private _w: number = 0;
    private _h: number = 0;

    public set x(n: number) { this._x = n; }
    public set y(n: number) { this._y = n; }

    public get x(): number { return this._x; }
    public get y(): number { return this._y; }

    public get height(): number { return this._h; }
    public get width(): number { return this._w; }

    public set height(n: number) {
        this._h = n;
        this.style.height = n + "px";
    }
    public set width(n: number) {
        this._w = n;
        this.style.width = n + "px";
    }

    public appendChild(element: UIMatrix): UIMatrix {
        element.stage = this.stage;
        this.childs.push(element);
        return super.appendChild(element) as UIMatrix;
    }

    public removeChild(element: UIMatrix): UIMatrix {
        const id = this.childs.indexOf(element);
        if (id < 0) return null;
        element.stage = null;
        this.childs.splice(id, 1);
        return super.removeChild(element) as UIMatrix;
    }

    public update() {
        if (this.onUpdate) this.onUpdate();
        this.identity();
        this.applyTransform();
        for (let i = 0; i < this.childs.length; i++) this.childs[i].update();
    }

    public applyTransform(): DOMMatrix {
        const m: DOMMatrix = this.matrix;
        if (this.parent) {

            const dx = this.alignFromContainer.x * this.parent.width;
            const dy = this.alignFromContainer.y * this.parent.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const a = Math.atan2(dy, dx);
            const r = a + this.globalRotation * Math.PI / 180;




            m.multiplySelf(this.parent);
            m.translateSelf(this.x - this.align.x * this.width, this.y - this.align.y * this.height);
            m.translateSelf(dx, dy)
            m.rotateSelf(this.rotation);

            m.translateSelf(-this.axis.x, -this.axis.y)
            m.scaleSelf(this.scaleX, this.scaleY);



        } else {
            m.multiplySelf(this.parent);
            m.translateSelf(this.x - this.align.x * this.width, this.y - this.align.y * this.height);
            m.rotateSelf(this.rotation);
            m.translateSelf(-this.axis.x, -this.axis.y)
            m.scaleSelf(this.scaleX, this.scaleY);
        }



        this.style.transform = "" + m;

        this.boundingBox = this.getBoundingRect();
        return m;
    }

    public get globalX(): number { return this.parent.globalX + this.x };
    public get globalY(): number { return this.parent.globalY + this.y };
    public get globalScaleX(): number { return this.parent.globalScaleX * this.scaleX };
    public get globalScaleY(): number { return this.parent.globalScaleY * this.scaleY };
    public get globalRotation(): number { return this.parent.globalRotation + this.rotation };

    public translate(x: number, y: number): DOMMatrix { return this.matrix.translateSelf(x, y); }
    public rotate(angle: number): DOMMatrix { return this.matrix.rotateSelf(angle); }
    public scale(x: number, y: number): DOMMatrix { return this.matrix.scaleSelf(x, y); }
    public invert(): DOMMatrix { return this.matrix.invertSelf() }
    public rotateFromVector(x: number, y: number): DOMMatrix { return this.matrix.rotateFromVectorSelf(x, y) }
    public multiply(m: UIMatrix): void { this.matrix.multiplySelf(m.domMatrix); }
    public preMultiply(m: UIMatrix): void { this.matrix.preMultiplySelf(m.domMatrix); }
    public identity(): void {
        this.matrix.setMatrixValue("matrix(1, 0, 0, 1, 0, 0)");
        this.html.style.transform = "" + this.matrix;
    }
    public setMatrixValue(s: string = "matrix(1, 0, 0, 1, 0, 0)"): DOMMatrix { return this.matrix.setMatrixValue(s); }





    //---------------------------------------------------


    public clone(): UIMatrix {
        var m: UIMatrix = new UIMatrix();
        m.x = this.x;
        m.y = this.y;
        m.rotation = this.rotation;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.axis = new DOMPoint(this.axis.x, this.axis.y)
        m.align = this.align;
        m.width = this.width;
        m.height = this.height;
        m.setMatrixValue(this.matrix.toString());
        return m;
    }


    public get domMatrix(): DOMMatrix { return this.matrix; }

    public get dataString(): string {
        var data: string = [this.x, this.y, this.axis.x, this.axis.y, this.rotation, this.scaleX, this.scaleY, this.width, this.height].join(",");
        data += "#";
        data += [this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f].join(",");
        return data;
    }
    public static fromDataString(data: string, target: UIMatrix = null): UIMatrix {
        var t: string[] = data.split("#");
        var p: string[] = t[0].split(",");
        var m: string[] = t[1].split(",");

        var o: UIMatrix;
        if (!target) o = new UIMatrix();
        else o = target;

        o.x = Number(p[0]);
        o.y = Number(p[1]);
        o.axis.x = Number(p[2]);
        o.axis.y = Number(p[3]);
        o.rotation = Number(p[4]);
        o.scaleX = Number(p[5]);
        o.scaleY = Number(p[6]);
        o.width = Number(p[7]);
        o.height = Number(p[8]);

        o.domMatrix.a = Number(m[0]);
        o.domMatrix.b = Number(m[1]);
        o.domMatrix.c = Number(m[2]);
        o.domMatrix.d = Number(m[3]);
        o.domMatrix.e = Number(m[4]);
        o.domMatrix.f = Number(m[5]);

        return o;
    }
}


export class UIMatrixStage extends UIMatrix {

    private screenX: number = 0;
    private screenY: number = 0;
    private _mouseX: number = 0;
    private _mouseY: number = 0;

    constructor() {
        super();
        this.stage = this;
        this.getScreenPosition();
        document.body.addEventListener("mousemove", (e) => {
            this._mouseX = e.clientX;
            this._mouseY = e.clientY;
        })

    }

    public get mouseX(): number { return this._mouseX; }
    public get mouseY(): number { return this._mouseY; }

    private getScreenPosition(): void {
        const rect: DOMRect = this.getBoundingRect();
        this.screenX = rect.x;
        this.screenY = rect.y;


    }

    public get globalX(): number { return 0; };
    public get globalY(): number { return 0 };
    public get globalScaleX(): number { return 1 };
    public get globalScaleY(): number { return 1 };
    public get globalRotation(): number { return 0 };

    public update() {
        this.getScreenPosition();
        if (this.onUpdate) this.onUpdate();
        this.identity();
        this.applyTransform();
        for (let i = 0; i < this.childs.length; i++) this.childs[i].update();
    }
}