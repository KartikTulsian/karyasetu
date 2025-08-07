-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'COLLEGE', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."OfferType" AS ENUM ('TEAM_RECRUITMENT', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "public"."GroupType" AS ENUM ('ALL', 'COLLEGE', 'EVENT_PARTICIPANTS');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "college_name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "profile_pic_url" TEXT,
    "bio" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "event_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "organising_committee" TEXT,
    "entry_fee" DOUBLE PRECISION,
    "registration_link" TEXT,
    "poster_url" TEXT,
    "max_team_size" INTEGER,
    "registration_deadline" TIMESTAMP(3),
    "event_status" "public"."EventStatus" NOT NULL,
    "visibility" "public"."Visibility" NOT NULL,
    "category_id" TEXT NOT NULL,
    "organiser_user_id" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "public"."EventParticipation" (
    "participation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "team_id" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_team_leader" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventParticipation_pkey" PRIMARY KEY ("participation_id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "team_id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "max_members" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "public"."Offer" (
    "offer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "event_id" TEXT,
    "target_group_type" "public"."GroupType" NOT NULL,
    "target_college_name" TEXT,
    "target_event_id" TEXT,
    "offer_type" "public"."OfferType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("offer_id")
);

-- CreateTable
CREATE TABLE "public"."Result" (
    "result_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "announced_by" TEXT NOT NULL,
    "result_text" TEXT NOT NULL,
    "media_url" TEXT,
    "visible_to" "public"."GroupType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "public"."EventGallery" (
    "media_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" "public"."MediaType" NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventGallery_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "public"."Club" (
    "club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "college_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("club_id")
);

-- CreateTable
CREATE TABLE "public"."EventClubMapping" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "club_id" TEXT NOT NULL,

    CONSTRAINT "EventClubMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Event_category_id_idx" ON "public"."Event"("category_id");

-- CreateIndex
CREATE INDEX "Event_organiser_user_id_idx" ON "public"."Event"("organiser_user_id");

-- CreateIndex
CREATE INDEX "EventParticipation_team_id_idx" ON "public"."EventParticipation"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipation_user_id_event_id_key" ON "public"."EventParticipation"("user_id", "event_id");

-- CreateIndex
CREATE INDEX "Team_event_id_idx" ON "public"."Team"("event_id");

-- CreateIndex
CREATE INDEX "Offer_target_event_id_idx" ON "public"."Offer"("target_event_id");

-- CreateIndex
CREATE INDEX "Offer_created_by_idx" ON "public"."Offer"("created_by");

-- CreateIndex
CREATE INDEX "Result_event_id_idx" ON "public"."Result"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventClubMapping_event_id_club_id_key" ON "public"."EventClubMapping"("event_id", "club_id");

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_organiser_user_id_fkey" FOREIGN KEY ("organiser_user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventParticipation" ADD CONSTRAINT "EventParticipation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventParticipation" ADD CONSTRAINT "EventParticipation_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventParticipation" ADD CONSTRAINT "EventParticipation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_announced_by_fkey" FOREIGN KEY ("announced_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventGallery" ADD CONSTRAINT "EventGallery_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventGallery" ADD CONSTRAINT "EventGallery_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventClubMapping" ADD CONSTRAINT "EventClubMapping_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventClubMapping" ADD CONSTRAINT "EventClubMapping_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."Club"("club_id") ON DELETE RESTRICT ON UPDATE CASCADE;
