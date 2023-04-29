CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"username" varchar(30) NOT NULL,
	"password" varchar(30) NOT NULL,
	"last_request" TIMESTAMP,
	"show_status" BOOLEAN NOT NULL DEFAULT '1',
	"active" BOOLEAN NOT NULL DEFAULT '1',
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.chats" (
	"id" serial NOT NULL,
	"data" json NOT NULL,
	"last_message" varchar(255),
	"last_message_date" TIMESTAMP,
	CONSTRAINT "chats_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.users_chats" (
	"user_id" integer NOT NULL,
	"other_user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	CONSTRAINT "users_chats_pk" PRIMARY KEY ("user_id","other_user_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "users_chats" ADD CONSTRAINT "users_chats_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_chats" ADD CONSTRAINT "users_chats_fk1" FOREIGN KEY ("other_user_id") REFERENCES "users"("id");
ALTER TABLE "users_chats" ADD CONSTRAINT "users_chats_fk2" FOREIGN KEY ("chat_id") REFERENCES "chats"("id");