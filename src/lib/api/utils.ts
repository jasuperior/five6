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
    "border",
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
const trasnformStyles = new Set([
    "translate",
    "translateX",
    "translateY",
    "translateZ",
    "tx",
    "ty",
    "tz",
    "x",
    "y",
    "z",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "rx",
    "ry",
    "rz",
    "scale",
    "scaleX",
    "scaleY",
    "scaleZ",
    "sx",
    "sy",
    "sz",
]);
let transformKeyPattern = /^(r|t|s)?(otate|ranslate|cale)?([x-zX-Z])$/;
export const isTransform = (key: string) => {
    return trasnformStyles.has(key);
};
export const getTransformKeyValue = (key: string, value: any) => {
    let keyParts = key.match(transformKeyPattern);
    let keyType = keyParts[1];
    let transformValue = value;
    if (typeof transformValue == "number") {
        switch (keyType) {
            case "r":
                transformValue = `${value}deg`;
                break;
            case "t":
                transformValue = `${value}px`;
                break;
            case "s":
                transformValue = value;
                break;
            default:
                keyType = "t";
                transformValue = `${value}px`;
        }
    }
    return [(keyType ?? "") + keyParts[3].toLowerCase(), transformValue];
};
export const createTransformString = (t: any) => {
    return `translate3d(${t.tx ?? 0}, ${t.ty ?? 0}, ${t.tz ?? 0}) rotate3d(${
        t.rx ?? 0
    }, ${t.ry ?? 0}, ${t.rz ?? 0}) scale(${t.sx ?? 1}, ${t.sy ?? 1}, ${
        t.sz ?? 1
    })`;
};
export const isClassList = (key: string) => {
    return key == "classList";
};

export const isDataAttr = (key: string) => {
    return !!key.startsWith("data-");
};

export const getDataAttr = (key: string) => {
    return key.match(/data-(.+)/)?.[1];
};

export const canBeList = (key: string) => {};
