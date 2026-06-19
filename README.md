# TMAN Operations Website

Static multi-page business website for TMAN Operations, focused on plumbing, electrical, maintenance, enquiries, and contact support for Gauteng, South Africa.

## Project Structure

- `index.html` - Home page with featured services, gallery lightbox, FAQ accordion, and modal content
- `about.html` - About page covering mission, vision, and core values
- `service.html` - Dynamic service catalogue with search, tabs, sorting, and service detail modal
- `contact.html` - General contact form with validation, async submission flow, email draft generation, and interactive Leaflet map
- `enquiry.html` - Dedicated enquiry form for pricing, availability, volunteering, and sponsorship
- `CSS/styles.css` - Shared responsive styling, animations, modal/lightbox styles, and form feedback states
- `js/scripts.js` - Shared interactivity, DOM rendering, validation, async form submission, and UI enhancements
- `js/map.js` - Leaflet map configuration and marker rendering
- `data/posts.json` - Dynamic service data source used by the service listing and enquiry form
- `robots.txt` - Search crawler instructions
- `sitemap.xml` - XML sitemap for search engines
- `netlify.toml` - Netlify deployment, clean URL rewrites, caching, and security headers

## Part 3 Enhancements

- **Interactive Elements**
  - Added accordion FAQs, a gallery lightbox, and a reusable modal dialog
  - Added scroll-triggered reveal animations and smoother transitions
  - Added an interactive Leaflet map with multiple Gauteng service points
  - Used dynamic DOM rendering for featured services and the searchable service catalogue

- **Dynamic Content**
  - Reworked `data/posts.json` into a richer service dataset
  - Loaded services dynamically into the home and services pages
  - Added client-side category filters, keyword search, and sort options
  - Populated the enquiry form service selector dynamically from the same dataset

- **Forms and Validation**
  - Upgraded `contact.html` into a general message form
  - Upgraded `enquiry.html` into a dedicated estimate, availability, volunteer, and sponsorship form
  - Added HTML5 validation plus JavaScript validation for phone numbers, dates, and message lengths
  - Added inline field error feedback and async submission using a Netlify-ready form structure
  - Compiled contact form data into a send-ready email draft addressed to the configured recipient
  - Generated enquiry responses for pricing, availability, volunteering, and sponsorship next steps

- **SEO and Performance**
  - Added improved title tags, meta descriptions, keyword metadata, Open Graph tags, Twitter cards, and canonicals
  - Added structured data on the home page using `LocalBusiness` schema
  - Replaced broken local file image paths with deployable relative assets
  - Added lazy loading and async decoding for non-critical images
  - Added `robots.txt`, `sitemap.xml`, and Netlify clean URLs
  - Removed the external font import to reduce render-blocking requests

- **Security**
  - Added Netlify security headers including CSP, referrer policy, frame protection, and permissions policy
  - Added a honeypot field to both forms to reduce spam submissions

## Off-Page SEO Notes

The following requirements are partly outside the codebase and should be completed after deployment:

- Create and optimise business social profiles
- Register the site with Google Search Console and Bing Webmaster Tools
- Build backlinks from relevant directories, partners, and local community organisations
- Create or update a Google Business Profile for stronger local SEO

## Local Preview

1. Serve the project with a local static server instead of opening files directly when testing dynamic content.
2. Open `index.html` through that local server in your browser.
3. Test the services search, modal, gallery, forms, and contact map.

## Netlify Deployment

1. Create or connect the repository in Netlify.
2. Set the publish directory to the project root: `.`
3. Deploy the site with `netlify.toml` included in the root.
4. After the first deployment, replace the placeholder domain in:
   - page canonical and social URLs
   - `robots.txt`
   - `sitemap.xml`
5. Replace the placeholder recipient email `info@tmanoperations.example` with the real destination address.
6. Submit the live sitemap to search engines after the final domain is confirmed.

## Changelog

- 2026-06-19: Rebuilt the home, about, services, contact, and enquiry pages with stronger SEO and responsive layout improvements.
- 2026-06-19: Added service tabs, modal detail views, dynamic featured content, animation hooks, and richer DOM rendering.
- 2026-06-19: Upgraded the contact and enquiry forms with JavaScript validation, async Netlify-ready submission, inline errors, and response panels.
- 2026-06-19: Replaced broken image paths, refreshed the Leaflet map, and added deployment/security configuration in `netlify.toml`.
- 2026-06-19: Updated `robots.txt`, `sitemap.xml`, metadata, and structured data for search visibility improvements.

## References

- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Netlify Forms](https://docs.netlify.com/forms/setup/)
- [Netlify Configuration File](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [MDN Web Docs](https://developer.mozilla.org/)

## Important Placeholders

- Public URL currently uses the placeholder Netlify domain `https://tman-operations.netlify.app`
- Form recipient email currently uses `info@tmanoperations.example`
- Update both values after the live deployment target and final business email are confirmed
