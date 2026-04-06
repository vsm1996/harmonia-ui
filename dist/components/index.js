"use client";
'use strict';

var react = require('react');
var ui = require('@harmonia-core/ui');
var tokens = require('@renge-ui/tokens');
var jsxRuntime = require('react/jsx-runtime');

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var SLIDER_STYLES = `
[data-renge-slider] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${tokens.rengeVars.space[1]};
  background: ${tokens.rengeVars.color.bgMuted};
  border-radius: ${tokens.rengeVars.radius.full};
  outline: none;
  cursor: pointer;
  transition: background ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out};
}
[data-renge-slider]:focus-visible {
  box-shadow: 0 0 0 2px ${tokens.rengeVars.color.bg}, 0 0 0 4px ${tokens.rengeVars.color.borderFocus};
}
[data-renge-slider]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* WebKit track */
[data-renge-slider]::-webkit-slider-runnable-track {
  height: ${tokens.rengeVars.space[1]};
  background: ${tokens.rengeVars.color.bgMuted};
  border-radius: ${tokens.rengeVars.radius.full};
}

/* WebKit thumb */
[data-renge-slider]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: ${tokens.rengeVars.space[3]};
  height: ${tokens.rengeVars.space[3]};
  margin-top: calc((${tokens.rengeVars.space[1]} - ${tokens.rengeVars.space[3]}) / 2);
  border-radius: ${tokens.rengeVars.radius.full};
  background: ${tokens.rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
    transform  ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-webkit-slider-thumb:hover {
  background: ${tokens.rengeVars.color.accentHover};
  transform: scale(1.2);
}
[data-renge-slider]:not(:disabled):active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox track */
[data-renge-slider]::-moz-range-track {
  height: ${tokens.rengeVars.space[1]};
  background: ${tokens.rengeVars.color.bgMuted};
  border-radius: ${tokens.rengeVars.radius.full};
  border: none;
}

/* Firefox thumb */
[data-renge-slider]::-moz-range-thumb {
  width: ${tokens.rengeVars.space[3]};
  height: ${tokens.rengeVars.space[3]};
  border-radius: ${tokens.rengeVars.radius.full};
  background: ${tokens.rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
    transform  ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-moz-range-thumb:hover {
  background: ${tokens.rengeVars.color.accentHover};
  transform: scale(1.2);
}
`;
var stylesInjected = false;
function Slider(_a) {
  var _b = _a, {
    className,
    value,
    defaultValue,
    min = 0,
    max = 100,
    step,
    onChange,
    disabled,
    style
  } = _b, props = __objRest(_b, [
    "className",
    "value",
    "defaultValue",
    "min",
    "max",
    "step",
    "onChange",
    "disabled",
    "style"
  ]);
  if (typeof document !== "undefined" && !stylesInjected) {
    const el = document.createElement("style");
    el.setAttribute("data-renge-slider-styles", "");
    el.textContent = SLIDER_STYLES;
    document.head.appendChild(el);
    stylesInjected = true;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    __spreadValues({
      "data-slot": "slider",
      "data-renge-slider": "",
      type: "range",
      className,
      value,
      defaultValue,
      min,
      max,
      step,
      disabled,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": value != null ? value : defaultValue,
      onChange: (e) => onChange == null ? void 0 : onChange(parseFloat(e.target.value)),
      style
    }, props)
  );
}
var BUTTON_STYLES = `
[data-renge-btn] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  border: none;
  outline: none;
  text-decoration: none;
  user-select: none;
  transition:
    background ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
    color ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
    box-shadow ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
    transform ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.spring};
}
[data-renge-btn]:active:not(:disabled) {
  transform: scale(0.97);
}
[data-renge-btn]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
[data-renge-btn]:focus-visible {
  box-shadow: 0 0 0 2px ${tokens.rengeVars.color.bg}, 0 0 0 4px ${tokens.rengeVars.color.borderFocus};
}

[data-renge-btn="default"]:hover:not(:disabled) { background: ${tokens.rengeVars.color.accentHover}; }
[data-renge-btn="destructive"]:hover:not(:disabled) { filter: brightness(1.1); }
[data-renge-btn="outline"]:hover:not(:disabled) {
  background: ${tokens.rengeVars.color.bgSubtle};
  border-color: ${tokens.rengeVars.color.accent};
  color: ${tokens.rengeVars.color.accent};
}
[data-renge-btn="secondary"]:hover:not(:disabled) { background: ${tokens.rengeVars.color.bgMuted}; }
[data-renge-btn="ghost"]:hover:not(:disabled) { background: ${tokens.rengeVars.color.bgSubtle}; }
[data-renge-btn="link"]:hover:not(:disabled) { color: ${tokens.rengeVars.color.accentHover}; }
`;
var variantStyles = {
  default: {
    background: tokens.rengeVars.color.accent,
    color: tokens.rengeVars.color.fgInverse
  },
  destructive: {
    background: tokens.rengeVars.color.danger,
    color: tokens.rengeVars.color.fgInverse
  },
  outline: {
    background: "transparent",
    color: tokens.rengeVars.color.fg,
    border: `1px solid ${tokens.rengeVars.color.border}`
  },
  secondary: {
    background: tokens.rengeVars.color.bgSubtle,
    color: tokens.rengeVars.color.fg
  },
  ghost: {
    background: "transparent",
    color: tokens.rengeVars.color.fg
  },
  link: {
    background: "transparent",
    color: tokens.rengeVars.color.accent,
    textDecoration: "underline",
    textUnderlineOffset: "3px"
  }
};
var sizeStyles = {
  default: {
    padding: `${tokens.rengeVars.space[2]} ${tokens.rengeVars.space[4]}`,
    fontSize: tokens.rengeVars.fontSize.sm,
    borderRadius: tokens.rengeVars.radius[2],
    gap: tokens.rengeVars.space[2]
  },
  sm: {
    padding: `${tokens.rengeVars.space[1]} ${tokens.rengeVars.space[3]}`,
    fontSize: tokens.rengeVars.fontSize.xs,
    borderRadius: tokens.rengeVars.radius[2],
    gap: tokens.rengeVars.space[1]
  },
  lg: {
    padding: `${tokens.rengeVars.space[3]} ${tokens.rengeVars.space[5]}`,
    fontSize: tokens.rengeVars.fontSize.base,
    borderRadius: tokens.rengeVars.radius[3],
    gap: tokens.rengeVars.space[2]
  },
  icon: {
    width: tokens.rengeVars.space[6],
    height: tokens.rengeVars.space[6],
    padding: tokens.rengeVars.space[2],
    borderRadius: tokens.rengeVars.radius[2],
    flexShrink: 0
  },
  "icon-sm": {
    width: tokens.rengeVars.space[5],
    height: tokens.rengeVars.space[5],
    padding: tokens.rengeVars.space[1],
    borderRadius: tokens.rengeVars.radius[2],
    flexShrink: 0
  },
  "icon-lg": {
    width: tokens.rengeVars.space[7],
    height: tokens.rengeVars.space[7],
    padding: tokens.rengeVars.space[3],
    borderRadius: tokens.rengeVars.radius[3],
    flexShrink: 0
  }
};
var stylesInjected2 = false;
function Button(_a) {
  var _b = _a, {
    className,
    variant = "default",
    size = "default",
    style
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "style"
  ]);
  if (typeof document !== "undefined" && !stylesInjected2) {
    const el = document.createElement("style");
    el.setAttribute("data-renge-button-styles", "");
    el.textContent = BUTTON_STYLES;
    document.head.appendChild(el);
    stylesInjected2 = true;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    __spreadValues({
      "data-slot": "button",
      "data-renge-btn": variant,
      className,
      style: __spreadValues(__spreadValues(__spreadValues({}, variantStyles[variant]), sizeStyles[size]), style)
    }, props)
  );
}
function Card(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card",
      className,
      style: __spreadValues({
        background: tokens.rengeVars.color.bgSubtle,
        border: `1px solid ${tokens.rengeVars.color.border}`,
        borderRadius: tokens.rengeVars.radius[4],
        boxShadow: `0 1px 3px color-mix(in oklch, ${tokens.rengeVars.color.fg} 8%, transparent)`,
        transition: `box-shadow ${tokens.rengeVars.duration[2]} ${tokens.rengeVars.easing.out}`,
        overflow: "hidden"
      }, style)
    }, props)
  );
}
function CardHeader(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-header",
      className,
      style: __spreadValues({
        padding: `${tokens.rengeVars.space[4]} ${tokens.rengeVars.space[4]} 0`,
        display: "grid",
        gridAutoRows: "min-content",
        gap: tokens.rengeVars.space[1]
      }, style)
    }, props)
  );
}
function CardTitle(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-title",
      className,
      style: __spreadValues({
        fontSize: tokens.rengeVars.fontSize.base,
        lineHeight: tokens.rengeVars.lineHeight.base,
        fontWeight: 600,
        color: tokens.rengeVars.color.fg
      }, style)
    }, props)
  );
}
function CardDescription(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-description",
      className,
      style: __spreadValues({
        fontSize: tokens.rengeVars.fontSize.sm,
        lineHeight: tokens.rengeVars.lineHeight.sm,
        color: tokens.rengeVars.color.fgSubtle
      }, style)
    }, props)
  );
}
function CardAction(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-action",
      className,
      style: __spreadValues({
        gridColumn: "2",
        gridRow: "1 / span 2",
        alignSelf: "start",
        justifySelf: "end"
      }, style)
    }, props)
  );
}
function CardContent(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-content",
      className,
      style: __spreadValues({
        padding: `0 ${tokens.rengeVars.space[4]} ${tokens.rengeVars.space[4]}`
      }, style)
    }, props)
  );
}
function CardFooter(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    __spreadValues({
      "data-slot": "card-footer",
      className,
      style: __spreadValues({
        display: "flex",
        alignItems: "center",
        padding: `0 ${tokens.rengeVars.space[4]} ${tokens.rengeVars.space[4]}`
      }, style)
    }, props)
  );
}
var variantStyles2 = {
  default: {
    background: tokens.rengeVars.color.accent,
    color: tokens.rengeVars.color.fgInverse
  },
  secondary: {
    background: tokens.rengeVars.color.accentSubtle,
    color: tokens.rengeVars.color.fg
  },
  destructive: {
    background: tokens.rengeVars.color.danger,
    color: tokens.rengeVars.color.fgInverse
  },
  outline: {
    background: "transparent",
    color: tokens.rengeVars.color.fg,
    border: `1px solid ${tokens.rengeVars.color.border}`
  }
};
var baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: `${tokens.rengeVars.space[1]} ${tokens.rengeVars.space[2]}`,
  borderRadius: tokens.rengeVars.radius.full,
  fontSize: tokens.rengeVars.fontSize.xs,
  lineHeight: tokens.rengeVars.lineHeight.xs,
  fontWeight: 500,
  whiteSpace: "nowrap",
  border: "none",
  transition: `background ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
               color ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out}`
};
function Badge(_a) {
  var _b = _a, {
    className,
    variant = "default",
    style
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "style"
  ]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    __spreadValues({
      "data-slot": "badge",
      className,
      style: __spreadValues(__spreadValues(__spreadValues({}, baseStyle), variantStyles2[variant]), style)
    }, props)
  );
}
var SELECT_STYLES = `
[data-renge-select]:focus {
  outline: none;
  border-color: ${tokens.rengeVars.color.borderFocus};
  box-shadow: 0 0 0 2px ${tokens.rengeVars.color.accentSubtle};
}
[data-renge-select]:hover:not(:disabled):not(:focus) {
  border-color: ${tokens.rengeVars.color.accent};
}
[data-renge-select]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
`;
var stylesInjected3 = false;
function Select(_a) {
  var _b = _a, {
    className,
    children,
    value,
    defaultValue,
    onChange,
    style
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "value",
    "defaultValue",
    "onChange",
    "style"
  ]);
  if (typeof document !== "undefined" && !stylesInjected3) {
    const el = document.createElement("style");
    el.setAttribute("data-renge-select-styles", "");
    el.textContent = SELECT_STYLES;
    document.head.appendChild(el);
    stylesInjected3 = true;
  }
  const handleChange = (e) => {
    var _a3;
    onChange == null ? void 0 : onChange(e);
    (_a3 = props.onValueChange) == null ? void 0 : _a3.call(props, e.target.value);
  };
  const _a2 = props, { onValueChange: _ } = _a2, restProps = __objRest(_a2, ["onValueChange"]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "select",
    __spreadProps(__spreadValues({
      "data-slot": "select",
      "data-renge-select": "",
      className,
      value,
      defaultValue,
      onChange: handleChange,
      style: __spreadValues({
        width: "100%",
        padding: `${tokens.rengeVars.space[2]} ${tokens.rengeVars.space[3]}`,
        background: tokens.rengeVars.color.bg,
        color: tokens.rengeVars.color.fg,
        border: `1px solid ${tokens.rengeVars.color.border}`,
        borderRadius: tokens.rengeVars.radius[2],
        fontSize: tokens.rengeVars.fontSize.sm,
        lineHeight: tokens.rengeVars.lineHeight.sm,
        cursor: "pointer",
        transition: `border-color ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out},
                     box-shadow ${tokens.rengeVars.duration[1]} ${tokens.rengeVars.easing.out}`
      }, style)
    }, restProps), {
      children
    })
  );
}
function SettingsIcon({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          }
        )
      ]
    }
  );
}
function CloseIcon({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M6 18L18 6M6 6l12 12"
        }
      )
    }
  );
}
function ResetIcon({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        }
      )
    }
  );
}
var CAPACITY_PRESETS = {
  exhausted: {
    label: "Exhausted",
    description: "Protective mode: stripped-back, no motion, no surprises",
    cognitive: 0.1,
    temporal: 0.1,
    emotional: 0.1,
    valence: -0.6,
    arousal: 0.1
  },
  overwhelmed: {
    label: "Overwhelmed",
    description: "High stress: minimal content, boosted contrast, soothing motion",
    cognitive: 0.2,
    temporal: 0.15,
    emotional: 0.2,
    valence: -0.5,
    arousal: 0.2
  },
  distracted: {
    label: "Distracted",
    description: "Short attention: fewer items, guided focus on key elements",
    cognitive: 0.35,
    temporal: 0.25,
    emotional: 0.5,
    valence: 0,
    arousal: 0.4
  },
  neutral: {
    label: "Neutral",
    description: "Balanced: medium density, subtle motion, gentle focus on key items",
    cognitive: 0.5,
    temporal: 0.5,
    emotional: 0.5,
    valence: 0,
    arousal: 0.5
  },
  focused: {
    label: "Focused",
    description: "Task-ready: full content, subtle motion, clear hierarchy",
    cognitive: 0.75,
    temporal: 0.75,
    emotional: 0.55,
    valence: 0.1,
    arousal: 0.6
  },
  energized: {
    label: "Energized",
    description: "Full engagement: dense layout, expressive animations, warm tone",
    cognitive: 0.9,
    temporal: 0.85,
    emotional: 0.85,
    valence: 0.6,
    arousal: 0.8
  },
  exploring: {
    label: "Exploring",
    description: "Maximum everything: all content, all animations, all features",
    cognitive: 1,
    temporal: 1,
    emotional: 1,
    valence: 0.8,
    arousal: 0.9
  }
};
var DEFAULT_CALM_STATE = {
  cognitive: 0.5,
  temporal: 0.5,
  emotional: 0.5,
  valence: 0,
  arousal: 0.5
};
function CapacityControls() {
  var _a;
  const [isOpen, setIsOpen] = react.useState(false);
  const { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, conflicts } = ui.useCapacityContext();
  const { hapticEnabled, sonicEnabled, setHapticEnabled, setSonicEnabled, fire: fireFeedback } = ui.useFeedback();
  const { field, mode } = ui.useDerivedMode();
  const energy = ui.useEnergyField();
  const attention = ui.useAttentionField();
  const valence = ui.useEmotionalValenceField();
  const modeLabel = ui.deriveModeLabel(field);
  const modeBadgeColor = ui.getModeBadgeColor(modeLabel);
  const handleReset = () => {
    updateCapacity({
      cognitive: DEFAULT_CALM_STATE.cognitive,
      temporal: DEFAULT_CALM_STATE.temporal,
      emotional: DEFAULT_CALM_STATE.emotional
    });
    updateEmotionalState({
      valence: DEFAULT_CALM_STATE.valence,
      arousal: DEFAULT_CALM_STATE.arousal
    });
  };
  const fireInteractionFeedback = react.useCallback(() => {
    fireFeedback("tap");
  }, [fireFeedback]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "fixed bottom-4 right-4 z-50", children: [
    !isOpen && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        Badge,
        {
          className: "shadow-lg",
          style: { backgroundColor: modeBadgeColor, color: "white" },
          children: modeLabel
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          onClick: () => setIsOpen(true),
          variant: "outline",
          size: "sm",
          className: "shadow-lg bg-background",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(SettingsIcon, { className: "w-4 h-4 mr-2" }),
            "Capacity"
          ]
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden",
        onClick: () => setIsOpen(false),
        "aria-hidden": "true"
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "w-80 shadow-xl max-h-[85vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { className: "text-sm font-semibold", children: "Capacity Controls" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 shrink-0",
                onClick: (e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                },
                "aria-label": "Close capacity controls",
                children: /* @__PURE__ */ jsxRuntime.jsx(CloseIcon, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Badge,
              {
                className: "text-xs",
                style: { backgroundColor: modeBadgeColor, color: "white" },
                children: modeLabel
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: isAutoMode ? "default" : "outline",
                size: "sm",
                className: "h-7 text-xs px-2",
                onClick: toggleAutoMode,
                "aria-label": isAutoMode ? "Switch to manual mode" : "Switch to auto mode",
                children: isAutoMode ? "Auto" : "Manual"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: isAutoMode ? "Signals are driving values automatically. Move any slider to take manual control." : "Adjust your state to see the UI adapt in real-time." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx("label", { className: "text-sm font-medium", children: "Quick Presets" }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            Select,
            {
              defaultValue: "",
              onValueChange: (value) => {
                if (!value) return;
                const preset = CAPACITY_PRESETS[value];
                updateCapacity({
                  cognitive: preset.cognitive,
                  temporal: preset.temporal,
                  emotional: preset.emotional
                });
                updateEmotionalState({ valence: preset.valence, arousal: preset.arousal });
                fireInteractionFeedback();
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", disabled: true, children: "Select a preset..." }),
                Object.entries(CAPACITY_PRESETS).map(([key, preset]) => /* @__PURE__ */ jsxRuntime.jsxs("option", { value: key, children: [
                  preset.label,
                  " \u2014 ",
                  preset.description
                ] }, key))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: "Or adjust individually:" }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleReset,
              className: "h-7 text-xs text-muted-foreground hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(ResetIcon, { className: "w-3 h-3 mr-1" }),
                "Reset"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          SliderControl,
          {
            label: "Cognitive Capacity",
            description: "Controls: density, hierarchy, concurrency",
            value: field.cognitive,
            onChange: (v) => updateCapacity({ cognitive: v }),
            lowLabel: "Fewer items",
            highLabel: "More items"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          SliderControl,
          {
            label: "Temporal Capacity",
            description: "Controls: content length, shortcuts, defaults",
            value: field.temporal,
            onChange: (v) => updateCapacity({ temporal: v }),
            lowLabel: "Abbreviated",
            highLabel: "Full detail"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          SliderControl,
          {
            label: "Emotional Capacity",
            description: "Controls: motion restraint, friction",
            value: field.emotional,
            onChange: (v) => updateCapacity({ emotional: v }),
            lowLabel: "Calm UI",
            highLabel: "Expressive"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsxRuntime.jsx(
          ValenceSliderControl,
          {
            label: "Emotional Valence",
            description: "Controls: tone, expressiveness (not info volume)",
            value: field.valence,
            onChange: (v) => updateEmotionalState({ valence: v })
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          SliderControl,
          {
            label: "Arousal",
            description: "Controls: animation pacing (calm \u2192 activated)",
            value: (_a = field.arousal) != null ? _a : 0.5,
            onChange: (v) => updateEmotionalState({ arousal: v }),
            lowLabel: "Calm",
            highLabel: "Activated"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-2 border-t border-border space-y-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
            "Feedback ",
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-normal opacity-60", children: "(opt-in)" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setHapticEnabled((v) => !v),
                className: `flex-1 py-1.5 px-2 rounded-md text-xs border transition-colors ${hapticEnabled ? "bg-primary/10 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
                "aria-pressed": hapticEnabled,
                children: "\u{1F4F3} Haptic"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setSonicEnabled((v) => !v),
                className: `flex-1 py-1.5 px-2 rounded-md text-xs border transition-colors ${sonicEnabled ? "bg-primary/10 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
                "aria-pressed": sonicEnabled,
                children: "\u{1F514} Sonic"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-[10px] text-muted-foreground opacity-60", children: [
            "Pace: ",
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.pace }),
            " \u2192 ",
            mode.pace === "calm" ? "+50% duration" : mode.pace === "activated" ? "\u221235% duration" : "standard"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Derived Fields" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
            /* @__PURE__ */ jsxRuntime.jsx(FieldDisplay, { label: "Energy", value: energy.value, color: "text-chart-1" }),
            /* @__PURE__ */ jsxRuntime.jsx(FieldDisplay, { label: "Attention", value: attention.value, color: "text-chart-2" }),
            /* @__PURE__ */ jsxRuntime.jsx(FieldDisplay, { label: "Valence", value: valence.value, color: "text-chart-3", signed: true })
          ] })
        ] }),
        conflicts.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-4 border-t border-border space-y-2", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
            "Conflicts ",
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-normal opacity-60", children: [
              "(",
              conflicts.length,
              ")"
            ] })
          ] }),
          conflicts.map((c) => /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: `rounded-md p-2 text-xs space-y-1 ${c.severity === "warning" ? "bg-warning/10 border border-warning/30 text-warning-content" : "bg-muted/60 border border-border text-muted-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium", children: c.label }),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "opacity-80 leading-snug", children: c.message }),
                c.suggestion && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "opacity-60 italic", children: c.suggestion }),
                c.affectedTokens.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "opacity-50", children: [
                  "Affects: ",
                  c.affectedTokens.join(", ")
                ] })
              ]
            },
            c.id
          ))
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Interface Mode" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Density:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.density }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Guidance:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.guidance }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Motion:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.motion }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Contrast:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.contrast }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Choices:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.choiceLoad }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Focus:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.focus }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground", children: "Pace:" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: mode.pace })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function SliderControl({
  label,
  description,
  value,
  onChange,
  lowLabel,
  highLabel
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
        Math.round(value * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      Slider,
      {
        value,
        onChange: (v) => onChange(v),
        min: 0,
        max: 1,
        step: 0.01,
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: lowLabel }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: highLabel })
    ] })
  ] });
}
function ValenceSliderControl({
  label,
  description,
  value,
  onChange
}) {
  const sliderValue = (value + 1) / 2;
  const displayValue = value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsxRuntime.jsx("label", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground tabular-nums font-mono", children: displayValue })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      Slider,
      {
        value: sliderValue,
        onChange: (v) => onChange(v * 2 - 1),
        min: 0,
        max: 1,
        step: 0.01,
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Negative" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "opacity-50", children: "Neutral" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Positive" })
    ] })
  ] });
}
function FieldDisplay({
  label,
  value,
  color,
  signed = false
}) {
  const displayValue = signed ? (value >= 0 ? "+" : "") + value.toFixed(2) : value.toFixed(2);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-muted/50 rounded-md p-2", children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: `text-sm font-mono font-bold ${color}`, children: displayValue })
  ] });
}
var DENSITY_CONTENT = {
  high: {
    title: "Adaptive Interface Demo",
    featureCount: 4,
    cta: "Explore the Framework"
  },
  medium: {
    title: "Adaptive Interface",
    featureCount: 2,
    cta: "Explore"
  },
  low: {
    title: "Live Demo",
    featureCount: 0,
    cta: "Go"
  }
};
var TEMPORAL_CONTENT = {
  full: {
    description: "This card demonstrates how the capacity system adapts UI in real-time based on your current state.",
    features: [
      "Cognitive capacity controls visual density",
      "Temporal capacity controls content length",
      "Emotional capacity controls motion restraint",
      "Valence controls tone and expressiveness"
    ]
  },
  abbreviated: {
    description: "UI adapts in real-time.",
    features: [
      "Density from cognitive",
      "Length from temporal",
      "Motion from emotional",
      "Tone from valence"
    ]
  }
};
var TONE = {
  positive: {
    greeting: "You're doing great!",
    accent: "text-green-600 dark:text-accent"
  },
  neutral: {
    greeting: "Here's how it works:",
    accent: "text-primary"
  },
  negative: {
    greeting: "Take your time.",
    accent: "text-muted-foreground"
  }
};
function CapacityDemoCard() {
  const { field, mode } = ui.useDerivedMode();
  const { fire } = ui.useFeedback();
  const modeLabel = ui.deriveModeLabel(field);
  const modeBadgeColor = ui.getModeBadgeColor(modeLabel);
  const densityContent = DENSITY_CONTENT[mode.density];
  const temporalContent = field.temporal > 0.4 ? TEMPORAL_CONTENT.full : TEMPORAL_CONTENT.abbreviated;
  const toneKey = field.valence > 0.2 ? "positive" : field.valence < -0.2 ? "negative" : "neutral";
  const tone = TONE[toneKey];
  const entrance = ui.entranceClass(mode.motion, "morph", false);
  const hover = ui.hoverClass(mode.motion);
  const visibleFeatures = temporalContent.features.slice(0, densityContent.featureCount);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Card,
    {
      className: `max-w-md border-2 transition-colors ${entrance} ${hover}`,
      style: { borderColor: `color-mix(in oklch, ${modeBadgeColor} 40%, transparent)` },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              Badge,
              {
                className: "text-xs",
                style: { backgroundColor: modeBadgeColor, color: "white" },
                children: [
                  modeLabel,
                  " Mode"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `text-xs ${tone.accent}`, children: tone.greeting })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { className: ui.ambientClass(mode.motion, "float"), children: densityContent.title }),
          mode.density !== "low" && /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: temporalContent.description })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-4", children: [
          visibleFeatures.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("ul", { className: "space-y-2", children: visibleFeatures.map((feature, idx) => /* @__PURE__ */ jsxRuntime.jsxs(
            "li",
            {
              className: `flex items-start gap-2 text-sm text-muted-foreground ${ui.listItemClass(mode.motion)}`,
              style: { animationDelay: `${idx * 0.15}s` },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(CheckIcon, { className: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: feature })
              ]
            },
            idx
          )) }),
          mode.guidance !== "low" && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground/70 italic", children: mode.guidance === "high" ? "Tip: adjust capacity controls (bottom-right) to see this card change" : "Try adjusting the capacity controls" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: mode.choiceLoad === "normal" ? "flex gap-2" : "", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                className: `${mode.choiceLoad === "normal" ? "flex-1" : "w-full"} py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-transform ${hover} ${ui.ambientClass(mode.motion, "breathe")}`,
                onClick: () => fire("tap"),
                children: densityContent.cta
              }
            ),
            mode.choiceLoad === "normal" && mode.density !== "low" && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                className: "py-2 px-3 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors",
                onClick: () => fire("tap"),
                children: "Details"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Live State" }),
            mode.choiceLoad === "minimal" ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Cog", value: field.cognitive, hint: "density" }),
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Temp", value: field.temporal, hint: "length" })
            ] }) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-4 gap-1 text-xs", children: [
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Cog", value: field.cognitive, hint: "density" }),
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Temp", value: field.temporal, hint: "length" }),
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Emo", value: field.emotional, hint: "motion" }),
              /* @__PURE__ */ jsxRuntime.jsx(StateChip, { label: "Val", value: field.valence, hint: "tone", signed: true })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function StateChip({
  label,
  value,
  hint,
  signed = false
}) {
  const displayValue = signed ? (value >= 0 ? "+" : "") + value.toFixed(1) : value.toFixed(1);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-muted/50 rounded-md px-2 py-1 text-center", children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground text-[10px]", children: label }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-mono font-medium", children: displayValue }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-muted-foreground text-[9px] opacity-70", children: hint })
  ] });
}
function CheckIcon({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "path",
        {
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M5 13l4 4L19 7"
        }
      )
    }
  );
}
function AmbientFieldMonitor() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntime.jsx(InputsToModeFlow, {}),
    /* @__PURE__ */ jsxRuntime.jsx(DerivationLogicExplainer, {})
  ] });
}
function InputsToModeFlow() {
  const { field, mode } = ui.useDerivedMode();
  const label = ui.deriveModeLabel(field);
  const badgeColor = ui.getModeBadgeColor(label);
  return /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "overflow-hidden border-border/50", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/50", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "1" }),
        "Your Inputs"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx(InputGauge, { label: "Cognitive", value: field.cognitive, description: "mental bandwidth" }),
        /* @__PURE__ */ jsxRuntime.jsx(InputGauge, { label: "Temporal", value: field.temporal, description: "time available" }),
        /* @__PURE__ */ jsxRuntime.jsx(InputGauge, { label: "Emotional", value: field.emotional, description: "resilience" }),
        /* @__PURE__ */ jsxRuntime.jsx(InputGauge, { label: "Valence", value: field.valence, description: "mood", isBipolar: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6 space-y-4 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "2" }),
        "Derived Mode"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-col items-center py-4", children: /* @__PURE__ */ jsxRuntime.jsx(
        Badge,
        {
          className: "text-xl font-bold px-6 py-3 shadow-lg",
          style: { backgroundColor: badgeColor, color: "white" },
          children: label
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-2 justify-center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "density", value: mode.density }),
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "guidance", value: mode.guidance }),
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "choices", value: mode.choiceLoad }),
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "motion", value: mode.motion }),
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "contrast", value: mode.contrast }),
        /* @__PURE__ */ jsxRuntime.jsx(ModePill, { label: "focus", value: mode.focus })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "3" }),
        "UI Effects"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.density === "low", text: "Fewer items shown, simpler layouts" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.density === "high", text: "Full feature display, dense grids" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.guidance === "high", text: "More labels, helper text visible" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.choiceLoad === "minimal", text: "Reduced options, smart defaults" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.motion === "off", text: "No animations, fully static UI" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.motion === "soothing", text: "Slow rhythmic motion: breathe, float" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.motion === "subtle", text: "Calm animations, no surprises" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.motion === "expressive", text: "Playful micro-interactions" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.contrast === "boosted", text: "Higher contrast for accessibility" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.focus === "gentle", text: "Soft highlight on important elements" }),
        /* @__PURE__ */ jsxRuntime.jsx(EffectRow, { active: mode.focus === "guided", text: "Strong beacon glow on key elements" })
      ] })
    ] })
  ] }) });
}
function InputGauge({
  label,
  value,
  description,
  isBipolar = false
}) {
  const percentage = isBipolar ? (value + 1) / 2 * 100 : value * 100;
  const getColor = () => {
    if (isBipolar) {
      if (value < -0.15) return "bg-amber-500";
      if (value > 0.15) return "bg-emerald-500";
      return "bg-sky-500";
    }
    if (value < 0.4) return "bg-amber-500";
    if (value > 0.7) return "bg-emerald-500";
    return "bg-sky-500";
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: `h-full rounded-full transition-all duration-300 ${getColor()}`,
          style: { width: `${percentage}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm font-mono tabular-nums w-12 text-right text-foreground", children: isBipolar ? (value >= 0 ? "+" : "") + value.toFixed(1) : (value * 100).toFixed(0) + "%" })
    ] })
  ] });
}
function ModePill({ label, value }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-xs", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-muted-foreground", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium text-foreground", children: value })
  ] });
}
function EffectRow({ active, text }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `py-1.5 text-sm transition-opacity ${active ? "opacity-100" : "opacity-40"}`, children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: active ? "text-foreground font-medium" : "text-muted-foreground", children: [
    active ? "-> " : "   ",
    text
  ] }) });
}
function DerivationLogicExplainer() {
  return /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "p-6 border-border/50 bg-muted/20", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4", children: "Derivation Rules" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid gap-4 md:grid-cols-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-foreground", children: "Cognitive controls density:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "cognitive < 0.4  \u2192 density: low" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "cognitive > 0.7  \u2192 density: high" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "else             \u2192 density: medium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-foreground", children: "Temporal controls choices:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "temporal < 0.4  \u2192 choiceLoad: minimal" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "else            \u2192 choiceLoad: normal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-foreground", children: "Emotional controls motion:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "emotional < 0.15             \u2192 motion: off" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "emotional < 0.4              \u2192 motion: soothing" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "emotional > 0.6 & val > 0.15 \u2192 motion: expressive" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "else                         \u2192 motion: subtle" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-foreground", children: "Valence controls tone:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "valence < -0.15 \u2192 contrast: boosted" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "else            \u2192 contrast: standard" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-foreground", children: "Cognitive controls focus:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "motion == off    \u2192 focus: default" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "cognitive < 0.4 \u2192 focus: guided" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "cognitive < 0.7 \u2192 focus: gentle" }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "else            \u2192 focus: default" })
        ] })
      ] })
    ] })
  ] });
}

exports.AmbientFieldMonitor = AmbientFieldMonitor;
exports.Badge = Badge;
exports.Button = Button;
exports.CapacityControls = CapacityControls;
exports.CapacityDemoCard = CapacityDemoCard;
exports.Card = Card;
exports.CardAction = CardAction;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.Select = Select;
exports.Slider = Slider;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map