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
    protected offsetX2: number = 0;
    protected offsetY2: number = 0;
    protected offsetAngle: number = 0;
    protected offsetScaleX: number = 1;
    protected offsetScaleY: number = 1;
    protected distFromOpposite: number = 0;
    protected angleFromOpposite: number = 0;
    protected offsetOriginDist: number = 0;
    protected offsetOriginAngle: number = 0;
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

        const label = new DivElement("div", {
            color: "#ffffff",
            fontSize: "26px",
            padding: "10px"
        });
        label.text = "youpi !";

        this.border.appendChild(label)


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
            const axis = this.rotationAxis.html.getBoundingClientRect();

            const a = { x: btn.x + btn.width * 0.5 - parent.x - this.x, y: btn.y + btn.height * 0.5 - parent.y - this.y }
            const b = { x: opposite.x + opposite.width * 0.5 - parent.x - this.x, y: opposite.y + opposite.height * 0.5 - parent.y - this.y }



            let dx = a.x - b.x;
            let dy = a.y - b.y;
            this.distFromOpposite = Math.sqrt(dx * dx + dy * dy);
            this.angleFromOpposite = Math.atan2(dy, dx);

            this.orientationX = dx > 0 ? 1 : -1;
            this.orientationY = dy > 0 ? 1 : -1;

            this.offsetScaleX = this.scaleX;
            this.offsetScaleY = this.scaleY;
            this.offsetX = this.x;
            this.offsetY = this.y;

            dx = opposite.x - axis.x;
            dy = opposite.y - axis.y;
            this.offsetOriginDist = Math.sqrt(dx * dx + dy * dy);
            this.offsetOriginAngle = Math.atan2(dy, dx);

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
                this.xAxis = this.rotationAxis.x * this.scaleX;
                this.yAxis = this.rotationAxis.y * this.scaleY;


                this.x = this.offsetX + this.rotationAxis.x * this.scaleX - this.offsetX2;
                this.y = this.offsetY + this.rotationAxis.y * this.scaleY - this.offsetY2;
            } else if (resizing) {
                this.offsetScaleX = this.scaleX;
                this.offsetScaleY = this.scaleY;
            }
            this.offsetX = this.offsetY = this.offsetAngle = 0;
            resizing = resizingX = resizingY = rotating = movingAxis = moving = false;
        })

        this.rotationBtn = createAnchor(16, (current, e) => {
            rotating = true;
            this.offsetAngle = this.getAngleBetweenMouseAndAxis(e) - this.rotation * Math.PI / 180;  //- Math.PI / 2;
        })

        this.rotationAxis = createAnchor(14, (current, e) => {
            movingAxis = true;

            this.offsetX = this.x;
            this.offsetY = this.y;


            this.offsetX2 = this.rotationAxis.x;
            this.offsetY2 = this.rotationAxis.y;
        })

        this.border.addEventListener("mousedown", (e) => { moving = true; })

    }


    private setRotation(mouseEvent: any): void {
        this.rotation = (-this.offsetAngle + this.getAngleBetweenMouseAndAxis(mouseEvent)) / (Math.PI / 180);
    }

    private getAngleBetweenMouseAndAxis(mouseEvent: any) {
        const parent = this.parent.html.getBoundingClientRect();
        const axis = this.rotationAxis.html.getBoundingClientRect();

        let mx = mouseEvent.clientX - parent.x - this.x + (axis.x + axis.width * 0.5);
        let my = mouseEvent.clientY - parent.y - this.y + (axis.y + axis.height * 0.5);

        let xAxis = axis.x + axis.width * 0.5;
        let yAxis = axis.y + axis.height * 0.5;

        let dx = mx - xAxis;
        let dy = my - yAxis;

        return Math.PI / 2 + Math.atan2(dy, dx);
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
        const d = this.getDistFromOppositePoint(mouseEvent);
        const scale = d / this.distFromOpposite;
        const parent = this.parent.html.getBoundingClientRect();
        const opposite = this.parent.html.getBoundingClientRect();
        console.log(scale)

        this.scaleX = scale * this.offsetScaleX;
        this.scaleY = scale * this.offsetScaleY;

        this.x = this.offsetX + Math.cos(this.offsetOriginAngle + Math.PI) * (this.offsetOriginDist * scale - this.distFromOpposite * 0.5);
        this.y = this.offsetY + Math.sin(this.offsetOriginAngle + Math.PI) * (this.offsetOriginDist * scale - this.distFromOpposite * 0.5);

    }


    private getDistFromOppositePoint(mouseEvent: any): number {
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

        return d;
    }

    private setSizeX(mouseEvent: any): void {

        const d = this.getDistFromOppositePoint(mouseEvent);
        this.scaleX = this.offsetScaleX + (d - this.distFromOpposite) / (this.distFromOpposite / this.offsetScaleX);

    }
    private setSizeY(mouseEvent: any): void {
        const d = this.getDistFromOppositePoint(mouseEvent);
        this.scaleY = this.offsetScaleY + (d - this.distFromOpposite) / (this.distFromOpposite / this.offsetScaleY);
    }
    private setPosition(mouseEvent: any): void {


    }

    public rotationAxisObj: any;

    private moveRotationAxis(mouseEvent: any): void {
        const parent = this.parent.html.getBoundingClientRect();
        //const axis = this.rotationAxis.html.getBoundingClientRect();
        let r = this.rotation * Math.PI / 180;
        let mx = (mouseEvent.clientX - parent.x - this.x) / this.scaleX;//- axis.x - axis.width * 0.5;
        let my = (mouseEvent.clientY - parent.y - this.y) / this.scaleY;//- axis.y - axis.height * 0.5;
        let a = Math.atan2(my, mx);
        let d = Math.sqrt(mx * mx + my * my);

        this.rotationAxisObj = {
            mx,
            my,
            d,
            a
        }





        this.rotationAxis.x = this.offsetX2 + Math.cos(-r + a) * d;
        this.rotationAxis.y = this.offsetY2 + Math.sin(-r + a) * d;


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