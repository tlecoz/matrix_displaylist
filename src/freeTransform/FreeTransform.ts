import { UIElement } from "../UIElement";
import { DivElement } from "../display/DivElement";
import { DivGroup } from "../display/DivGroup";
import { Pt2D } from "../geom/Pt2D";

export class FreeTransform extends DivGroup {

    public buttons: DivGroup;
    public left: DivElement;
    public topLeft: DivElement;
    public bottomLeft: DivElement;
    public top: DivElement;
    public right: DivElement;
    public topRight: DivElement;
    public bottomRight: DivElement;
    public bottom: DivElement;

    public border: DivElement;

    public rotationAxis: DivElement;
    public rotationBtn: DivElement;

    protected btn: DivElement;
    protected opposite: DivElement;

    protected offsetX: number = 0;
    protected offsetY: number = 0;
    protected offsetAngle: number = 0;
    protected offsetScaleX: number = 1;
    protected offsetScaleY: number = 1;
    protected distFromOpposite: number = 0;
    protected angleFromOpposite: number = 0;
    protected orientationX: number = 0;
    protected orientationY: number = 0;

    constructor() {
        super();

        let anchorStyle = {
            borderRadius: "50%",
            border: "solid 1px #666666",
            backgroundColor: "#ffffff",
            cursor: "pointer",
            userSelect: "none",
        }




        const createAnchor = (size: number, func: (obj: DivElement, e: any) => void) => {
            const anchor = new DivElement("div", {
                position: "absolute",
                width: size + "px",
                height: size + "px",
                ...anchorStyle
            });
            anchor.noScale = true;
            anchor.xAxis = size / 2;
            anchor.yAxis = size / 2;
            anchor.addEventListener("mousedown", (e) => func(anchor, e))
            this.buttons.appendChild(anchor);
            return anchor;
        }


        this.border = this.appendChild(new DivElement("div", {
            border: "solid 1px #ffffff",
            backgroundColor: "rgba(255,200,200,0.5)",
        }))

        this.buttons = this.appendChild(new DivGroup()) as DivGroup;

        this.border.appendChild(new UIElement("div", {
            color: "#ffffff",
            fontSize: "26px",
            padding: "10px"
        })).text = "Youpi !"


        let resizing: boolean = false;
        let resizingX: boolean = false;
        let resizingY: boolean = false;
        let rotating: boolean = false;
        let movingAxis: boolean = false;
        let moving: boolean = false;


        document.body.addEventListener("mousemove", (e) => {

            if (rotating) {
                this.setRotation(e);
                return;
            }

            if (resizing) {
                if (resizingX) this.setSizeX(e);
                else if (resizingY) this.setSizeY(e);
                else this.setSize(e);
                return;
            }

            if (moving) {
                this.setPosition(e);
                return;
            }

            if (movingAxis) {
                this.moveRotationAxis(e);
                return
            }
        })


        const onResize = (current, e) => {
            resizing = true;
            resizingX = current == this.left || current == this.right;
            resizingY = (current == this.top || current == this.bottom);




            this.btn = current;
            if (current.opposite) this.opposite = current.opposite as DivElement;

            const parent = this.parent.html.getBoundingClientRect();
            const btn = this.btn.html.getBoundingClientRect();
            const opposite = this.opposite.html.getBoundingClientRect();

            const a = { x: btn.x + btn.width * 0.5 - parent.x - this.x, y: btn.y + btn.height * 0.5 - parent.y - this.y }
            const b = { x: opposite.x + opposite.width * 0.5 - parent.x - this.x, y: opposite.y + opposite.height * 0.5 - parent.y - this.y }



            let dx = a.x - b.x;
            let dy = a.y - b.y;
            this.distFromOpposite = Math.sqrt(dx * dx + dy * dy);
            this.angleFromOpposite = Math.atan2(dy, dx);

            this.orientationX = dx > 0 ? 1 : -1;
            this.orientationY = dy > 0 ? 1 : -1;

        }



        const anchorSize = 12;
        this.left = createAnchor(anchorSize, onResize);
        this.topLeft = createAnchor(anchorSize, onResize);
        this.bottomLeft = createAnchor(anchorSize, onResize);
        this.right = createAnchor(anchorSize, onResize);
        this.topRight = createAnchor(anchorSize, onResize);
        this.bottomRight = createAnchor(anchorSize, onResize);
        this.top = createAnchor(anchorSize, onResize);
        this.bottom = createAnchor(anchorSize, onResize);


        const setOpposite = (a: any, b: any) => {
            a.opposite = b;
            b.opposite = a;
        }

        setOpposite(this.left, this.right);
        setOpposite(this.topLeft, this.bottomRight);
        setOpposite(this.bottomLeft, this.topRight);
        setOpposite(this.top, this.bottom);


        document.body.addEventListener("mouseup", (e) => {
            if (movingAxis) {
                this.xAxis = this.rotationAxis.x;
                this.yAxis = this.rotationAxis.y;
                this.x = this.offsetX + this.rotationAxis.x;
                this.y = this.offsetY + this.rotationAxis.y;
            } else if (resizing) {
                this.offsetScaleX = this.scaleX;
                this.offsetScaleY = this.scaleY;
            }
            this.offsetX = this.offsetY = this.offsetAngle = 0;
            resizing = resizingX = resizingY = rotating = movingAxis = moving = false;
        })

        this.rotationBtn = createAnchor(16, (current, e) => {
            rotating = true;
            this.offsetAngle = this.rotation * Math.PI / 180;  //- Math.PI / 2;
        })

        this.rotationAxis = createAnchor(14, (current, e) => {
            movingAxis = true;
            this.offsetX = this.x;
            this.offsetY = this.y;
        })

        this.border.addEventListener("mousedown", (e) => { moving = true; })

    }

    private setRotation(mouseEvent: any): void {

        const parent = this.parent.html.getBoundingClientRect();
        const axis = this.rotationAxis.html.getBoundingClientRect();

        let mx = mouseEvent.clientX - parent.x - this.x + (axis.x + axis.width * 0.5);
        let my = mouseEvent.clientY - parent.y - this.y + (axis.y + axis.height * 0.5);

        let xAxis = axis.x + axis.width// * 0.5;
        let yAxis = axis.y + axis.height// * 0.5;

        let dx = mx - xAxis;
        let dy = my - yAxis;

        let a = Math.PI / 2 + Math.atan2(dy, dx) - this.offsetAngle;
        this.rotation = (this.offsetAngle + a) / (Math.PI / 180);



    }

    private getClosestPointOnLine(mouseX: number, mouseY: number, p0: { x: number, y: number }, p1: { x: number, y: number }) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const t = ((mouseX - p0.x) * dx + (mouseY - p0.y) * dy) / (dx * dx + dy * dy);
        const closestX = p0.x + t * dx;
        const closestY = p0.y + t * dy;
        return { x: closestX, y: closestY };
    }

    private setSize(mouseEvent: any): void {

    }
    private setSizeX(mouseEvent: any): void {
        const parent = this.parent.html.getBoundingClientRect();
        const btn = this.btn.html.getBoundingClientRect();
        const opposite = this.opposite.html.getBoundingClientRect();

        let mx = mouseEvent.clientX - parent.x - this.x;
        let my = mouseEvent.clientY - parent.y - this.y;


        const a = { x: btn.x + btn.width * 0.5 - parent.x - this.x, y: btn.y + btn.height * 0.5 - parent.y - this.y }
        const b = { x: opposite.x + opposite.width * 0.5 - parent.x - this.x, y: opposite.y + opposite.height * 0.5 - parent.y - this.y }
        let pt = this.getClosestPointOnLine(
            mx, my,
            a,
            b
        );



        let dx = pt.x - b.x;
        let dy = pt.y - b.y;
        let d = Math.sqrt(dx * dx + dy * dy);

        let sensX = dx > 0 ? 1 : -1;
        let sensY = dy > 0 ? 1 : -1;

        if (sensX != this.orientationX || sensY != this.orientationY) {
            d *= -1;
        }

        //console.log(d, this.distFromOpposite)
        this.scaleX = this.offsetScaleX + (d - this.distFromOpposite) / (this.distFromOpposite / this.offsetScaleX);

        //this.border.scaleX = this.scaleX;


    }
    private setSizeY(mouseEvent: any): void {

    }
    private setPosition(mouseEvent: any): void {

    }
    private moveRotationAxis(mouseEvent: any): void {
        const parent = this.parent.html.getBoundingClientRect();
        let mx = mouseEvent.clientX - parent.x - this.x;
        let my = mouseEvent.clientY - parent.y - this.y;

        this.rotationAxis.x = mx;
        this.rotationAxis.y = my;


    }





    public init(o: {
        x: number,
        y: number,
        width: number,
        height: number,
        scaleX: number,
        scaleY: number,
        rotation: number
    }) {

        this.width = o.width;
        this.height = o.height;
        this.x = o.x;
        this.y = o.y;
        this.scaleX = o.scaleX;
        this.scaleY = o.scaleY;
        this.rotation = o.rotation;

        this.border.width = o.width;
        this.border.height = o.height;
        this.border.style.width = o.width + "px";
        this.border.style.height = o.height + "px";

        //this.border.align(new Pt2D(-0.5, -0.5))

        let w = this.width;
        w *= this.scaleX;
        w *= 0.5;

        let h = this.height;
        h *= this.scaleY;
        h *= 0.5;


        this.top.x = 0;
        this.top.y = -h;

        this.topLeft.x = -w;
        this.topLeft.y = -h;

        this.topRight.x = +w;
        this.topRight.y = -h;

        this.left.x = -w;
        this.left.y = 0;

        this.right.x = +w;
        this.right.y = 0;

        this.bottom.x = 0;
        this.bottom.y = +h;

        this.bottomLeft.x = -w;
        this.bottomLeft.y = +h;

        this.bottomRight.x = +w;
        this.bottomRight.y = +h;

        this.rotationAxis.x = 0;
        this.rotationAxis.y = 0;

        this.rotationBtn.x = 0;
        this.rotationBtn.y = -h - 30;


        this.border.x = -w;
        this.border.y = -h;
        //this.border.xAxis = w;
        //this.border.yAxis = h;

        this.rotation = o.rotation;
        this.scaleX = o.scaleX;
        this.scaleY = o.scaleY;

        setTimeout(() => {
            //console.log(this.rotationBtn.html.getBoundingClientRect())
        }, 100);


    }


}