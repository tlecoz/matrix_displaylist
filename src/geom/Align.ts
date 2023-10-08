import { Pt2D } from "./Pt2D";

export class Align {

    public static TOP_LEFT: Pt2D = new Pt2D(0, 0);
    public static TOP_CENTER: Pt2D = new Pt2D(0.5, 0);
    public static TOP_RIGHT: Pt2D = new Pt2D(1, 0);

    public static CENTER_LEFT: Pt2D = new Pt2D(0, 0.5);
    public static CENTER: Pt2D = new Pt2D(0.5, 0.5);
    public static CENTER_RIGHT: Pt2D = new Pt2D(1, 0.5);

    public static BOTTOM_LEFT: Pt2D = new Pt2D(0, 1);
    public static BOTTOM_CENTER: Pt2D = new Pt2D(0.5, 1);
    public static BOTTOM_RIGHT: Pt2D = new Pt2D(1, 1);

}
