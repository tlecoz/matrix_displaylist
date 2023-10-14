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
        bmp.width = bmp.height = 150;
        bmp.getContext("2d").fillStyle = "#0000ff";
        bmp.getContext("2d").fillRect(0, 0, 150, 150);
        bmp.getContext("2d").fillStyle = "#ff0000";
        bmp.getContext("2d").font = "20px Arial"
        bmp.getContext("2d").fillText("AAAAAAAA", 0, 20, 150)


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
        stage.drawElements()



        transform.addEventListener(FreeTransform2.CHANGED, () => {
            item.init(transform.getMatrixInfos());
            stage.drawElements()
            //item.renderTransform(stage.context, transform.domMatrix);
        })



    }



}