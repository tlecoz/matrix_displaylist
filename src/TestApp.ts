import { Axis, UIMatrix, UIMatrixStage } from "./displayListMatrix/UIMatrix";

export class TestApp extends UIMatrixStage {


    private greenSquare: UIMatrix;


    constructor() {
        super()

        document.body.appendChild(this.html);



        let o = this.greenSquare = new UIMatrix("div", {
            backgroundColor: "rgba(0,255,0,0.5)",
            width: '550px',
            height: '550px'
        })

        o.scaleX = 2;
        o.scaleY = 1;
        o.width = 550;
        o.height = 550;
        o.axis.x = 100//-0.5 * o.width;
        //o.axis.y = -0.5 * o.height;
        o.x = o.width * 0.5 * o.scaleX;
        o.y = o.height * 0.5 * o.scaleY;
        o.rotation = 45;


        o.align = Axis.CENTER;

        this.appendChild(o);









        let obj, oo;


        for (let i = 0; i < 2; i++) {

            for (let j = 0; j < 2; j++) {

                obj = new UIMatrix("div", { backgroundColor: "#ff0000", })


                obj.width = 200;
                obj.height = 200;

                obj.x = (50 + i * (obj.width + 50));
                obj.y = (50 + j * (obj.height + 50));


                oo = new UIMatrix("div", { backgroundColor: "#0000ff" })
                oo.width = oo.height = 50;
                //oo.x = 50;
                obj.appendChild(oo);


                this.greenSquare.appendChild(obj);
                //console.log(obj)
            }



        }
        oo.axis.x = 50
        oo.align = Axis.BOTTOM_LEFT;
        //oo.align = Axis.TOP_RIGHT;
        oo.alignFromContainer = Axis.BOTTOM_LEFT;
        oo.style.backgroundColor = "#cccccc"
        oo.noScale = true;



        let item = document.createElement("div");
        item.style.position = "absolute";
        item.style.zIndex = "" + 999999;
        item.style.left = (o.x) + "px"
        item.style.top = (o.y) + "px";
        item.style.width = item.style.height = "10px"
        item.style.backgroundColor = "#000000"
        document.body.appendChild(item)

        item = document.createElement("div");
        item.style.position = "absolute";
        item.style.zIndex = "" + 999999;
        item.style.left = (o.x - o.axis.x) + "px"
        item.style.top = (o.y - o.axis.y) + "px";
        item.style.width = item.style.height = "10px"
        item.style.backgroundColor = "#00cdff"
        document.body.appendChild(item)


        item = document.createElement("div");
        item.style.position = "absolute";
        item.style.top = "500px"
        document.body.appendChild(item);


        /*o.addEventListener("click", (e) => {
            console.log(o.getBoundingRect())
            console.log(o.mouseX, o.mouseY)
        })*/

        this.onUpdate = () => {
            console.log(oo.mouseX, oo.mouseY);
            item.innerText = Math.round(oo.mouseX) + " | " + Math.round(oo.mouseY)
            // console.log("mouse  = ", oo.mouseX, oo.mouseY)

            //oo.rotation++
            //obj.rotation++
            //o.rotation += 0.25
        }


        //this.update()
    }


}