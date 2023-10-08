import { App } from "./App";
import { DivElement } from "./display/DivElement";


const app = new App(window.innerWidth, window.innerHeight);

const animate = () => {
  app.update();
  requestAnimationFrame(animate);
}
animate()

