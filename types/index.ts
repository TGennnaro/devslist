import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export type ProfileFormEntry = {
	email?: string | undefined;
	firstName: string | undefined;
	lastName: string | undefined;
	profilePicture?: FormDataEntryValue | undefined;
	about: string | undefined;
	city: string | undefined;
	country: string | undefined;
	phoneNumber: string | undefined;
	birthday: string | undefined;
	[key: string]: string | FormDataEntryValue | undefined;
};
