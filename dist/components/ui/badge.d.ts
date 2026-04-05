import * as React from 'react';
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
declare function Badge({ className, variant, style, ...props }: React.ComponentProps<'span'> & {
    variant?: BadgeVariant;
}): import("react/jsx-runtime").JSX.Element;
export { Badge };
export type { BadgeVariant };
//# sourceMappingURL=badge.d.ts.map