CREATE TABLE public.users (
	id serial NOT NULL,
	telephone varchar(30) NOT NULL,
	post_code  varchar(30) NULL,
	home_address  varchar(300) NULL,
	first_name varchar(300) NULL,
	last_name varchar(300) NULL,
	"password" varchar(300) NULL,
	CONSTRAINT "PK_USERS_ID" PRIMARY KEY (id)
);
