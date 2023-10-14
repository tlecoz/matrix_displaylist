import { MatrixInfos } from "../displayListMatrix/DomMatrixElement";
import { Align } from "../geom/Align";
import { Matrix2D } from "../geom/Matrix2D";
import { Pt2D } from "../geom/Pt2D";
import { DisplayGroup } from "./DisplayGroup";
import { Stage } from "./Stage";

export class DisplayElement extends Matrix2D {

    protected _stage: Stage;

    public inverseW: number;//used for filling process;
    public inverseH: number;//used for filling process;
    public alpha: number = 1;
    public parent: DisplayGroup;
    public currentTransform: DOMMatrix;

    public render: (context: CanvasRenderingContext2D) => void = null;

    constructor(w: number, h: number) {
        super();
        this.width = w;
        this.height = h;

    }

    public align(displayAlign: Pt2D = Align.CENTER): void {
        this.xAxis = this.width * displayAlign.x;
        this.yAxis = this.height * displayAlign.y;
    }

    public get stage(): Stage { return this._stage; }
    public set stage(s: Stage) { this._stage = s; }


    public get globalAlpha(): number { return this.parent.globalAlpha * this.alpha; }
    public get globalX(): number { return this.parent.globalX + this.x };
    public get globalY(): number { return this.parent.globalY + this.y };
    public get globalScaleX(): number { return this.parent.globalScaleX * this.scaleX };
    public get globalScaleY(): number { return this.parent.globalScaleY * this.scaleY };
    public get globalRotation(): number { return this.parent.globalRotation + this.rotation };

    public init(obj: MatrixInfos) {
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
        this.rotation = obj.rotation;
        this.scaleX = obj.scaleX;

        this.xAxis = obj.axis.x;
        this.yAxis = obj.axis.y;
        this.align(Align.CENTER);
        this.moveRotationAxis(obj.axis.x, obj.axis.y);
    }

    public moveRotationAxis(x: number, y: number) {


        let dx = (this.xAxis) - x;
        let dy = (this.yAxis) - y;
        let a = Math.atan2(dy, dx) //+ Math.PI;
        let d = Math.sqrt(dx * dx + dy * dy);

        let r = this.globalRotation * Math.PI / 180;

        console.log(dx, dy)

        //this.x += this.xAxis;
        //this.y -= this.yAxis;
        //this.x -= Math.cos(r + a) * d;
        //this.y -= Math.sin(r + a) * d;

        this.xAxis = x / this.scaleX + this.width * 0.5
        this.yAxis = y / this.scaleY + this.height * 0.5

    }

    public renderTransform(ctx: CanvasRenderingContext2D, m: DOMMatrix): void {
        this.identity();
        ctx.canvas.width = ctx.canvas.width
        ctx.save();
        if (this.parent) this.multiply(this.parent);

        (ctx as any).setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
        if (this.render) this.render(ctx);
        ctx.restore();
    }

    public update(context: CanvasRenderingContext2D) {
        this.identity();
        this.inverseW = 1 / this.width;
        this.inverseH = 1 / this.height;

        context.save();
        if (this.parent) this.multiply(this.parent);

        let m: DOMMatrix = this.currentTransform = this.applyTransform();

        (context as any).setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

        if (this.render) this.render(context);

        context.restore();
    }
}