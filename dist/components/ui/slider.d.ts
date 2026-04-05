import * as React from 'react';
declare function Slider({ className, value, defaultValue, min, max, step, onChange, disabled, style, ...props }: {
    className?: string;
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'>): import("react/jsx-runtime").JSX.Element;
export { Slider };
//# sourceMappingURL=slider.d.ts.map