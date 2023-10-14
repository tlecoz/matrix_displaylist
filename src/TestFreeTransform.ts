import { DomMatrixElementStage } from "./displayListMatrix/DomMatrixElement";
import { FreeTransform2 } from "./displayListMatrix/FreeTransform2";

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




        const center = document.createElement("div");
        center.style.backgroundColor = "#6666ff";
        center.style.outline = "solid 2px #ffffff"
        center.style.width = "20px";
        center.style.height = "20px";
        center.style.position = "absolute";
        center.style.left = (obj.x - 10) + "px";
        center.style.top = (obj.y - 10) + "px";
        center.style.zIndex = "0";

        this.html.appendChild(center);

        const transform = new FreeTransform2();
        this.appendChild(transform);
        transform.init(obj)



    }



}