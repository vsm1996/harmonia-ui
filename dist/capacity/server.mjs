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
var DEFAULT_CAPACITY_FIELD = {
  cognitive: 0.5,
  temporal: 0.5,
  emotional: 0.5,
  valence: 0
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

export { DEFAULT_CAPACITY_FIELD, DEFAULT_COMPONENT_RESPONSE, FEEDBACK_FREQUENCIES, FIBONACCI, MOTION_TOKENS, PHI, PHI_INVERSE, SPACING_SCALE, ambientClass, deriveMode, deriveModeLabel, detectConflicts, entranceClass, focusBeaconClass, focusTextClass, getFluidFontSize, getFontSize, getFontWeight, getLetterSpacing, getLineHeight, getModeBadgeColor, getProportionalSpacing, getSpacing, getTypographyStyles, hoverClass, listItemClass, modularScale, phiRatio };
//# sourceMappingURL=server.mjs.map
//# sourceMappingURL=server.mjs.map