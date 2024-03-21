const cheerio = require('cheerio');

// Sample HTML data
const htmlData = `<section class="core-section-container my-3 core-section-container--with-border border-b-1 border-solid border-color-border-faint m-0 py-3 pp-section experience" data-section="experience">
<!---->
          
        <h2 class="core-section-container__title section-title">
          Experience
        </h2>
      
        
<!---->
      <div class="core-section-container__content break-words">
        
        <ul class="experience__list">
              
    
    
    

    
    

    <li class="profile-section-card relative flex w-full list-none py-1.5 pr-2 pl-1 experience-item" data-section="currentPositionsDetails">
<!---->            <a class="profile-section-card__image-link" href="https://www.linkedin.com/company/the-scale-summit?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate="">
              
      <img class="inline-block relative
          
          w-6 h-6
           shrink-0 mr-0.5 border-4 border-color-transparent border-solid box-content rounded-[6px] profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/D560BAQFQraGufJ0LjQ/company-logo_100_100/0/1703955541960/the_scale_summit_logo?e=2147483647&amp;v=beta&amp;t=jFnXBuOSSTp65wa2jcM5FcRjNBHicXJSVfmwS67h4TA" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/cs8pjfgyw96g44ln9r7tct85f" alt="The Scale Summit Graphic">
  
            </a>

      <div class="pl-0.5 grow break-words">
        <h3 class="[&amp;>*]:mb-0 text-[18px] text-color-text leading-regular group-hover:underline font-semibold">
          
        <span class="experience-item__title">
          Founder &amp; CEO
        </span>
      
        </h3>

            <h4 class="text-color-text text-md [&amp;>*]:mb-0 not-first-middot leading-[1.75]">
                <a class="relative hover:underline link-styled hover:!text-color-text active:!text-color-text !font-normal" href="https://www.linkedin.com/company/the-scale-summit?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-client-ingraph="" data-tracking-will-navigate="">
                  
        <span class="experience-item__subtitle">
          The Scale Summit
        </span>
      
                </a>
            </h4>

        

        <div class="text-color-text-low-emphasis text-md [&amp;>*]:mb-0 [&amp;>*]:text-md [&amp;>*]:text-color-text-low-emphasis">
          
          <p class="experience-item__meta-item">
            
    
    
    
    
    
    

      <span class="date-range text-color-text-secondary font-sans text-md leading-open font-regular">
              <time>Jan 2024</time> - Present
            <span class="before:middot">3 months</span>
      </span>
  
          </p>

          <p class="experience-item__meta-item">
            Rancho Santa Margarita, California, United States
          </p>

          <div class="experience-item__meta-item" data-section="currentPositions">
            
    <div class="show-more-less-text">
      <p class="show-more-less-text__text--less">
        Welcome to The Scale Summit Small Business Growth Community. We are Propel Sales Solutions, Inc.'s spin-off brand dedicated to start-up and early-stage business owners. <br><br>This brand is over a decade in the making. This is where pioneering sales strategies meet small business affordability for start-up and early-stage entrepreneurs.<br><br>With over two decades of direct experience collaborating with thriving entrepreneurs and their teams as Propel Sales Solutions, we've crafted a unique…
            

    
    

    <button class="show-more-less-text__button show-more-less-button
        show-more-less-text__button--more" data-tracking-control-name="public_profile_experience-item_show-more-text-btn" aria-label="Show full description for this position" aria-expanded="false">
        Show more

          <icon class="show-more-less-text__button-icon show-more-less-button-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
    </button>
  
      </p>

        <p class="show-more-less-text__text--more" tabindex="-1">
          Welcome to The Scale Summit Small Business Growth Community. We are Propel Sales Solutions, Inc.'s spin-off brand dedicated to start-up and early-stage business owners. <br><br>This brand is over a decade in the making. This is where pioneering sales strategies meet small business affordability for start-up and early-stage entrepreneurs.<br><br>With over two decades of direct experience collaborating with thriving entrepreneurs and their teams as Propel Sales Solutions, we've crafted a unique group service that blends expertise and community.<br><br>Our platform offers small business entrepreneurs an unparalleled strategic selling plan. We are the only small business community priced for small businesses to help you reach your first $1 - $2 Million in Annual Sales.<br><br>What's included in The Scale Summit Mastermind Program<br>- Monthly Mastermind Group Sessions<br>- Complimentary Weekly Roundtable Strategy Sessions <br>- Training Workshops<br>- Small Business Education Workshops<br>- Systemized Selling Playbook<br>- Peer Network Collaboration<br>- Expert-Led Guidance<br><br>Prepare to elevate your sales for growth in a community as ambitious and innovative as you are.
            

    
    

    <button class="show-more-less-text__button show-more-less-button
        show-more-less-text__button--less" data-tracking-control-name="public_profile_experience-item_show-less-text-btn" aria-label="Show less description for this position" aria-expanded="true">
        Show less

          <icon class="show-more-less-text__button-icon show-more-less-button-icon lazy-loaded" aria-hidden="true" aria-busy="false"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" preserveAspectRatio="xMinYMin meet" focusable="false" class="lazy-loaded" aria-busy="false"><path d="M8 7l-5.9 4L1 9.5l6.2-4.2c.5-.3 1.2-.3 1.7 0L15 9.5 13.9 11 8 7z" fill="currentColor"></path></svg></icon>
    </button>
  
        </p>
    </div>
  
          </div>
      
        </div>
      </div>

      
    </li>
  
  
              
    
    
    

    
    

    <li class="profile-section-card relative flex w-full list-none py-1.5 pr-2 pl-1 experience-item" data-section="currentPositionsDetails">
<!---->            <a class="profile-section-card__image-link" href="https://www.linkedin.com/company/propel-sales?trk=public_profile_experience-item_profile-section-card_image-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_image-click" data-tracking-will-navigate="">
              
      <img class="inline-block relative
          
          w-6 h-6
           shrink-0 mr-0.5 border-4 border-color-transparent border-solid box-content rounded-[6px] profile-section-card__image" data-delayed-url="https://media.licdn.com/dms/image/D560BAQERyaiKqomRag/company-logo_100_100/0/1688772165358/propel_sales_logo?e=2147483647&amp;v=beta&amp;t=M5P45f3Eg6DQjrshpoasr0-1qsh2PD_K8rzQbkeTaO0" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/cs8pjfgyw96g44ln9r7tct85f" alt="Propel Sales Graphic">
  
            </a>

      <div class="pl-0.5 grow break-words">
        <h3 class="[&amp;>*]:mb-0 text-[18px] text-color-text leading-regular group-hover:underline font-semibold">
          
        <span class="experience-item__title">
          Founder &amp; CEO
        </span>
      
        </h3>

            <h4 class="text-color-text text-md [&amp;>*]:mb-0 not-first-middot leading-[1.75]">
                <a class="relative hover:underline link-styled hover:!text-color-text active:!text-color-text !font-normal" href="https://www.linkedin.com/company/propel-sales?trk=public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-control-name="public_profile_experience-item_profile-section-card_subtitle-click" data-tracking-client-ingraph="" data-tracking-will-navigate="">
                  
        <span class="experience-item__subtitle">
          Propel Sales
        </span>
      
                </a>
            </h4>

        

        <div class="text-color-text-low-emphasis text-md [&amp;>*]:mb-0 [&amp;>*]:text-md [&amp;>*]:text-color-text-low-emphasis">
          
          <p class="experience-item__meta-item">
            
    
    
    
    
    
    

      <span class="date-range text-color-text-secondary font-sans text-md leading-open font-regular">
              <time>Aug 2002</time> - Present
            <span class="before:middot">21 years 8 months</span>
      </span>
  
          </p>

          <p class="experience-item__meta-item">
            Rancho Santa Margarita, California, United States
          </p>

          <div class="experience-item__meta-item" data-section="currentPositions">
            
    <div class="show-more-less-text">
      <p class="show-more-less-text__text--less">
        Since 2022, Propel Sales has been building a complete systemized selling strategy for B2B service companies that includes: (1) strategic messaging to differentiate from the competition, (2) lead generation with relentless consistency, and (3) a step-by-step sales process to consistently execute best sales practices for predictable and consistent growth.
<!---->      </p>

<!---->    </div>
  
          </div>
      
        </div>
      </div>

      
    </li>
  
          </ul>
        
      </div>
    </section>`;

// Load HTML data into Cheerio
const $ = cheerio.load(htmlData);

const URL_ = (u) => {
    if (!u) return null;
    if (!u.startsWith("http")) u = "https://" + u;
    return (!!u && forceNewUrl(u)) || undefined;
};

const forceNewUrl = (string, base) => {
    try {
        return new URL(string, base);
    } catch (e) {
        return null;
    }
};

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

// Select languages section and extract course titles
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
            company: $(e).find("h4")?.text().trim(),
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
                .text().trim(),
            subtitle: $(e)
                .find(
                    "h4.text-color-text, .result-card__subtitle, .profile-section-card__subtitle"
                )
                .text().trim(),
            subtitleURL: URL_(
                $(e)
                    .find(
                        "h4.text-color-text > a, .result-card__subtitle > a, .profile-section-card__subtitle > a"
                    )
                    .attr("href")
            ),
            location: $(e)
                .find(".experience-item__location, h4.text-color-text+div>p+p")
                .text().trim(),
            description:
                $(e)
                    .find(".show-more-less-text__text--more")
                    .text()
                    ?.replace("Show less", "").trim() ||
                $(e)
                    .find(
                        ".show-more-less-text__text--more, .experience-item__description .show-more-less-text, .experience-item__meta-item .show-more-less-text__text--less"
                    )
                    .eq(0)
                    .text()
                    ?.replace("Show more", "").trim(),
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

// Output the result
console.log(experience);

