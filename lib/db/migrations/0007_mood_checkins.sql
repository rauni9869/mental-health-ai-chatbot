CREATE TABLE IF NOT EXISTS "MoodCheckIn" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chatId" uuid,
	"mood" varchar(32) NOT NULL,
	"intensity" integer,
	"notes" text,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "MoodCheckIn_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MoodCheckIn" ADD CONSTRAINT "MoodCheckIn_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MoodCheckIn" ADD CONSTRAINT "MoodCheckIn_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
