import {
    ElementProps,
    ElementType,
    Element,
    NodeType,
} from "../models/Element.model";

export const createElement = (
    type: ElementType,
    props: ElementProps,
    ...children: Element[]
): Element => {
    return {
        type,
        props: {
            ...props,
            chilren: children.map((child) => {
                typeof child == "object" ? child : createTextNode(child);
            }),
        },
    };
};

export const createTextNode = (value: string | number | boolean): Element => {
    //apparently react doesnt wrap primitibe values.
    //they leave them naked?
    return {
        type: NodeType.TEXT_NODE,
        props: {
            nodeValue: value,
            children: [],
        },
    };
};
