import * as React from 'react';
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
declare function Button({ className, variant, size, style, ...props }: React.ComponentProps<'button'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
}): import("react/jsx-runtime").JSX.Element;
export { Button };
export type { ButtonVariant, ButtonSize };
//# sourceMappingURL=button.d.ts.map