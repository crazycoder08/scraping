const { google } = require("googleapis");
const keys = require("./keys.json");

function formatDataForSheet(data) {
  const formattedData = [];

  // Extracting detailed information from the object

  const {
    name,
    current_company,
    city,
    region,
    about,
    followers,
    connections,
    educations_details,
    posts,
    certifications,
    people_also_viewed,
    recommendations,
    recommendations_count,
    avatar,
    locations,
    current_company_name,
  } = data[2];

  // Pushing extracted data into the formatted array
  formattedData.push(
    name,
    current_company?.name?.replace(/\n/g, "")?.replace(/\s+/g, " ")?.trim(),
    city?.replace(/\n/g, "")?.replace(/\s+/g, " ")?.trim(),
    region?.replace(/\n/g, "")?.replace(/\s+/g, " ")?.trim(),
    about?.replace(/\n/g, "")?.replace(/\s+/g, " ")?.trim(),
    followers,
    connections,
    educations_details?.replace(/\n/g, "")?.replace(/\s+/g, " ")?.trim(),
    posts?.map((post) => `${post?.title} (${post?.created_at})`)?.join("\n"),
    certifications?.map((cert) => `${cert?.title} - ${cert?.subtitle}`)?.join("\n"),
    people_also_viewed?.map((person) => person?.profile_link)?.join("\n"),
    recommendations?.join("\n"),
    recommendations_count,
    avatar,
    locations?.join("\n"),
    current_company_name
  );

  return formattedData;
}

async function writeData(
  data = [
    "stephpliha",
    "https://www.linkedin.com/in/stephpliha",
    {
      locale: "en_US",
      name: "Stephanie Pliha",
      current_company: {
        link: "https://www.linkedin.com/company/tribebrand?trk=public_profile_topcard-current-company",
        name: "\n        \n        \n      \n  \n      \n        Tribe Consulting Agency\n      \n    \n      ",
        company_id: "tribebrand",
        industry:
          "\n        \n        \n      \n  \n      \n        Tribe Consulting Agency\n      \n    \n      ",
        title: "",
      },
      avatar:
        "https://media.licdn.com/dms/image/D4E03AQF-vi8A2E2sLQ/profile-displayphoto-shrink_200_200/0/1668528678877?e=2147483647&v=beta&t=HJcZpCjvAd6KVdBH6Bq_e2GQ7iSXB77R3dj-ttQ5Q68",
      city: "Newport Beach",
      region:
        "\n          Newport Beach, California, United States\n          \n            Contact Info\n          \n      ",
      position: "",
      about:
        "★ Robotic Surgeons & Medtech: Elevate Your Brand, Online Presence, Social Media…",
      followers: 5353,
      connections: 500,
      educations_details:
        "\n                \n    \n      \n        \n        \n      \n  \n      \n        Professional Development - Harvard Division of Continuing Education\n      \n    \n      \n  \n  \n              ",
      education: null,
      posts: [
        {
          title:
            "Navigating the Treacherous Waters of MedTech Startups: Why Many Sink and a Few Sail",
          attribution: "By Stephanie Pliha",
          img: "https://media.licdn.com/dms/image/D4E12AQHvdUZ3R-m5EQ/article-cover_image-shrink_720_1280/0/1706402630519?e=2147483647&v=beta&t=hPhsXDy-sg8oPSYFg2Gvp20ApNV1l5rpTDg-0Gvd4gY",
          link: null,
          created_at: "2024-01-27T18:30:00.000Z",
        },
        {
          title: "10 Reasons",
          attribution: "By Stephanie Pliha",
          img: "https://static.licdn.com/scds/common/u/img/pic/pic_pulse_stock_article_9.jpg",
          link: null,
          created_at: "2017-05-04T18:30:00.000Z",
        },
      ],
      experience: null,
      certifications: [
        {
          title: "Management Consulting Certification",
          subtitle:
            "Professional Development - Harvard Division of Continuing Education",
          meta: "Issued Dec 2022Credential ID 227J-1ME8-SSAASee credential",
        },
        {
          title: "Ken Blanchard on Servant Leadership",
          subtitle: "LinkedIn",
          meta: "Issued Nov 2018See credential",
        },
      ],
      courses: null,
      languages: null,
      groups: null,
      people_also_viewed: [
        {
          profile_link:
            "https://www.linkedin.com/in/leahbraddell?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/katylyall?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/deborah-snodgrass-rn-msn-12915112?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/slaporter?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://it.linkedin.com/in/stevegbell?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/nicole-fitzgerald-6a4b639b?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/erin-finley-36a759163?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/okhateeb?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/amanda-cowan-sanchez-772a67a?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/joseph-hyland-authement-227b2a19?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/johannafrench?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/heather-labhart-40127558?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/richallen-allenpartnersltd?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/kara-chapman-a3b5746a?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/henrypeck?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/heather-traulsen-rohrman-b34b9a94?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/amanda-pedersen-59053721?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/kristin-cooke-thompson-96915112?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/sherice-nivens?trk=public_profile_browsemap-profile",
        },
        {
          profile_link:
            "https://www.linkedin.com/in/douglaswerner?trk=public_profile_browsemap-profile",
        },
      ],
      activities: null,
      recommendations: [
        "Deborah Snodgrass, RN, MSN “Stephanie hired and managed me at CardioDynamics (Sonosite) in her role as Director of Clinical Sales. This was my first industry position after working as a registered nurse. Stephanie mentored and groomed me to excel in my new career move. She knows how to motivate and lead a team like no other. I’ve only known her to exceed set goals. She manages in a way that instantly earns your loyalty and respect. She continued to guide and support my career development for which I am forever thankful. Stephanie is charismatic, intelligent, and an exemplary Sales Director that will be a leading contributor at any company. ”",
        "Nicole Fitzgerald “Stephanie exemplifies a true leader. I have reported to her for the past year and have grown tremendously in my professional and personal development due to her coaching. Her management style is clear and consistent-she demands the best from her reps and gives them her best in return. Her attention to detail remains constant even as she focuses on bigger picture. She is results driven but keeps mission of the company at the forefront! ”",
      ],
      recommendations_count: 20,
      patents: null,
      publications: null,
      awards: null,
      canonical_url: "https://www.linkedin.com/in/stephpliha",
      locations: [
        "Newport Beach, California, United States Contact Info Sign in to view Stephanie’s full profile Sign in Welcome back Email or phone Password Show Forgot password? Sign in or By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy. Continue with GoogleContinue with Google New to LinkedIn? Join now or By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy. Continue with GoogleContinue with Google New to LinkedIn? Join now 5K followers 500+ connections",
      ],
      skills: null,
      current_company_name:
        "\n        \n        \n      \n  \n      \n        Tribe Consulting Agency\n      \n    \n      ",
      current_company_company_id: "tribebrand",
      volunteer_experience: null,
      organizations: null,
      projects: null,
    },
    "https://media.licdn.com/dms/image/D4E03AQF-vi8A2E2sLQ/profile-displayphoto-shrink_200_200/0/1668528678877?e=2147483647&v=beta&t=HJcZpCjvAd6KVdBH6Bq_e2GQ7iSXB77R3dj-ttQ5Q68",
    [
      "Newport Beach, California, United States Contact Info Sign in to view Stephanie’s full profile Sign in Welcome back Email or phone Password Show Forgot password? Sign in or By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy. Continue with GoogleContinue with Google New to LinkedIn? Join now or By clicking Continue, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy. Continue with GoogleContinue with Google New to LinkedIn? Join now 5K followers 500+ connections",
    ],
    "US",
  ]
) {
  try {
    const client = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    await client.authorize();
    console.log("Connected to Google Sheets API");

    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1J1f0dTrg1GRdUgnIjro6_77zMo5x9mDxt0XcCKBgQ7M";
    const range = "Sheet1!B1:B"; // Updated range where you want to append data
    const valueInputOption = "RAW"; // How the input data should be interpreted

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: valueInputOption,
      resource: { values: [formatDataForSheet(data)] },
    });
    console.log("Data appended successfully!");
    return result.data; // Return the appended data
  } catch (error) {
    console.error("Error appending data:", error);
    throw error; // Re-throw the error for the caller to handle if necessary
  }
}
// writeData();
module.exports = writeData;
