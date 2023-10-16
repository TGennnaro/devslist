import { cva, VariantProps } from 'class-variance-authority';

const circleVariants = cva('rounded-full w-48 h-48 absolute blur-[109px]', {
	variants: {
		color: {
			primary: 'bg-primary-500',
			secondary: 'bg-secondary',
		},
	},
	defaultVariants: {
		color: 'primary',
	},
});

export default function GlowCircle({
	top,
	left,
	center = false,
	opacity = 0.8,
	percent = false,
	color,
}:
	| {
			top: number;
			left: number;
			center?: boolean;
			opacity?: number;
			percent?: boolean;
			color?: VariantProps<typeof circleVariants>['color'];
	  }
	| {
			top?: number;
			left?: number;
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
				left: center ? '50%' : `${left + unit}`,
				transform: center ? 'translate(-50%, -50%)' : undefined,
				opacity: opacity,
			}}
		/>
	);
}
