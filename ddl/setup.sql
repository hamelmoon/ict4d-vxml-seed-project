CREATE TABLE public.farmers (
	id serial NOT NULL,
	phone_number varchar(50) NOT NULL,
	street_name varchar(300) NULL,
	house_number varchar(50) NULL,
	zip_code varchar(50) NULL,
	first_name varchar(300) NULL,
	last_name varchar(300) NULL,
	pin_code integer NOT NULL,
	created_at TIMESTAMPTZ DEFAULT Now(),
	modified_at TIMESTAMPTZ DEFAULT Now(),
	UNIQUE(phone_number),
	CONSTRAINT "PK_FARMERS_ID" PRIMARY KEY (id)
);

CREATE TABLE public.call_history (
	id serial NOT NULL,
	phone_number varchar(50) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT Now(),	
	CONSTRAINT "PK_CALL_HISTORY_ID" PRIMARY KEY (id)
);

CREATE TABLE public.system_users (
	id serial NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"password" varchar(300) NULL,
	created_at TIMESTAMPTZ DEFAULT Now(),
	modified_at TIMESTAMPTZ DEFAULT Now(),
	CONSTRAINT "PK_SYSTEM_USERS_ID" PRIMARY KEY (id)
);

CREATE TABLE public.agent (
	id serial NOT NULL,
	agent_type smallint NOT NULL,
	"name" varchar(100) NOT NULL,
	phone_number varchar(50) NULL,
	created_at TIMESTAMPTZ DEFAULT Now(),
	modified_at TIMESTAMPTZ DEFAULT Now(),
	CONSTRAINT "PK_AGENT_ID" PRIMARY KEY (id)
);

CREATE TABLE public.listings (
	id serial NOT NULL,
	farmer_id integer references public.farmers(id) NOT NULL,
	seed_type varchar(50) NOT NULL,
	seed_weight integer NOT NULL,
	seed_price numeric NOT NULL,
	created_at TIMESTAMPTZ DEFAULT Now(),
	modified_at TIMESTAMPTZ DEFAULT Now(),
	CONSTRAINT "PK_LISTING_ID" PRIMARY KEY (id)
);


INSERT INTO public.farmers
(phone_number, street_name, house_number, zip_code, first_name, last_name, pin_code, created_at, modified_at)
VALUES('31645313215', 'Test Street', '100', '1085DP', 'Test', 'Von', 1234, now(), now());


INSERT INTO public.listings
(farmer_id, seed_type, seed_weight, seed_price, created_at, modified_at)
VALUES(1, 'rice', 1, 10, now(), now());


