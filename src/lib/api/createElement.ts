import {
    ElementType,
    HTMLElementType,
    Component,
} from "../model/Element.model";
import { applyStyles } from "./applyStyles";
import { convertEvent, isEvent, isState } from "./utils";

export const createElement = (
    type: ElementType | Component,
    props: any,
    ...children: (Element | string | Function)[]
): Element => {
    let el: Element;
    if (typeof type == "string") {
        el = createHTMLNode(type as HTMLElementType, props);
    } else {
        el = type(props);
    }
    //TODO how do I handle conditional rendering of elements?
    let body = children.flat().map((child) => {
        if (typeof child == "string") return createTextNode(child);
        else if (child instanceof Function) {
            //TODO
            throw Error("Cant handle functional children yet");
        } else {
            return child;
        }
    });
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
