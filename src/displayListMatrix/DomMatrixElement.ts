import { UIElement } from "../UIElement";


export class Axis {
    public static TOP: DOMPoint = new DOMPoint(0.5, 0);
    public static TOP_LEFT: DOMPoint = new DOMPoint(0, 0);
    public static LEFT: DOMPoint = new DOMPoint(0, 0.5);
    public static BOTTOM_LEFT: DOMPoint = new DOMPoint(0, 1);
    public static CENTER: DOMPoint = new DOMPoint(0.5, 0.5);
    public static TOP_RIGHT: DOMPoint = new DOMPoint(1, 0);
    public static RIGHT: DOMPoint = new DOMPoint(1, 0.5);
    public static BOTTOM_RIGHT: DOMPoint = new DOMPoint(1, 1);
    public static BOTTOM: DOMPoint = new DOMPoint(0.5, 1);
}

export type MatrixInfos = {
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number,
    width: number,
    height: number
    axis?: DOMPoint,
    align?: DOMPoint,
    alignFromContainer?: DOMPoint,
}


export class DomMatrixElement extends UIElement {


    private _stage: DomMatrixElementStage = null;

    public axis: DOMPoint;
    public align: DOMPoint;
    public alignFromContainer: DOMPoint;

    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;

    public childs: DomMatrixElement[] = [];
    protected matrix: DOMMatrix;
    public onUpdate: () => void;

    private boundingBox: DOMRect = new DOMRect();
    public data: any = {};//empty object that can be used to store data
    public noScale: boolean = false;

    constructor(tag: string = "div", style?: any) {
        super(tag, {
            position: "absolute",
            width: "1px",
            height: "1px",
            ...style
        })
        this.align = Axis.CENTER;
        this.alignFromContainer = Axis.CENTER;
        this.axis = new DOMPoint();
        this.matrix = new DOMMatrix()


    }

    public get stage(): DomMatrixElementStage {
        return this._stage;
    }
    public set stage(s: DomMatrixElementStage) {
        this._stage = s;
        for (let i = 0; i < this.childs.length; i++) this.childs[i].stage = s;
    }

    public getBoundingRect(): DOMRect {
        const r = this.html.getBoundingClientRect();
        //if (this.parent == this.stage) {
        r.x -= this.stage.screenX;
        r.y -= this.stage.screenY;
        //}

        //console.log("getBoundingRect = ", r)

        return r;
    }

    public moveRotationAxis(x: number, y: number) {


        let dx = this.axis.x - x;
        let dy = this.axis.y - y;
        let a = Math.atan2(dy, dx) + Math.PI;
        let d = Math.sqrt(dx * dx + dy * dy);

        let r = this.globalRotation * Math.PI / 180;
        this.x += Math.cos(r + a) * d;
        this.y += Math.sin(r + a) * d;

        this.axis.x = x
        this.axis.y = y

    }

    public getGlobalOrigin(): { x: number, y: number } {
        let cy = this.boundingBox.y + this.boundingBox.height * 0.5;
        let cx = this.boundingBox.x + this.boundingBox.width * 0.5;


        let cornerX = this.width * (this.align.x - 0.5) * this.globalScaleX;
        let cornerY = this.height * (this.align.y - 0.5) * this.globalScaleY;
        let cornerAngle = Math.atan2(cornerY, cornerX);
        let cornerDist = Math.sqrt(cornerX * cornerX + cornerY * cornerY);

        let px = cx + Math.cos(this.globalRotation * Math.PI / 180 + cornerAngle) * (cornerDist);
        let py = cy + Math.sin(this.globalRotation * Math.PI / 180 + cornerAngle) * (cornerDist);

        let w, h, a, d;
        if (this.noScale) {
            w = (this.width - this.width * this.globalScaleX) * (-0.5 + this.align.x);
            h = (this.height - this.height * this.globalScaleY) * (-0.5 + this.align.y);
            a = Math.atan2(h, w);
            d = Math.sqrt(w * w + h * h);

            px += Math.cos(this.globalRotation * Math.PI / 180 + a) * d;
            py += Math.sin(this.globalRotation * Math.PI / 180 + a) * d;
        }

        return {
            x: px,
            y: py
        }
    }


    public getMousePosition(): { x: number, y: number } {


        let o = this.getGlobalOrigin();
        let w = o.x - this.stage.mouseX;
        let h = o.y - this.stage.mouseY;
        let a = Math.atan2(h, w) + Math.PI;
        let d = Math.sqrt(w * w + h * h);

        return {
            x: Math.cos(-this.globalRotation * Math.PI / 180 + a) * d,
            y: Math.sin(-this.globalRotation * Math.PI / 180 + a) * d,
        }

    }

    public get mouseX(): number {
        return this.getMousePosition().x;
    }
    public get mouseY(): number {

        return this.getMousePosition().y;
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

    public appendChild(element: DomMatrixElement): DomMatrixElement {
        element.stage = this.stage;
        this.childs.push(element);
        return super.appendChild(element) as DomMatrixElement;
    }

    public removeChild(element: DomMatrixElement): DomMatrixElement {
        const id = this.childs.indexOf(element);
        if (id < 0) return null;
        element.stage = null;
        this.childs.splice(id, 1);
        return super.removeChild(element) as DomMatrixElement;
    }

    public update() {
        if (this.onUpdate) this.onUpdate();
        this.identity();
        this.applyTransform();
        for (let i = 0; i < this.childs.length; i++) this.childs[i].update();
    }

    public applyTransform(usedInCanvas: boolean = false): DOMMatrix {
        const m: DOMMatrix = this.matrix;


        //-------------------- DOM --------------------------------

        if (!usedInCanvas) {

            let alignX = 0, alignY = 0;
            if (this.parent) {
                alignX = this.alignFromContainer.x * this.parent.width;
                alignY = this.alignFromContainer.y * this.parent.height;
                m.multiplySelf(this.parent);
            }


            if (!this.noScale) {
                m.translateSelf(this.x - this.align.x * this.width + alignX, this.y - this.align.y * this.height + alignY);
                m.rotateSelf(this.rotation);
                m.translateSelf(-this.axis.x, -this.axis.y)
                m.scaleSelf(this.scaleX, this.scaleY);
            } else {

                m.translateSelf(this.x - this.align.x * this.width + alignX, this.y - this.align.y * this.height + alignY);
                m.rotateSelf(this.rotation);
                m.translateSelf(-this.axis.x, -this.axis.y)
                m.scaleSelf(1 / this.globalScaleX, 1 / this.globalScaleY);
            }

            this.style.transform = "" + m;
            this.boundingBox = this.getBoundingRect();

            return m;
        }

        //---------------- CANVAS -----------------------------

        let alignX = 0, alignY = 0;
        if (this.parent) {
            alignX = this.alignFromContainer.x * this.parent.width;
            alignY = this.alignFromContainer.y * this.parent.height;
            m.multiplySelf(this.parent);
        }



        let ax = -this.axis.x + alignX - this.align.x * this.width * this.scaleX;
        let ay = -this.axis.y + alignY - this.align.y * this.height * this.scaleY;
        let r = this.rotation * Math.PI / 180;
        let a = Math.atan2(ay, ax);
        let da = Math.sqrt(ax * ax + ay * ay) //+ Math.PI;  


        m.translateSelf(this.x, this.y);
        m.rotateSelf(this.rotation);
        m.translateSelf(Math.cos(a) * da, Math.sin(a) * da)
        m.scaleSelf(this.scaleX, this.scaleY);


        console.log("aaa ", alignX)





        return m;
    }


    public get globalScaleX(): number { return this.parent.globalScaleX * this.scaleX };
    public get globalScaleY(): number { return this.parent.globalScaleY * this.scaleY };
    public get globalRotation(): number { return this.parent.globalRotation + this.rotation };

    public translate(x: number, y: number): DOMMatrix { return this.matrix.translateSelf(x, y); }
    public rotate(angle: number): DOMMatrix { return this.matrix.rotateSelf(angle); }
    public scale(x: number, y: number): DOMMatrix { return this.matrix.scaleSelf(x, y); }
    public invert(): DOMMatrix { return this.matrix.invertSelf() }
    public rotateFromVector(x: number, y: number): DOMMatrix { return this.matrix.rotateFromVectorSelf(x, y) }
    public multiply(m: DomMatrixElement): void { this.matrix.multiplySelf(m.domMatrix); }
    public preMultiply(m: DomMatrixElement): void { this.matrix.preMultiplySelf(m.domMatrix); }
    public identity(): void {
        this.matrix.setMatrixValue("matrix(1, 0, 0, 1, 0, 0)");
        this.html.style.transform = "" + this.matrix;
    }
    public setMatrixValue(s: string = "matrix(1, 0, 0, 1, 0, 0)"): DOMMatrix { return this.matrix.setMatrixValue(s); }


    public get domMatrix(): DOMMatrix { return this.matrix; }

    private static canvasMatrixElement: DomMatrixElement;
    public get canvasMatrix(): DOMMatrix {
        if (!DomMatrixElement.canvasMatrixElement) DomMatrixElement.canvasMatrixElement = new DomMatrixElement();
        const m: DomMatrixElement = this.getMatrixInfos(DomMatrixElement.canvasMatrixElement) as DomMatrixElement;
        m.identity();
        m.applyTransform(true)


        return m.matrix;
    }




    public getMatrixInfos(input?: DomMatrixElement): MatrixInfos {
        var m: any = input ? input : {};
        m.x = this.x;
        m.y = this.y;
        m.rotation = this.rotation;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.axis = new DOMPoint(this.axis.x, this.axis.y)
        m.align = new DOMPoint(this.align.x, this.align.y);
        m.alignFromContainer = new DOMPoint(this.alignFromContainer.x, this.alignFromContainer.y);
        m.width = this.width;
        m.height = this.height;
        m.parent = this.parent;
        m.stage = this.stage;
        return m;
    }

    public clone(): DomMatrixElement {

        return this.getMatrixInfos(new DomMatrixElement()) as DomMatrixElement;
    }

    //---------------------------------------------------






    /*
    public clone(): DomMatrixElement {
        var m: DomMatrixElement = new DomMatrixElement();
        m.x = this.x;
        m.y = this.y;
        m.rotation = this.rotation;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.axis = new DOMPoint(this.axis.x, this.axis.y)
        m.align = new DOMPoint(this.align.x, this.align.y);
        m.alignFromContainer = new DOMPoint(this.alignFromContainer.x, this.alignFromContainer.y);
        m.width = this.width;
        m.height = this.height;
        m.setMatrixValue(this.matrix.toString());
        return m;
    }
    public get dataString(): string {
        var data: string = [this.x, this.y, this.axis.x, this.axis.y, this.rotation, this.scaleX, this.scaleY, this.width, this.height].join(",");
        data += "#";
        data += [this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f].join(",");
        return data;
    }
    public static fromDataString(data: string, target: DomMatrixElement = null): DomMatrixElement {
        var t: string[] = data.split("#");
        var p: string[] = t[0].split(",");
        var m: string[] = t[1].split(",");

        var o: DomMatrixElement;
        if (!target) o = new DomMatrixElement();
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
    }*/
}


export class DomMatrixElementStage extends DomMatrixElement {

    public screenX: number = 0;
    public screenY: number = 0;
    private _mouseX: number = 0;
    private _mouseY: number = 0;

    constructor(tag: string = "div", style?: any) {
        super(tag, style);
        this.stage = this;
        this.getScreenPosition();
        document.body.addEventListener("mousemove", (e) => {

            this._mouseX = e.pageX;
            this._mouseY = e.pageY;
        })

    }

    public get mouseX(): number { return this._mouseX; }
    public get mouseY(): number { return this._mouseY; }

    private getScreenPosition(): void {
        const rect: DOMRect = this.getBoundingRect();
        this.screenX = rect.x;
        this.screenY = rect.y;


    }

    public getBoundingRect(): DOMRect {
        return this.html.getBoundingClientRect();
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