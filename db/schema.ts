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
import { eq } from 'drizzle-orm';

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
});

export const Users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    phone: varchar('phone', { length: 15 }),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    profilePhoto: bytea('profile_photo'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    skills: json('skills').default([]).notNull(),
    resume: bytea('resume'),
    about: text('about'),
    dob: date('dob'),
    isEmployer: boolean('is_employer').default(false),
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

export const userView = pgView('user_view').as((qb) =>
  qb.select().from(Users).where(eq(Users.isEmployer, false))
);
export const employerView = pgView('employer_view').as((qb) =>
  qb.select().from(Users).where(eq(Users.isEmployer, true))
);

export const Jobs = pgTable('jobs', {
  jobid: serial('jobid').primaryKey(),
  userid: integer('userid')
    .notNull()
    .references(() => Users.id),
  companyid: integer('company_id')
    .notNull()
    .references(() => Company.companyid),
  jobTitle: text('jobTitle').notNull(),
  showPayRate: boolean('showPayRate').default(true).notNull(),
  payType: text('payType'),
  hourlyRate: real('hourlyRate'),
  salary: real('salary'),
  skills: json('skills').notNull(),
  address: text('address'),
  jobDescription: text('jobDescription').notNull(),
  jobResponsibilities: text('jobResponsibilities').notNull(),
  jobRequirements: text('jobRequirements').notNull(),
  jobType: text('jobType').notNull(),
  startDate: date('startDate').notNull(),
  endDate: date('endDate').notNull(),
});

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

export const Company = pgTable('company', {
  companyid: serial('companyid').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  userid: integer('userid').references(() => Users.id),
  logo: bytea('logo').notNull(),
  url: text('url'),
});

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
