import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import Balancer from 'react-wrap-balancer';

const textVariants = cva('block', {
	variants: {
		variant: {
			body: 'text-gray-700 dark:text-gray-400 text-lg leading-normal',
			heading:
				'text-gray-900 dark:text-gray-50 font-bold leading-[1.1] tracking-tight text-5xl sm:text-7xl',
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
	balance = false,
}: {
	className?: string;
	children: ReactNode;
	variant?: VariantProps<typeof textVariants>['variant'];
	balance?: boolean;
}) {
	if (balance) {
		return (
			<Balancer>
				<span className={cn(textVariants({ variant }), className)}>
					{children}
				</span>
			</Balancer>
		);
	} else {
		return (
			<span className={cn(textVariants({ variant }), className)}>
				{children}
			</span>
		);
	}
}
