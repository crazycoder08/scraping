let url = new URL(input.url);
url.searchParams.set('_l', 'en');
navigate(url, { solve_captcha: true });

if (el_exists('img[alt="wow"],title:contains("Wifinity"),title:contains("Blocked")'))
    dead_page(`Page not found.`);
if (!el_exists('meta[name="locale"][content="en_US"]'))
    throw ('Wrong localization');
if (!el_exists('h1.top-card-layout__title') && !el_exists('h2.top-card-layout__headline'))
    dead_page('Page is not found');
tag_html('page');

