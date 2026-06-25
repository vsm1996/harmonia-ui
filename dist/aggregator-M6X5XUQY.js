'use strict';

var chunkJPRRZPBL_js = require('./chunk-JPRRZPBL.js');

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
    return chunkJPRRZPBL_js.__async(this, null, function* () {
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

exports.SignalAggregator = SignalAggregator;
//# sourceMappingURL=aggregator-M6X5XUQY.js.map
//# sourceMappingURL=aggregator-M6X5XUQY.js.map