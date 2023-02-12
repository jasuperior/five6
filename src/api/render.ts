import { ElementType, Element, NodeType } from "../models/Element.model";
import { Thread } from "../models/Render.model";
import {
    createDeletions,
    getCurrentRoot,
    setThread,
    setWipRoot,
} from "./concurrency";

export const createDom = (element: Thread) => {
    const dom =
        element.type == NodeType.TEXT_NODE
            ? document.createTextNode("")
            : document.createElement(element.type);
    const isProperty = (key: string) => key !== "children";
    Object.keys(element.props)
        .filter(isProperty)
        .forEach((name) => {
            //can be refactored to have better application
            //@ts-ignore
            dom[name] = element.props[name];
        });

    return dom;
};

export const render = (element: Element, container: string | HTMLElement) => {
    const dom =
        container instanceof HTMLElement
            ? container
            : document.querySelector(container) || undefined;

    let root: Thread = {
        type: null as unknown as ElementType,
        dom,
        props: {
            children: [element],
        },
        alternate: getCurrentRoot() as unknown as Thread,
    };
    setWipRoot(root);
    createDeletions();
    setThread(root);
};
