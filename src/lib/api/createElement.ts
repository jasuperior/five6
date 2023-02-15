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
    if (typeof type == "string") {
        el = createHTMLNode(type as HTMLElementType, props);
    } else if (isState(type)) {
        el = type(props);
    } else {
        return type({ ...props, children });
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
    return el;
};

export const createHTMLNode = (type: HTMLElementType, props: any) => {
    let el = document.createElement(type);
    let keys = Object.keys(props);
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
        }
    });
    return el;
};

export const createTextNode = (text: string) => {
    let el = document.createTextNode(text);
    return el;
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
let component = ({ children, color }: ElementProps) => {
    const colorState = state(color || globalcolor.value);
    globalcolor((next) => {
        if (next == "pink") colorState(next);
        else colorState(color || next);
    });
    return createElement(
        "div",
        { style: { color: colorState } },
        ...children,
        " cash"
    );
};

let el = createElement(
    component,
    {},
    "goodbye",
    createElement(component, { color: "blue" }, "goodbye")
);
el.outerHTML; //?
globalcolor("black");
el.outerHTML; //?
