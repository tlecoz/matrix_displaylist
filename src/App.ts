import { DivElement } from "./display/DivElement";
import { DivGroup } from "./display/DivGroup";
import { StageDiv } from "./display/StageDiv";
import { FreeTransform } from "./freeTransform/FreeTransform";

export class App {


    private stage: StageDiv;
    private freeTransform: FreeTransform;



    constructor(w, h) {
        this.stage = new StageDiv(w, h, true)

        this.freeTransform = new FreeTransform();




        this.stage.appendChild(this.freeTransform);

        this.freeTransform.init({
            x: 400,
            y: 400,
            width: 200,
            height: 300,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        })

        this.freeTransform.init({
            x: 400,
            y: 400,
            width: 200,
            height: 300,
            scaleX: 1.5,
            scaleY: 1,
            rotation: 0
        })


    }
    public update() {


        this.stage.drawElements()
    }

    /*

    
    private stage: StageDiv;
    private redSquare: DivElement;
    private group: DivGroup;
    private group2: DivGroup;

    constructor(w, h) {
        this.stage = new StageDiv(w, h, true)


        this.group2 = new DivGroup();
        this.group = new DivGroup();
        this.group2.appendChild(this.group);

        for (let i = 0; i < 5; i++) {
            let redSquare = new DivElement();
            redSquare.test(200, 200);
            if (i == 0) this.redSquare = redSquare
            //redSquare.rotation = i * 20;
            //redSquare.xAxis = 50 + 100 * i;
            //redSquare.style.height = (200 + i * 20) + "px"
            //redSquare.x = i * 50;
            redSquare.y = i * redSquare.height;
            //redSquare.align(DivAlign.CENTER);

            //this.group.x = this.group.y = 300;
            this.group.appendChild(redSquare)

        }
        //this.redSquare.scaleX = this.redSquare.scaleY = 0.001

        this.stage.appendChild(this.group2);


    }




    
    public update() {

        this.group2.x = 100;
        //this.group2.scaleX = 1.5;
        this.group2.yAxis = 0;
        //this.group2.rotation--;


        this.group.x = 300;
        //this.group.scaleY = 0.5;
        //this.group.xAxis = -100;
        //this.group.yAxis = -100;

        //this.group.scaleY = 1;
        //this.group.rotation++

        this.group.children[2].rotation++;
        //this.redSquare.scaleX += 0.01;
        var r = this.redSquare.html.getBoundingClientRect();

        //this.redSquare.style.height = r.height + "px";
        this.redSquare.scaleX -= (this.redSquare.scaleX - 1) * 0.01
        this.redSquare.scaleY = this.redSquare.scaleX
        //this.redSquare.rotation++// = 360 - this.group.rotation;
        //this.redSquare.xAxis++;

        //console.log(this.redSquare.globalX, this.redSquare.globalY)
        this.stage.drawElements()
    }
    */






    /*
    private stage: Stage;
    private redSquare: DisplayElement;
    private group: DisplayGroup;
    constructor(w: number, h: number) {

        this.stage = new Stage(w, h, true);

        let bmp = document.createElement("canvas");
        bmp.width = bmp.height = 150;
        bmp.getContext("2d").fillStyle = "#0000ff";
        bmp.getContext("2d").fillRect(0, 0, 150, 150);

        bmp.getContext("2d").fillStyle = "#ff0000";
        bmp.getContext("2d").font = "20px Arial"
        bmp.getContext("2d").fillText("AAAAAAAA", 0, 20, 150)


        this.group = new DisplayGroup();
        let redSquare = this.redSquare = new DisplayElement(200, 200);
        redSquare.align(Align.CENTER);
        redSquare.render = (context: CanvasRenderingContext2D) => {
            //context.fillStyle = "#ff0000";
            //context.fillRect(0, 0, 1, 1);
            context.scale(1 / bmp.width, 1 / bmp.height);
            context.drawImage(bmp, 0, 0);
        }

        redSquare.x = 300
        redSquare.y = 200;

        this.group.appendChild(redSquare);
        this.stage.appendChild(this.group);
    }

    public update() {
        //this.group.x++;
        //this.group.scaleX += 0.01;
        //this.redSquare.scaleX += 0.01;
        this.redSquare.rotation++;
        this.stage.drawElements()
    }
    */

}