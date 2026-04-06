"use client";
import { createContext, useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// lib/capacity/validation.ts
function detectConflicts(field) {
  var _a;
  const conflicts = [];
  const arousal = (_a = field.arousal) != null ? _a : 0.5;
  if (field.emotional < 0.15 && arousal > 0.65) {
    conflicts.push({
      id: "dead-pace",
      severity: "info",
      label: "Pace has no effect",
      message: "Arousal is high (pace: activated) but emotional capacity has disabled all animations. The pace multiplier runs on nothing.",
      affectedTokens: ["motion", "pace"],
      suggestion: "Lower arousal below 0.65, or raise emotional capacity above 0.15 to let pace take effect."
    });
  }
  if (arousal > 0.7 && field.emotional < 0.3 && !conflicts.find((c) => c.id === "dead-pace")) {
    conflicts.push({
      id: "anxiety-pattern",
      severity: "warning",
      label: "Anxiety pattern detected",
      message: "High arousal with low emotional capacity signals an overwhelm/anxiety state. The UI is protective (slow or static motion) but internal pace is fast \u2014 these work against each other.",
      affectedTokens: ["motion", "pace"],
      suggestion: "Lower arousal to match emotional capacity, or raise emotional capacity if the high energy is intentional."
    });
  }
  if (field.cognitive > 0.75 && field.temporal < 0.2) {
    conflicts.push({
      id: "density-choice-inversion",
      severity: "info",
      label: "Dense content, minimal choices",
      message: "High cognitive capacity requests full information density, but low temporal capacity minimises available choices. Content will be rich but most actions will be hidden.",
      affectedTokens: ["density", "choiceLoad", "guidance"]
    });
  }
  if (field.valence > 0.5 && field.emotional < 0.15) {
    conflicts.push({
      id: "mute-expressiveness",
      severity: "info",
      label: "Positive tone, no motion",
      message: "Emotional valence is strongly positive, but emotional capacity has disabled all animations. The expressive tone cannot be conveyed through motion.",
      affectedTokens: ["motion", "contrast"],
      suggestion: "Raise emotional capacity above 0.15 to allow at least soothing motion."
    });
  }
  return conflicts;
}

// lib/capacity/constants.ts
var PHI = 1.618033988749895;
var PHI_INVERSE = 0.618033988749895;
var FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
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
var DEFAULT_COMPONENT_RESPONSE = {
  visual: {
    opacityRange: [0.4, 1],
    scaleRange: [0.95, 1]
  },
  spatial: {
    densityRange: [0.6, 1],
    spacingMultiplier: [1, PHI]
  },
  sonic: {
    enabled: false
    // Opt-in
  },
  semantic: {
    verbosityLevel: "concise",
    urgencyFraming: "neutral"
  }
};
var MOTION_TOKENS = {
  off: {
    durationFast: 0,
    durationBase: 0,
    durationSlow: 0,
    easing: "linear",
    // Essential transitions still allowed (opacity, focus rings)
    essentialDuration: 100,
    essentialEasing: "ease-out"
  },
  soothing: {
    durationFast: 0,
    // No fast motion -- everything is slow and rhythmic
    durationBase: 800,
    durationSlow: 1200,
    easing: "ease-in-out",
    // Smooth, no sharp edges
    essentialDuration: 200,
    essentialEasing: "ease-in-out"
  },
  subtle: {
    durationFast: 100,
    durationBase: 200,
    durationSlow: 350,
    easing: "ease-out",
    essentialDuration: 150,
    essentialEasing: "ease-out"
  },
  expressive: {
    durationFast: 200,
    durationBase: 400,
    durationSlow: 700,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    // Spring-like overshoot
    essentialDuration: 150,
    essentialEasing: "ease-out"
  }
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
var FieldManager = new FieldManagerClass();

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
  const motion = veryLowEmotional ? "off" : lowEmotional ? "soothing" : highEmotional && highValence ? "expressive" : "subtle";
  const contrast = negValence ? "boosted" : "standard";
  const focus = motion === "off" ? "default" : lowCognitive ? "guided" : !highCognitive ? "gentle" : "default";
  const arousal = (_a = field.arousal) != null ? _a : 0.5;
  const pace = arousal < 0.35 ? "calm" : arousal > 0.65 ? "activated" : "neutral";
  return { density, guidance, motion, contrast, choiceLoad, focus, pace };
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

// lib/capacity/signals/detectors/time-detector.ts
var TimeDetector = class {
  constructor() {
    this.name = "TimeDetector";
    this.weight = 0.6;
  }
  // Medium weight — time is significant but a broad generalisation
  /**
   * Detects and returns SignalReadings based on the current time and day.
   * Returns two readings: cognitive (hour-of-day) and temporal (weekday/weekend).
   */
  detect() {
    const now = /* @__PURE__ */ new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const ts = now.getTime();
    let cognitiveValue;
    if (hour >= 9 && hour < 12) {
      cognitiveValue = 0.8;
    } else if (hour >= 14 && hour < 17) {
      cognitiveValue = 0.6;
    } else if (hour >= 17 && hour < 20) {
      cognitiveValue = 0.5;
    } else if (hour >= 20 || hour < 6) {
      cognitiveValue = 0.3;
    } else {
      cognitiveValue = 0.7;
    }
    const temporalValue = dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.7 : 0.9;
    return [
      {
        dimension: "cognitive",
        value: cognitiveValue,
        confidence: 0.7,
        // Medium — population average, not personalised
        timestamp: ts,
        detectorName: this.name
      },
      {
        dimension: "temporal",
        value: temporalValue,
        confidence: 0.6,
        // Slightly lower — weekday/weekend is a coarser signal
        timestamp: ts,
        detectorName: this.name
      }
    ];
  }
};

// lib/capacity/signals/detectors/session-detector.ts
var SessionDetector = class {
  constructor() {
    this.name = "SessionDetector";
    this.weight = 0.7;
    this.sessionStartTime = Date.now();
  }
  /**
   * Detects and returns a SignalReading based on the current session duration.
   * It provides insights into the temporal dimension.
   *
   * @returns {SignalReading} A reading indicating the inferred capacity.
   */
  detect() {
    const now = Date.now();
    const sessionDurationMinutes = (now - this.sessionStartTime) / (1e3 * 60);
    let temporalValue;
    let confidence;
    if (sessionDurationMinutes < 15) {
      temporalValue = 0.9;
      confidence = 0.8;
    } else if (sessionDurationMinutes < 60) {
      temporalValue = 0.7;
      confidence = 0.7;
    } else if (sessionDurationMinutes < 180) {
      temporalValue = 0.5;
      confidence = 0.6;
    } else {
      temporalValue = 0.3;
      confidence = 0.7;
    }
    return [{
      dimension: "temporal",
      value: temporalValue,
      confidence,
      timestamp: now,
      detectorName: this.name
    }];
  }
};

// lib/capacity/signals/detectors/scroll-detector.ts
var DEBOUNCE_TIME_MS = 100;
var ScrollDetector = class {
  constructor() {
    this.name = "ScrollDetector";
    this.weight = 0.5;
    // Moderate weight, as scroll velocity can indicate engagement or frustration
    this.lastScrollY = 0;
    this.lastScrollTime = 0;
    this.scrollVelocity = 0;
    this.timeoutId = null;
    /**
     * Handles the scroll event, debouncing it and calculating scroll velocity.
     * @private
     */
    this.handleScroll = () => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        const now = Date.now();
        const scrollY = window.scrollY;
        const distance = Math.abs(scrollY - this.lastScrollY);
        const timeElapsed = now - this.lastScrollTime;
        if (timeElapsed > 0) {
          this.scrollVelocity = distance / timeElapsed * 1e3;
        } else {
          this.scrollVelocity = 0;
        }
        this.lastScrollY = scrollY;
        this.lastScrollTime = now;
      }, DEBOUNCE_TIME_MS);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
  }
  /**
   * Detects and returns a SignalReading based on the current scroll velocity.
   * It provides insights into the cognitive dimension.
   *
   * @returns {SignalReading} A reading indicating the inferred capacity.
   */
  detect() {
    const now = Date.now();
    let cognitiveValue;
    let confidence;
    if (this.scrollVelocity > 1500) {
      cognitiveValue = 0.4;
      confidence = 0.6;
    } else if (this.scrollVelocity > 500) {
      cognitiveValue = 0.7;
      confidence = 0.8;
    } else if (this.scrollVelocity > 50) {
      cognitiveValue = 0.6;
      confidence = 0.7;
    } else {
      cognitiveValue = 0.5;
      confidence = 0.5;
    }
    return [{
      dimension: "cognitive",
      value: cognitiveValue,
      confidence,
      timestamp: now,
      detectorName: this.name
    }];
  }
  /**
   * Cleans up the scroll event listener when the detector is no longer needed.
   */
  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  }
};

// lib/capacity/signals/detectors/interaction-detector.ts
var IDLE_THRESHOLD_MS = 15e3;
var CLICK_WINDOW_MS = 6e4;
var InteractionDetector = class {
  constructor() {
    this.name = "InteractionDetector";
    this.weight = 0.7;
    this.lastMouseMoveTime = 0;
    this.lastClickTime = 0;
    this.lastClickPosition = null;
    this.clickHistory = [];
    // rolling 60-second window
    this.idleTimer = null;
    this.isIdle = false;
    this.resetIdleTimer = () => {
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.isIdle = false;
      this.idleTimer = setTimeout(() => {
        this.isIdle = true;
      }, IDLE_THRESHOLD_MS);
    };
    this.handleMouseMove = () => {
      this.lastMouseMoveTime = Date.now();
      this.resetIdleTimer();
    };
    this.handleClick = (event) => {
      this.resetIdleTimer();
      const now = Date.now();
      this.lastClickTime = now;
      let distance = 0;
      if (this.lastClickPosition) {
        const dx = event.clientX - this.lastClickPosition.x;
        const dy = event.clientY - this.lastClickPosition.y;
        distance = Math.sqrt(dx * dx + dy * dy);
      }
      this.lastClickPosition = { x: event.clientX, y: event.clientY };
      this.clickHistory.push({ time: now, distance });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
      window.addEventListener("click", this.handleClick, { passive: true });
    }
    this.resetIdleTimer();
  }
  detect() {
    const now = Date.now();
    const cutoff = now - CLICK_WINDOW_MS;
    this.clickHistory = this.clickHistory.filter((c) => c.time >= cutoff);
    const clickCount = this.clickHistory.length;
    const avgClickDistance = clickCount > 0 ? this.clickHistory.reduce((sum, c) => sum + c.distance, 0) / clickCount : 0;
    const timeSinceLastClick = now - this.lastClickTime;
    let cognitiveValue;
    let confidence;
    if (this.isIdle) {
      cognitiveValue = 0.4;
      confidence = 0.6;
    } else if (timeSinceLastClick < 500 && clickCount > 5 && avgClickDistance < 20) {
      cognitiveValue = 0.9;
      confidence = 0.9;
    } else if (timeSinceLastClick < 1500 && clickCount > 1 && avgClickDistance < 50) {
      cognitiveValue = 0.7;
      confidence = 0.7;
    } else if (avgClickDistance > 100) {
      cognitiveValue = 0.3;
      confidence = 0.6;
    } else {
      cognitiveValue = 0.5;
      confidence = 0.5;
    }
    return [{
      dimension: "cognitive",
      value: cognitiveValue,
      confidence,
      timestamp: now,
      detectorName: this.name
    }];
  }
  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("click", this.handleClick);
    }
    if (this.idleTimer) clearTimeout(this.idleTimer);
  }
};

// lib/capacity/signals/detectors/input-detector.ts
var TYPING_SPEED_SAMPLE_SIZE = 10;
var ERROR_CHECK_WINDOW = 5e3;
var InputDetector = class {
  // timestamps of recent Backspace/Delete presses
  constructor() {
    this.name = "InputDetector";
    this.weight = 0.6;
    this.keyPressTimes = [];
    this.errorTimes = [];
    this.handleKeyDown = (event) => {
      const now = Date.now();
      this.keyPressTimes.push(now);
      if (this.keyPressTimes.length > TYPING_SPEED_SAMPLE_SIZE) {
        this.keyPressTimes.shift();
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        this.errorTimes.push(now);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown, { passive: true });
    }
  }
  detect() {
    const now = Date.now();
    let typingSpeedCPM = 0;
    if (this.keyPressTimes.length > 1) {
      const elapsed = this.keyPressTimes[this.keyPressTimes.length - 1] - this.keyPressTimes[0];
      if (elapsed > 0) {
        typingSpeedCPM = this.keyPressTimes.length / elapsed * 6e4;
      }
    }
    const cutoff = now - ERROR_CHECK_WINDOW;
    this.errorTimes = this.errorTimes.filter((t) => t >= cutoff);
    const recentErrorCount = this.errorTimes.length;
    let cognitiveValue;
    let confidence;
    if (typingSpeedCPM > 100 && recentErrorCount === 0) {
      cognitiveValue = 0.9;
      confidence = 0.8;
    } else if (typingSpeedCPM > 40 && recentErrorCount <= 1) {
      cognitiveValue = 0.7;
      confidence = 0.7;
    } else if (recentErrorCount > 2 || typingSpeedCPM < 20) {
      cognitiveValue = 0.4;
      confidence = 0.6;
    } else {
      cognitiveValue = 0.6;
      confidence = 0.5;
    }
    return [{
      dimension: "cognitive",
      value: cognitiveValue,
      confidence,
      timestamp: now,
      detectorName: this.name
    }];
  }
  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  }
};

// lib/capacity/signals/detectors/environment-detector.ts
var EnvironmentDetector = class {
  constructor() {
    this.name = "EnvironmentDetector";
    this.weight = 0.8;
    // High weight — these are explicit user preferences
    this.mqlReducedMotion = null;
    this.mqlDarkMode = null;
    this.handleChange = () => {
    };
    if (typeof window !== "undefined") {
      this.mqlReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.mqlDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
      this.mqlReducedMotion.addEventListener("change", this.handleChange);
      this.mqlDarkMode.addEventListener("change", this.handleChange);
    }
  }
  /**
   * Returns two readings:
   * - temporal:  based on prefers-reduced-motion (low → less time pressure on animations)
   * - emotional: based on prefers-color-scheme   (dark → slightly lower emotional load)
   */
  detect() {
    const now = Date.now();
    const prefersReducedMotion = this.mqlReducedMotion != null ? this.mqlReducedMotion.matches : typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersDarkMode = this.mqlDarkMode != null ? this.mqlDarkMode.matches : typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return [
      {
        dimension: "temporal",
        // prefers-reduced-motion → user may have lower tolerance for demanding UIs
        value: prefersReducedMotion ? 0.3 : 0.8,
        confidence: 0.9,
        timestamp: now,
        detectorName: this.name
      },
      {
        dimension: "emotional",
        // Dark mode preference → slightly lower emotional capacity or reduced-stimulation preference
        value: prefersDarkMode ? 0.6 : 0.7,
        confidence: 0.9,
        timestamp: now,
        detectorName: this.name
      }
    ];
  }
  /**
   * Removes the event listeners registered in the constructor.
   * Uses the stored refs so the same function reference is unregistered.
   */
  destroy() {
    var _a, _b;
    (_a = this.mqlReducedMotion) == null ? void 0 : _a.removeEventListener("change", this.handleChange);
    (_b = this.mqlDarkMode) == null ? void 0 : _b.removeEventListener("change", this.handleChange);
    this.mqlReducedMotion = null;
    this.mqlDarkMode = null;
  }
};

// lib/capacity/signals/aggregator.ts
var _SignalAggregator = class _SignalAggregator {
  constructor() {
    this.detectors = [
      new TimeDetector(),
      new SessionDetector(),
      new ScrollDetector(),
      new InteractionDetector(),
      new InputDetector(),
      new EnvironmentDetector()
    ];
  }
  /**
   * Collects signal readings from all detectors and aggregates them into a
   * confidence-weighted CapacityField.
   */
  aggregateSignals() {
    return __async(this, null, function* () {
      const readings = [];
      for (const detector of this.detectors) {
        const detectorReadings = yield detector.detect();
        readings.push(...detectorReadings);
      }
      const weightedSums = {
        cognitive: 0,
        temporal: 0,
        emotional: 0,
        valence: 0
      };
      const totalWeights = {
        cognitive: 0,
        temporal: 0,
        emotional: 0,
        valence: 0
      };
      for (const reading of readings) {
        const effectiveWeight = reading.confidence * this.getDetectorWeight(reading.dimension, reading.detectorName);
        weightedSums[reading.dimension] += reading.value * effectiveWeight;
        totalWeights[reading.dimension] += effectiveWeight;
      }
      return {
        cognitive: totalWeights.cognitive > 0 ? weightedSums.cognitive / totalWeights.cognitive : 0.5,
        temporal: totalWeights.temporal > 0 ? weightedSums.temporal / totalWeights.temporal : 0.5,
        emotional: totalWeights.emotional > 0 ? weightedSums.emotional / totalWeights.emotional : 0.5,
        valence: totalWeights.valence > 0 ? weightedSums.valence / totalWeights.valence : 0
      };
    });
  }
  /**
   * Returns the effective weight for a detector/dimension pair.
   * Checks DIMENSION_WEIGHTS first; falls back to detector.weight.
   */
  getDetectorWeight(dimension, detectorName) {
    var _a, _b, _c;
    const override = (_a = _SignalAggregator.DIMENSION_WEIGHTS[detectorName]) == null ? void 0 : _a[dimension];
    if (override !== void 0) return override;
    return (_c = (_b = this.detectors.find((d) => d.name === detectorName)) == null ? void 0 : _b.weight) != null ? _c : 0;
  }
  /** Cleans up all detector resources (event listeners, timers). */
  destroy() {
    var _a;
    for (const detector of this.detectors) {
      (_a = detector.destroy) == null ? void 0 : _a.call(detector);
    }
  }
};
/**
 * Per-detector, per-dimension weight overrides.
 * Falls back to detector.weight for any unlisted combination.
 *
 * Rationale for asymmetries:
 * - TimeDetector: cognitive signal is stronger (diurnal pattern) than temporal
 *   (weekday/weekend is coarser)
 * - EnvironmentDetector: emotional signal (color scheme) is a stronger explicit
 *   preference than temporal (reduced-motion)
 */
_SignalAggregator.DIMENSION_WEIGHTS = {
  TimeDetector: { cognitive: 0.6, temporal: 0.5 },
  EnvironmentDetector: { emotional: 0.8, temporal: 0.7 },
  InteractionDetector: { cognitive: 0.7 },
  InputDetector: { cognitive: 0.6 },
  SessionDetector: { temporal: 0.7 },
  ScrollDetector: { cognitive: 0.5 }
};
var SignalAggregator = _SignalAggregator;
var CapacityContext = createContext(null);
var AUTO_EMA_ALPHA = 0.2;
function applyEMA(prev, next, alpha) {
  return {
    cognitive: prev.cognitive * (1 - alpha) + next.cognitive * alpha,
    temporal: prev.temporal * (1 - alpha) + next.temporal * alpha,
    emotional: prev.emotional * (1 - alpha) + next.emotional * alpha,
    valence: prev.valence * (1 - alpha) + next.valence * alpha
  };
}
function CapacityProvider({ children }) {
  const [context, setContext] = useState(() => FieldManager.getContext());
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(false);
  const [sonicEnabled, setSonicEnabled] = useState(false);
  const isFirstAggregationComplete = useRef(false);
  const smoothedFieldRef = useRef(null);
  const aggregatorRef = useRef(null);
  useEffect(() => {
    aggregatorRef.current = new SignalAggregator();
    const unsubscribe = FieldManager.subscribe((newContext) => {
      setContext(newContext);
    });
    return () => {
      unsubscribe();
      if (aggregatorRef.current) {
        aggregatorRef.current.destroy();
      }
    };
  }, []);
  useEffect(() => {
    let intervalId;
    if (isAutoMode && aggregatorRef.current) {
      isFirstAggregationComplete.current = false;
      smoothedFieldRef.current = null;
      intervalId = setInterval(() => __async(null, null, function* () {
        var _a;
        try {
          const suggestedField = yield aggregatorRef.current.aggregateSignals();
          if (!isFirstAggregationComplete.current) {
            isFirstAggregationComplete.current = true;
            smoothedFieldRef.current = suggestedField;
          } else {
            smoothedFieldRef.current = applyEMA(
              (_a = smoothedFieldRef.current) != null ? _a : suggestedField,
              suggestedField,
              AUTO_EMA_ALPHA
            );
            const smoothed = smoothedFieldRef.current;
            FieldManager.updateCapacity({
              cognitive: smoothed.cognitive,
              temporal: smoothed.temporal,
              emotional: smoothed.emotional
            });
            FieldManager.updateEmotionalState({
              valence: smoothed.valence
            });
          }
        } catch (error) {
          console.warn("[CapacityProvider] Signal aggregation failed:", error);
        }
      }), 2e3);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoMode]);
  const conflicts = useMemo(() => {
    const field = {
      cognitive: context.userCapacity.cognitive,
      temporal: context.userCapacity.temporal,
      emotional: context.userCapacity.emotional,
      valence: context.emotionalState.valence,
      arousal: context.emotionalState.arousal
    };
    const detected = detectConflicts(field);
    if (process.env.NODE_ENV !== "production" && detected.length > 0) {
      detected.forEach(
        (c) => console.warn(`[CapacityProvider] ${c.severity.toUpperCase()} \u2014 ${c.label}: ${c.message}`)
      );
    }
    return detected;
  }, [context.userCapacity, context.emotionalState]);
  useEffect(() => {
    var _a;
    if (typeof document === "undefined") return;
    const arousal = (_a = context.emotionalState.arousal) != null ? _a : 0.5;
    const multiplier = arousal < 0.35 ? 1.5 : arousal > 0.65 ? 0.65 : 1;
    document.documentElement.style.setProperty("--capacity-pace-multiplier", String(multiplier));
  }, [context.emotionalState.arousal]);
  const updateCapacity = useCallback((capacity) => {
    if (isAutoMode) {
      setIsAutoMode(false);
    }
    FieldManager.updateCapacity(capacity);
  }, [isAutoMode]);
  const updateEmotionalState = useCallback((state) => {
    if (isAutoMode) {
      setIsAutoMode(false);
    }
    FieldManager.updateEmotionalState(state);
  }, [isAutoMode]);
  const updateCapacityField = useCallback((field) => {
    FieldManager.updateCapacity({
      cognitive: field.cognitive,
      temporal: field.temporal,
      emotional: field.emotional
    });
    FieldManager.updateEmotionalState({
      valence: field.valence
    });
  }, []);
  const toggleAutoMode = useCallback(() => {
    setIsAutoMode((prev) => !prev);
  }, []);
  return /* @__PURE__ */ jsx(CapacityContext.Provider, { value: {
    context,
    updateCapacity,
    updateEmotionalState,
    isAutoMode,
    toggleAutoMode,
    updateCapacityField,
    hapticEnabled,
    sonicEnabled,
    setHapticEnabled,
    setSonicEnabled,
    conflicts
  }, children });
}
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
function useFieldControls() {
  const { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField, conflicts } = useCapacityContext();
  return { updateCapacity, updateEmotionalState, isAutoMode, toggleAutoMode, updateCapacityField, conflicts };
}
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return prefersReducedMotion;
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
function useEffectiveMotion() {
  const { field } = useDerivedMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const derivedMode = deriveMode(field);
  const effectiveMode = prefersReducedMotion ? "off" : derivedMode.motion;
  return {
    mode: effectiveMode,
    tokens: MOTION_TOKENS[effectiveMode],
    prefersReducedMotion
  };
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
function usePacedMotionTokens() {
  const { mode } = useDerivedMode();
  const { mode: effectiveMotion, tokens: baseTokens, prefersReducedMotion } = useEffectiveMotion();
  const effectivePace = prefersReducedMotion ? "calm" : mode.pace;
  const multiplier = effectivePace === "calm" ? 1.5 : effectivePace === "activated" ? 0.65 : 1;
  return {
    mode: effectiveMotion,
    pace: effectivePace,
    tokens: __spreadProps(__spreadValues({}, baseTokens), {
      durationFast: Math.round(baseTokens.durationFast * multiplier),
      durationBase: Math.round(baseTokens.durationBase * multiplier),
      durationSlow: Math.round(baseTokens.durationSlow * multiplier)
    })
  };
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
function entranceClass(motion, preset, hasPlayed) {
  if (hasPlayed) return "";
  return ENTRANCE_PRESETS[preset][motion];
}
function hoverClass(motion) {
  if (motion === "expressive") return "hover-expand";
  if (motion === "subtle" || motion === "soothing") return "hover-lift";
  return "";
}
function ambientClass(motion, type) {
  if (motion === "expressive") return type;
  if (motion === "soothing" && (type === "breathe" || type === "float")) return type;
  return "";
}
function listItemClass(motion) {
  if (motion === "expressive") return "helix-rise";
  if (motion === "subtle" || motion === "soothing") return "sacred-fade";
  return "";
}
function focusBeaconClass(focus) {
  if (focus === "guided") return "attention-beacon focus-highlight";
  if (focus === "gentle") return "gentle-beacon gentle-highlight";
  return "";
}
function focusTextClass(focus) {
  if (focus === "guided") return "attention-text";
  if (focus === "gentle") return "gentle-text";
  return "";
}

// lib/capacity/utils/typography.ts
var BASE_FONT_SIZE = 16;
var MIN_FONT_SIZE = 14;
var JITTER_FACTOR = 0.05;
var SCALE_STEPS = {
  h1: 4,
  // φ^4 ≈ 6.85x base
  h2: 3,
  // φ^3 ≈ 4.24x base
  h3: 2,
  // φ^2 ≈ 2.62x base
  h4: 1,
  // φ^1 ≈ 1.62x base
  body: 0,
  // φ^0 = 1x base
  label: -0.5,
  // φ^-0.5 ≈ 0.79x base
  caption: -1
  // φ^-1 ≈ 0.62x base
};
var ENERGY_BIAS = {
  low: 1.05,
  // +5% for better readability when tired
  medium: 1,
  // Neutral
  high: 0.95
  // -5% for higher density when alert
};
var ATTENTION_WEIGHT = {
  low: 400,
  // Regular
  medium: 450,
  // Medium
  high: 500
  // Medium-bold for focus
};
var ATTENTION_TRACKING = {
  low: 0.02,
  // Loose tracking for comfortable reading
  medium: 0,
  // Normal
  high: -0.01
  // Tight tracking for focus
};
function modularScale(step, base = BASE_FONT_SIZE) {
  return base * Math.pow(PHI, step);
}
function getFontSize(role, energy = "medium", options) {
  const { base = BASE_FONT_SIZE, jitter = true, minSize = MIN_FONT_SIZE } = options || {};
  const step = SCALE_STEPS[role];
  const baseSize = modularScale(step, base);
  const jitterAmount = jitter ? (Math.random() - 0.5) * 2 * JITTER_FACTOR : 0;
  const jitteredSize = baseSize * (1 + jitterAmount);
  const energyAdjustedSize = jitteredSize * ENERGY_BIAS[energy];
  return Math.max(energyAdjustedSize, minSize);
}
function getFontWeight(attention = "medium") {
  return ATTENTION_WEIGHT[attention];
}
function getLetterSpacing(attention = "medium") {
  return ATTENTION_TRACKING[attention];
}
function getLineHeight(role) {
  const lineHeights = {
    h1: 1.2,
    h2: 1.25,
    h3: 1.3,
    h4: 1.35,
    body: 1.5,
    label: 1.4,
    caption: 1.45
  };
  return lineHeights[role];
}
function getTypographyStyles(role, energy = "medium", attention = "medium") {
  return {
    fontSize: `${getFontSize(role, energy)}px`,
    fontWeight: getFontWeight(attention),
    lineHeight: getLineHeight(role),
    letterSpacing: `${getLetterSpacing(attention)}em`
  };
}
function getFluidFontSize(role, energy = "medium") {
  const minSize = getFontSize(role, energy, { jitter: false });
  const maxSize = minSize * 1.2;
  return `clamp(${minSize}px, ${minSize}px + (${maxSize - minSize}) * ((100vw - 320px) / 1600), ${maxSize}px)`;
}
var SPACING_BASE = 4;
var SPACING_SCALE = FIBONACCI.map((f) => f * SPACING_BASE);
function getSpacing(step, unit = "px") {
  const clampedStep = Math.max(0, Math.min(step, SPACING_SCALE.length - 1));
  const raw = SPACING_SCALE[clampedStep];
  if (unit === "raw") return raw;
  if (unit === "rem") return `${(raw / 16).toFixed(4).replace(/\.?0+$/, "")}rem`;
  return `${raw}px`;
}
function getProportionalSpacing(density) {
  const shift = density === "low" ? -1 : density === "high" ? 1 : 0;
  return {
    xs: getSpacing(2 + shift),
    sm: getSpacing(3 + shift),
    md: getSpacing(5 + shift),
    lg: getSpacing(7 + shift),
    gap: getSpacing(4 + shift)
  };
}
function phiRatio(steps) {
  return Math.pow(PHI, steps);
}

// lib/capacity/signals/signal-bus.ts
var SignalBusClass = class {
  constructor() {
    this.handlers = /* @__PURE__ */ new Map();
    this.signalQueue = [];
    this.processing = false;
  }
  /**
   * Emit a signal to all subscribed handlers
   */
  emit(type, payload, priority = "normal", source) {
    const signal = {
      type,
      payload,
      timestamp: Date.now(),
      priority,
      source
    };
    if (priority === "critical") {
      this.signalQueue.unshift(signal);
    } else {
      this.signalQueue.push(signal);
    }
    this.processQueue();
  }
  /**
   * Subscribe to a specific signal type
   */
  subscribe(type, handler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, /* @__PURE__ */ new Set());
    }
    const handlers = this.handlers.get(type);
    handlers.add(handler);
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    };
  }
  /**
   * Subscribe to multiple signal types with same handler
   */
  subscribeMultiple(types, handler) {
    const unsubscribers = types.map((type) => this.subscribe(type, handler));
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }
  /**
   * Process signal queue
   */
  processQueue() {
    return __async(this, null, function* () {
      if (this.processing || this.signalQueue.length === 0) {
        return;
      }
      this.processing = true;
      while (this.signalQueue.length > 0) {
        const signal = this.signalQueue.shift();
        const handlers = this.handlers.get(signal.type);
        if (handlers) {
          handlers.forEach((handler) => {
            try {
              handler(signal);
            } catch (error) {
              console.error(`[v0] Signal handler error for "${signal.type}":`, error);
            }
          });
        }
      }
      this.processing = false;
    });
  }
  /**
   * Get count of handlers for a signal type
   */
  getHandlerCount(type) {
    var _a, _b;
    return (_b = (_a = this.handlers.get(type)) == null ? void 0 : _a.size) != null ? _b : 0;
  }
  /**
   * Clear all handlers (useful for testing)
   */
  clear() {
    this.handlers.clear();
    this.signalQueue = [];
  }
};
var SignalBus = new SignalBusClass();
var SIGNAL_TYPES = {
  // Field changes
  FIELD_ENERGY_CHANGED: "field:energy:changed",
  FIELD_ATTENTION_CHANGED: "field:attention:changed",
  FIELD_VALENCE_CHANGED: "field:valence:changed",
  // User interactions
  USER_INTERACTION_START: "user:interaction:start",
  USER_INTERACTION_END: "user:interaction:end",
  USER_FOCUS_CHANGED: "user:focus:changed",
  // Component lifecycle
  COMPONENT_MOUNTED: "component:mounted",
  COMPONENT_UNMOUNTED: "component:unmounted",
  // Accessibility
  A11Y_ANNOUNCE: "a11y:announce",
  A11Y_FOCUS_TRAP: "a11y:focus:trap"
};

export { CapacityProvider, DEFAULT_COMPONENT_RESPONSE, FEEDBACK_FREQUENCIES, FIBONACCI, FieldManager, HAPTIC_PATTERNS, MOTION_TOKENS, PHI, PHI_INVERSE, SIGNAL_TYPES, SPACING_SCALE, SignalBus, ambientClass, deriveMode, deriveModeLabel, detectConflicts, entranceClass, focusBeaconClass, focusTextClass, getFluidFontSize, getFontSize, getFontWeight, getFrequencyForPace, getLetterSpacing, getLineHeight, getModeBadgeColor, getProportionalSpacing, getSpacing, getTypographyStyles, hoverClass, listItemClass, modularScale, phiRatio, playPacedSonic, playSonicFeedback, triggerHaptic, useAttentionField, useCapacityContext, useDerivedMode, useEffectiveMotion, useEmotionalValenceField, useEnergyField, useFeedback, useFieldControls, usePacedMotionTokens, usePrefersReducedMotion };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map