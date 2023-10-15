import { DisplayElement } from "./display/DisplayElement";
import { Stage } from "./display/Stage";
import { DomMatrixElementStage } from "./displayListMatrix/DomMatrixElement";
import { FreeTransform2 } from "./displayListMatrix/FreeTransform2";
import { Align } from "./geom/Align";

export class TestFreeTransform extends DomMatrixElementStage {


    constructor() {
        super("div", {
            backgroundColor: "#666666",
            width: "100vw",
            height: "100vh",
            zIndex: "1"
        });
        document.body.appendChild(this.html);



        const obj = {
            x: 600,
            y: 300,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            width: 200,
            height: 300,
            axis: new DOMPoint(0, 0)
        }



        const transform = new FreeTransform2();
        this.appendChild(transform);
        transform.init(obj)


        //--------------------------

        const stage = new Stage(1000, 1000);
        this.html.appendChild(stage.canvas)

        let bmp = document.createElement("canvas");
        bmp.width = obj.width
        bmp.height = obj.height;
        bmp.getContext("2d").fillStyle = "#0000ff";
        bmp.getContext("2d").fillRect(0, 0, bmp.width, bmp.height);
        bmp.getContext("2d").fillStyle = "#ff0000";
        bmp.getContext("2d").font = "20px Arial"
        bmp.getContext("2d").fillText("AAAAAAAA", 0, 20, bmp.width)


        const item = new DisplayElement(obj.width, obj.height);
        item.rotation = obj.rotation;
        item.scaleX = obj.scaleX;
        item.scaleY = obj.scaleY;
        item.xAxis = obj.axis.x;
        item.yAxis = obj.axis.y;
        item.x = obj.x;
        item.y = obj.y;
        item.align(Align.CENTER)


        item.render = (ctx: CanvasRenderingContext2D) => {
            ctx.scale(1 / bmp.width, 1 / bmp.height);
            ctx.drawImage(bmp, 0, 0);

        }

        stage.appendChild(item);
        //stage.drawElements()


        const renderOnCanvas = () => {
            let ctx = stage.context;
            ctx.canvas.width = ctx.canvas.width;
            item.identity();
            ctx.save();
            const m = transform.canvasMatrix;

            /*
            const m = new DOMMatrix();
            const dw = transform.width * transform.scaleX - transform.width
            const dx = transform.x - obj.x;
            const dh = transform.height * transform.scaleY - transform.height
            const dy = transform.y - obj.y;
            */

            //m.translateSelf(-dx * 2 - dw * 0.5, -dy);



            ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
            //ctx.scale(1 / bmp.width, 1 / bmp.height)
            ctx.drawImage(bmp, 0, 0);
            ctx.restore()
        }
        setTimeout(() => {
            renderOnCanvas()
        }, (1));


        transform.addEventListener(FreeTransform2.CHANGED, () => {
            renderOnCanvas()
        })



    }



}