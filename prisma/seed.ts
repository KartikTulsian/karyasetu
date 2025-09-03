// prisma/seed.ts

import { PrismaClient, EventStatus, Visibility, GroupType, OfferType, MediaType, EventCategory } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KaryaSetu Seed...");

  // Create Categories
  // const categories = await prisma.category.createMany({
  //   data: [
  //     { name: "Technical" },
  //     { name: "Cultural" },
  //     { name: "Seminar" },
  //     { name: "Hackathon" },
  //   ],
  // });

  // const allCategories = await prisma.category.findMany();

  const categories = Object.values(EventCategory);

  // Create Clubs
  const clubs = await prisma.club.createMany({
    data: [
      { name: "IEM Coders Club", college_name: "IEM" },
      { name: "UEM Music Society", college_name: "UEM" },
      { name: "TechTalks Club", college_name: "IEM" },
    ],
  });

  const allClubs = await prisma.club.findMany();

  // Create Users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@clg.com`,
        password: `pass${i}`,
        college_name: i % 2 === 0 ? "IEM" : "UEM",
        course: i % 2 === 0 ? "B.Tech IT" : "BCA",
        year: (i % 4) + 1,
        profile_pic_url: null,
        bio: `Hello, I'm user ${i}`,
        phone_number: `90000000${i}`,
      },
    });
    users.push(user);
  }

  // Create Events
  const events = [];
  for (let i = 0; i < 5; i++) {
    const event = await prisma.event.create({
      data: {
        title: `Event ${i + 1}`,
        description: `This is a description for event ${i + 1}.`,
        date: new Date(Date.now() + i * 86400000),
        start_time: new Date(Date.now() + i * 86400000 + 3600000),
        end_time: new Date(Date.now() + i * 86400000 + 7200000),
        venue: `Auditorium ${i + 1}`,
        organising_committee: `Committee ${i + 1}`,
        entry_fee: i % 2 === 0 ? 100 : 0,
        registration_link: `https://register.event${i + 1}.com`,
        use_custom_form: false,
        poster_url: null,
        max_team_size: i % 2 === 0 ? 5 : null,
        registration_deadline: new Date(Date.now() + i * 86400000 - 86400000),
        event_status: i % 2 === 0 ? EventStatus.UPCOMING : EventStatus.ONGOING,
        visibility: i % 2 === 0 ? Visibility.PUBLIC : Visibility.COLLEGE,
        organiser_user_id: users[i % users.length].user_id,
        category: categories[i % categories.length],
      },
    });
    events.push(event);
  }

  // Map Events to Clubs
  for (let i = 0; i < events.length; i++) {
    await prisma.eventClubMapping.create({
      data: {
        event_id: events[i].event_id,
        club_id: allClubs[i % allClubs.length].club_id,
      },
    });
  }

  // Create Teams
  const teams = [];
  for (let i = 0; i < 3; i++) {
    const team = await prisma.team.create({
      data: {
        team_name: `Team Alpha ${i + 1}`,
        event_id: events[i].event_id,
        created_by: users[i].user_id,
        max_members: 5,
      },
    });
    teams.push(team);
  }

  // Event Participation
  for (let i = 0; i < users.length; i++) {
    await prisma.eventParticipation.create({
      data: {
        user_id: users[i].user_id,
        event_id: events[i % events.length].event_id,
        team_id: i < teams.length ? teams[i].team_id : null,
        is_team_leader: i < teams.length,
      },
    });
  }

  // Create Offers
  for (let i = 0; i < 3; i++) {
    await prisma.offer.create({
      data: {
        title: `Looking for teammates ${i + 1}`,
        description: `Need members with design and coding skills.`,
        created_by: users[i].user_id,
        event_id: events[i].event_id,
        offer_type: OfferType.TEAM_RECRUITMENT,
        target_group_type: GroupType.EVENT_PARTICIPANTS,
      },
    });
  }

  // Upload Event Results
  for (let i = 0; i < 3; i++) {
    await prisma.result.create({
      data: {
        event_id: events[i].event_id,
        announced_by: users[i].user_id,
        result_text: `Winners of Event ${i + 1}: Team ${i + 1}`,
        media_url: i % 2 === 0 ? `https://example.com/result${i + 1}.pdf` : null,
        visible_to: i % 2 === 0 ? GroupType.ALL : GroupType.COLLEGE,
      },
    });
  }

  // Upload Event Media
  for (let i = 0; i < 5; i++) {
    await prisma.eventGallery.create({
      data: {
        event_id: events[i].event_id,
        uploaded_by: users[i].user_id,
        media_url: `https://media.example.com/photo${i + 1}.jpg`,
        media_type: MediaType.IMAGE,
      },
    });
  }

  console.log("✅ Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Seed failed: ", err);
    prisma.$disconnect();
  });
