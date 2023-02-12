import * as ElementModel from "./Element.model";

export interface Thread extends ElementModel.Element {
    dom?: Element | Text;
    parent?: Thread;
    sibling?: Thread;
    child?: Thread;
    alternate?: Thread;
    effect?: Effect;
}

export enum Effect {
    DELETE,
    UPDATE,
    PLACE,
}
