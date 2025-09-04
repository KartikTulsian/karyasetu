import { z } from "zod";

export const userSchema = z.object({
  user_id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  college_name: z.string().min(2, "College name is required"),
  course: z.string().min(2, "Course is required"),
  year: z
    .number()
    .int()
    .min(1, "Year must be at least 1")
    .max(5, "Year cannot be greater than 5"),
  profile_pic_url: z.string().optional().or(z.literal("")),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const eventSchema = z.object({
  event_id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  date: z.string().min(1, { message: "Date is required!" }),
  startTime: z.string().min(1, { message: "Start time is required!" }),
  endTime: z.string().min(1, { message: "End time is required!" }),
  registration_deadline: z.string().optional(),

  venue: z.string().min(1, { message: "Venue is required!" }),
  organising_committee: z.string().optional().or(z.literal("")),
  entry_fee: z.coerce.number().optional().nullable(),
  use_custom_form: z.boolean().default(false),
  registration_link: z.string().optional().or(z.literal("")),
  poster_url: z.string().optional().or(z.literal("")),
  max_team_size: z.coerce.number().optional().nullable(),
  event_status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"], { message: "Status is required!" }),
  visibility: z.enum(["PUBLIC", "COLLEGE", "GROUP"], { message: "Visibility is required!" }),
  category: z.enum(
    ["TECHNICAL", "CULTURAL", "SEMINAR", "WORKSHOP", "SPORTS", "HACKATHON",
      "QUIZ", "DRAMATICS", "MUSIC", "DANCE", "LITERARY", "ART", "MANAGEMENT", "SOCIAL"],
    { message: "Category is required!" }
  ),

  organiser_user_id: z.string().min(1, { message: "Organiser is required!" }),
  clubs: z.array(z.string()).optional(), // For club mapping
})
.refine((data) => {
  if (!data.registration_deadline) return true; // skip if not provided
  const deadline = new Date(data.registration_deadline);
  const eventDate = new Date(data.date);
  return deadline <= eventDate;
}, {
  message: "Registration deadline cannot exceed the event date",
  path: ["registration_deadline"], // attach error to that field
});

export type EventSchema = z.infer<typeof eventSchema>;

export const offerSchema = z.object({
  offer_id: z.string().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "Description is required!" }),
  //   created_by: z.string().min(1, { message: "Creator name is required!" }),
  //   event_id: z.string().optional(),
  target_group_type: z.enum(["ALL", "COLLEGE", "EVENT_PARTICIPANTS"], { message: "Group Type is required!" }),
  target_college_name: z.string().optional(),
  target_event_name: z.string().optional(),
  offer_type: z.enum(["TEAM_RECRUITMENT", "ANNOUNCEMENT"], { message: "Offer Type is required!" }),
  //   created_at: z.coerce.date(),
  //   creator: z.string().min(1, { message: "Proposer is required!" }),
});

export type OfferSchema = z.infer<typeof offerSchema>;

export const clubSchema = z.object({
  club_id: z.string().optional(),
  name: z.string().min(1, { message: "Club name is required!" }),
  college_name: z.string().min(1, { message: "College name is required!" }),
  description: z.string().optional(),
  eventLinks: z.string().optional(),
});

export type ClubSchema = z.infer<typeof clubSchema>;

export const resultSchema = z.object({
  result_id: z.string().optional(),
  result_text: z
    .string()
    .min(1, { message: "Result Description is required!" }),
  visible_to: z.enum(["ALL", "COLLEGE", "EVENT_PARTICIPANTS"], {
    message: "Group Type is required!",
  }),
  // media_url: z
  // .string()
  // .optional()
  // .or(z.literal(""))
  // .transform((val) => (val === "" ? undefined : val)),
  media_url: z.string().optional().or(z.literal("")),

  event_id: z.string().min(1, { message: "Event selection is required!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const participationTeamSchema = z.object({
  // PARTICIPATION FIELDS
  participation_id: z.string().optional(), // Only needed for update
  participant_name: z.string().min(1, { message: "Participant name is required!" }),
  event_id: z.string().min(1, { message: "Event selection is required!" }),
  is_team_leader: z.boolean(),

  // TEAM CREATION FIELDS
  create_team: z.boolean(), // Whether this participant is creating a team
  team_name: z.string().min(1, { message: "Team name is required!" }),
  max_team_size: z
    .number({ message: "Max team size must be a number" })
    .int()
    .min(0, { message: "Team size cannot be negative" })
    .optional(),
  member_emails: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // optional
      // check for comma-separated valid emails
      const emails = val.split(",").map((e) => e.trim());
      return emails.every((email) => /^\S+@\S+\.\S+$/.test(email));
    }, { message: "Please enter valid comma-separated emails" }),
})
.refine((data) => {
  // If creating a team or user is team leader, team_name and max_team_size are required
  if (data.is_team_leader || data.create_team) {
    if (data.max_team_size) {
      const emails = data.member_emails
        ? data.member_emails.split(",").map((e) => e.trim()).filter(Boolean)
        : [];
      const teamCount = 1 + emails.length; // leader + members
      return teamCount <= data.max_team_size;
    }
  }
  return true;
}, {
  message: "Team name and max team size are required when creating a team",
  path: ["team_name"], // attach error to team_name (can also attach max_team_size if needed)
});

// TypeScript type inferred from schema
export type ParticipationTeamSchema = z.infer<typeof participationTeamSchema>;