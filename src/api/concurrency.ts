import { NodeType } from "../models/Element.model";
import { Thread } from "../models/Dom.model";
import { reconcileChildren } from "./reconcile";
import { createDom } from "./dom";

let nextUnitOfWork: Thread | null = null;
let wipRoot: Thread | null = null;
let currentRoot: Thread | null = null;
let deletions: Thread[] | null = null;
export const setThread = (thread: Thread | null = null) => {
    nextUnitOfWork = thread;
};
export const getThread = () => {
    return nextUnitOfWork;
};
export const setWipRoot = (thread: Thread | null = null) => {
    wipRoot = thread;
};
export const getWipRoot = () => {
    return wipRoot;
};
export const setCurrentRoot = (thread: Thread | null = null) => {
    currentRoot = thread;
};
export const getCurrentRoot = () => {
    return currentRoot;
};
export const createDeletions = () => {
    deletions = [];
};
export const getDeletions = () => {
    return deletions;
};

export const workLoop = (deadline: IdleDeadline) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
};

export const performUnitOfWork = (thread: Thread): Thread | null => {
    const isFunctionComponent = thread.type == NodeType.COMPONENT;
    if (isFunctionComponent) {
        updateFunctionComponent(thread);
    } else {
        updateHostComponent(thread);
    }
    if (thread.child) {
        return thread.child;
    }
    let nextThread: Thread | undefined = thread;
    while (nextThread) {
        if (nextThread.sibling) {
            return nextThread.sibling;
        }
        nextThread = nextThread.parent;
    }
    return null;
};

const updateFunctionComponent = (thread: Thread) => {
    const children = [thread.render?.(thread.props)];
    reconcileChildren(thread, children);
};
const updateHostComponent = (thread: Thread) => {
    if (!thread.dom) {
        thread.dom = createDom(thread);
    }
    reconcileChildren(thread, thread.props.children);
};

requestIdleCallback(workLoop);

// if (thread.parent) {
//     thread.parent?.dom?.appendChild(thread.dom);
// }
