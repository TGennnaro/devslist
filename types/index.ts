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
	isEmployer: boolean;
	projects: string | undefined;
	[key: string]: string | boolean | FormDataEntryValue | undefined;
};

export type ExperienceEntry = {
	jobTitle: string | undefined;
	company: string | undefined;
	workLocation: string | undefined;
	description: string | undefined;
	startMonth: string | undefined;
	startYear: string | undefined;
	endMonth: string | undefined;
	endYear: string | undefined;
};

export type Job = {
	companyId: number;
	jobTitle: string | undefined;
	jobType: string | undefined;
	jobDescription: string | undefined;
	jobResponsibilities: string | undefined;
	jobRequirements: string | undefined;
	jobLocation?: string | undefined;
	skills: string | undefined;
	expirationDate: string | undefined;
	showPayRate: string | undefined;
	payType?: string | undefined;
	salary?: FormDataEntryValue | undefined;
	hourlyRate?: FormDataEntryValue | undefined;
};

export type JobFilters = {
	searchQuery: string | undefined;
	jobTypes: string[] | undefined;
};

export type GeocodeResult = {
	candidates: {
		address: string;
		location: { x: number; y: number };
		score: number;
	}[];
	spatialReference: { wkid: number; latestWkid: number };
};

export type GeoSuggestionResult = {
	suggestions: GeoSuggestion[];
};

export type GeoSuggestion = {
	text: string;
	magicKey: string;
	isCollection: boolean;
};

export type GitHubRepo = {
	id: number;
	name: string;
	html_url: string | null;
	description: string | null;
	homepage: string | null;
	language: string | null;
	owner?: {
		avatar_url: string;
	} | null;
};

export enum ApplicationStatus {
	PENDING,
	CONSIDERATION,
	ACCEPTED,
	REJECTED,
	WITHDRAWN,
}
