import { DisplayElement } from "./display/DisplayElement";
import { Stage } from "./display/Stage";
import { DomMatrixElementStage } from "./displayListMatrix/DomMatrixElement";
import { FreeTransform } from "./displayListMatrix/FreeTransform";
import { Align } from "./geom/Align";

export class TestFreeTransform extends DomMatrixElementStage {


    constructor() {
        super("div", {
            backgroundColor: "#666666",
            width: "100vw",
            height: "100vh",
            zIndex: "1",
            margin: "150px"
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



        const transform = new FreeTransform();
        this.appendChild(transform);
        transform.init(obj)


        //--------------------------

        //const stage = new Stage(1000, 1000);
        //this.html.appendChild(stage.canvas)

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.height = 1000;
        this.html.appendChild(canvas);


        let bmp = document.createElement("canvas");
        bmp.width = obj.width
        bmp.height = obj.height;
        bmp.getContext("2d").fillStyle = "#0000ff";
        bmp.getContext("2d").fillRect(0, 0, bmp.width, bmp.height);
        bmp.getContext("2d").fillStyle = "#ff0000";
        bmp.getContext("2d").font = "20px Arial"
        bmp.getContext("2d").fillText("AAAAAAAA", 0, 20, bmp.width)



        const renderOnCanvas = () => {

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.save();
            const m = transform.canvasMatrix;
            ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
            ctx.drawImage(bmp, 0, 0);
            ctx.restore()

        }
        setTimeout(() => {
            renderOnCanvas()
        }, (1));



        const animate = () => {
            //renderOnCanvas();
            requestAnimationFrame(animate)
        }
        animate();

        //transform.addEventListener(FreeTransform2.CHANGED, () => {
        //renderOnCanvas()
        //})



    }



}