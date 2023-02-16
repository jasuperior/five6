import * as Five6 from "../api/createElement";
import { state, map, product } from "@oneii3/4iv";
import { ElementProps } from "../model/Element.model";
import { getTransformKeyValue } from "../api/utils";

let globalState = state("Global");
let ExampleComponent = ({
    provide,
    style,
    children,
    siblings,
}: Partial<ElementProps>) => {
    let innerState = state("Inner");
    let innerEl = map(<div></div>);
    provide({ innerState, innerEl });
    console.log(siblings, children);
    return (
        <div style={{ ...style, color: "blue" }} id="hello">
            <h1>{children}</h1>
            <span>{globalState}</span>
            {[" to ", innerState, innerEl]}
        </div>
    ) as HTMLElement;
};

let ObjectComponent = ({ children }: Partial<ElementProps>) => {
    return { a: 1, b: 2, children };
};
Five6.createCustomElement("different", ExampleComponent);
// let element = <ExampleComponent />;
// let obj = <ObjectComponent> dsfsdfsdf {"goodbye"} </ObjectComponent>;
// obj; //?
// element.outerHTML; //?
// globalState("Changed");
// element.innerEl(<div>Something Else</div>);
// element.outerHTML; //?

let isGoodbye = state<boolean | Record<any, any>>(false);
let goodbyeName = product(() => isGoodbye.name || isGoodbye.a, [isGoodbye]);
let deg = state(0.6);
let classedEl = (
    <div
        classList={{ hello: true, goodbye: isGoodbye }}
        data-goodbye={goodbyeName}
        style={{
            border: ["thin", "solid", "blue"],
            // x: 1,
            // z: 32,
            // rx: deg,
            scaleY: deg,
            position: "absolute",
            // perspectiveOrigin: "center center",
            // borderBottom: ["thin", "dashed", "black"],
        }}
    >
        <span></span> left {ExampleComponent} right
    </div>
);
deg(() => console.log(classedEl.outerHTML));
classedEl.outerHTML; //?

// deg(0.8);
