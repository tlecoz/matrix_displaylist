import { UIElement } from "../UIElement";
import { EventDispatcher } from "../events/EventDispatcher";
import { Matrix2D } from "./Matrix2D";

export class DivMatrix2D extends UIElement {

    public static IDENTITY: DOMMatrix = new DOMMatrix("matrix(1, 0, 0, 1, 0, 0)");

    //public x: number = 0;
    //public y: number = 0;
    public xAxis: number = 0;
    public yAxis: number = 0;
    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    //public width: number = 1;
    //public height: number = 1;

    public offsetW: number = 0;
    public offsetH: number = 0;


    public _x: number = 0;
    public _y: number = 0;
    public _xAxis: number = 0;
    public _yAxis: number = 0;
    public _rotation: number = 0;
    public _scaleX: number = 1;
    public _scaleY: number = 1;

    protected matrix: DOMMatrix;

    protected savedMatrixs: any;

    private __x: number = 0;
    private __y: number = 0;
    private __width: number = 1;
    private __height: number = 1;

    public set x(n: number) { this.__x = n; }
    public set y(n: number) { this.__y = n; }

    public get x(): number { return this.__x; }
    public get y(): number { return this.__y; }

    public set width(n: number) { this.__width = n; }
    public set height(n: number) { this.__height = n; }

    public get width(): number { return this.__width; }
    public get height(): number { return this.__height; }


    constructor(tag: string, style?: any) {
        super(tag, style);
        this.savedMatrixs = [];
        this.matrix = new DOMMatrix();
    }

    public get dataString(): string {
        var data: string = [this.x, this.y, this.xAxis, this.yAxis, this.rotation, this.scaleX, this.scaleY, this.width, this.height, this.offsetW, this.offsetH].join(",");
        data += "#";
        data += [this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f].join(",");
        return data;
    }

    public static fromDataString(data: string, target: Matrix2D = null): Matrix2D {
        var t: string[] = data.split("#");
        var p: string[] = t[0].split(",");
        var m: string[] = t[1].split(",");

        var o: Matrix2D;
        if (!target) o = new Matrix2D();
        else o = target;


        o.x = Number(p[0]);
        o.y = Number(p[1]);
        o.xAxis = Number(p[2]);
        o.yAxis = Number(p[3]);
        o.rotation = Number(p[4]);
        o.scaleX = Number(p[5]);
        o.scaleY = Number(p[6]);
        o.width = Number(p[7]);
        o.height = Number(p[8]);
        o.offsetW = Number(p[9]);
        o.offsetH = Number(p[10]);

        o.domMatrix.a = Number(m[0]);
        o.domMatrix.b = Number(m[1]);
        o.domMatrix.c = Number(m[2]);
        o.domMatrix.d = Number(m[3]);
        o.domMatrix.e = Number(m[4]);
        o.domMatrix.f = Number(m[5]);

        return o;
    }



    public save(): void {
        let o: any = this.savedMatrixs, next: any = null;
        if (o) next = o;
        var obj: any = {
            matrix: this.matrix.toString(),
            next: next
        }
        this.savedMatrixs = obj;
    }
    public restore(): void {
        this.setMatrixValue(this.savedMatrixs.matrix);
        this.savedMatrixs = this.savedMatrixs.next;
    }
    public get realWidth(): number {
        //must be overrided
        return this.width;
    }
    public get realHeight(): number {
        //must be overrided
        return this.height;
    }
    public clone(): DivMatrix2D {
        var m: DivMatrix2D = new DivMatrix2D("div", { position: "absolute" });
        m.x = this.x;
        m.y = this.y;
        m.rotation = this.rotation;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.xAxis = this.xAxis;
        m.yAxis = this.yAxis;
        m.width = this.width;
        m.height = this.height;
        m.setMatrixValue(this.matrix.toString());
        return m;
    }

    public applyTransform(): DOMMatrix {
        const m: DOMMatrix = this.matrix;

        m.translateSelf(this.x, this.y);
        m.rotateSelf(this.rotation);
        m.translateSelf(- this.xAxis, - this.yAxis)


        //console.log(this.xAxis, this.yAxis);
        m.scaleSelf(this.scaleX, this.scaleY);



        return m;
    }
    public multiply(m: DivMatrix2D): void {
        this.matrix.multiplySelf(m.domMatrix);
    }


    public setMatrixValue(s: string = "matrix(1, 0, 0, 1, 0, 0)"): DOMMatrix { return this.matrix.setMatrixValue(s); }
    public translate(x: number, y: number): DOMMatrix { return this.matrix.translateSelf(x, y); }
    public rotate(angle: number): DOMMatrix { return this.matrix.rotateSelf(angle); }
    public scale(x: number, y: number): DOMMatrix { return this.matrix.scaleSelf(x, y); }

    public invert(): DOMMatrix { return this.matrix.invertSelf() }
    public rotateFromVector(x: number, y: number): DOMMatrix { return this.matrix.rotateFromVectorSelf(x, y) }

    public preMultiply(m: DivMatrix2D): void { this.matrix.preMultiplySelf(m.domMatrix); }
    public identity(): void { this.matrix.setMatrixValue("matrix(1, 0, 0, 1, 0, 0)"); }

    public get domMatrix(): DOMMatrix { return this.matrix }
}
