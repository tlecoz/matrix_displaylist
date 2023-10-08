export class Pt2D {

    public x: number;
    public y: number;
    public isCurveAnchor: boolean;

    public static X: Pt2D = new Pt2D(1, 0);
    public static Y: Pt2D = new Pt2D(0, 1);
    public static ZERO: Pt2D = new Pt2D(0, 0);

    constructor(x: number = 0, y: number = 0, isCurveAnchor: boolean = false) {
        this.x = x;
        this.y = y;
        this.isCurveAnchor = isCurveAnchor;
    }
    public equals(pt: Pt2D): boolean { return this.x == pt.x && this.y == pt.y }
    public add(pt: Pt2D): Pt2D { return new Pt2D(this.x + pt.x, this.y + pt.y) };
    public substract(pt: Pt2D) { return new Pt2D(this.x - pt.x, this.y - pt.y); }
    public multiply(pt: Pt2D): Pt2D { return new Pt2D(this.x * pt.x, this.y * pt.y) };
    public divide(pt: Pt2D): Pt2D { return new Pt2D(this.x / pt.x, this.y / pt.y) };
    public normalize(): Pt2D {
        let max = Math.sqrt(this.dot(this));
        return new Pt2D(this.x / max, this.y / max)
    }
    public dot(pt: Pt2D): number { return this.x * pt.x + this.y * pt.y };
    public greaterThan(pt: Pt2D): boolean {
        return this.x > pt.x || this.x == pt.x && this.y > pt.y;
    }

    public static distance(a: Pt2D, b: Pt2D): number {
        let dx: number = a.x - b.x;
        let dy: number = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }


}
