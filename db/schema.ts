import {
	mysqlTable,
	mysqlView,
	serial,
	text,
	uniqueIndex,
	int,
	json,
	date,
	varchar,
	boolean,
	timestamp,
	real,
	customType,
	double,
	tinyint,
	primaryKey,
	mysqlEnum,
	smallint,
} from 'drizzle-orm/mysql-core';
import { eq, relations, sql } from 'drizzle-orm';
import { ApplicationStatus } from '@/types';

export const Users = mysqlTable(
	'users',
	{
		id: serial('id').primaryKey(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		phone: varchar('phone', { length: 15 }),
		email: varchar('email', { length: 255 }).notNull().unique(),
		password: text('password'),
		picture_url: text('picture_url'),
		city: text('city'),
		state: text('state'),
		country: text('country'),
		skills: json('skills').default([]).notNull(),
		// resume: bytea('resume'),
		about: text('about'),
		dob: date('dob'),
		isEmployer: boolean('is_employer').default(false),
		companyId: int('company_id'),
		githubID: text('github_id'),
		githubAccessToken: text('github_access_token'),
		gender: boolean('gender'),
		veteranStatus: boolean('veteran_status'),
		ethnicity: text('ethnicity'),
		disability: boolean('disability'),
	}
	// (users) => {
	// 	return {
	// 		uniqueIdx: uniqueIndex('unique_idx').on(users.email),
	// 	};
	// }
);

export type User = typeof Users.$inferSelect;

export const userView = mysqlView('user_view').as((qb) =>
	qb.select().from(Users).where(eq(Users.isEmployer, false))
);
export const employerView = mysqlView('employer_view').as((qb) =>
	qb.select().from(Users).where(eq(Users.isEmployer, true))
);

export const usersRelations = relations(Users, ({ many }) => ({
	jobs: many(Jobs),
	companies: many(Company),
	applications: many(Application),
}));

export const Jobs = mysqlTable('jobs', {
	id: serial('id').primaryKey(),
	userId: int('user_id').notNull(),
	companyId: int('company_id').notNull(),
	jobTitle: text('job_title').notNull(),
	showPayRate: boolean('show_pay_rate').default(true).notNull(),
	payType: text('pay_type'),
	hourlyRate: double('hourly_rate'),
	salary: double('salary'),
	skills: json('skills').default([]).notNull(),
	address: text('address'),
	longitude: double('longitude'),
	latitude: double('latitude'),
	jobDescription: text('job_description').notNull(),
	jobResponsibilities: text('job_responsibilities').notNull(),
	jobRequirements: text('job_requirements').notNull(),
	jobType: text('job_type').notNull(),
	startDate: date('start_date').default(new Date()).notNull(),
	endDate: date('end_date').notNull(),
});

export type Job = typeof Jobs.$inferSelect;

export const jobsRelations = relations(Jobs, ({ one, many }) => ({
	user: one(Users, {
		fields: [Jobs.userId],
		references: [Users.id],
	}),
	company: one(Company, {
		fields: [Jobs.companyId],
		references: [Company.id],
	}),
	applications: many(Application),
}));

export const GitHubProjects = mysqlTable('githubProjects', {
	id: serial('id').primaryKey(),
	userId: int('userId').notNull(),
	repoId: int('repoId').notNull(),
	projectName: varchar('projectName', { length: 255 }).notNull(),
	githubUrl: varchar('githubUrl', { length: 255 }),
	projectDescription: text('projectDescription'),
	homepageUrl: varchar('homepageUrl', { length: 255 }),
	language: varchar('language', { length: 100 }),
});

export type GitHubProject = typeof GitHubProjects.$inferSelect;

export const githubProjectsRelations = relations(GitHubProjects, ({ one }) => ({
	user: one(Users, {
		fields: [GitHubProjects.userId],
		references: [Users.id],
	}),
}));

export const Application = mysqlTable(
	'application',
	{
		id: serial('id').primaryKey(),
		userId: int('user_id').notNull(),
		jobId: int('job_id').notNull(),
		created: timestamp('created').defaultNow(),
		lastModified: timestamp('last_modified').defaultNow(),
		status: smallint('status').$type<ApplicationStatus>(),
	},
	(application) => {
		return {
			uniqueIdx: uniqueIndex('unique_idx').on(application.created),
		};
	}
);

export type Application = typeof Application.$inferSelect;

export const applicationRelations = relations(Application, ({ one }) => ({
	user: one(Users, {
		fields: [Application.userId],
		references: [Users.id],
	}),
	job: one(Jobs, {
		fields: [Application.jobId],
		references: [Jobs.id],
	}),
}));

// export const link = pgTable(
// 	'link',
// 	{
// 		linkType: serial('linkType').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
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
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
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
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
// 		user2id: text('user2id')
// 			.notNull()
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
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
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
// 		companyid: text('companyID')
// 			.notNull()
// 			.references() => Company.companyid, { onDelete: 'CASCADE' },
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
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
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

export const Company = mysqlTable('company', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	address: text('address').notNull(),
	userId: int('user_id').notNull(),
	logo: text('logo'),
	url: text('url'),
});

export type Company = typeof Company.$inferSelect;

export const companyRelations = relations(Company, ({ one }) => ({
	user: one(Users, {
		fields: [Company.userId],
		references: [Users.id],
	}),
}));

// export const Education = pgTable(
// 	'education',
// 	{
// 		educationID: serial('educationID').primaryKey(),
// 		userid: text('userid')
// 			.notNull()
// 			.references() => Users.userid, { onDelete: 'CASCADE' },
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

export const Messages = mysqlTable(
	'messages',
	{
		id: int('id').autoincrement().notNull(),
		fromId: int('from_id'),
		toId: int('to_id'),
		subject: varchar('subject', { length: 100 }),
		body: text('body'),
		isOpened: tinyint('is_opened'),
		timeSent: timestamp('time_sent', { mode: 'string' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		parentMessageId: int('parent_message_id'),
	},
	(table) => {
		return {
			messagesId: primaryKey({ columns: [table.id], name: 'messages_id' }),
		};
	}
);

export type Message = typeof Messages.$inferSelect;
