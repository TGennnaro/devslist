'use client';

import ReactCountUp, { CountUpProps } from 'react-countup';

export default function CountUp(props: CountUpProps) {
	const { end = props.end, ...rest } = props;
	return <ReactCountUp end={end} {...rest} />;
}
