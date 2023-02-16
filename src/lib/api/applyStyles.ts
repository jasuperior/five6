import {
    createTransformString,
    getTransformKeyValue,
    isState,
    isTransform,
    shouldConvertToPx,
} from "./utils";

//TODO fix perspective properties
export const applyStyles = (el: HTMLElement, styles: any) => {
    let keys = Object.keys(styles);
    let transforms: any = undefined;
    //handle multi-value properties
    keys.forEach((key) => {
        let value = styles[key];
        switch (true) {
            case isTransform(key): {
                if (!transforms) transforms = {};
                let isStateful = isState(value);
                let [transform, transformValue] = getTransformKeyValue(
                    key,
                    isStateful ? value.value : value
                );
                transforms[transform] = transformValue;
                if (isStateful) {
                    value((next) => {
                        transforms[transform] = getTransformKeyValue(
                            transform,
                            next
                        )?.[1];
                        el.style.setProperty(
                            "transform",
                            createTransformString(transforms)
                        );
                    });
                }
                break;
            }
            case isState(value): {
                console.log(value, key);
                value((next: any) => {
                    el.style.setProperty(
                        key,
                        getStyleValue(key as string, next)
                    );
                });
                el.style.setProperty(
                    key,
                    getStyleValue(key as string, value.value)
                );
                break;
            }
            case !!key.match(/[a-z]+[A-Z]|perspective/): {
                console.log(key);
                el.style[key] = getStyleValue(key, value);
                break;
            }
            default: {
                // console.log(key, getStyleValue(key, value));
                el.style.setProperty(key, getStyleValue(key, value));
                break;
            }
        }
    });
    if (transforms) {
        el.style.setProperty("transform", createTransformString(transforms));
    }
};

const getStyleValue = (key: string, value: any) => {
    switch (true) {
        case typeof value == "number" && shouldConvertToPx(key as string): {
            value = `${value}px`;
            break;
        }
        case value instanceof Array: {
            //should
            value = value.map((v: any) => getStyleValue(key, v)).join(" ");
            break;
        }
        //TODO should handle other primitive types (some custom) maybe
        default: {
        }
    }
    return value;
};
