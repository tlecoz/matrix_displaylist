import { DisplayElement } from "./DisplayElement";
import { Stage } from "./Stage";

export class DisplayGroup extends DisplayElement {

    protected _numChildren: number = 0;
    protected _children: DisplayElement[];

    constructor() {
        super(1, 1);
        this._children = [];
    }

    public get numChildren(): number { return this._numChildren; }
    public get children(): DisplayElement[] { return this._children; }

    public set stage(s: Stage) {
        super._stage = s;
        let i: number, nb: number = this._children.length;
        for (i = 0; i < nb; i++) this._children[i].stage = s;
    }

    public appendChild(element: DisplayElement): DisplayElement {
        this._children[this._numChildren++] = element;
        element.parent = this;
        //console.log("Group.appendChild ", element, this.stage)
        element.stage = this.stage;
        return element;
    }
    public removeChild(element: DisplayElement): DisplayElement {
        const id = this._children.lastIndexOf(element);
        if (id < 0) return null;
        this._children.splice(id, 1);
        this._numChildren--;
        element.parent = null;
        this.stage = null;
        return element;
    }

    public update(context: CanvasRenderingContext2D): DOMMatrix {

        let alpha: number = this.alpha;
        const parent: DisplayGroup = this.parent;
        const children: DisplayElement[] = this.children;
        this.identity();
        if (parent) this.multiply(parent);


        let m: DOMMatrix = this.applyTransform();

        context.save();

        let i: number, nb: number = this._numChildren;
        for (i = 0; i < nb; i++) children[i].update(context);

        context.restore();

        return m;
    }
}