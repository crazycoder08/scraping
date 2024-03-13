const puppeteer = require("puppeteer-core");
const cheerio = require("cheerio");
const fs = require("fs");
const writeData = require("./write");
// const COUNTRIES = require("./countries");

const SBR_WS_ENDPOINT = "wss://brd-customer-hl_ea1a7d34-zone-scraping_browser_test1:qg2tfn6fl1f9@brd.superproxy.io:9222";
// const SBR_WS_ENDPOINT = "wss://brd-customer-hl_ea1a7d34-zone-residential_proxy2:ffr9p8fdzon5@brd.superproxy.io:22225";

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

async function main(url) {
  console.log("Connecting to Scraping Browser...");
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: SBR_WS_ENDPOINT,
  // });

  var browser = "";

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: SBR_WS_ENDPOINT,
    });
  } catch (error) {
    return {
      status: 500,
      message: 'Connecting time-out please try again!'
    };
  }

  try {
    const page = await browser.newPage();
    console.log(`Connected! Navigating to ${url}...`);

    try {
      await page.goto(url);
      // Add other code that relies on successful navigation here
      // CAPTCHA handling: If you're expecting a CAPTCHA on the target page, use the following code snippet to check the status of Scraping Browser's automatic CAPTCHA solver
      const client = await page.createCDPSession();
      console.log("Waiting captcha to solve...");
      const { status } = await client
        .send("Captcha.waitForSolve", {
          detectTimeout: 10000,
        })
        .catch((e) => {
          main(url);
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
      if (!locale?.startsWith("en")) throw new Error("Wrong localization");

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



      try {
        let script_text = $('script[type="application/ld+json"]').html();
        script = JSON.parse(script_text || "{}");
      } catch { }

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
            } catch { }
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
        ).text().replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
        company_id: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        )
          .attr("href")
          ?.match(/linkedin.com\/company\/(.*)/)?.[1]
          .split("?")?.[0],
        industry: $(
          '[data-section="currentPositionsDetails"] [data-test-id="top-card-link"], [data-section="currentPositionsDetails"] .top-card-link, [data-section="pastPositionsDetails"] [data-test-id="top-card-link"], [data-section="pastPositionsDetails"] .top-card-link'
        ).text().replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
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

      let worksFor = person.worksFor
        .filter(org => org.url)
        .map(org => ({ url: org.url }));

      const addressArray = person.address ? person.address : [];

      let data = {
        avatar:
          $(".top-card__profile-image-container img").attr("src") ||
          $(".top-card__profile-image-container img").attr("data-delayed-url"),
        city: geoArr?.length > 1 ? geoArr.shift() : null,
        followers: shortNumberToLong(followers),
        connections: shortNumberToLong(connections),
        educations_details:
          educationsDetails ||
          educations?.[0]?.title ||
          [educations?.[0]?.degree, educations?.[0]?.field]
            .filter((v) => v)
            .join(" - "),
        posts: get_posts(),
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
        recommendations_count:
          +trim(
            $(
              '.recommendations__count, [data-test-id="recommendations__recommenders"]'
            ).text()
          ).split(" ")[0] ||
          recommendations?.length ||
          null,
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
      // function country_code_by_name(name) {
      //   return (
      //     COUNTRIES.find((e) =>
      //       name.toLowerCase().includes(e.name.toLowerCase())
      //     ) || null
      //   );
      // }
      // country_code = null;
      // if (data.canonical_url) {
      //   country_code = data.canonical_url
      //     .match(/https:\/\/([a-z]{2})\.?linkedin/)?.[1]
      //     .toUpperCase();
      //   if (!country_code && data.locations[0]) {
      //     country_code = country_code_by_name(data.locations[0])?.code;
      //   }
      // }

      const resultArray = {
        id: decodeURI(decodeURIComponent(decodeURIComponent(id).toLowerCase())), // id
        url: forceNewUrl(location.replace(/\?.+/g, "")),
        locale: locale ?? "",
        name: name ?? "",
        current_company: current_company ?? "",
        avatar: data.avatar ? forceNewUrl(data.avatar) : "",
        city: data.city ?? "",
        region: geo.replace(/\n/g, '').replace(/\s+/g, ' ').trim() ?? "",
        position: position ?? "",
        followers: data.followers ?? "",
        connections: data.connections ?? "",
        educations_details: data.educations_details.replace(/\n/g, '').replace(/\s+/g, ' ').trim() ?? "",
        people_also_viewed: data.people_also_viewed ?? "",
        // locations: data.locations,
        current_company_name: data.current_company_name.replace(/\n/g, '').replace(/\s+/g, ' ').trim() ?? "",
        current_company_company_id: data.current_company_company_id ?? "",
        country_code: addressArray.addressCountry ?? "",
        country_name: addressArray.addressLocality ?? "",
        about: about ?? "",
        input_url: url ?? "",
        posts: data.posts ?? "",
        experience: worksFor ?? "",
        certifications: certifications ?? "",
        courses: courses ?? "",
        languages: languages ?? "",
        groups: data.groups ?? "",
        activities: data.activities ?? "",
        volunteer_experience: volunteer_experience ?? "",
        recommendations: recommendations ?? "",
        recommendations_count: data.recommendations_count ?? "",
        patents: patents ?? "",
        publications: publications ?? "",
        awards: data.awards ?? "",
        canonical_url: data.canonical_url ?? "",
        skills: data.skills ?? "",
        organizations: organizations ?? "",
        projects: projects ?? "",
      };

      var response = {
        status: 200,
        data: resultArray,
        message: "Scrapped LinkedIn profile successfully!"
      };
      return response;
      // await writeData(resultArray);
      // const resultJson = JSON.stringify(resultArray, null, 2);
      // Write the JSON string to the result.txt file
      // fs.writeFile("result.txt", resultJson, "utf8", (err) => {
      //   if (err) {
      //     console.error("Error writing to file:", err);
      //   } else {
      //     console.log("ResultArray values have been stored in result.txt");
      //   }
      // });
    } catch (error) {
      // Handle errors that occur during navigation
      var resultArray = {
        status: 500,
        message: 'Connecting time-out please try again!'
      };
      console.error(resultArray.message);
      return resultArray;
    }
  } catch (error) {
    console.error("Error appending data:", error);
    throw error; // Re-throw the error for the caller to handle if necessary
  } finally {
    await browser.close();
  }
}

// main().catch((err) => {
//   console.error(err.stack || err);
//   process.exit(1);
// });
module.exports = main;
