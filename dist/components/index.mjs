import { createContext, useState, useCallback, useContext } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { rengeVars } from '@renge-ui/tokens';

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
var FEEDBACK_FREQUENCIES = {
  low: 396,
  // Foundation/root elements
  mid: 528,
  // Primary interactive content
  high: 741
  // Dynamic/feedback elements
};
var DEFAULT_FIELD_CONFIG = {
  smoothing: 0.15,
  // Exponential smoothing factor
  velocityThreshold: 0.05,
  // Min velocity to register as trend
  debounceMs: 100
  // Debounce rapid changes
};
var DEFAULT_USER_CAPACITY = {
  cognitive: 0.7,
  temporal: 0.7,
  emotional: 0.7
};
var DEFAULT_EMOTIONAL_STATE = {
  valence: 0.3,
  // > 0.15 (with emotional > 0.6) triggers expressive motion mode
  arousal: 0.5
};

// lib/capacity/feedback.ts
var HAPTIC_PATTERNS = {
  /** Short tap — confirm/select */
  tap: [8],
  /** Two pulses — toggle/switch */
  toggle: [8, 50, 8],
  /** Gentle pulse — ambient/ambient confirmation */
  pulse: [15, 30, 15],
  /** Error/warning — three quick */
  error: [50, 30, 50, 30, 50]
};
function triggerHaptic(pattern = "tap") {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  }
}
var _audioCtx = null;
function getAudioContext() {
  if (typeof window === "undefined") return null;
  try {
    if (!_audioCtx || _audioCtx.state === "closed") {
      _audioCtx = new AudioContext();
    }
    if (_audioCtx.state === "suspended") {
      _audioCtx.resume();
    }
    return _audioCtx;
  } catch (e) {
    return null;
  }
}
function playSonicFeedback(frequency, duration = 120, volume = 0.06) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.015);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1e3);
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1e3 + 0.02);
}
function getFrequencyForPace(pace) {
  if (pace === "activated") return FEEDBACK_FREQUENCIES.high;
  if (pace === "calm") return FEEDBACK_FREQUENCIES.low;
  return FEEDBACK_FREQUENCIES.mid;
}
function playPacedSonic(pace, duration) {
  playSonicFeedback(getFrequencyForPace(pace), duration);
}

// lib/capacity/fields/field-manager.ts
function deriveEnergyField(capacity) {
  const { cognitive, temporal, emotional } = capacity;
  return Math.pow(cognitive * temporal * emotional, 1 / 3);
}
function deriveAttentionField(capacity) {
  return 1 - capacity.temporal * 0.5;
}
function deriveEmotionalValenceField(state) {
  return state.valence;
}
function createFieldValue(value, previousValue) {
  var _a;
  const now = Date.now();
  const lastChange = (_a = previousValue == null ? void 0 : previousValue.lastChange) != null ? _a : now;
  const timeDelta = (now - lastChange) / 1e3;
  let trend = "stable";
  let velocity;
  if (typeof value === "number" && previousValue && typeof previousValue.value === "number") {
    const valueDelta = value - previousValue.value;
    velocity = timeDelta > 0 ? valueDelta / timeDelta : 0;
    if (Math.abs(velocity) > DEFAULT_FIELD_CONFIG.velocityThreshold) {
      trend = velocity > 0 ? "rising" : "falling";
    }
  }
  return {
    value,
    lastChange: now,
    trend,
    velocity
  };
}
var FieldManagerClass = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.config = DEFAULT_FIELD_CONFIG;
    const initialCapacity = DEFAULT_USER_CAPACITY;
    const initialState = DEFAULT_EMOTIONAL_STATE;
    this.context = {
      energy: createFieldValue(deriveEnergyField(initialCapacity)),
      attention: createFieldValue(deriveAttentionField(initialCapacity)),
      emotionalValence: createFieldValue(deriveEmotionalValenceField(initialState)),
      userCapacity: initialCapacity,
      emotionalState: initialState
    };
  }
  /**
   * Get current ambient context (read-only)
   */
  getContext() {
    return this.context;
  }
  /**
   * Update user capacity (Phase 1 slider system writes here)
   */
  updateCapacity(capacity) {
    const newCapacity = __spreadValues(__spreadValues({}, this.context.userCapacity), capacity);
    this.context = __spreadProps(__spreadValues({}, this.context), {
      userCapacity: newCapacity,
      energy: createFieldValue(deriveEnergyField(newCapacity), this.context.energy),
      attention: createFieldValue(deriveAttentionField(newCapacity), this.context.attention)
    });
    this.notifyListeners();
  }
  /**
   * Update emotional state (Phase 1 slider system writes here)
   */
  updateEmotionalState(state) {
    const newState = __spreadValues(__spreadValues({}, this.context.emotionalState), state);
    this.context = __spreadProps(__spreadValues({}, this.context), {
      emotionalState: newState,
      emotionalValence: createFieldValue(deriveEmotionalValenceField(newState), this.context.emotionalValence)
    });
    this.notifyListeners();
  }
  /**
   * Subscribe to field changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**
   * Notify all listeners of field changes
   */
  notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.context);
      } catch (error) {
        console.error("[v0] Field listener error:", error);
      }
    });
  }
  /**
   * Update field configuration
   */
  updateConfig(config) {
    this.config = __spreadValues(__spreadValues({}, this.config), config);
  }
  /**
   * Get current field configuration
   */
  getConfig() {
    return this.config;
  }
};
new FieldManagerClass();

// lib/capacity/mode.ts
function deriveMode(field) {
  var _a;
  const lowCognitive = field.cognitive < 0.4;
  const highCognitive = field.cognitive > 0.7;
  const lowEmotional = field.emotional < 0.4;
  const highEmotional = field.emotional > 0.6;
  const lowTemporal = field.temporal < 0.4;
  const highValence = field.valence > 0.15;
  const negValence = field.valence < -0.15;
  const density = lowCognitive ? "low" : highCognitive ? "high" : "medium";
  const choiceLoad = lowTemporal ? "minimal" : "normal";
  const guidance = lowCognitive ? "high" : lowTemporal ? "medium" : "low";
  const veryLowEmotional = field.emotional < 0.15;
  const motion2 = veryLowEmotional ? "off" : lowEmotional ? "soothing" : highEmotional && highValence ? "expressive" : "subtle";
  const contrast = negValence ? "boosted" : "standard";
  const focus = motion2 === "off" ? "default" : lowCognitive ? "guided" : !highCognitive ? "gentle" : "default";
  const arousal = (_a = field.arousal) != null ? _a : 0.5;
  const pace = arousal < 0.35 ? "calm" : arousal > 0.65 ? "activated" : "neutral";
  return { density, guidance, motion: motion2, contrast, choiceLoad, focus, pace };
}
function deriveModeLabel(inputs) {
  const { cognitive, temporal, emotional } = inputs;
  if (cognitive > 0.6 && emotional > 0.6) {
    return "Exploratory";
  }
  if (cognitive < 0.4 && temporal < 0.4) {
    return "Minimal";
  }
  if (cognitive >= 0.55 && temporal >= 0.55) {
    return "Focused";
  }
  return "Calm";
}
function getModeBadgeColor(label) {
  switch (label) {
    case "Calm":
      return "oklch(0.65 0.15 220)";
    // Soft blue
    case "Focused":
      return "oklch(0.68 0.16 45)";
    // Primary rust
    case "Exploratory":
      return "oklch(0.65 0.2 135)";
    // Toxic green
    case "Minimal":
      return "oklch(0.55 0.1 280)";
    // Muted purple
    default:
      return "oklch(0.5 0 0)";
  }
}
var CapacityContext = createContext(null);
function useCapacityContext() {
  const context = useContext(CapacityContext);
  if (!context) {
    throw new Error("useCapacityContext must be used within CapacityProvider");
  }
  return context;
}
function useEnergyField() {
  const { context } = useCapacityContext();
  return context.energy;
}
function useAttentionField() {
  const { context } = useCapacityContext();
  return context.attention;
}
function useEmotionalValenceField() {
  const { context } = useCapacityContext();
  return context.emotionalValence;
}
function useDerivedMode() {
  const { context } = useCapacityContext();
  const field = {
    cognitive: context.userCapacity.cognitive,
    temporal: context.userCapacity.temporal,
    emotional: context.userCapacity.emotional,
    valence: context.emotionalState.valence,
    arousal: context.emotionalState.arousal
  };
  const mode = deriveMode(field);
  return { field, mode };
}
function useFeedback() {
  const { hapticEnabled, sonicEnabled, setHapticEnabled, setSonicEnabled } = useCapacityContext();
  const { mode } = useDerivedMode();
  const fire = useCallback((pattern = "tap") => {
    if (hapticEnabled) triggerHaptic(pattern);
    if (sonicEnabled) playPacedSonic(mode.pace);
  }, [hapticEnabled, sonicEnabled, mode.pace]);
  return { hapticEnabled, sonicEnabled, setHapticEnabled, setSonicEnabled, fire };
}

// lib/capacity/animation.ts
var ENTRANCE_PRESETS = {
  /** Liquid organic morph -> gentle scale fade -> soft bloom -> none */
  morph: { expressive: "morph-fade-in", subtle: "sacred-fade", soothing: "bloom", off: "" },
  /** Spinning vortex -> gentle scale fade -> soft bloom -> none */
  vortex: { expressive: "vortex-reveal", subtle: "sacred-fade", soothing: "bloom", off: "" },
  /** Spiral in from corner -> soft bloom -> soft bloom -> none */
  spiral: { expressive: "spiral-in", subtle: "bloom", soothing: "bloom", off: "" }
};
function entranceClass(motion2, preset, hasPlayed) {
  return ENTRANCE_PRESETS[preset][motion2];
}
function hoverClass(motion2) {
  if (motion2 === "expressive") return "hover-expand";
  if (motion2 === "subtle" || motion2 === "soothing") return "hover-lift";
  return "";
}
function ambientClass(motion2, type) {
  if (motion2 === "expressive") return type;
  if (motion2 === "soothing" && (type === "breathe" || type === "float")) return type;
  return "";
}
function listItemClass(motion2) {
  if (motion2 === "expressive") return "helix-rise";
  if (motion2 === "subtle" || motion2 === "soothing") return "sacred-fade";
  return "";
}
var SLIDER_STYLES = `
[data-renge-slider] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
  outline: none;
  cursor: pointer;
  transition: background ${rengeVars.duration[1]} ${rengeVars.easing.out};
}
[data-renge-slider]:focus-visible {
  box-shadow: 0 0 0 2px ${rengeVars.color.bg}, 0 0 0 4px ${rengeVars.color.borderFocus};
}
[data-renge-slider]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* WebKit track */
[data-renge-slider]::-webkit-slider-runnable-track {
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
}

/* WebKit thumb */
[data-renge-slider]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: ${rengeVars.space[3]};
  height: ${rengeVars.space[3]};
  margin-top: calc((${rengeVars.space[1]} - ${rengeVars.space[3]}) / 2);
  border-radius: ${rengeVars.radius.full};
  background: ${rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform  ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-webkit-slider-thumb:hover {
  background: ${rengeVars.color.accentHover};
  transform: scale(1.2);
}
[data-renge-slider]:not(:disabled):active::-webkit-slider-thumb {
  transform: scale(1.1);
}

/* Firefox track */
[data-renge-slider]::-moz-range-track {
  height: ${rengeVars.space[1]};
  background: ${rengeVars.color.bgMuted};
  border-radius: ${rengeVars.radius.full};
  border: none;
}

/* Firefox thumb */
[data-renge-slider]::-moz-range-thumb {
  width: ${rengeVars.space[3]};
  height: ${rengeVars.space[3]};
  border-radius: ${rengeVars.radius.full};
  background: ${rengeVars.color.accent};
  border: none;
  cursor: pointer;
  transition:
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform  ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-slider]:not(:disabled)::-moz-range-thumb:hover {
  background: ${rengeVars.color.accentHover};
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
  return /* @__PURE__ */ jsx(
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
    background ${rengeVars.duration[1]} ${rengeVars.easing.out},
    color ${rengeVars.duration[1]} ${rengeVars.easing.out},
    box-shadow ${rengeVars.duration[1]} ${rengeVars.easing.out},
    transform ${rengeVars.duration[1]} ${rengeVars.easing.spring};
}
[data-renge-btn]:active:not(:disabled) {
  transform: scale(0.97);
}
[data-renge-btn]:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
[data-renge-btn]:focus-visible {
  box-shadow: 0 0 0 2px ${rengeVars.color.bg}, 0 0 0 4px ${rengeVars.color.borderFocus};
}

[data-renge-btn="default"]:hover:not(:disabled) { background: ${rengeVars.color.accentHover}; }
[data-renge-btn="destructive"]:hover:not(:disabled) { filter: brightness(1.1); }
[data-renge-btn="outline"]:hover:not(:disabled) {
  background: ${rengeVars.color.bgSubtle};
  border-color: ${rengeVars.color.accent};
  color: ${rengeVars.color.accent};
}
[data-renge-btn="secondary"]:hover:not(:disabled) { background: ${rengeVars.color.bgMuted}; }
[data-renge-btn="ghost"]:hover:not(:disabled) { background: ${rengeVars.color.bgSubtle}; }
[data-renge-btn="link"]:hover:not(:disabled) { color: ${rengeVars.color.accentHover}; }
`;
var variantStyles = {
  default: {
    background: rengeVars.color.accent,
    color: rengeVars.color.fgInverse
  },
  destructive: {
    background: rengeVars.color.danger,
    color: rengeVars.color.fgInverse
  },
  outline: {
    background: "transparent",
    color: rengeVars.color.fg,
    border: `1px solid ${rengeVars.color.border}`
  },
  secondary: {
    background: rengeVars.color.bgSubtle,
    color: rengeVars.color.fg
  },
  ghost: {
    background: "transparent",
    color: rengeVars.color.fg
  },
  link: {
    background: "transparent",
    color: rengeVars.color.accent,
    textDecoration: "underline",
    textUnderlineOffset: "3px"
  }
};
var sizeStyles = {
  default: {
    padding: `${rengeVars.space[2]} ${rengeVars.space[4]}`,
    fontSize: rengeVars.fontSize.sm,
    borderRadius: rengeVars.radius[2],
    gap: rengeVars.space[2]
  },
  sm: {
    padding: `${rengeVars.space[1]} ${rengeVars.space[3]}`,
    fontSize: rengeVars.fontSize.xs,
    borderRadius: rengeVars.radius[2],
    gap: rengeVars.space[1]
  },
  lg: {
    padding: `${rengeVars.space[3]} ${rengeVars.space[5]}`,
    fontSize: rengeVars.fontSize.base,
    borderRadius: rengeVars.radius[3],
    gap: rengeVars.space[2]
  },
  icon: {
    width: rengeVars.space[6],
    height: rengeVars.space[6],
    padding: rengeVars.space[2],
    borderRadius: rengeVars.radius[2],
    flexShrink: 0
  },
  "icon-sm": {
    width: rengeVars.space[5],
    height: rengeVars.space[5],
    padding: rengeVars.space[1],
    borderRadius: rengeVars.radius[2],
    flexShrink: 0
  },
  "icon-lg": {
    width: rengeVars.space[7],
    height: rengeVars.space[7],
    padding: rengeVars.space[3],
    borderRadius: rengeVars.radius[3],
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
  return /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card",
      className,
      style: __spreadValues({
        background: rengeVars.color.bgSubtle,
        border: `1px solid ${rengeVars.color.border}`,
        borderRadius: rengeVars.radius[4],
        boxShadow: `0 1px 3px color-mix(in oklch, ${rengeVars.color.fg} 8%, transparent)`,
        transition: `box-shadow ${rengeVars.duration[2]} ${rengeVars.easing.out}`,
        overflow: "hidden"
      }, style)
    }, props)
  );
}
function CardHeader(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card-header",
      className,
      style: __spreadValues({
        padding: `${rengeVars.space[4]} ${rengeVars.space[4]} 0`,
        display: "grid",
        gridAutoRows: "min-content",
        gap: rengeVars.space[1]
      }, style)
    }, props)
  );
}
function CardTitle(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card-title",
      className,
      style: __spreadValues({
        fontSize: rengeVars.fontSize.base,
        lineHeight: rengeVars.lineHeight.base,
        fontWeight: 600,
        color: rengeVars.color.fg
      }, style)
    }, props)
  );
}
function CardDescription(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card-description",
      className,
      style: __spreadValues({
        fontSize: rengeVars.fontSize.sm,
        lineHeight: rengeVars.lineHeight.sm,
        color: rengeVars.color.fgSubtle
      }, style)
    }, props)
  );
}
function CardAction(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card-content",
      className,
      style: __spreadValues({
        padding: `0 ${rengeVars.space[4]} ${rengeVars.space[4]}`
      }, style)
    }, props)
  );
}
function CardFooter(_a) {
  var _b = _a, { className, style } = _b, props = __objRest(_b, ["className", "style"]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      "data-slot": "card-footer",
      className,
      style: __spreadValues({
        display: "flex",
        alignItems: "center",
        padding: `0 ${rengeVars.space[4]} ${rengeVars.space[4]}`
      }, style)
    }, props)
  );
}
var variantStyles2 = {
  default: {
    background: rengeVars.color.accent,
    color: rengeVars.color.fgInverse
  },
  secondary: {
    background: rengeVars.color.accentSubtle,
    color: rengeVars.color.fg
  },
  destructive: {
    background: rengeVars.color.danger,
    color: rengeVars.color.fgInverse
  },
  outline: {
    background: "transparent",
    color: rengeVars.color.fg,
    border: `1px solid ${rengeVars.color.border}`
  }
};
var baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: `${rengeVars.space[1]} ${rengeVars.space[2]}`,
  borderRadius: rengeVars.radius.full,
  fontSize: rengeVars.fontSize.xs,
  lineHeight: rengeVars.lineHeight.xs,
  fontWeight: 500,
  whiteSpace: "nowrap",
  border: "none",
  transition: `background ${rengeVars.duration[1]} ${rengeVars.easing.out},
               color ${rengeVars.duration[1]} ${rengeVars.easing.out}`
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
  return /* @__PURE__ */ jsx(
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
  border-color: ${rengeVars.color.borderFocus};
  box-shadow: 0 0 0 2px ${rengeVars.color.accentSubtle};
}
[data-renge-select]:hover:not(:disabled):not(:focus) {
  border-color: ${rengeVars.color.accent};
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
  return /* @__PURE__ */ jsx(
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
        padding: `${rengeVars.space[2]} ${rengeVars.space[3]}`,
        background: rengeVars.color.bg,
        color: rengeVars.color.fg,
        border: `1px solid ${rengeVars.color.border}`,
        borderRadius: rengeVars.radius[2],
        fontSize: rengeVars.fontSize.sm,
        lineHeight: rengeVars.lineHeight.sm,
        cursor: "pointer",
        transition: `border-color ${rengeVars.duration[1]} ${rengeVars.easing.out},
                     box-shadow ${rengeVars.duration[1]} ${rengeVars.easing.out}`
      }, style)
    }, restProps), {
      children
    })
  );
}
function SettingsIcon({ className }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          }
        ),
        /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
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
  const [isOpen, setIsOpen] = useState(false);
  const { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode } = useCapacityContext();
  const { hapticEnabled, sonicEnabled, setHapticEnabled, setSonicEnabled, fire: fireFeedback } = useFeedback();
  const { field, mode } = useDerivedMode();
  const energy = useEnergyField();
  const attention = useAttentionField();
  const valence = useEmotionalValenceField();
  const modeLabel = deriveModeLabel(field);
  const modeBadgeColor = getModeBadgeColor(modeLabel);
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
  const fireInteractionFeedback = useCallback(() => {
    fireFeedback("tap");
  }, [fireFeedback]);
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-4 right-4 z-50", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: !isOpen && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsx(
            Badge,
            {
              className: "shadow-lg",
              style: { backgroundColor: modeBadgeColor, color: "white" },
              children: modeLabel
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => setIsOpen(true),
              variant: "outline",
              size: "sm",
              className: "shadow-lg bg-background",
              children: [
                /* @__PURE__ */ jsx(SettingsIcon, { className: "w-4 h-4 mr-2" }),
                "Capacity"
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden",
        onClick: () => setIsOpen(false),
        "aria-hidden": "true"
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 },
        transition: { type: "spring", damping: 20, stiffness: 300 },
        className: "relative",
        children: /* @__PURE__ */ jsxs(Card, { className: "w-80 shadow-xl max-h-[85vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-semibold", children: "Capacity Controls" }),
                /* @__PURE__ */ jsx(
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
                    children: /* @__PURE__ */ jsx(CloseIcon, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: "text-xs",
                    style: { backgroundColor: modeBadgeColor, color: "white" },
                    children: modeLabel
                  }
                ),
                /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: isAutoMode ? "Signals are driving values automatically. Move any slider to take manual control." : "Adjust your state to see the UI adapt in real-time." })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Quick Presets" }),
              /* @__PURE__ */ jsxs(
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
                    /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select a preset..." }),
                    Object.entries(CAPACITY_PRESETS).map(([key, preset]) => /* @__PURE__ */ jsxs("option", { value: key, children: [
                      preset.label,
                      " \u2014 ",
                      preset.description
                    ] }, key))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border pt-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Or adjust individually:" }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: handleReset,
                  className: "h-7 text-xs text-muted-foreground hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsx(ResetIcon, { className: "w-3 h-3 mr-1" }),
                    "Reset"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-border", children: /* @__PURE__ */ jsx(
              ValenceSliderControl,
              {
                label: "Emotional Valence",
                description: "Controls: tone, expressiveness (not info volume)",
                value: field.valence,
                onChange: (v) => updateEmotionalState({ valence: v })
              }
            ) }),
            /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-border space-y-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-muted-foreground", children: [
                "Feedback ",
                /* @__PURE__ */ jsx("span", { className: "font-normal opacity-60", children: "(opt-in)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setHapticEnabled((v) => !v),
                    className: `flex-1 py-1.5 px-2 rounded-md text-xs border transition-colors ${hapticEnabled ? "bg-primary/10 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
                    "aria-pressed": hapticEnabled,
                    children: "\u{1F4F3} Haptic"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSonicEnabled((v) => !v),
                    className: `flex-1 py-1.5 px-2 rounded-md text-xs border transition-colors ${sonicEnabled ? "bg-primary/10 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
                    "aria-pressed": sonicEnabled,
                    children: "\u{1F514} Sonic"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground opacity-60", children: [
                "Pace: ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.pace }),
                " \u2192 ",
                mode.pace === "calm" ? "+50% duration" : mode.pace === "activated" ? "\u221235% duration" : "standard"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Derived Fields" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
                /* @__PURE__ */ jsx(FieldDisplay, { label: "Energy", value: energy.value, color: "text-chart-1" }),
                /* @__PURE__ */ jsx(FieldDisplay, { label: "Attention", value: attention.value, color: "text-chart-2" }),
                /* @__PURE__ */ jsx(FieldDisplay, { label: "Valence", value: valence.value, color: "text-chart-3", signed: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Interface Mode" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1 text-xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Density:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.density }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Guidance:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.guidance }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Motion:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.motion }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Contrast:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.contrast }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Choices:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.choiceLoad }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Focus:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.focus }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Pace:" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: mode.pace })
              ] })
            ] })
          ] })
        ] })
      }
    ) })
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
        Math.round(value * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { children: lowLabel }),
      /* @__PURE__ */ jsx("span", { children: highLabel })
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground tabular-nums font-mono", children: displayValue })
    ] }),
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { children: "Negative" }),
      /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "Neutral" }),
      /* @__PURE__ */ jsx("span", { children: "Positive" })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-md p-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: `text-sm font-mono font-bold ${color}`, children: displayValue })
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
  const { field, mode } = useDerivedMode();
  const { fire } = useFeedback();
  const modeLabel = deriveModeLabel(field);
  const modeBadgeColor = getModeBadgeColor(modeLabel);
  const densityContent = DENSITY_CONTENT[mode.density];
  const temporalContent = field.temporal > 0.4 ? TEMPORAL_CONTENT.full : TEMPORAL_CONTENT.abbreviated;
  const toneKey = field.valence > 0.2 ? "positive" : field.valence < -0.2 ? "negative" : "neutral";
  const tone = TONE[toneKey];
  const entrance = entranceClass(mode.motion, "morph");
  const hover = hoverClass(mode.motion);
  const visibleFeatures = temporalContent.features.slice(0, densityContent.featureCount);
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: `max-w-md border-2 transition-colors ${entrance} ${hover}`,
      style: { borderColor: `color-mix(in oklch, ${modeBadgeColor} 40%, transparent)` },
      children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsx("span", { className: `text-xs ${tone.accent}`, children: tone.greeting })
          ] }),
          /* @__PURE__ */ jsx(CardTitle, { className: ambientClass(mode.motion, "float"), children: densityContent.title }),
          mode.density !== "low" && /* @__PURE__ */ jsx(CardDescription, { children: temporalContent.description })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          visibleFeatures.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: visibleFeatures.map((feature, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `flex items-start gap-2 text-sm text-muted-foreground ${listItemClass(mode.motion)}`,
              style: { animationDelay: `${idx * 0.15}s` },
              children: [
                /* @__PURE__ */ jsx(CheckIcon, { className: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsx("span", { children: feature })
              ]
            },
            idx
          )) }),
          mode.guidance !== "low" && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 italic", children: mode.guidance === "high" ? "Tip: adjust capacity controls (bottom-right) to see this card change" : "Try adjusting the capacity controls" }),
          /* @__PURE__ */ jsxs("div", { className: mode.choiceLoad === "normal" ? "flex gap-2" : "", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `${mode.choiceLoad === "normal" ? "flex-1" : "w-full"} py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium text-sm transition-transform ${hover} ${ambientClass(mode.motion, "breathe")}`,
                onClick: () => fire("tap"),
                children: densityContent.cta
              }
            ),
            mode.choiceLoad === "normal" && mode.density !== "low" && /* @__PURE__ */ jsx(
              "button",
              {
                className: "py-2 px-3 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors",
                onClick: () => fire("tap"),
                children: "Details"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Live State" }),
            mode.choiceLoad === "minimal" ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1 text-xs", children: [
              /* @__PURE__ */ jsx(StateChip, { label: "Cog", value: field.cognitive, hint: "density" }),
              /* @__PURE__ */ jsx(StateChip, { label: "Temp", value: field.temporal, hint: "length" })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-1 text-xs", children: [
              /* @__PURE__ */ jsx(StateChip, { label: "Cog", value: field.cognitive, hint: "density" }),
              /* @__PURE__ */ jsx(StateChip, { label: "Temp", value: field.temporal, hint: "length" }),
              /* @__PURE__ */ jsx(StateChip, { label: "Emo", value: field.emotional, hint: "motion" }),
              /* @__PURE__ */ jsx(StateChip, { label: "Val", value: field.valence, hint: "tone", signed: true })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 rounded-md px-2 py-1 text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[10px]", children: label }),
    /* @__PURE__ */ jsx("p", { className: "font-mono font-medium", children: displayValue }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[9px] opacity-70", children: hint })
  ] });
}
function CheckIcon({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className,
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(InputsToModeFlow, {}),
    /* @__PURE__ */ jsx(DerivationLogicExplainer, {})
  ] });
}
function InputsToModeFlow() {
  const { field, mode } = useDerivedMode();
  const label = deriveModeLabel(field);
  const badgeColor = getModeBadgeColor(label);
  return /* @__PURE__ */ jsx(Card, { className: "overflow-hidden border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/50", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "1" }),
        "Your Inputs"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(InputGauge, { label: "Cognitive", value: field.cognitive, description: "mental bandwidth" }),
        /* @__PURE__ */ jsx(InputGauge, { label: "Temporal", value: field.temporal, description: "time available" }),
        /* @__PURE__ */ jsx(InputGauge, { label: "Emotional", value: field.emotional, description: "resilience" }),
        /* @__PURE__ */ jsx(InputGauge, { label: "Valence", value: field.valence, description: "mood", isBipolar: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4 bg-muted/30", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "2" }),
        "Derived Mode"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center py-4", children: /* @__PURE__ */ jsx(
        Badge,
        {
          className: "text-xl font-bold px-6 py-3 shadow-lg",
          style: { backgroundColor: badgeColor, color: "white" },
          children: label
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 justify-center", children: [
        /* @__PURE__ */ jsx(ModePill, { label: "density", value: mode.density }),
        /* @__PURE__ */ jsx(ModePill, { label: "guidance", value: mode.guidance }),
        /* @__PURE__ */ jsx(ModePill, { label: "choices", value: mode.choiceLoad }),
        /* @__PURE__ */ jsx(ModePill, { label: "motion", value: mode.motion }),
        /* @__PURE__ */ jsx(ModePill, { label: "contrast", value: mode.contrast }),
        /* @__PURE__ */ jsx(ModePill, { label: "focus", value: mode.focus })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs", children: "3" }),
        "UI Effects"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(EffectRow, { active: mode.density === "low", text: "Fewer items shown, simpler layouts" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.density === "high", text: "Full feature display, dense grids" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.guidance === "high", text: "More labels, helper text visible" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.choiceLoad === "minimal", text: "Reduced options, smart defaults" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.motion === "off", text: "No animations, fully static UI" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.motion === "soothing", text: "Slow rhythmic motion: breathe, float" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.motion === "subtle", text: "Calm animations, no surprises" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.motion === "expressive", text: "Playful micro-interactions" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.contrast === "boosted", text: "Higher contrast for accessibility" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.focus === "gentle", text: "Soft highlight on important elements" }),
        /* @__PURE__ */ jsx(EffectRow, { active: mode.focus === "guided", text: "Strong beacon glow on key elements" })
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `h-full rounded-full transition-all duration-300 ${getColor()}`,
          style: { width: `${percentage}%` }
        }
      ) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-mono tabular-nums w-12 text-right text-foreground", children: isBipolar ? (value >= 0 ? "+" : "") + value.toFixed(1) : (value * 100).toFixed(0) + "%" })
    ] })
  ] });
}
function ModePill({ label, value }) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-xs", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: value })
  ] });
}
function EffectRow({ active, text }) {
  return /* @__PURE__ */ jsx("div", { className: `py-1.5 text-sm transition-opacity ${active ? "opacity-100" : "opacity-40"}`, children: /* @__PURE__ */ jsxs("span", { className: active ? "text-foreground font-medium" : "text-muted-foreground", children: [
    active ? "-> " : "   ",
    text
  ] }) });
}
function DerivationLogicExplainer() {
  return /* @__PURE__ */ jsxs(Card, { className: "p-6 border-border/50 bg-muted/20", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4", children: "Derivation Rules" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Cognitive controls density:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsx("li", { children: "cognitive < 0.4  \u2192 density: low" }),
          /* @__PURE__ */ jsx("li", { children: "cognitive > 0.7  \u2192 density: high" }),
          /* @__PURE__ */ jsx("li", { children: "else             \u2192 density: medium" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Temporal controls choices:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsx("li", { children: "temporal < 0.4  \u2192 choiceLoad: minimal" }),
          /* @__PURE__ */ jsx("li", { children: "else            \u2192 choiceLoad: normal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Emotional controls motion:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsx("li", { children: "emotional < 0.15             \u2192 motion: off" }),
          /* @__PURE__ */ jsx("li", { children: "emotional < 0.4              \u2192 motion: soothing" }),
          /* @__PURE__ */ jsx("li", { children: "emotional > 0.6 & val > 0.15 \u2192 motion: expressive" }),
          /* @__PURE__ */ jsx("li", { children: "else                         \u2192 motion: subtle" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Valence controls tone:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsx("li", { children: "valence < -0.15 \u2192 contrast: boosted" }),
          /* @__PURE__ */ jsx("li", { children: "else            \u2192 contrast: standard" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: "Cognitive controls focus:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 text-muted-foreground font-mono text-xs", children: [
          /* @__PURE__ */ jsx("li", { children: "motion == off    \u2192 focus: default" }),
          /* @__PURE__ */ jsx("li", { children: "cognitive < 0.4 \u2192 focus: guided" }),
          /* @__PURE__ */ jsx("li", { children: "cognitive < 0.7 \u2192 focus: gentle" }),
          /* @__PURE__ */ jsx("li", { children: "else            \u2192 focus: default" })
        ] })
      ] })
    ] })
  ] });
}

export { AmbientFieldMonitor, Badge, Button, CapacityControls, CapacityDemoCard, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Select, Slider };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map