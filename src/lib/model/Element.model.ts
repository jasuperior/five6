export enum NodeType {
    TEXT_NODE = "TEXT_NODE",
    STATE_NODE = "STATE_NODE",
    COMPONENT = "COMPONENT",
}
export enum SVGElementType {
    A = "a",
    ANIMATE = "animate",
    ANIMATE_MOTION = "animateMotion",
    ANIMATE_TRANSFORM = "animateTransform",
    CIRCLE = "circle",
    CLIP_PATH = "clipPath",
    DEFS = "defs",
    DESC = "desc",
    DISCARD = "discard",
    ELLIPSE = "ellipse",
    FE_BLEND = "feBlend",
    FE_COLOR_MATRIX = "feColorMatrix",
    FE_COMPONENT_TRANSFER = "feComponentTransfer",
    FE_COMPOSITE = "feComposite",
    FE_CONVOLVE_MATRIX = "feConvolveMatrix",
    FE_DIFFUSE_LIGHTING = "feDiffuseLighting",
    FE_DISPLACEMENT_MAP = "feDisplacementMap",
    FE_DISTANT_LIGHT = "feDistantLight",
    FE_DROP_SHADOW = "feDropShadow",
    FE_FLOOD = "feFlood",
    FE_FUNC_A = "feFuncA",
    FE_FUNC_B = "feFuncB",
    FE_FUNC_G = "feFuncG",
    FE_FUNC_R = "feFuncR",
    FE_GAUSSIAN_BLUR = "feGaussianBlur",
    FE_IMAGE = "feImage",
    FE_MERGE = "feMerge",
    FE_MERGE_NODE = "feMergeNode",
    FE_MORPHOLOGY = "feMorphology",
    FE_OFFSET = "feOffset",
    FE_POINT_LIGHT = "fePointLight",
    FE_SPECULAR_LIGHTING = "feSpecularLighting",
    FE_SPOTLIGHT = "feSpotlight",
    FE_TILE = "feTile",
    FE_TURBULENCE = "feTurbulence",
    FILTER = "filter",
    FOREIGN_OBJECT = "foreignObject",
    G = "g",
    IMAGE = "image",
    LINE = "line",
    LINEAR_GRADIENT = "linearGradient",
    MARKER = "marker",
    MASK = "mask",
    METADATA = "metadata",
    MPATH = "mpath",
    PATH = "path",
    PATTERN = "pattern",
    POLYGON = "polygon",
    POLYLINE = "polyline",
    RADIAL_GRADIENT = "radialGradient",
    RECT = "rect",
    SCRIPT = "script",
    SET = "set",
    STOP = "stop",
    STYLE = "style",
    SWITCH = "switch",
    SYMBOL = "symbol",
    TEXT = "text",
    TEXT_PATH = "textPath",
    TITLE = "title",
    TSPAN = "tspan",
    USE = "use",
    VIEW = "view",
}
export enum HTMLElementType {
    ARTICLE = "article",
    HEADER = "header",
    TABLE = "table",
    TR = "tr",
    TD = "td",
    TH = "th",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    A = "a",
    BUTTON = "button",
    CANVAS = "canvas",
    BODY = "body",
    BR = "br",
    BLOCKQUOTE = "blockquote",
    B = "b",
    CAPTION = "caption",
    CODE = "code",
    CAP = "cap",
    CITE = "cite",
    COL = "col",
    COLGROUP = "colgroup",
    DATA = "data",
    DATALIST = "datalist",
    DD = "dd",
    DEL = "del",
    DETAILS = "details",
    DIALOG = "dialog",
    DL = "dl",
    DT = "dt",
    DIV = "div",
    EM = "em",
    EMBED = "embed",
    FIELDSET = "fieldset",
    FIGCAPTION = "figcaption",
    FIGURE = "figure",
    FOOTER = "footer",
    FORM = "form",
    HEAD = "head",
    HR = "hr",
    I = "i",
    IFRAME = "iframe",
    IMG = "img",
    INPUT = "input",
    INS = "ins",
    KBD = "kbd",
    LABEL = "label",
    LEGEND = "legend",
    LI = "li",
    LINK = "link",
    MAIN = "main",
    MAP = "map",
    MARK = "mark",
    META = "meta",
    METER = "meter",
    NAV = "nav",
    NOSCRIPT = "noscript",
    OBJECT = "object",
    OL = "ol",
    OPTION = "option",
    OPTGROUP = "optgroup",
    OUTPUT = "output",
    P = "p",
    PARAM = "param",
    PICTURE = "picture",
    PRE = "pre",
    PROGRESS = "progress",
    Q = "q",
    RP = "rp",
    RT = "rt",
    RUBY = "ruby",
    S = "s",
    SAMP = "samp",
    SCRIPT = "script",
    SECTION = "section",
    SELECT = "select",
    SMALL = "small",
    SOURCE = "source",
    SPAN = "span",
    STRONG = "strong",
    STYLE = "style",
    SUB = "sub",
    SUMMARY = "summary",
    SUP = "sup",
    SVG = "svg",
    TBODY = "tbody",
    TEMPLATE = "template",
    TEXTAREA = "textarea",
    TFOOT = "tfoot",
    THEAD = "thead",
    TIME = "time",
    TITLE = "title",
    TRACK = "track",
    U = "u",
    UL = "ul",
    VAR = "var",
    VIDEO = "video",
}
export type ElementTypeUnion = HTMLElementType | SVGElementType | NodeType;
export type ElementType = `${ElementTypeUnion}`;
export interface ElementProps {
    // value?: string | number | boolean;
    children: (Element | Text)[];
    [key: string]: any;
}

export type Component = (props: ElementProps) => Element;
