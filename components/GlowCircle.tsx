import { cva, VariantProps } from 'class-variance-authority';

const circleVariants = cva(
	'rounded-full w-48 h-48 absolute blur-[109px] pointer-events-none',
	{
		variants: {
			color: {
				primary: 'bg-primary-300 dark:bg-primary-500',
				secondary: 'bg-secondary-300 dark:bg-secondary',
			},
		},
		defaultVariants: {
			color: 'primary',
		},
	}
);

export default function GlowCircle({
	top,
	left,
	right,
	center = false,
	opacity = 1.0,
	percent = false,
	color = 'primary',
}:
	| (
			| {
					top: number;
					left: number;
					right?: undefined;
					center?: boolean;
					opacity?: number;
					percent?: boolean;
					color?: VariantProps<typeof circleVariants>['color'];
			  }
			| {
					top: number;
					left?: undefined;
					right: number;
					center?: boolean;
					opacity?: number;
					percent?: boolean;
					color?: VariantProps<typeof circleVariants>['color'];
			  }
	  )
	| {
			top?: undefined;
			left?: undefined;
			right?: undefined;
			center: true;
			opacity?: number;
			percent?: boolean;
			color?: VariantProps<typeof circleVariants>['color'];
	  }) {
	const unit = percent ? '%' : 'px';
	return (
		<div
			className={circleVariants({ color })}
			style={{
				top: center ? '50%' : `${top + unit}`,
				left: center
					? '50%'
					: left !== undefined
					? `${left + unit}`
					: undefined,
				right: center
					? '50%'
					: right !== undefined
					? `${right + unit}`
					: undefined,
				transform: center ? 'translate(-50%, -50%)' : undefined,
				opacity: opacity,
			}}
		/>
	);
}
