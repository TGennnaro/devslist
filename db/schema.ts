import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
	pgTable,
	pgView,
	serial,
	text,
	uniqueIndex,
	integer,
	json,
	date,
	varchar,
	boolean,
	timestamp,
	real,
	customType,
} from 'drizzle-orm/pg-core';

// const bytea = customType<{ data: string; notNull: false; default: false }>({
// 	dataType() {
// 		return 'bytea';
// 	},
// 	toDriver(val) {
// 		let newVal = val;
// 		if (val.startsWith('0x')) {
// 			newVal = val.slice(2);
// 		}

// 		return Buffer.from(newVal, 'hex');
// 	},
// 	fromDriver(val: any) {
// 		return val.toString('hex');
// 	},
// });

export const Users = pgTable(
	'users',
	{
		userid: serial('userid').primaryKey(),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		phone: varchar('phone', { length: 15 }),
		email: text('email').notNull().unique(),
		password: text('password').notNull(),
		// profilePhoto: bytea('profile_photo').notNull(),
		city: text('city'),
		state: text('state'),
		country: text('country'),
		skills: json('skills').default([]).notNull(),
		// resume: bytea('resume'),
		about: text('about'),
		dob: date('dob'),
		roles: text('roles').$type<'user' | 'employer'>(),
		githubID: text('github_id'),
		gender: boolean('gender'),
		veteranStatus: boolean('veteran_status'),
		ethnicity: text('ethnicity'),
		disability: boolean('disability'),
	},
	(users) => {
		return {
			uniqueIdx: uniqueIndex('unique_idx').on(users.email),
		};
	}
);

export type User = typeof Users.$inferSelect;

// export const userView = pgView("user_view").as((qb) => qb.select().from(Users).where(eq(Users.roles, "user")));
// export const employerView = pgView("employer_view").as((qb) => qb.select().from(Users).where(eq(Users.roles, "employer")));

// export const Jobs = pgTable(
// 	'jobs',
// 	{
// 		jobid: serial('jobid').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		companyid: text('companyID')
// 			.notNull()
// 			.references(() => Company.companyid),
// 		jobTitle: text('jobTitle').notNull(),
// 		salary: integer('salary'),
// 		skills: json('skills').notNull(),
// 		address: text('address'),
// 		jobDescription: text('jobDescription').notNull(),
// 		jobType: text('jobType').notNull(),
// 		startDate: date('startDate').notNull(),
// 		endDate: date('endDate').notNull(),
// 	},
// 	(jobs) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(jobs.jobid),
// 		};
// 	}
// );

// export const Application = pgTable(
// 	'application',
// 	{
// 		appid: serial('appid').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		jobid: text('jobid')
// 			.notNull()
// 			.references(() => Jobs.jobid),
// 		applicationTimeStamp: timestamp('tim').notNull(),
// 		status: integer('status').notNull(),
// 	},
// 	(application) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(application.applicationTimeStamp),
// 		};
// 	}
// );

// export const link = pgTable(
// 	'link',
// 	{
// 		linkType: serial('linkType').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid)
// 			.primaryKey(),
// 		url: text('url').notNull(),
// 	},
// 	(link) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(link.url),
// 		};
// 	}
// );

// export const Experience = pgTable(
// 	'experience',
// 	{
// 		experienceid: serial('experienceid').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		startDate: date('startDate').notNull(),
// 		endDate: date('endDate').notNull(),
// 		company: text('company').notNull(),
// 		position: text('position').notNull().unique(),
// 		description: text('description').notNull(),
// 		addresss: text('addresss').notNull(),
// 	},
// 	(experience) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(experience.position),
// 		};
// 	}
// );

// export const Connection = pgTable(
// 	'connection',
// 	{
// 		connectionid: serial('connectionid').primaryKey(),
// 		user1id: text('user1id')
// 			.notNull()
// 			.references(() => Users.userid),
// 		user2id: text('user2id')
// 			.notNull()
// 			.references(() => Users.userid),
// 		status: integer('status').notNull(),
// 	},
// 	(connection) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(connection.connectionid),
// 		};
// 	}
// );

// export const Review = pgTable(
// 	'review',
// 	{
// 		reviewid: serial('userid').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		companyid: text('companyID')
// 			.notNull()
// 			.references(() => Company.companyid),
// 		rating: real('rating').notNull(),
// 		description: text('description').notNull(),
// 		reviewTimeStamp: timestamp('tim').notNull(),
// 	},
// 	(review) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(review.reviewTimeStamp),
// 		};
// 	}
// );

// export const Post = pgTable(
// 	'post',
// 	{
// 		postid: serial('postid').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		postTitle: text('postTitle').notNull(),
// 		postContent: text('postContent').notNull(),
// 		postTimeStamp: timestamp('tim').notNull(),
// 	},
// 	(post) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(post.postTimeStamp),
// 		};
// 	}
// );

// export const Company = pgTable(
// 	'company',
// 	{
// 		companyid: serial('companyid').primaryKey(),
// 		companyName: text('companyName').notNull(),
// 		postContent: text('postContent').notNull(),
// 		userid: text('userid').references(() => Users.userid),
// 		compamyTimeStamp: timestamp('tim').notNull(),
// 	},
// 	(company) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(company.compamyTimeStamp),
// 		};
// 	}
// );

// export const Education = pgTable(
// 	'education',
// 	{
// 		educationID: serial('educationID').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references(() => Users.userid),
// 		startDate: date('startDate').notNull(),
// 		endDate: date('endDate').notNull(),
// 		degree: text('degree').notNull(),
// 		major: text('major').notNull(),
// 		schoolName: text('schoolName').notNull(),
// 		gpa: real('gpa').notNull(),
// 	},
// 	(education) => {
// 		return {
// 			uniqueIdx: uniqueIndex('unique_idx').on(education.educationID),
// 		};
// 	}
// );
