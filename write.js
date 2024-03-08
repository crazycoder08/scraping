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

async function writeData(data) {
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
