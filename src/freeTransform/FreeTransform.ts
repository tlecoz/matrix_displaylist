import { UIElement } from "../UIElement";
import { DivElement } from "../display/DivElement";
import { DivGroup } from "../display/DivGroup";
import { Pt2D } from "../geom/Pt2D";

export class FreeTransform extends DivGroup {

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

    protected offsetX: number = 0;
    protected offsetY: number = 0;
    protected offsetAngle: number = 0;

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
            anchor.xAxis = size / 2;
            anchor.yAxis = size / 2;
            anchor.addEventListener("mousedown", (e) => func(anchor, e))
            this.appendChild(anchor);
            return anchor;
        }


        this.border = this.appendChild(new DivElement("div", {
            border: "solid 1px #ffffff",
            backgroundColor: "rgba(255,200,200,0.5)",

        }))
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
            resizingX = (current === this.left || current === this.right);
            resizingX = (current === this.top || current === this.bottom);
            this.btn = current;
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

        document.body.addEventListener("mouseup", (e) => {
            if (movingAxis) {
                this.xAxis = this.rotationAxis.x;
                this.yAxis = this.rotationAxis.y;
                this.x = this.offsetX + this.rotationAxis.x;
                this.y = this.offsetY + this.rotationAxis.y;
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
    private setSize(mouseEvent: any): void {

    }
    private setSizeX(mouseEvent: any): void {

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

        console.log("moveRotationAxis ", mx, my)

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

        console.log("h = ", h)

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
            console.log(this.rotationBtn.html.getBoundingClientRect())
        }, 100);


    }


}