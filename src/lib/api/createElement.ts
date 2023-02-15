import {
    ElementType,
    HTMLElementType,
    Component,
    ElementProps,
} from "../model/Element.model";
import { applyStyles } from "./applyStyles";
import { convertEvent, isEvent, isPrimitive, isState } from "./utils";
import { state, map, Action } from "@oneii3/4iv";
import { Effect } from "../../react-like/models/Dom.model";

export const createElement = (
    type: ElementType | Component,
    props: any,
    ...children: (Element | string | Element[] | Text)[]
): Element => {
    let el: Element;
    const attr: any = {};
    let provide = (context: any) => {
        Object.assign(attr, context);
        // console.log(output)
        return attr;
    };
    if (typeof type == "string") {
        el = createHTMLNode(type as HTMLElementType, props);
    } else if (isState(type)) {
        el = type(props);
    } else {
        return wrapElement(type({ ...props, children, provide }), attr);
    }
    //TODO how do I handle conditional rendering of elements?
    let mapChild = (child: any): Element | Element[] | Text => {
        switch (true) {
            case isPrimitive(child):
                return createTextNode(child);
            // case Array.isArray(child):{

            // }
            case child instanceof Array && !isState(child):
                return child
                    .map((value: any) => {
                        let newChild = mapChild(value);
                        return newChild;
                    })
                    .flat();
            case isState(child): {
                let { value } = child;
                child((next: any) => {
                    let newChild = mapChild(
                        typeof next == "undefined" ? "" : next
                    );
                    //probabably need to iterate for arrays
                    if (Array.isArray(newChild)) {
                        resolveChildren(el, newChild, mappedChild as Element[]);
                    } else el.replaceChild(newChild, mappedChild as Element);
                    mappedChild = newChild;
                });
                let mappedChild = mapChild(
                    !value && value !== false ? "" : value
                );
                return mappedChild;
            }
            case child instanceof Function:
                throw Error("Cant handle functional children yet");
            default:
                return child;
        }
    };
    let body = children.map(mapChild).flat();
    el.append(...body);
    return wrapElement(el, attr);
};

export const createHTMLNode = (type: HTMLElementType, props?: any) => {
    let el = document.createElement(type);
    let keys = props ? Object.keys(props) : [];
    console.log(props);
    keys.forEach((key) => {
        let value = props[key];
        if (key == "style") {
            applyStyles(el, value);
        } else if (isEvent(key)) {
            let event = convertEvent(key);
            el.addEventListener(event, value);
        } else if (isState(value)) {
            //@ts-ignore
            value((next) => (el[key] = next));
            //@ts-ignore
            el[key] = value.value;
        } else {
            //@ts-ignore
            el[key] = value;
        }
    });
    return el;
};

export const createTextNode = (text: string) => {
    let el = document.createTextNode(text);
    return el;
};

export const wrapElement = (el: Element, output: any) => {
    return new Proxy(el, {
        get(target, prop) {
            let context = Reflect.has(output, prop) ? output : el;
            let value = Reflect.get(context, prop);
            if (prop == "colorState") console.log(prop, output);
            if (value instanceof Function) {
                return value.bind(context);
            }
            return value;
        },
    });
};
const resolveChildren = (
    element: Element,
    children: Element[],
    lastChildren: Element[]
) => {
    switch (true) {
        case children.length > lastChildren.length:
            children.map((child, i) => {
                let lastChild = lastChildren[i];

                if (!lastChild) {
                    children[i - 1].after(child);
                } else {
                    element.replaceChild(child, lastChild);
                }
                return child;
            });
            break;
        case lastChildren.length >= children.length:
            lastChildren.map((lastChild, i) => {
                let newChild = children[i];
                if (!newChild) {
                    lastChild.remove();
                } else {
                    element.replaceChild(newChild, lastChild);
                }
                return lastChild;
            });
            break;
    }
};
//TODO need to create a way to do component cleanup when element is unmounted

let globalcolor = state("black");
let ExampleComponent = ({ children, color, provide }: ElementProps) => {
    const colorState = state(color || globalcolor.value);
    globalcolor((next) => {
        if (next == "pink") colorState(next);
        else colorState(color || next);
    });

    provide({ colorState });
    return createElement(
        "div",
        { style: { color: colorState } },
        ...children,
        " cash"
    );
};

// let el = createElement(
//     ExampleComponent,
//     {},
//     "goodbye",
//     createElement(ExampleComponent, { color: "blue" }, "goodbye")
// );

// let examples = { a: 1, b: 2 };
// let el2 = createElement(ExampleComponent, {}, "new element");
// // let el3 = new Proxy(el2, {});
// globalcolor("blue");
// //TODO work on types for outputs
// TODO create type for output element
// el2.colorState("wheat"); //?
// el.append(el2);

// el.outerHTML; //?
//TODO need to handle aria-labels, data-attributes, and look into why things like width dont work.
//TODO handle assigning arrays for class and id properties to be space seperated string
//TODO handle className / class property assigning
