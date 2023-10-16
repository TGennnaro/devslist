import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const textVariants = cva('block', {
	variants: {
		variant: {
			body: 'text-gray-400 text-lg leading-normal',
			heading: 'text-gray-50 font-bold text-7xl leading-[1.1] tracking-tight',
		},
	},
	defaultVariants: {
		variant: 'body',
	},
});

export default function Text({
	className = '',
	children,
	variant,
}: {
	className?: string;
	children: ReactNode;
	variant?: VariantProps<typeof textVariants>['variant'];
}) {
	return (
		<span className={cn(textVariants({ variant }), className)}>{children}</span>
	);
}
