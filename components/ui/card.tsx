import { cn } from '@/lib/utils';
import { CardProps, Card as NextCard } from '@nextui-org/card';
import { forwardRef } from 'react';

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ children, radius, shadow, className, ...props }, ref) => {
		return (
			<NextCard
				{...props}
				ref={ref}
				className={cn('border border-border', className)}
				radius={radius ?? 'sm'}
				shadow={shadow ?? 'sm'}
			>
				{children}
			</NextCard>
		);
	}
);

Card.displayName = 'Card';

export { Card };
