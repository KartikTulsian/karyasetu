"use server"

import { clubSchema, ClubSchema, EventSchema, offerSchema, OfferSchema, participationTeamSchema, ParticipationTeamSchema, resultSchema, ResultSchema, UserSchema } from "./formValidationSchema";
import prisma from "./prisma";
import { EventStatus } from "@prisma/client";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: string | boolean }

export const createUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "No authenticated user found." };
    }

    const userId = clerkUser.id;

    if (!data.password) {
      return { success: false, error: "Password is required when creating the profile." };
    }

    await prisma.user.create({
      data: {
        user_id: userId,
        name: data.name,
        email: data.email,
        password: data.password, // ⚠️ You should hash this before saving in production
        college_name: data.college_name,
        course: data.course,
        year: data.year,
        ...(data.profile_pic_url && { profile_pic_url: data.profile_pic_url }),
        ...(data.bio && { bio: data.bio }),
        ...(data.phone_number && { phone_number: data.phone_number }),
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Error creating user:", err);
    return { success: false, error: err.message || true };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: UserSchema & { user_id: string }
) => {
  try {
    const clerk = await clerkClient();

    if (!data.user_id) {
      return {
        success: false,
        error: "Missing user_id",
      };
    }

    await clerk.users.updateUser(data.user_id, {
      firstName: data.name,
    });

    await prisma.user.update({
      where: {
        user_id: data.user_id,
      },
      data: {
        name: data.name,
        // ...(data.email && { email: data.email }),
        college_name: data.college_name,
        course: data.course,
        year: data.year,
        ...(data.password && { password: data.password }),
        ...(data.profile_pic_url && { profile_pic_url: data.profile_pic_url }),
        ...(data.bio && { bio: data.bio }),
        ...(data.phone_number && { phone_number: data.phone_number }),
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Error updating user:", err);
    return { success: false, error: err.message || true };
  }
};

export const deleteUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const clerk = await clerkClient();

    await prisma.user.delete({
      where: {
        user_id: id
      },
    });

    await clerk.users.deleteUser(id);

    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema & { gallery?: string[] }
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        start_time: new Date(`${data.date}T${data.startTime}`),
        end_time: new Date(`${data.date}T${data.endTime}`),
        venue: data.venue,
        organising_committee: data.organising_committee || null,
        ...(data.poster_url && { poster_url: data.poster_url }),
        entry_fee: data.entry_fee,
        max_team_size: data.max_team_size || null,
        registration_link: data.use_custom_form ? null : data.registration_link || null,
        use_custom_form: data.use_custom_form ?? false,
        registration_deadline: data.registration_deadline ? new Date(data.registration_deadline) : null,
        event_status: data.event_status,
        visibility: data.visibility,
        category: data.category,
        organiser_user_id: data.organiser_user_id,

        ...(data.clubs && {
          clubs: {
            create: data.clubs.map((clubId) => ({
              club: { connect: { club_id: clubId } },
            })),
          },
        }),

        ...(data.gallery?.length
          ? {
            gallery: {
              create: data.gallery.map((url) => ({
                media_url: url,
                media_type: url.match(/\.(mp4|mov|avi|mkv)$/i) ? "VIDEO" : "IMAGE",
                uploaded_by: data.organiser_user_id,
              })),
            },
          }
          : {}
        ),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema & { gallery?: string[] }
) => {
  try {
    if (!data.event_id) {
      return { success: false, error: "Event ID is required for update" };
    }

    await prisma.$transaction(async (tx) => {
      // clear child relations first
      await tx.eventGallery.deleteMany({ where: { event_id: data.event_id } });
      await tx.eventClubMapping.deleteMany({ where: { event_id: data.event_id } });

      // update event
      await tx.event.update({
        where: { event_id: data.event_id },
        data: {
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          start_time: new Date(`${data.date}T${data.startTime}`),
          end_time: new Date(`${data.date}T${data.endTime}`),
          venue: data.venue,
          organising_committee: data.organising_committee || null,
          poster_url: data.poster_url || null, // ✅ reset to null if removed
          entry_fee: data.entry_fee,
          max_team_size: data.max_team_size,
          registration_link: data.use_custom_form
            ? null
            : data.registration_link || null, // ✅ ensure proper nulling
          use_custom_form: data.use_custom_form ?? false,
          registration_deadline: data.registration_deadline
            ? new Date(data.registration_deadline)
            : null,
          event_status: data.event_status,
          visibility: data.visibility,
          category: data.category,
          organiser_user_id: data.organiser_user_id,

          // ✅ re-create clubs
          ...(data.clubs && data.clubs.length > 0 && {
            clubs: {
              create: data.clubs.map((clubId) => ({
                club: { connect: { club_id: clubId } },
              })),
            },
          }),

          // ✅ re-create gallery
          ...(data.gallery && data.gallery.length > 0 && {
            gallery: {
              create: data.gallery.map((url) => ({
                media_url: url,
                media_type: url.match(/\.(mp4|mov|avi|mkv|webm)$/i)
                  ? "VIDEO"
                  : "IMAGE",
                uploaded_by: data.organiser_user_id,
              })),
            },
          }),
        },
      });
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};


export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const event_id = data.get("event_id") as string;
  try {
    // Delete child records first
    await prisma.eventGallery.deleteMany({ where: { event_id } });
    await prisma.eventClubMapping.deleteMany({ where: { event_id } });
    await prisma.eventParticipation.deleteMany({
      where: { event_id }
    });

    await prisma.team.deleteMany({
      where: { event_id }
    });

    // Delete offers
    await prisma.offer.deleteMany({
      where: { event_id }
    });

    // Delete results
    await prisma.result.deleteMany({
      where: { event_id }
    });

    // Finally delete the event
    await prisma.event.delete({
      where: { event_id }
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createOffer = async (
  currentState: CurrentState,
  data: OfferSchema
) => {
  try {

    const parsed = offerSchema.parse(data);

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be logged in to create an offer." }
    }

    let eventId: string | undefined = undefined;

    if (parsed.target_event_name) {
      const event = await prisma.event.findFirst({
        where: {
          title: { equals: parsed.target_event_name, mode: 'insensitive' },
          event_status: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
        },
        select: { event_id: true },
      });

      if (!event) {
        return { success: false, error: "Invalid event name. Please enter a valid upcoming/ongoing event." };
      }

      eventId = event.event_id;
    }

    await prisma.offer.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        created_by: userId,
        event_id: eventId,
        target_group_type: parsed.target_group_type,
        target_college_name: parsed.target_college_name,
        target_event_id: eventId,
        offer_type: parsed.offer_type,
        created_at: new Date(),
      },
    });

    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}

export const updateOffer = async (
  currentState: CurrentState,
  data: OfferSchema
) => {
  try {
    if (!data.offer_id) {
      return { success: false, error: "Offer ID is required for update." };
    }

    const parsed = offerSchema.parse(data);

    await prisma.offer.update({
      where: {
        offer_id: data.offer_id,
      },
      data: {
        title: parsed.title,
        description: parsed.description,
        target_group_type: parsed.target_group_type,
        target_college_name: parsed.target_college_name,
        offer_type: parsed.offer_type,
      },
    });

    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteOffer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.offer.delete({
      where: {
        offer_id: id
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });


    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClub = async (
  currentState: CurrentState,
  data: ClubSchema
) => {
  try {
    const parsed = clubSchema.parse(data);

    const { userId } = await auth();
    if (!userId) return { success: false, error: "You must be logged in." };

    const club = await prisma.club.create({
      data: {
        name: parsed.name,
        description: parsed.description || null,
        college_name: parsed.college_name,
      },
    });

    const eventNames = parsed.eventLinks?.split(",").map(s => s.trim()).filter(Boolean) || [];

    if (eventNames.length > 0) {
      const events = await prisma.event.findMany({
        where: {
          title: { in: eventNames, mode: "insensitive" },
          event_status: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
        },
        select: { event_id: true },
      });

      await prisma.eventClubMapping.createMany({
        data: events.map(ev => ({
          event_id: ev.event_id,
          club_id: club.club_id,
        })),
        skipDuplicates: true,
      });
    }

    return { success: true, error: false, club }; // return the club
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong" };
  }
};


export const updateClub = async (
  currentState: CurrentState,
  data: ClubSchema
) => {
  try {
    const parsed = clubSchema.parse(data);

    const club = await prisma.club.update({
      where: { club_id: parsed.club_id },
      data: {
        name: parsed.name,
        description: parsed.description || null,
        college_name: parsed.college_name,
      },
    });

    // Clear old mappings
    // await prisma.eventClubMapping.deleteMany({
    //   where: { club_id: club.club_id },
    // });

    // const eventNames =
    //   parsed.eventLinks
    //     ?.split(",")
    //     .map((s) => s.trim())
    //     .filter((s) => s.length > 0) || [];

    const eventNames = parsed.eventLinks?.split(",").map(s => s.trim()).filter(Boolean) || [];

    if (eventNames.length > 0) {
      const events = await prisma.event.findMany({
        where: {
          title: { in: eventNames, mode: "insensitive" },
          event_status: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
        },
        select: { event_id: true },
      });

      await prisma.eventClubMapping.createMany({
        data: events.map((ev) => ({
          event_id: ev.event_id,
          club_id: club.club_id,
        })),
        skipDuplicates: true,
      });
    }

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Something went wrong" };
  }
};


export const deleteClub = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.club.delete({
      where: {
        club_id: id
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });


    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    const parsed = resultSchema.parse(data);

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be logged in to create a result." };
    }

    // Resolve event_id from event_name
    // const eventTitle = parsed.event_name.trim();

    // const event = await prisma.event.findFirst({
    //   where: { title: { equals: eventTitle, mode: "insensitive" }, event_status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] } },
    //   select: { event_id: true },
    // });


    // if (!event) {
    //   return {
    //     success: false,
    //     error: "Invalid event name. Please enter a valid ongoing/completed event.",
    //   };
    // }
    const mediaUrl = parsed.media_url?.trim() || null;

    await prisma.result.create({
      data: {
        result_text: parsed.result_text,
        announced_by: userId,
        event_id: parsed.event_id,
        visible_to: parsed.visible_to,
        media_url: mediaUrl,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong" };
  }
};


export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    if (!data.result_id) {
      return { success: false, error: "Result ID is required for update." };
    }

    const parsed = resultSchema.parse(data);

    // Resolve event_id from event_name (if user updates event)
    // const event = await prisma.event.findFirst({
    //   where: {
    //     title: { equals: parsed.event_name, mode: "insensitive" },
    //     event_status: { in: [EventStatus.ONGOING, EventStatus.COMPLETED] },
    //   },
    //   select: { event_id: true },
    // });

    // if (!event) {
    //   return {
    //     success: false,
    //     error: "Invalid event name. Please enter a valid ongoing/completed event.",
    //   };
    // }

    const mediaUrl = parsed.media_url?.trim() || null;

    await prisma.result.update({
      where: { result_id: data.result_id },
      data: {
        result_text: parsed.result_text,
        visible_to: parsed.visible_to,
        media_url: mediaUrl,
        event_id: parsed.event_id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong" };
  }
};


export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        result_id: id
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });


    // revalidatePath("/list/announcement");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createParticipation = async (
  currentState: CurrentState,
  data: ParticipationTeamSchema
) => {
  try {
    const parsed = participationTeamSchema.parse(data);

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be logged in to participate." };
    }

    let teamId: string | undefined;
    let memberUserIds: string[] = [userId]; // ✅ Always include the creator

    if (parsed.is_team_leader || parsed.create_team) {
      // Create team first
      const team = await prisma.team.create({
        data: {
          team_name: parsed.team_name!,
          event_id: parsed.event_id,
          max_members: parsed.max_team_size!,
          created_by: userId,
        },
      });
      teamId = team.team_id;

      // Add other members if emails are provided
      if (parsed.member_emails) {
        const emails = parsed.member_emails
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);

        if (emails.length) {
          const users = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { user_id: true, email: true },
          });

          const foundUserIds = users.map((u) => u.user_id);
          memberUserIds.push(...foundUserIds);

          // ❌ Instead of failing, warn if some emails were not found
          const notFound = emails.filter(
            (e) => !users.find((u) => u.email === e)
          );
          if (notFound.length) {
            console.warn("Some emails not found:", notFound);
          }

          // ✅ Enforce max team size
          if (parsed.max_team_size && memberUserIds.length > parsed.max_team_size) {
            return {
              success: false,
              error: `Team cannot have more than ${parsed.max_team_size} members.`,
            };
          }
        }
      }
    }

    // Remove duplicate IDs
    memberUserIds = Array.from(new Set(memberUserIds));

    if (
      parsed.max_team_size !== undefined &&
      parsed.max_team_size !== 0 &&
      memberUserIds.length > parsed.max_team_size
    ) {
      return {
        success: false,
        error: `Team cannot have more than ${parsed.max_team_size} members.`,
      };
    }


    await prisma.eventParticipation.createMany({
      data: memberUserIds.map((uid) => ({
        user_id: uid,
        event_id: parsed.event_id,
        is_team_leader: uid === userId,
        team_id: teamId,
      })),
      skipDuplicates: true,
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error(err);
    if (err?.name === "ZodError") {
      return { success: false, error: err.errors };
    }
    return { success: false, error: "Something went wrong" };
  }
};


export const updateParticipation = async (
  currentState: CurrentState,
  data: ParticipationTeamSchema
) => {
  try {
    const parsed = participationTeamSchema.parse(data);

    if (!parsed.participation_id) {
      return { success: false, error: "Participation ID is required for update." };
    }

    // Update team info if leader and creating a team
    if (parsed.create_team && parsed.team_name && parsed.max_team_size) {
      const existingParticipation = await prisma.eventParticipation.findUnique({
        where: { participation_id: parsed.participation_id },
        include: { team: true },
      });

      if (existingParticipation?.team) {
        await prisma.team.update({
          where: { team_id: existingParticipation.team.team_id },
          data: {
            team_name: parsed.team_name,
            max_members: parsed.max_team_size,
          },
        });
      }

      if (
        parsed.max_team_size !== undefined &&
        parsed.max_team_size !== 0
      ) {
        const existingMembers = await prisma.eventParticipation.count({
          where: { team_id: existingParticipation?.team_id },
        });

        if (existingMembers > parsed.max_team_size) {
          return {
            success: false,
            error: `Team already has ${existingMembers} members, which exceeds the new limit of ${parsed.max_team_size}.`,
          };
        }
      }

    }


    // Update participation itself
    await prisma.eventParticipation.update({
      where: { participation_id: parsed.participation_id },
      data: {
        is_team_leader: parsed.is_team_leader,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    console.error(err);
    if (err?.name === "ZodError") {
      return { success: false, error: err.errors };
    }
    return { success: false, error: "Something went wrong" };
  }
};

export const deleteParticipation = async (
  currentState: CurrentState,
  data: FormData
) => {
  const participation_id = data.get("participation_id") as string;
  try {
    const participation = await prisma.eventParticipation.findUnique({
      where: { participation_id: participation_id },
    });

    if (!participation) {
      return { success: false, error: "Participation not found." };
    }

    // Delete team if leader
    if (participation.is_team_leader && participation.team_id) {
      await prisma.team.delete({
        where: { team_id: participation.team_id },
      });
    }

    await prisma.eventParticipation.delete({
      where: { participation_id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
