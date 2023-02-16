import {
    ElementType,
    HTMLElementType,
    Component,
} from "../model/Element.model";
import { applyStyles } from "./applyStyles";
import {
    convertEvent,
    getDataAttr,
    isClassList,
    isDataAttr,
    isEvent,
    isPrimitive,
    isState,
} from "./utils";
const customElements: any = {};
export const createCustomElement = (key: string, definition: Function) => {
    customElements[key] = definition;
};
export const createElement = (
    type: ElementType | Component,
    props: any,
    ...children: (Element | string | Element[] | Text)[]
): Element | Record<string, any> => {
    let el: Element;
    const attr: any = {};
    let provide = (context: any) => {
        Object.assign(attr, context);
        return attr;
    };
    if (typeof type == "string") {
        if (customElements[type]) {
            return wrapElement(
                customElements[type]({ ...props, children, provide }),
                attr
            );
        }
        el = createHTMLNode(type as HTMLElementType, props);
    } else if (isState(type)) {
        el = type(props);
    } else {
        return wrapElement(type({ ...props, children, provide }), attr);
    }
    //TODO how do I handle conditional rendering of elements?
    let mapChild = (child: any, i?: number): Element | Element[] | Text => {
        switch (true) {
            //TODO handle undefined case
            case isPrimitive(child):
                return createTextNode(child);
            case child instanceof Array && !isState(child):
                return child.map(mapChild).flat();
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
                // console.log(children);
                return wrapElement(
                    child({
                        ...props,
                        ...attr,
                        provide,
                        siblings: {
                            before: children.slice(0, i),
                            after: children.slice(i + 1),
                        },
                        children: [],
                    }),
                    attr
                );
            default:
                return child;
        }
    };
    let body = children.map(mapChild).flat();
    el.append(...body);

    return wrapElement(el, attr);
};

export const createFragment = ({ children }) => {
    return children.flat();
};
export const createHTMLNode = (type: HTMLElementType, props?: any) => {
    let el = document.createElement(type);
    let keys = props ? Object.keys(props) : [];
    let mapProps;
    keys.forEach(
        (mapProps = (key: string) => {
            let value = props[key];
            switch (true) {
                case key == "style": {
                    applyStyles(el, value);
                    break;
                }
                case isEvent(key): {
                    let event = convertEvent(key);
                    el.addEventListener(event, value);
                    break;
                }
                case isDataAttr(key): {
                    key = getDataAttr(key);
                    if (isState(value)) {
                        el.dataset[key] = value.value;
                        value((next: any) => (el.dataset[key] = next));
                    } else {
                        el.dataset[key] = value;
                    }
                    break;
                }
                case isState(value): {
                    //@ts-ignore
                    value((next) => (el[key] = next));
                    //@ts-ignore
                    el[key] = value.value;
                    break;
                }
                case isClassList(key): {
                    let classNames = Object.keys(value);
                    classNames.forEach((className: string) => {
                        let showValue = value[className];
                        if (isState(showValue)) {
                            el.classList.toggle(className, !!showValue.value);
                            showValue((next: any) =>
                                el.classList.toggle(className, !!next)
                            );
                        } else {
                            el.classList.toggle(className, !!showValue);
                        }
                    });
                    break;
                }
                default: {
                    //@ts-ignore
                    el[key] = value;
                }
            }
        })
    );
    return el;
};

export const createTextNode = (text: string) => {
    let el = document.createTextNode(text);
    return el;
};

export const wrapElement = (el: Element, output: any) => {
    return new Proxy(el, {
        get(_, prop) {
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
// TODO need to create a way to do component cleanup when element is unmounted
// TODO work on types for outputs
// TODO create type for output element
//TODO need to handle aria-labels, data-attributes, and look into why things like width dont work.
//TODO handle assigning arrays for class and id properties to be space seperated string
//TODO handle className / class property assigning
