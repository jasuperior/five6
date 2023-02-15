import { Action } from "@oneii3/4iv";

export const isState = (value: any) => {
    return (
        value[Action.Type] == Action.Type ||
        (typeof value == "function" && !(value instanceof Function))
    );
};
export const isEvent = (key: string) => {
    return !!key.match(/^on\W/);
};
export const isPrimitive = (value: any) => {
    return (
        typeof value == "string" ||
        typeof value == "number" ||
        typeof value == "boolean"
    );
};
export const convertEvent = (key: string) => {
    let event = key.replace(/^on/, "");
    let firstChar = event[0];
    return event.replace(/^[A-Z]/, firstChar.toLowerCase());
};
export const shouldConvertToPx = (key: string) => pixelStyles.has(key);

const pixelStyles = new Set([
    "height",
    "maxHeight",
    "minHeight",
    "width",
    "maxWidth",
    "minWidth",
    "bottom",
    "top",
    "left",
    "right",
    "margin",
    "marginRight",
    "marginLeft",
    "marginTop",
    "marginBottom",
    "padding",
    "paddingRight",
    "paddingLeft",
    "paddingTop",
    "paddingBottom",
    "fontSize",
    "x",
    "y",
    "outlineWidth",
    "borderWidth",
    "letterSpacing",
    "gap",
    "cx",
    "cy",
]);
