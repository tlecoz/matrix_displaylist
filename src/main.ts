import { App } from "./App";
import { TestApp } from "./TestApp";
import { TestFreeTransform } from "./TestFreeTransform";
import { DivElement } from "./display/DivElement";


//const app = new App(window.innerWidth, window.innerHeight);

//const test = new TestApp();
const test = new TestFreeTransform();

const animate = () => {
  test.update();
  //app.update();
  requestAnimationFrame(animate);
}
animate()

