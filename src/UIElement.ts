
export class UIElement {

    public html: HTMLElement;
    public htmlTag: string;
    public data: any;
    public parent: any;

    constructor(htmlTag: string = "div", style?: any) {
        this.htmlTag = htmlTag;
        this.html = document.createElement(htmlTag);
        (this.html as any).js = this;
        if (style) this.setStyle(style);
    }

    public click(): void { this.html.click(); }
    public set onclick(f: (element: UIElement) => void) {
        this.html.onclick = () => {
            f(this);
        };
    }
    public setStyle(css: any) {
        for (let z in css) if (css[z]) this.html.style[z] = css[z];
    }




    public set x(n: number) {
        this.style.left = n + "px";
    }
    public set y(n: number) {
        this.style.top = n + "px";
    }

    public get x(): number {
        return this.html.getBoundingClientRect().x;
    }
    public get y(): number {
        return this.html.getBoundingClientRect().y;
    }

    public get text(): string { return this.html.innerText; }
    public set text(s: string) { this.html.innerText = s; }


    public set height(n: number) {
        this.style.height = n + "px";
    }
    public set width(n: number) {
        this.style.width = n + "px";
    }

    public get height(): number {
        return this.html.getBoundingClientRect().height;
    }
    public get width(): number {
        return this.html.getBoundingClientRect().width;
    }

    public get style(): any { return this.html.style; }

    public get innerText(): string { return this.html.innerText; }
    public set innerText(s: string) { this.html.innerText = s; }

    private _display: string;
    public get visible(): boolean { return this.style.display !== "none"; }
    public set visible(b: boolean) {

        if (!b) {

            this._display = this.style.display;
            this.style.display = "none";
        } else {
            //console.log("style.display = ", this.style.display, this._display)
            if (this.style.display != "none") {
                if (this.style.display === "") {
                    this.style.display = "block";
                }
                this._display = this.style.display;
                return;
            }
            if (this._display === "none" || this.style.display === "none") {
                this._display = "block";
            }
            this.style.display = this._display;
        }
    }
    public get children(): any { return this.html.children }
    public appendChild(element: UIElement) {
        if (!element) return
        if (element instanceof HTMLElement) this.html.appendChild(element);
        else this.html.appendChild(element.html);
        element.parent = this;
        return element;
    }
    public removeChild(element: UIElement) {
        if (!element) return

        /*if (element instanceof HTMLElement) this.html.removeChild(element);
        else*/ this.html.removeChild(element.html);
        element.parent = null;

        return element;
    }

    public addEventListener(eventName: string, func: any) {
        this.html.addEventListener(eventName, func)
    }
    public removeEventListener(eventName: string, func: () => void) {
        this.html.removeEventListener(eventName, func);
    }
}   