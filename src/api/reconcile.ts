import * as ElementModel from "../models/Element.model";
import { Effect, Thread } from "../models/Render.model";
import {
    getDeletions,
    getWipRoot,
    setCurrentRoot,
    setWipRoot,
} from "./concurrency";

export const commitRoot = () => {
    let root = getWipRoot();
    let deletions = getDeletions();
    deletions?.forEach(commitWork);
    commitWork(root?.child);
    setCurrentRoot(root);
    setWipRoot(null);
};

export const commitWork = (thread?: Thread) => {
    if (!thread) {
        return;
    }
    let domParentThread = thread.parent;
    while (!domParentThread?.dom) {
        domParentThread = domParentThread?.parent;
    }
    const domParent = domParentThread?.dom;

    if (thread.dom && thread.effect == Effect.PLACE)
        domParent?.appendChild(thread.dom);
    else if (thread.dom && thread.effect == Effect.UPDATE)
        updateDom(thread.dom, thread.alternate?.props, thread.props);
    else if (thread.dom && thread.effect == Effect.DELETE)
        commitDeletion(thread, domParent as Element);
    commitWork(thread.child);
    commitWork(thread.sibling);
};

export const reconcileChildren = (
    thread: Thread,
    elements: ElementModel.Element[]
) => {
    let index = 0;
    let prevSibling: Thread = null as unknown as Thread;
    let oldThread: Thread = (thread.alternate &&
        thread.alternate.child) as unknown as Thread;
    let deletions = getDeletions();

    while (index < elements.length || oldThread != null) {
        const element = elements[index];
        let newThread: Thread | null = null;
        const sameType = oldThread && element && element.type == oldThread.type;
        if (sameType) {
            newThread = {
                type: oldThread.type,
                props: element.props,
                dom: oldThread.dom,
                parent: thread,
                alternate: oldThread,
                effect: Effect.UPDATE,
            };
        }
        if (element && !sameType) {
            newThread = {
                type: element.type,
                props: element.props,
                dom: null as unknown as Element,
                parent: thread,
                alternate: null as unknown as Thread,
                effect: Effect.PLACE,
            };
        }
        if (oldThread && !sameType) {
            oldThread.effect = Effect.DELETE;
            deletions?.push(oldThread);
        }
        if (oldThread) {
            oldThread = oldThread.sibling as Thread;
        }

        if (index === 0) {
            thread.child = newThread as Thread;
        } else if (element) {
            prevSibling.sibling = newThread as Thread;
        }

        prevSibling = newThread as Thread;
        index++;
    }
};

const commitDeletion = (thread: Thread, domParent: Element) => {
    if (thread?.dom) {
        domParent.removeChild(thread?.dom);
    } else {
        commitDeletion(thread?.child as Thread, domParent);
    }
};

const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew =
    (prev: ElementModel.ElementProps, next: ElementModel.ElementProps) =>
    (key: string) =>
        prev[key] !== next[key];
const isGone =
    (prev: ElementModel.ElementProps, next: ElementModel.ElementProps) =>
    (key: string) =>
        !(key in next);

const updateDom = (
    dom: Element | Text,
    prevProps: ElementModel.ElementProps = { children: [] },
    nextProps: ElementModel.ElementProps = { children: [] }
) => {
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            (key) => !(key in nextProps) || isNew(prevProps, nextProps)(key)
        )
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            //@ts-ignore
            dom[name] = "";
        });
    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            //@ts-ignore
            dom[name] = nextProps[name];
        });
    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
};
