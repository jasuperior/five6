import { isState, shouldConvertToPx } from "./utils";

export const applyStyles = (el: HTMLElement, styles: any) => {
    let keys = Object.keys(styles) as (keyof typeof el.style)[];
    keys.forEach((key) => {
        let value = styles[key];
        switch (true) {
            case isState(value): {
                value((next: any) => {
                    //@ts-ignore
                    el.style[key] = getStyleValue(key as string, next);
                });
                //@ts-ignore
                el.style[key] = getStyleValue(key as string, value.value);
            }
            default: {
                //@ts-ignore
                el.style[key] = getStyleValue(key, value);
            }
        }
    });
};

const getStyleValue = (key: string, value: any) => {
    switch (true) {
        case typeof value == "number": {
            if (shouldConvertToPx(key as string)) {
                value = `${value}px`;
            }
            break;
        }
        //TODO should handle other primitive types (some custom) maybe
        default: {
        }
    }
    return value;
};
