import { Axis, DomMatrixElement, DomMatrixElementStage } from "./displayListMatrix/DomMatrixElement";

export class TestApp extends DomMatrixElementStage {


    private greenSquare: DomMatrixElement;


    constructor() {
        super()

        document.body.appendChild(this.html);



        let o = this.greenSquare = new DomMatrixElement("div", {
            backgroundColor: "rgba(0,255,0,0.5)",

        })

        o.scaleX = 2;
        o.scaleY = 1;
        o.width = 550;
        o.height = 550;
        o.axis.x = 78//-0.5 * o.width;
        o.axis.y = 110//-0.5 * o.height;
        o.x = 123 + o.width * 0.5 * o.scaleX;
        o.y = 159 + o.height * 0.5 * o.scaleY;

        o.rotation = 45;



        o.align = Axis.CENTER;

        this.appendChild(o);
        this.update();
        let ori = o.getGlobalOrigin();



        console.log("OO = ", o.x, o.y, ori)







        let obj, oo;


        for (let i = 0; i < 2; i++) {

            for (let j = 0; j < 2; j++) {

                obj = new DomMatrixElement("div", { backgroundColor: "#ff0000", })


                obj.width = 200;
                obj.height = 200;

                obj.x = (50 + i * (obj.width + 50));
                obj.y = (50 + j * (obj.height + 50));


                oo = new DomMatrixElement("div", { backgroundColor: "#0000ff" })
                oo.width = oo.height = 50;
                //oo.x = 50;
                obj.appendChild(oo);


                this.greenSquare.appendChild(obj);
                //console.log(obj)
            }



        }
        oo.axis.x = 50
        //oo.align = Axis.TOP_LEFT;
        //oo.align = Axis.TOP_RIGHT;
        oo.align = Axis.CENTER;
        //oo.alignFromContainer = Axis.TOP_LEFT;
        oo.alignFromContainer = Axis.TOP_RIGHT;
        oo.alignFromContainer = Axis.CENTER;
        oo.style.backgroundColor = "#cccccc"
        //oo.noScale = true;


        const addObj = (target, x, y) => {
            let obj = new DomMatrixElement("div", { backgroundColor: "#ff00ff" });
            obj.width = obj.height = 10;
            obj.align = Axis.CENTER;
            obj.alignFromContainer = oo.align;


            obj.x = x / target.globalScaleX;
            obj.y = y / target.globalScaleY;
            obj.noScale = true;
            target.appendChild(obj);
        }

        addObj(oo, 20, 10);


        oo.addEventListener("click", (e) => {
            addObj(oo, oo.mouseX, oo.mouseY)
        })

        let bool = false;
        /*
        this.greenSquare.addEventListener("click", (e) => {
            bool = true;
            this.greenSquare.moveRotationAxis(this.greenSquare.mouseX, this.greenSquare.mouseY);
            addObj(this.greenSquare, this.greenSquare.mouseX, this.greenSquare.mouseY);

            //this.greenSquare.rotation += 10;
        })*/

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
        item.style.top = "700px"
        document.body.appendChild(item);


        /*o.addEventListener("click", (e) => {
            console.log(o.getBoundingRect())
            console.log(o.mouseX, o.mouseY)
        })*/

        this.onUpdate = () => {
            //console.log(this.greenSquare.mouseX, this.greenSquare.mouseY);
            item.innerText = Math.round(this.greenSquare.mouseX) + " | " + Math.round(this.greenSquare.mouseY)
            // console.log("mouse  = ", oo.mouseX, oo.mouseY)

            //oo.rotation++
            //obj.rotation++
            if (bool) o.rotation += 0.25
        }


        //this.update()
    }


}