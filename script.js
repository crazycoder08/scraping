const puppeteer = require("puppeteer-core");
const cheerio = require("cheerio");
const fs = require("fs");
const writeData = require("./write");

const SBR_WS_ENDPOINT =
  "wss://brd-customer-hl_ea1a7d34-zone-scraping_browser_test1:qg2tfn6fl1f9@brd.superproxy.io:9222";
const COUNTRIES = [
  { name: "Afghanistan", code: "AF" },
  { name: "Åland Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People'S Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People'S Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia and Montenegro", code: "CS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

async function main(url) {
  console.log("Connecting to Scraping Browser...");
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });
  try {
    const page = await browser.newPage();
    console.log(
      "Connected! Navigating to https://www.linkedin.com/in/generussell..."
    );
    await page.goto(url);
    // CAPTCHA handling: If you're expecting a CAPTCHA on the target page, use the following code snippet to check the status of Scraping Browser's automatic CAPTCHA solver
    const client = await page.createCDPSession();
    console.log("Waiting captcha to solve...");
    const { status } = await client.send("Captcha.waitForSolve", {
      detectTimeout: 10000,
    });
    console.log("Captcha solve status:", status);
    console.log("Navigated! Scraping page content...");
    const html = await page.content();

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);
    // Extract the href attribute from the link tag with rel="canonical"
    let location = $("link[rel=canonical]").attr("href");
    let jsonLD = JSON.parse(
      $('script[type="application/ld+json"]').html() || "{}"
    );
    let person = jsonLD?.["@graph"]?.find((e) => e["@type"] == "Person");
    let webPage = jsonLD?.["@graph"]?.find((e) => e["@type"] == "WebPage");

    let name = $("h1.top-card-layout__title").text().trim();
    let position = $("h2.top-card-layout__headline").text().trim();
    let about =
      null ||
      person?.description ||
      $("section.summary")
        .clone()
        .find("h2, .sign-in-modal")
        .remove()
        .end()
        .text()
        .trim() ||
      null;
    let followers =
      0 ||
      person?.interactionStatistic?.userInteractionCount ||
      $(
        'h3.top-card-layout__first-subline .top-card__subline-item:contains("follower")'
      )
        ?.text()
        .replace(/follower(s)?/g, "")
        ?.trim() ||
      $('.profile-info-subheader > div > span:contains("follower")')
        ?.text()
        .replace(/follower(s)?/g, "")
        ?.trim() ||
      $('.profile-info-subheader > div:contains("follower")')
        ?.text()
        .replace(/follower(s)?/g, "")
        ?.trim() ||
      null;
    let connections =
      $(
        'h3.top-card-layout__first-subline .top-card__subline-item:contains("connection")'
      )
        ?.text()
        .replace(/connection(s)?/, "")
        ?.trim() ||
      $('.profile-info-subheader > div > span:contains("connection")')
        ?.text()
        .replace(/connection(s)?/, "")
        ?.trim() ||
      $('.profile-info-subheader > div:contains("connection")')
        ?.text()
        .replace(/connection(s)?/, "")
        ?.trim() ||
      null;
    let locale = $('meta[name="locale"][content]').attr("content");
    if (!locale.startsWith("en")) throw new Error("Wrong localization");

    function parseDuration(str) {
      return {
        duration: str || null,
        duration_short: str.split("·")?.[1]?.trim() || null,
        start_date: str.split("·")?.[0].split("-")?.[0]?.trim() || null,
        end_date: str.split("·")?.[0].split("-")?.[1]?.trim() || null,
      };
    }
    let volunteer_experience = []
      .concat(
        $('[data-section="volunteering"]')
          .find(".volunteering__list li, li.profile-section-card")
          .toArray()
          .map((e) => ({
            title: $(e).find("h3").text().trim() || null,
            subtitle: $(e).find("h4").text().trim() || null,
            cause: $(e).find("h4 + div > p + p").eq(0).text().trim() || null,
            ...parseDuration(
              $(e)
                .find(".date-range")
                .text()
                .trim()
                .replace(/(^\n|\n$)/g, "")
                .replace(/\n {1,}/g, " · ")
                .trim()
            ),
            info: $(e)
              .find("h4 + div > .show-more-less-text")
              .eq(0)
              .text()
              .trim(),
          })),
        $(
          "section:has(#volunteering_experience) ul.pvs-list li.artdeco-list__item"
        )
          .toArray()
          .map((e) => ({
            title:
              $(e)
                .find(
                  '.align-self-center div.align-items-center > span[aria-hidden="true"]'
                )
                .text()
                .trim() || null,
            subtitle: $(e)
              .find('span[class] > span[aria-hidden="true"]')
              .eq(0)
              .text()
              .trim(),
            cause: $(e)
              .find('span[class] > span[aria-hidden="true"]')
              .eq(2)
              .text()
              .trim(),
            ...parseDuration(
              $(e).find(".pvs-entity__caption-wrapper").text().trim()
            ),
            info: $(e)
              .find(
                '.pvs-list__outer-container .pvs-list span[aria-hidden="true"]'
              )
              .toArray()
              .map((l) => $(l).text().trim())
              .join(". "),
          }))
      )
      .filter((e) => e)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    let certifications = $(
      '[data-section="certifications"] li.profile-section-card'
    )
      .toArray()
      .map((e) => ({
        title: $(e)
          .find("h3")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
        subtitle: $(e)
          .find("h4")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
        meta: $(e)
          .find("> div > div")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
      }))
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    let courses = $('[data-section="courses"] li')
      .toArray()
      .map((e) => ({
        title: $(e)
          .find("h3")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
        subtitle: $(e)
          .find("h4")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
        meta: $(e)
          .find("> div > div")
          .text()
          .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
      }))
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    let languages = $('[data-section="languages"] li')
      .toArray()
      .map((e) => ({
        title: $(e)
          .find("h3")
          .text()
          .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, ""),
        subtitle: $(e)
          .find("h4")
          .text()
          .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, ""),
        meta: $(e)
          .find("> div > div")
          .text()
          .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, ""),
      }))
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    let publications = []
      .concat(
        $("section:has(#publications) li.artdeco-list__item")
          .toArray()
          .map((e) => ({
            title:
              $(e)
                .find(
                  'div.align-items-center:has(> span + span) span[class="visually-hidden"]'
                )
                .text()
                .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, "") || null,
            subtitle:
              $(e)
                .find('span:has(> span + span) span[class="visually-hidden"]')
                .text()
                .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, "")
                .split("·")[0]
                .trim() || null,
            date:
              $(e)
                .find('span:has(> span + span) span[class="visually-hidden"]')
                .text()
                .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, "")
                .split("·")[1]
                ?.trim() || null,
            description:
              $(e)
                .find(
                  '.pv-shared-text-with-see-more span[class="visually-hidden"]'
                )
                .text()
                .replace(/(\n|\r|\t| *$|^ *|(?<= )[ \r\t\n]{1,})/g, "") || null,
          }))
          .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null),
        $('[data-section="publications"] li.profile-section-card')
          .toArray()
          .map((e) => ({
            title: $(e)
              .find("h3.leading-regular")
              .text()
              .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
            subtitle: $(e)
              .find("h4 > span.text-color-text-low-emphasis")
              .text()
              .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
            date: $(e)
              .find("h4 span.date-range time")
              .text()
              .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, ""),
            description: $(e)
              .find(".show-more-less-text p:last-of-type")
              .text()
              .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "")
              .replace(/ ?Show (less|more)/g, ""),
          }))
          .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null)
      )
      .filter((e) => e)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    let parse_duration = (el) => {
      let contents = el
        .contents()
        .toArray()
        .map((e) => $(e).text().trim())
        .filter((e) => e?.length > 1);
      return {
        duration: contents.join(" "),
        start_date: contents[0],
        end_date: contents[1] == "- Present" ? "Present" : contents[1],
        duration_short: contents.slice(2).join(" "),
      };
    };

    let patents = $('[data-section="patents"] .patents__list > li')
      .toArray()
      .map((e) => ({
        title:
          $(e)
            .find("h3.leading-regular, .profile-section-card__title")
            .eq(0)
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        date_issued:
          $(e)
            .find("h4 time, .profile-section-card__subtitle time")
            .eq(0)
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        patents_id:
          $(e)
            .find(".text-color-text-low-emphasis.not-first-middot")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        description:
          $(e)
            .find(".show-more-less-text p:last-of-type")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "")
            .replace(/ ?Show (less|more)/g, "") || null,
      }))
      .filter((e) => e)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    let projects = $('[data-section="projects"] ul > li')
      .toArray()
      .map((e) => ({
        title:
          $(e)
            .find("h3.leading-regular")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        ...parseDuration(
          $(e)
            .find("h4 .date-range")
            .text()
            .trim()
            .replace(/(^\n|\n$)/g, "")
            .replace(/\n {1,}/g, " · ")
            .trim()
        ),
        description:
          $(e)
            .find(".show-more-less-text p:last-of-type")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "")
            .replace(/ ?Show (less|more)/g, "") || null,
      }))
      .filter((e) => e)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    let organizations = $('[data-section="organizations"] ul > li')
      .toArray()
      .map((e) => ({
        title:
          $(e)
            .find("h3.leading-regular")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        membership_type:
          $(e)
            .find("h4")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "") || null,
        ...parse_duration($(e).find("div > span.date-range")),
        description:
          $(e)
            .find(".show-more-less-text p:last-of-type")
            .text()
            .replace(/(((?<= )|\n|\r|\t|^ | $)[ \r\t\n]*)/g, "")
            .replace(/ ?Show (less|more)/g, "") || null,
      }))
      .filter((e) => e)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    const forceNumber = (data) => (isNaN(data) ? 0 : +data);
    const forceNewUrl = (string, base) => {
      try {
        return new URL(string, base);
      } catch (e) {
        return null;
      }
    };

    let shortNumberToLong = (str) => {
      if (!str && str !== 0) return null;
      if (+str === 0) return 0;
      const s = str
        .toString()
        .toUpperCase()
        ?.replace(/[0-9., ]/g, "");
      const d = +str.toString().replace(/[^0-9.]/g, "") || 0;
      const e = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[s] || 1;
      return d * e;
    };

    let script = {};
    try {
      let script_text = $('script[type="application/ld+json"]').html();
      script = JSON.parse(script_text || "{}");
    } catch {}

    let trim = (str) => (str || "").replace(/\s+/g, " ").trim();
    const URL_ = (u) => {
      if (!u) return null;
      if (!u.startsWith("http")) u = "https://" + u;
      return (!!u && forceNewUrl(u)) || undefined;
    };
    // const Image_ = (u) => {
    //     return !!u && new Image(u) || undefined;
    // }
    get_u = (str) => {
      try {
        return decodeURIComponent(forceNewUrl(str).searchParams.get("url"));
      } catch {
        return null;
      }
    };

    let experience = $(
      ".experience__list li.experience-item, .experience__list li.experience-group"
    )
      .toArray()
      .map((e) => {
        if ($(e).find(".experience-group-header__company").text()) {
          return {
            title: $(e).find(".experience-group-header__company").text(),
            company: $(e).find(".experience-group-header__company").text(),
            duration: $(e)
              .find(
                ".experience-group-header__duration, .experience-group-header__meta-item .date-range"
              )
              .text(),
            url: URL_($(e).find("a").attr("href")),
            company_id: $(e)
              .find("a")
              .attr("href")
              ?.match(/linkedin.com\/company\/(.*)/)?.[1]
              .split("?")?.[0],
            positions: $(e)
              .find(
                ".experience-group__positions .result-card, .experience-group__positions .experience-group-position"
              )
              .toArray()
              .map((l) => ({
                title: $(l)
                  .find(
                    "h3.leading-regular, .result-card__title, .profile-section-card__title"
                  )
                  .text(),
                subtitle: $(l)
                  .find(
                    "h4.text-color-text, .result-card__subtitle, .profile-section-card__subtitle"
                  )
                  .text(),
                meta: trim(
                  $(l)
                    .find(
                      "h4.text-color-text+div>p:first-child, .result-card__meta p, .profile-section-card__meta p"
                    )
                    .toArray()
                    .map((m) => {
                      let duration_text = trim(
                        $(m).find(".date-range__duration").text()
                      );
                      return $(m)
                        .text()
                        .replace(duration_text, " " + duration_text);
                    })
                    .join(", ")
                ),
                location: $(l)
                  .find(
                    ".experience-item__location, h4.text-color-text+div>p+p"
                  )
                  .text(),
                description:
                  $(l)
                    .find(".show-more-less-text__text--more")
                    .text()
                    ?.replace("Show less", "") ||
                  $(l)
                    .find(".show-more-less-text__text--less")
                    .eq(0)
                    .text()
                    ?.replace("Show more", ""),
                ...parse_duration(
                  $(l).find(
                    "h4.text-color-text+div>p .date-range, .result-card__meta .date-range, .profile-section-card__meta .date-range"
                  )
                ),
              })),
          };
        }
        return {
          company: $(e).find("h4")?.text(),
          company_id: $(e)
            .find("h4 > a")
            ?.attr("href")
            ?.match(/linkedin.com\/company\/(.*)/)?.[1]
            .split("?")?.[0],
          url: $(e).find("h4 > a").attr("href")?.split("?")?.[0],
          title: $(e)
            .find(
              "h3.leading-regular, .result-card__title, .profile-section-card__title"
            )
            .text(),
          subtitle: $(e)
            .find(
              "h4.text-color-text, .result-card__subtitle, .profile-section-card__subtitle"
            )
            .text(),
          subtitleURL: URL_(
            $(e)
              .find(
                "h4.text-color-text > a, .result-card__subtitle > a, .profile-section-card__subtitle > a"
              )
              .attr("href")
          ),
          location: $(e)
            .find(".experience-item__location, h4.text-color-text+div>p+p")
            .text(),
          description:
            $(e)
              .find(".show-more-less-text__text--more")
              .text()
              ?.replace("Show less", "") ||
            $(e)
              .find(
                ".show-more-less-text__text--more, .experience-item__description .show-more-less-text, .experience-item__meta-item .show-more-less-text__text--less"
              )
              .eq(0)
              .text()
              ?.replace("Show more", ""),
          ...parse_duration(
            $(e).find(
              "h4.text-color-text+div>p .date-range, .result-card__meta .date-range, .profile-section-card__meta .date-range"
            )
          ),
        };
      })
      ?.map((e) => ({
        ...e,
        location: e.location ? e.location : e?.positions?.[0].location,
      }))
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    function get_activities() {
      return $("section.activities")
        .find(".activities-section__item--posts")
        .toArray()
        .map((item) => {
          let link = $(item)
            .find("a.activity-card__link, .base-card__full-link")
            .attr("href");
          try {
            link = URL_(
              decodeURIComponent(
                forceNewUrl(link).searchParams.get("session_redirect")
              )
            );
          } catch {}
          return {
            title: trim(
              $(item)
                .find("h3.activity-card__title, .base-main-card__title")
                .text()
            ),
            attribution: trim(
              $(item)
                .find(".activity-card__attribution, .base-main-card__subtitle")
                .text()
            ),
            img: fetch(
              $(item).find("img.activity-card__image").attr("src") ||
                $(item)
                  .find("img.main-activity-card__img")
                  .attr("data-delayed-url")
            )
              .then((res) => res.buffer())
              .then((buffer) => buffer.toString("base64")),
            link,
          };
        })
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    }
    function get_posts() {
      return $(
        'h2.section-title:contains("Articles by") + .core-section-container__content > ul > li'
      )
        .toArray()
        .map((item) => {
          let link = URL_($(item).find("a.base-card--link").attr("href"));
          let time = $(item).find(".base-main-card__metadata-item");
          return {
            title: trim(
              $(item)
                .find("h3.activity-card__title, .base-main-card__title")
                .text()
            ),
            attribution: trim(
              $(item)
                .find(".activity-card__attribution, .base-main-card__subtitle")
                .text()
            ),
            img:
              $(item).find(".base-main-card__media img").attr("src") ||
              $(item)
                .find(".base-main-card__media img")
                .attr("data-delayed-url") ||
              null,
            link,
            created_at: time.text().trim()
              ? new Date(time.text()).toISOString()
              : "",
          };
        })
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);
    }

    const educationsDetails = $(
      '.top-card__links-container [data-section="educationsDetails"]'
    ).text();
    const educations = $(
      '[data-section="educationsDetails"] .education__list li'
    )
      .toArray()
      .map((item) => ({
        title: $(item)
          .find("h3, .result-card__title, .profile-section-card__title")
          .text(),
        degree: $(item)
          .find(
            "h4 > span:first-child, .result-card__subtitle > span:nth-child(1), .profile-section-card__subtitle > span:nth-child(1)"
          )
          .text(),
        field: $(item)
          .find(
            "h4 > span:nth-child(2), .result-card__subtitle > span:nth-child(2), .profile-section-card__subtitle > span:nth-child(2)"
          )
          .text(),
        meta: trim(
          $(item).find(".result-card__meta, .profile-section-card__meta").text()
        ),
        url: URL_($(item).find("li > a").attr("href")),
        start_year: $(item)
          .find(
            "div.text-color-text-low-emphasis time:nth-child(1), .education__item--duration time:nth-child(1)"
          )
          .text(),
        end_year: $(item)
          .find(
            "div.text-color-text-low-emphasis time+time, .education__item--duration time+time"
          )
          .text(),
      }))
      .filter((v) => v.title || v.degree || v.url || v.start_year)
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    if (educations?.[0] && !educations[0].title && educationsDetails)
      educations[0].title = educationsDetails;

    let geo =
      $("h3.top-card-layout__first-subline > div.profile-info-subheader > div")
        .eq(0)
        .text() ||
      $("h3.top-card-layout__first-subline > div.top-card__subline-item")
        .eq(0)
        .text();
    let geoArr = geo?.split(",")?.map((v) => trim(v));

    let current_company = {
      link: URL_(
        $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        ).attr("href")
      ),
      name: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      ).text(),
      company_id: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      )
        .attr("href")
        ?.match(/linkedin.com\/company\/(.*)/)?.[1]
        .split("?")?.[0],
      industry: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      ).text(),
      title: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      ).text()
        ? position
        : null,
    };

    let recommendations = $(
      '[data-section="recommendations"] .recommendations__list-item, [data-section="recommendations"] li'
    )
      .toArray()
      .map((v) => trim($(v).text()))
      .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null);

    let data = {
      locale,
      name,
      current_company: {
        link: URL_(
          $(
            '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
          ).attr("href")
        ),
        name: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        ).text(),
        company_id: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        )
          .attr("href")
          ?.match(/linkedin.com\/company\/(.*)/)?.[1]
          .split("?")?.[0],
        industry: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        ).text(),
        title: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        ).text()
          ? position
          : null,
      },
      avatar:
        $(".top-card__profile-image-container img").attr("src") ||
        $(".top-card__profile-image-container img").attr("data-delayed-url"),
      city: geoArr?.length > 1 ? geoArr.shift() : null,
      region: geo,
      position,
      about,
      followers: shortNumberToLong(followers),
      connections: shortNumberToLong(connections),
      educations_details:
        educationsDetails ||
        educations?.[0]?.title ||
        [educations?.[0]?.degree, educations?.[0]?.field]
          .filter((v) => v)
          .join(" - "),
      education: educations,
      posts: get_posts(),
      experience,
      certifications,
      courses,
      languages,
      groups: $('[data-section="groups"]  li')
        .toArray()
        .map((item) => ({
          img: $(item).find("img").attr("src") || null,
          title: trim(
            $(item)
              .find(".result-card__title, .profile-section-card__title")
              .text()
          ),
          subtitle: trim(
            $(item)
              .find(".result-card__subtitle, .profile-section-card__subtitle")
              .text()
          ),
          meta: trim(
            $(item)
              .find(".result-card__meta, .profile-section-card__meta")
              .text()
          ),
        }))
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null),

      people_also_viewed: $(
        "section.browsemap.right-rail-section > div > ul > li, .right-rail .aside-section-container.browsemap >div > div > ul > li"
      )
        .toArray()
        .map((item) => ({
          profile_link: URL_($(item).find("a").attr("href")),
        }))
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null),
      activities: get_activities(),
      recommendations,
      recommendations_count:
        +trim(
          $(
            '.recommendations__count, [data-test-id="recommendations__recommenders"]'
          ).text()
        ).split(" ")[0] ||
        recommendations?.length ||
        null,
      patents,
      publications,
      awards: $('[data-section="awards"] .awards__list > li')
        .toArray()
        .map((x) => ({
          title: trim($(x).find(".profile-section-card__title").text()),
          issuer: trim($(x).find(".profile-section-card__subtitle").text()),
          issuedOn: trim($(x).find(".profile-section-card__meta time").text())
            ? new Date(
                trim($(x).find(".profile-section-card__meta time").text())
              ).toISOString()
            : null,
          description: null,
        }))
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null),
      canonical_url: $('link[rel="canonical"]').attr("href"),
      locations: [
        trim($("h3.top-card-layout__first-subline div").eq(0).text()),
      ],
      skills: $('[data-field="skill_card_skill_topic"]')
        .toArray()
        .map((item) => ({
          title: $(item).text(),
          info: $(item)
            .parent()
            .parent()
            .find(".display-flex.link-without-hover-visited")
            .eq(0)
            .text(),
        }))
        .reduce((acc, e, idx, arr) => (arr.length ? arr : null), null),
      current_company_name: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      ).text(),
      current_company_company_id: $(
        '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
      )
        .attr("href")
        ?.match(/linkedin.com\/company\/(.*)/)?.[1]
        .split("?")?.[0],
      volunteer_experience,
      organizations,
      patents,
      projects,
    };
    id = location
      .match(/linkedin.com\/in\/(.*)/)?.[1]
      .split("?")?.[0]
      ?.replace("/", "");
    function country_code_by_name(name) {
      return (
        COUNTRIES.find((e) =>
          name.toLowerCase().includes(e.name.toLowerCase())
        ) || null
      );
    }
    country_code = null;
    if (data.canonical_url) {
      country_code = data.canonical_url
        .match(/https:\/\/([a-z]{2})\.?linkedin/)?.[1]
        .toUpperCase();
      if (!country_code && data.locations[0]) {
        country_code = country_code_by_name(data.locations[0])?.code;
      }
    }

    const resultArray = [
      decodeURI(decodeURIComponent(decodeURIComponent(id).toLowerCase())), // id
      forceNewUrl(location.replace(/\?.+/g, "")), // url
      data, // data
      data.avatar ? forceNewUrl(data.avatar) : null, // avatar
      data.locations, // locations
      country_code, // country_code
    ];
    await writeData(resultArray);
    const resultJson = JSON.stringify(resultArray, null, 2);
    // Write the JSON string to the result.txt file
    // fs.writeFile("result.txt", resultJson, "utf8", (err) => {
    //   if (err) {
    //     console.error("Error writing to file:", err);
    //   } else {
    //     console.log("ResultArray values have been stored in result.txt");
    //   }
    // });
  } finally {
    await browser.close();
  }
}

// main().catch((err) => {
//   console.error(err.stack || err);
//   process.exit(1);
// });
module.exports = main;
