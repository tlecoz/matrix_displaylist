import { DivElement } from "./DivElement";
import { StageDiv } from "./StageDiv";

export class DivGroup extends DivElement {

    protected _numChildren: number = 0;
    protected _children: any[];

    constructor() {
        super();
        this._children = [];
    }

    public get numChildren(): number { return this._numChildren; }
    public get children(): DivElement[] { return this._children; }

    public set stage(s: StageDiv) {
        super._stage = s;
        let i: number, nb: number = this._children.length;
        for (i = 0; i < nb; i++) this._children[i].stage = s;
    }

    public appendChild(element: DivElement): DivElement {
        this._children[this._numChildren++] = element;
        element.parent = this;
        this.html.appendChild(element.html);
        //console.log("Group.appendChild ", element, this.stage)
        element.stage = this.stage;
        return element;
    }
    public removeChild(element: DivElement): DivElement {
        const id = this._children.lastIndexOf(element);
        if (id < 0) return null;
        this.html.removeChild(element.html);
        this._children.splice(id, 1);
        this._numChildren--;
        element.parent = null;
        this.stage = null;
        return element;
    }

    public applyTransform(): DOMMatrix {


        let i: number, nb: number = this._numChildren;
        let o: DivElement
        let dx, dy, a, d;
        let parent = this.parent;
        if (parent) {

            // console.log("parent._x = ", parent._x)

            if (parent._rotation != 0) {

                let r = parent._rotation * Math.PI / 180;

                dx = -parent.xAxis + this.x * parent._scaleX;
                dy = -parent.yAxis + this.y * parent._scaleY;
                a = Math.atan2(dy, dx);
                d = Math.sqrt(dx * dx + dy * dy);



                this._rotation = this.rotation + parent.rotation;
                this._x = parent._x + Math.cos(r + a) * d;
                this._y = parent._y + Math.sin(r + a) * d;

            } else {
                this._rotation = this.rotation;
                this._x = -parent.xAxis + parent._x + this.x * parent._scaleX;
                this._y = -parent.yAxis + parent._y + this.y * parent._scaleY;

                //console.log(this._x + " = " + parent._x + " + " + this.x + " * " + parent._scaleX);
            }


            this._scaleX = parent._scaleX * this.scaleX;
            this._scaleY = parent._scaleY * this.scaleY;



        } else {
            this._x = this.x;
            this._y = this.y;
            this._rotation = this.rotation;
            this._scaleX = 1//this.scaleX;
            this._scaleY = 1//this.scaleY;
        }


        let rotation = this._rotation * Math.PI / 180;
        for (i = 0; i < nb; i++) {
            o = this.children[i] as DivElement;

            if (this._rotation != 0) {

                dx = -this.xAxis + (o.x) * this._scaleX;
                dy = -this.yAxis + (o.y) * this._scaleY;
                a = Math.atan2(dy, dx);
                d = Math.sqrt(dx * dx + dy * dy);

                //console.log(i, this._scaleX)

                o._rotation = this._rotation + o.rotation;
                o._x = this._x + Math.cos(rotation + a) * d;
                o._y = this._y + Math.sin(rotation + a) * d;
                //o._rotation = this.rotation


            } else {
                o._x = this._x - this.xAxis + (o.x) * this._scaleX;
                o._y = this._y - this.yAxis + (o.y) * this._scaleY;
                o._rotation = o._rotation;
            }

            if (o instanceof DivGroup) {

            } else {

                o._scaleX = this.scaleX * o.scaleX;
                o._scaleY = this.scaleY * o.scaleY;
            }








        }



        return this.matrix;
    }

    public update(): DOMMatrix {

        let alpha: number = this.alpha;
        const parent: DivGroup = this.parent;
        const children: DivElement[] = this.children;
        this.identity();




        let m: DOMMatrix = this.applyTransform();



        let i: number, nb: number = this._numChildren;
        for (i = 0; i < nb; i++) children[i].update();

        //if (parent) this.multiply(parent);

        return m;
    }
}