
import { Axis, DomMatrixElement, MatrixInfos } from "./DomMatrixElement";

export class FreeTransform2 extends DomMatrixElement {

    protected top: DomMatrixElement;
    protected topLeft: DomMatrixElement;
    protected topRight: DomMatrixElement;
    protected left: DomMatrixElement;
    protected right: DomMatrixElement;
    protected bottom: DomMatrixElement;
    protected bottomLeft: DomMatrixElement;
    protected bottomRight: DomMatrixElement;
    protected center: DomMatrixElement;
    protected rotationAxis: DomMatrixElement;
    protected rotationBtn: DomMatrixElement;


    protected border: DomMatrixElement;
    protected buttons: DomMatrixElement[]
    //--------
    protected resizing: boolean = false;
    protected resizingX: boolean = false;
    protected resizingY: boolean = false;
    protected movingAxis: boolean = false;
    protected rotating: boolean = false;
    protected currentBtn: DomMatrixElement;
    //---------

    constructor() {
        super("div", {
            zIndex: 9999999999,

        });
        this.html.style.zIndex = "" + 999999;
        this.createButtons();
        document.body.addEventListener("mouseup", () => {
            this.resizing = this.resizingX = this.resizingY = this.movingAxis = this.rotating = false;
        })
        document.body.addEventListener("mousemove", () => {
            if (this.resizing) this.applyResizing();
            else if (this.movingAxis) this.applyMoveRotationAxis();
            else if (this.rotating) this.applyRotation();
        })
    }

    protected getDistance(a: { x: number, y: number }, b: { x: number, y: number }): number {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    protected getAngle(a: { x: number, y: number }, b: { x: number, y: number }): number {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.atan2(dy, dx);
    }

    protected startResizing() {
        const data = this.currentBtn.data;
        const axis = this.rotationAxis.getGlobalOrigin();
        const sideA = data.sideA.getGlobalOrigin();
        const sideB = data.sideB.getGlobalOrigin();
        data.sens = this.getSens({ x: this.stage.mouseX, y: this.stage.mouseY }, sideA, sideB)
        data.dist = this.getDistance({ x: this.stage.mouseX, y: this.stage.mouseY }, axis);

        //we keep the absolute values during startResizing and use them later in applyResizing
        //so even if if the scaleX/scaleY change its sign, it won't affect these values 
        data.sideAOrigin = sideA;
        data.sideBOrigin = sideB;

        console.log(data.sens, data.dist)
        data.startState = this.getMatrixInfos();
    }

    private inverseBorderAndButtonsScaleDimension() {
        this.border.width = Math.abs(this.width * this.scaleX);
        this.border.height = Math.abs(this.height * this.scaleY);
        this.border.scaleX = 1 / this.scaleX;
        this.border.scaleY = 1 / this.scaleY;


        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].scaleX = 1 / this.scaleX;
            this.buttons[i].scaleY = 1 / this.scaleY;
        }
    }


    protected applyResizing() {

        const data = this.currentBtn.data;
        const btn = this.currentBtn.getGlobalOrigin();
        const opposite = data.opposite.getGlobalOrigin();
        const origin = this.rotationAxis.getGlobalOrigin();
        const sideA = data.sideAOrigin;
        const sideB = data.sideBOrigin;
        const pt = this.getClosestPointOnLine(this.stage.mouseX, this.stage.mouseY, btn, opposite);


        let resizingScale = this.getDistance(pt, origin) / data.dist;
        if (Math.abs(resizingScale) === 0) return;


        const sens = this.getSens({ x: this.stage.mouseX, y: this.stage.mouseY }, sideA, sideB)
        if (sens != data.sens) resizingScale *= -1;

        if (this.resizingX) this.scaleX = resizingScale;
        else if (this.resizingY) this.scaleY = resizingScale;
        else this.scaleX = this.scaleY = resizingScale;

        this.inverseBorderAndButtonsScaleDimension();
        this.stage.update();
    }




    protected startMoveRotationAxis() {

    }
    protected applyMoveRotationAxis() {

    }

    protected startRotation() {

    }
    protected applyRotation() {

    }


    public init(obj: MatrixInfos) {
        this.width = this.border.width = obj.width;
        this.height = this.border.height = obj.height;
        this.x = obj.x;
        this.y = obj.y;
        this.scaleX = obj.scaleX;
        this.scaleY = obj.scaleY;
        this.rotation = obj.rotation;

        if (obj.align) {
            this.align.x = obj.align.x;
            this.align.y = obj.align.y;
        } else {
            this.align = Axis.CENTER;
        }

        if (obj.alignFromContainer) {
            this.alignFromContainer.x = obj.alignFromContainer.x;
            this.alignFromContainer.y = obj.alignFromContainer.y;
        } else {
            obj.alignFromContainer = Axis.CENTER;
        }

        if (obj.axis) {
            this.axis.x = obj.axis.x;
            this.axis.y = obj.axis.y;
        } else {
            this.axis.x = this.axis.y = 0;
        }

        this.rotationAxis.x = this.axis.x;
        this.rotationAxis.y = this.axis.y;

        const buttons = this.buttons;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].x = buttons[i].data.position.x * obj.width;
            buttons[i].y = buttons[i].data.position.y * obj.height;

        }
    }

    private getClosestPointOnLine(mouseX: number, mouseY: number, p0: { x: number, y: number }, p1: { x: number, y: number }) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const t = ((mouseX - p0.x) * dx + (mouseY - p0.y) * dy) / (dx * dx + dy * dy);
        const closestX = p0.x + t * dx;
        const closestY = p0.y + t * dy;
        return { x: closestX, y: closestY };
    }

    private getSens(A: { x: number, y: number }, B: { x: number, y: number }, C: { x: number, y: number }): number {
        // Calcul des vecteurs AB et AC
        const vectorAB: { x: number, y: number } = { x: B.x - A.x, y: B.y - A.y };
        const vectorAC: { x: number, y: number } = { x: C.x - A.x, y: C.y - A.y };

        // Calcul du produit vectoriel
        const crossProduct: number = vectorAB.x * vectorAC.y - vectorAB.y * vectorAC.x;

        if (crossProduct > 0) {
            return 1; // A est du côté gauche de la ligne BC
        } else if (crossProduct < 0) {
            return -1; // A est du côté droit de la ligne BC
        } else {
            return 0; // A est sur la ligne BC
        }
    }

    protected createButtons() {



        const createButton = (size: number, func: (btn: DomMatrixElement) => void, axis?: DOMPoint, style?: any) => {
            const btn = new DomMatrixElement("div", {
                cursor: "pointer",
                userSelect: "none",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: "solid 0.5px #333333",
                ...style
            })
            if (axis) btn.data.position = { x: axis.x - 0.5, y: axis.y - 0.5 };
            //btn.noScale = true;
            btn.width = btn.height = size;
            btn.align = Axis.CENTER;
            btn.alignFromContainer = Axis.CENTER;

            btn.addEventListener("mousedown", (e) => {
                func(btn);
            })

            this.appendChild(btn);

            return btn;
        }

        const resize = (btn: DomMatrixElement) => {
            this.currentBtn = btn;
            this.resizing = true;
            this.resizingX = btn == this.left || btn == this.right;
            this.resizingY = btn == this.top || btn == this.bottom;

            this.startResizing();


        }
        const moveAxis = (btn: DomMatrixElement) => {
            this.currentBtn = btn;
            this.startMoveRotationAxis();
        }
        const rotate = (btn: DomMatrixElement) => {
            this.currentBtn = btn;
            this.startRotation();
        }

        this.border = this.appendChild(new DomMatrixElement("div", {
            outline: "solid 1px #ffffff",

        }))
        //this.border.noScale = true;

        const anchorSize = 10;
        const buttons = this.buttons = []
        let nb = 0;

        this.top = buttons[nb++] = createButton(anchorSize, resize, Axis.TOP);
        this.topLeft = buttons[nb++] = createButton(anchorSize, resize, Axis.TOP_LEFT);
        this.topRight = buttons[nb++] = createButton(anchorSize, resize, Axis.TOP_RIGHT);
        this.left = buttons[nb++] = createButton(anchorSize, resize, Axis.LEFT);
        this.right = buttons[nb++] = createButton(anchorSize, resize, Axis.RIGHT);
        this.bottom = buttons[nb++] = createButton(anchorSize, resize, Axis.BOTTOM);
        this.bottomLeft = buttons[nb++] = createButton(anchorSize, resize, Axis.BOTTOM_LEFT);
        this.bottomRight = buttons[nb++] = createButton(anchorSize, resize, Axis.BOTTOM_RIGHT);

        const setOpposite = (a: DomMatrixElement, b: DomMatrixElement, sideA: DomMatrixElement, sideB: DomMatrixElement) => {
            a.data.opposite = b;
            b.data.opposite = a;
            a.data.sideA = b.data.sideB = sideA;
            a.data.sideB = b.data.sideA = sideB;

        }
        setOpposite(this.top, this.bottom, this.left, this.right);
        setOpposite(this.topLeft, this.bottomRight, this.bottomLeft, this.topRight);
        setOpposite(this.left, this.right, this.top, this.bottom);
        setOpposite(this.bottomLeft, this.topRight, this.topLeft, this.bottomRight);



        const axisSize = 14;
        this.rotationAxis = buttons[nb++] = createButton(axisSize, moveAxis, Axis.CENTER, { backgroundColor: "#66ff66" })

        const rotationBtnSize = 18;
        this.rotationBtn = buttons[nb++] = createButton(rotationBtnSize, rotate, Axis.TOP);
        this.rotationBtn.axis.y = 30;





        const label = new DomMatrixElement("div", {
            color: "#00ff00",
            fontSize: "25px",
        })
        label.text = "Hello World !"
        this.appendChild(label);

    }

}