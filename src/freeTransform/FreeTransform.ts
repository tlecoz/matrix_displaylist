import { DivElement } from "../display/DivElement";
import { DivGroup } from "../display/DivGroup";

export class FreeTransform extends DivGroup {

    public left: DivElement;
    public topLeft: DivElement;
    public bottomLeft: DivElement;

    public right: DivElement;
    public topRight: DivElement;
    public bottomRight: DivElement;

    constructor() {
        super();

        this.left = new DivElement()
    }




}