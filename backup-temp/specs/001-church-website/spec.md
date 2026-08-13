# Feature Specification: Igreja Cévennes Multilingual Website

**Feature Branch**: `001-church-website`  
**Created**: 2025-01-XX  
**Status**: Draft  
**Input**: User description: "Site institucional multilíngue (FR/PT/EN) para a Igreja Cévennes com CMS admin. O projeto visa criar presença digital moderna, centralizar comunicação e engajar a comunidade através de features como eventos, sermões, grupos, blog e newsletter."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Discovers Church Information (Priority: P1)

A first-time visitor lands on the website to learn about Igreja Cévennes, find service times and locations, and understand the church's mission and values. They can browse in their preferred language (French, Portuguese, or English) and quickly access essential information.

**Why this priority**: This is the primary entry point for all users. Without basic church information accessible, the website fails its core institutional purpose. Every other feature depends on users first finding and understanding the church.

**Independent Test**: Can be fully tested by navigating to the homepage, switching languages, viewing the About page, and locating service times. Delivers immediate value by answering "What is this church?" and "When/where can I attend?"

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they view the hero section, **Then** they see the church name, mission statement, and primary call-to-action
2. **Given** a visitor wants service information, **When** they scroll to the worship times section, **Then** they see schedules for all 3 locations (Saint-Hippolyte, Lasalle, Monoblet) with addresses
3. **Given** a visitor speaks Portuguese, **When** they select Portuguese from the language switcher, **Then** all content displays in Portuguese including navigation, headings, and body text
4. **Given** a visitor wants to learn about leadership, **When** they navigate to the team section, **Then** they see pastoral staff photos, names, roles, and short biographies
5. **Given** a visitor is on mobile, **When** they access any page, **Then** the layout adapts responsively with readable text and touch-friendly navigation

---

### User Story 2 - Member Watches Sermon Archive (Priority: P1)

An existing church member wants to rewatch a recent sermon or explore past sermon series. They can search by preacher, biblical book/series, theme, or date, watch videos directly on the site, and download accompanying study notes.

**Why this priority**: Sermon content is central to the church's spiritual ministry and one of the most valuable resources for members. This extends the reach of Sunday services beyond physical attendance.

**Independent Test**: Can be fully tested by navigating to the sermon archive, using search/filters, playing a YouTube video, and downloading a PDF. Delivers standalone value as a spiritual resource library.

**Acceptance Scenarios**:

1. **Given** a member visits the sermon archive, **When** they view the listing page, **Then** they see sermon cards with thumbnail, title, preacher, date, and biblical reference
2. **Given** a member searches for sermons, **When** they filter by preacher name, **Then** only sermons by that preacher appear in results
3. **Given** a member wants to study a series, **When** they filter by biblical book/series, **Then** sermons are grouped and ordered chronologically within that series
4. **Given** a member clicks on a sermon, **When** they view the detail page, **Then** they see an embedded YouTube player, full description, biblical references, and download link for PDF notes
5. **Given** a member is studying offline, **When** they click "Download Notes", **Then** a PDF file downloads with sermon outline and scripture references

---

### User Story 3 - User Explores Upcoming Events (Priority: P2)

A visitor or member wants to discover upcoming church events (special services, conferences, community gatherings). They can view event details, see locations on a map, and register their interest or attendance.

**Why this priority**: Events drive community engagement and visitor conversion. This feature encourages participation beyond Sunday services and helps users connect with church activities.

**Independent Test**: Can be fully tested by viewing the events calendar, filtering by date/type, viewing event details with map integration, and submitting a registration form. Delivers value by promoting participation.

**Acceptance Scenarios**:

1. **Given** a user visits the events page, **When** they view the listing, **Then** they see upcoming events sorted chronologically with title, date, location, and featured image
2. **Given** a user wants specific events, **When** they apply filters (date range, location, event type), **Then** the list updates to show only matching events
3. **Given** a user clicks an event, **When** they view the detail page, **Then** they see complete description, date/time, location address, embedded Google Map, and registration button
4. **Given** a user wants to attend, **When** they click "Register Interest" and submit the form with name/email/phone, **Then** they receive a confirmation message
5. **Given** a user wants to share, **When** they click social share buttons, **Then** the event link opens in Facebook/WhatsApp/email with pre-populated text

---

### User Story 4 - Member Finds Community Group (Priority: P2)

A church member or engaged visitor wants to join a small group (Bible study, prayer group, youth group, etc.). They can browse available groups, see meeting details and leader information, and express interest in joining.

**Why this priority**: Small groups are essential for community building and spiritual growth. This feature facilitates deeper engagement beyond Sunday services.

**Independent Test**: Can be fully tested by browsing the groups directory, viewing group details, and submitting an interest form. Delivers value by connecting people to community.

**Acceptance Scenarios**:

1. **Given** a user visits the groups page, **When** they view the directory, **Then** they see group cards with name, type (Bible study/prayer/youth), meeting time, and location
2. **Given** a user clicks a group, **When** they view details, **Then** they see full description, leader name/contact, meeting schedule, location, and "I'm Interested" button
3. **Given** a user wants to join, **When** they submit the interest form with name/email/preferred group, **Then** the group leader receives notification and user gets confirmation
4. **Given** a user is looking for specific groups, **When** they filter by group type or day of week, **Then** only matching groups appear

---

### User Story 5 - User Reads Blog and News (Priority: P3)

A visitor or member wants to stay informed about church news, read spiritual reflections, and engage with written content. They can browse articles by category, read full posts, and share content with others.

**Why this priority**: Blog content extends the church's teaching ministry and keeps the community informed. While valuable, it's less critical than live events and sermon archives.

**Independent Test**: Can be fully tested by viewing the blog listing, reading an article, filtering by category, and sharing via social media. Delivers value through written ministry and communication.

**Acceptance Scenarios**:

1. **Given** a user visits the blog, **When** they view the listing page, **Then** they see article cards with title, featured image, excerpt, author, date, and category tags
2. **Given** a user clicks an article, **When** they read the full post, **Then** they see complete content with formatting, images, author bio, and publish date
3. **Given** a user wants specific topics, **When** they filter by category or tag, **Then** only articles in that category appear
4. **Given** a user wants to share, **When** they click social share buttons, **Then** the article opens in Facebook/Twitter/email with title and link

---

### User Story 6 - User Contacts Church (Priority: P3)

A visitor or member needs to get in touch with church leadership, ask questions, submit prayer requests, or report issues. They can find contact information and submit a message through a contact form.

**Why this priority**: Contact functionality is important for accessibility but less frequently used than other features. Most users first consume content before reaching out.

**Independent Test**: Can be fully tested by navigating to the contact page, viewing contact details, seeing the location on a map, and submitting a form. Delivers value by enabling direct communication.

**Acceptance Scenarios**:

1. **Given** a user visits the contact page, **When** they view the page, **Then** they see church address, phone, email, office hours, and embedded Google Map
2. **Given** a user wants to send a message, **When** they fill the contact form with name/email/subject/message, **Then** the form validates required fields
3. **Given** a user submits a valid form, **When** they click "Send Message", **Then** they see a success confirmation and church staff receives the message
4. **Given** a user wants directions, **When** they click "Get Directions" on the map, **Then** Google Maps opens with route guidance to the church location

---

### Edge Cases

- **What happens when** a user visits with a browser set to an unsupported language (e.g., Spanish)? System should detect and default to French as the primary language, with visible language switcher for FR/PT/EN.

- **How does the system handle** a sermon without an available PDF? The "Download Notes" button should either be hidden or display "Notes not available" message instead of a broken link.

- **What happens when** a YouTube video is deleted or made private? The sermon detail page should display a graceful error message: "This video is temporarily unavailable" rather than a broken embed.

- **How does the system handle** form submissions when the backend is unavailable? Forms should display a user-friendly error message and preserve entered data so users don't lose their input.

- **What happens when** an event date passes? Past events should automatically move to an archive or be hidden from the main events listing to keep content fresh.

- **How does the system handle** multiple simultaneous events at different locations? The events calendar should clearly differentiate by location and allow filtering by venue.

- **What happens when** a user tries to access admin CMS features? In Phase 1 (public site MVP), admin routes should return "Coming in Phase 2" or redirect to homepage.

- **How does the system handle** very long sermon series (50+ sermons)? The sermon archive should implement pagination to avoid performance issues with large result sets.

- **What happens when** a mobile user on slow connection loads video-heavy pages? Images should be optimized/compressed, videos should lazy-load, and critical content should render first (progressive enhancement).

## Requirements *(mandatory)*

### Functional Requirements

#### Content Display & Navigation
- **FR-001**: System MUST display homepage with 8 sections: Hero with CTA, Worship Times (3 locations), Latest Sermons, About the Church, Leadership Team, Upcoming Events, Community Life (groups), Recent Blog Posts
- **FR-002**: System MUST support three languages (French, Portuguese, English) with visible language switcher on all pages
- **FR-003**: System MUST persist user language selection across page navigation and return visits
- **FR-004**: System MUST provide responsive mobile-first layout that adapts to screen sizes from 320px to 4K displays
- **FR-005**: System MUST display worship service times for all three locations: Saint-Hippolyte, Lasalle, and Monoblet with address and schedule

#### Sermon Archive
- **FR-006**: System MUST display sermon archive with cards showing thumbnail, title, preacher name, date, and biblical reference
- **FR-007**: System MUST provide search functionality filtering sermons by: preacher name, biblical book/series, theme/topic, and date range
- **FR-008**: System MUST embed YouTube video player on sermon detail pages using YouTube API
- **FR-009**: System MUST provide downloadable PDF sermon notes when available
- **FR-010**: System MUST group sermons into series/playlists with visual indication of series membership

#### Events System
- **FR-011**: System MUST display upcoming events sorted chronologically with title, date, location, and featured image
- **FR-012**: System MUST provide event filtering by date range, location (venue), and event type
- **FR-013**: System MUST display event detail pages with full description, date/time, location, embedded Google Map, and registration option
- **FR-014**: System MUST integrate Google Maps showing exact location for each event with "Get Directions" functionality
- **FR-015**: System MUST provide event registration form collecting name, email, phone, and number of attendees
- **FR-016**: System MUST enable social sharing of events to Facebook, WhatsApp, and email with pre-formatted messages

#### Community Groups
- **FR-017**: System MUST display community groups directory with cards showing group name, type, meeting time, and location
- **FR-018**: System MUST categorize groups by type (Bible study, prayer, youth, women's, men's, seniors, etc.)
- **FR-019**: System MUST display group detail pages with description, leader information, meeting schedule, location, and interest form
- **FR-020**: System MUST provide "Express Interest" form collecting name, email, and preferred group selection
- **FR-021**: System MUST allow filtering groups by type and day of the week

#### Blog/News
- **FR-022**: System MUST display blog articles with title, featured image, excerpt, author, publication date, and category tags
- **FR-023**: System MUST render full article content with text formatting, embedded images, author bio, and social share buttons
- **FR-024**: System MUST categorize blog posts with tags and allow filtering by category
- **FR-025**: System MUST support multilingual content where each article can have translations in FR/PT/EN

#### Institutional Pages
- **FR-026**: System MUST provide "About the Church" page with history, mission statement, vision, and core values
- **FR-027**: System MUST display leadership team page with photos, names, roles, and biographies for pastoral staff
- **FR-028**: System MUST provide "Statement of Faith" page with theological positions and beliefs
- **FR-029**: System MUST display contact page with church address, phone, email, office hours, contact form, and embedded Google Map

#### Forms & Data Collection
- **FR-030**: System MUST validate all forms with real-time feedback using client-side validation (email format, required fields, phone format)
- **FR-031**: System MUST display success confirmation messages after successful form submission
- **FR-032**: System MUST display user-friendly error messages when form submission fails, preserving user input
- **FR-033**: System MUST implement spam protection on all public forms (honeypot or similar non-intrusive method)

#### SEO & Discoverability
- **FR-034**: System MUST generate unique meta titles and descriptions for each page based on content
- **FR-035**: System MUST implement structured data (schema.org) for Church, Events, Articles, and Videos
- **FR-036**: System MUST generate XML sitemap including all public pages in all three languages
- **FR-037**: System MUST generate robots.txt allowing search engine indexing of public content
- **FR-038**: System MUST implement Open Graph tags for social media sharing with appropriate images and descriptions

#### Performance & Accessibility
- **FR-039**: System MUST optimize images with responsive formats (WebP with fallbacks) and lazy loading
- **FR-040**: System MUST implement semantic HTML with proper heading hierarchy (h1-h6) for screen readers
- **FR-041**: System MUST provide keyboard navigation support for all interactive elements
- **FR-042**: System MUST ensure sufficient color contrast ratios meeting WCAG 2.1 Level AA standards
- **FR-043**: System MUST provide alternative text for all images and videos

### Key Entities *(mandatory)*

- **Sermon**: Represents a recorded church message with attributes including title (multilingual), preacher name, date delivered, biblical reference (book, chapter, verses), series/playlist name, YouTube video ID, PDF notes URL (optional), description, theme/tags, and duration

- **Event**: Represents a church event or gathering with attributes including title (multilingual), description (multilingual), event type (service, conference, community, youth, outreach), start date/time, end date/time, location (reference to Location entity), featured image, registration enabled flag, capacity limit, and social share metadata

- **Location**: Represents a physical church venue with attributes including name (Saint-Hippolyte, Lasalle, or Monoblet), street address, city, postal code, country, Google Maps coordinates (latitude/longitude), worship service schedule, and contact information

- **CommunityGroup**: Represents a small group or ministry with attributes including name (multilingual), description (multilingual), group type (Bible study, prayer, youth, women's, men's, seniors), leader name, leader contact, meeting day of week, meeting time, meeting location (reference to Location entity or custom address), and maximum capacity

- **BlogArticle**: Represents a news post or article with attributes including title (multilingual), content body (multilingual, rich text), author name, author bio, publication date, last updated date, featured image, category tags, SEO metadata, and published status

- **LeadershipMember**: Represents a church staff or leadership team member with attributes including full name, role/title (multilingual), biography (multilingual), profile photo, email contact, ordination date, and areas of ministry

- **Translation**: Represents multilingual content strings with attributes including key identifier, language code (fr, pt, en), translated text, and content category (ensures consistent translations across the site)

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### User Experience & Engagement
- **SC-001**: Visitors can discover church service times and location within 10 seconds of landing on homepage
- **SC-002**: Users can complete the primary task (find service time, watch sermon, view event, or contact church) within 3 clicks from homepage
- **SC-003**: 90% of first-time visitors can successfully switch languages and navigate to key pages (About, Events, Sermons)
- **SC-004**: Mobile users can access all content and features without horizontal scrolling or broken layouts on devices 360px width and above
- **SC-005**: Users can search and find a specific sermon by preacher or biblical reference within 30 seconds

#### Performance & Technical Quality
- **SC-006**: Homepage achieves Lighthouse performance score of 90+ on mobile and desktop
- **SC-007**: All Core Web Vitals metrics pass: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **SC-008**: Pages load initial content (First Contentful Paint) in under 1.5 seconds on 3G connection
- **SC-009**: Site supports 500 concurrent users without performance degradation or downtime
- **SC-010**: All public pages return response within 2 seconds under normal load

#### Accessibility & Multilingual Support
- **SC-011**: Site achieves WCAG 2.1 Level AA compliance with zero critical accessibility violations
- **SC-012**: All interactive elements (buttons, forms, navigation) are fully operable via keyboard navigation
- **SC-013**: Screen readers can navigate entire site with appropriate labels and semantic structure
- **SC-014**: Content displays correctly in all three languages (FR/PT/EN) with proper character encoding and text direction
- **SC-015**: Language switching preserves user context (stays on same page/section after switching)

#### SEO & Discoverability
- **SC-016**: Homepage appears in Google search results within 1 week of launch
- **SC-017**: All public pages are indexed by search engines within 2 weeks of launch
- **SC-018**: Event and sermon pages display rich snippets in search results with structured data
- **SC-019**: Social media shares display proper Open Graph images, titles, and descriptions
- **SC-020**: Site achieves 85+ SEO score in Lighthouse audits

#### Content Management & Forms
- **SC-021**: Form submissions are successfully delivered to church administrators with 99.5% reliability
- **SC-022**: Users receive confirmation within 3 seconds of submitting any form (contact, registration, interest)
- **SC-023**: Form validation provides clear, actionable error messages in the user's selected language
- **SC-024**: Sermon archive can accommodate 500+ sermons without performance issues
- **SC-025**: Event listings automatically hide past events and display upcoming events in chronological order

#### Business & Ministry Impact
- **SC-026**: Website increases online sermon viewership by 200% compared to previous YouTube-only access within 3 months
- **SC-027**: Event registration form submissions increase community event participation by 30% within 2 months
- **SC-028**: Contact form submissions reduce administrative email workload by centralizing all inquiries
- **SC-029**: 70% of new church visitors report finding service information and location "very easy" in user surveys
- **SC-030**: Small group interest form submissions lead to 15+ new group connections within first month

## Assumptions *(mandatory)*

### Content & Data
- Church will provide initial content (About, Mission, Statement of Faith, Leadership bios) in at least French and Portuguese; English translations can be added progressively
- Initial sermon archive will include metadata for at least 20-30 recent sermons with YouTube links; older sermons can be added over time
- Church will provide high-quality images for leadership team, featured event photos, and blog posts (minimum 1200x630px for hero/featured images)
- Events and groups data will be manageable via direct database access or provided as structured data (CSV/JSON) during Phase 1; full CMS admin comes in Phase 2

### Technical Infrastructure
- Cappuccino Cloud (MongoDB) is already provisioned and accessible for storing all content and form submissions
- Church has existing YouTube channel with sermon videos already uploaded and public
- Google Maps API credentials will be provided or church approves API usage under project account
- Domain name (e.g., eglisecevennes.org) is registered or will be registered before deployment

### User & Usage Patterns
- Primary audience speaks French (60%), Portuguese (30%), English (10%) with most bilingual or trilingual capabilities
- Peak traffic occurs around Sunday service times (before/after) and when new sermon videos are published
- Average monthly traffic estimate: 500-1000 unique visitors growing to 2000+ within 6 months
- Users expect standard church website conventions (About, Contact, Events, Sermons navigation)

### Design & Branding
- Design system colors, typography, and visual style are finalized as specified (Borgonha primary, Playfair Display headings, Inter body)
- Church logo and brand assets are available in vector format (SVG or high-res PNG)
- Content tone is warm, welcoming, and accessible to both believers and seekers
- Photography style is authentic and diverse, reflecting the multilingual, multicultural community

### Timeline & Scope
- Phase 1 (MVP) focuses on public-facing website only; CMS admin interface deferred to Phase 2
- Content updates during Phase 1 will be handled by developers or direct database edits
- Newsletter subscription functionality may be integrated with external provider (Mailchimp, SendGrid) or built custom based on church preference
- Integration with existing church management systems (if any) is out of scope for Phase 1

### Performance & Hosting
- Vercel deployment with global CDN provides sufficient infrastructure for expected traffic and growth
- Budget allows for standard Vercel hosting tier (Pro if needed for team collaboration and performance features)
- MongoDB storage requirements are within Cappuccino Cloud free/starter tier limits (estimate: < 1GB for Phase 1 content)
- Third-party API costs (YouTube Data API, Google Maps) remain within free tier usage limits

### Legal & Compliance
- Church has rights and permissions for all content, images, and videos published on the site
- YouTube embed complies with YouTube Terms of Service and content is owned/licensed by church
- Form data collection complies with GDPR (if applicable) and local privacy laws; privacy policy will be provided by church
- No e-commerce or financial transactions in Phase 1 (donations/giving deferred to future phase or external platform)

## Dependencies *(mandatory)*

### External Services & APIs
- **YouTube Data API v3**: Required for fetching sermon video metadata, thumbnails, and embedding player. Dependency on YouTube service uptime and API quota limits (10,000 units/day free tier).
- **Google Maps JavaScript API**: Required for displaying location maps on event pages and contact page. Dependency on Google Maps service availability and API key provisioning.
- **Google Maps Embed API**: Required for interactive embedded maps with directions functionality. Separate from JavaScript API but same billing account.

### Infrastructure & Hosting
- **Vercel Deployment Platform**: Required for hosting Next.js application with automatic deployments from Git. Dependency on Vercel service uptime and build/deployment pipeline.
- **Cappuccino Cloud (MongoDB)**: Required for storing all content (sermons, events, groups, blog articles, form submissions). Dependency on database availability, connection limits, and data retention policies.
- **Vercel Edge Network (CDN)**: Required for fast global content delivery and image optimization. Dependency on CDN edge node availability in target regions (Europe, Americas).

### Technical Libraries & Frameworks
- **Next.js 14+ App Router**: Core framework dependency requiring specific Node.js version (18.17+) and npm/pnpm package manager.
- **next-intl**: Required for internationalization (i18n) routing and translation management. Dependency on library maintaining Next.js 14 compatibility.
- **Tailwind CSS 4+**: Required for styling and responsive design. Dependency on Tailwind configuration and shadcn/ui component compatibility.
- **shadcn/ui components**: Required for consistent UI components (forms, dialogs, cards). Dependency on React 18+ and Tailwind CSS integration.
- **React Hook Form + Zod**: Required for form validation and data handling. Dependency on type-safe schema validation and React integration.

### Content & Assets
- **Church-provided Content**: Requires church to deliver initial content including mission statement, About text, leadership bios, Statement of Faith in at least 2 languages (FR/PT) within first 2 weeks of development.
- **Sermon Metadata**: Requires structured data (spreadsheet or JSON) with existing sermon titles, dates, preachers, biblical references, YouTube video IDs for at least 20-30 sermons.
- **High-Quality Images**: Requires church to provide professional photos for hero section, leadership team (headshots), event featured images (1200x630px minimum) before content population phase.
- **Logo & Brand Assets**: Requires church logo in SVG or high-res PNG format with transparent background for header/footer usage.

### Domain & DNS
- **Domain Name Registration**: Requires church to own or register domain (e.g., eglisecevennes.org) and provide DNS management access for Vercel integration.
- **SSL Certificate**: Managed automatically by Vercel but requires domain verification and DNS configuration.

### Stakeholder Availability
- **Content Review & Approval**: Requires church leadership availability for reviewing and approving content, translations, and feature implementation at key milestones (weeks 3, 6, 9).
- **User Acceptance Testing**: Requires 3-5 church members (representing different language groups) available for UAT during week 9-10.
- **Photography/Video Session**: If original photos not available, requires scheduling photoshoot with church leadership and congregation (2-3 hours) before week 6.

### Phase 2 Dependencies (Future)
- **CMS Admin Authentication**: Phase 2 CMS depends on JWT authentication integration with Cappuccino Cloud auth services.
- **Role-Based Access Control**: Phase 2 admin features depend on defining user roles (admin, editor, viewer) and permission matrix.
- **Newsletter Integration**: Future newsletter feature depends on selecting and integrating email service provider (Mailchimp, SendGrid, or custom).

## Out of Scope (Phase 1) *(mandatory)*

### Admin & Content Management
- **CMS Admin Interface**: Full admin dashboard for content editors to manage sermons, events, groups, and blog posts through a web UI (deferred to Phase 2)
- **User Authentication System**: Login/logout functionality for administrators and members (Phase 2)
- **Role-Based Permissions**: Granular access control for admin, editor, and viewer roles (Phase 2)
- **Content Versioning**: Ability to save drafts, track content changes, and revert to previous versions (Phase 2)
- **Media Library Management**: Web UI for uploading, organizing, and managing images and PDF files (Phase 2)
- **Bulk Content Import**: Tools for importing large batches of sermons or events from CSV/spreadsheet (Phase 2)

### Advanced Features
- **Member Portal**: Login area for church members with personalized dashboards, saved sermons, or private content (Future)
- **Online Giving/Donations**: Payment processing for tithes, offerings, or event fees (Future phase or external platform)
- **Event Ticketing**: Paid event registration with payment processing and ticket generation (Future)
- **Live Streaming**: Integration for broadcasting live church services (Future; can use existing YouTube Live as interim solution)
- **Member Directory**: Searchable directory of church members with contact details and photos (Future, privacy considerations)
- **Small Group Management**: Full group lifecycle management including rosters, attendance tracking, and communication tools (Future)
- **Prayer Request System**: Private submission and management of prayer requests with admin moderation (Future)
- **Volunteer Scheduling**: Calendar and signup system for church volunteers and ministry teams (Future)

### E-commerce & Transactions
- **Online Bookstore**: Selling books, resources, or merchandise through the website (Future or external platform)
- **Event Payment Processing**: Collecting fees for conferences, retreats, or paid events (Future)
- **Donation Receipts**: Automated tax receipt generation for financial contributions (Future, requires accounting integration)

### Communication & Notifications
- **Email Newsletter Campaigns**: Full-featured email marketing with templates, segmentation, and analytics (Future; may integrate Mailchimp/SendGrid)
- **Push Notifications**: Browser or mobile push notifications for new sermons or event reminders (Future)
- **SMS Notifications**: Text message alerts for events or prayer chain (Future, requires SMS gateway)
- **In-App Messaging**: Direct messaging between members or member-to-leader communication (Future)

### Social & Community
- **Discussion Forums**: Public or member-only forums for biblical discussions and community interaction (Future)
- **Comment System**: User comments on sermons, blog posts, or events (Future, requires moderation)
- **Social Media Feed Integration**: Embedding live feeds from Facebook or Instagram (Future; manual social sharing already included)
- **Member Profiles**: Personal profiles for members with bio, interests, and small group affiliations (Future)

### Analytics & Reporting
- **Custom Analytics Dashboard**: Admin dashboard with charts and metrics for site traffic, sermon views, event registrations (Phase 2/Future)
- **Sermon Engagement Metrics**: Tracking watch time, completion rates, and user engagement per sermon (Future; basic YouTube analytics available)
- **Conversion Tracking**: Monitoring visitor-to-member conversion rates and funnel analysis (Future)
- **A/B Testing**: Comparing different layouts or content strategies for optimization (Future)

### Third-Party Integrations
- **Calendar Sync**: Exporting events to Google Calendar, Outlook, or Apple Calendar (Future)
- **Church Management System Integration**: Syncing with Planning Center, ChurchTools, or similar platforms (Future)
- **Email Service Provider Integration**: Full Mailchimp or SendGrid integration for newsletter management (Future; basic email submission included in Phase 1)
- **CRM Integration**: Connecting form submissions to Salesforce or HubSpot (Future)

### Technical Enhancements
- **Progressive Web App (PWA)**: Offline functionality, app-like experience, and installability (Future)
- **Advanced Search**: Full-text search across all content types with filters and autocomplete (Future; basic sermon filtering included in Phase 1)
- **Personalization Engine**: Recommending sermons or events based on user behavior (Future, requires user accounts)
- **Multi-Language Admin**: CMS admin interface available in FR/PT/EN (Phase 2)
- **API for Mobile Apps**: RESTful or GraphQL API for future native mobile applications (Future)
- **Automated Content Translation**: AI-powered translation assistance for multilingual content (Future)

### Other Exclusions
- **Podcast RSS Feed**: Distributing sermons via podcast platforms (Apple Podcasts, Spotify) (Future)
- **Mobile Native Apps**: iOS and Android applications (Future; responsive web is Phase 1)
- **Accessibility Beyond WCAG AA**: Level AAA compliance or advanced assistive technology support (Future enhancement)
- **Multi-Church Network**: Supporting multiple church locations as separate sites or microsites under one platform (Future)
- **Sermon Transcription**: Automatic transcription of sermon audio to text for accessibility or search (Future)

---

**Note**: Phase 1 focuses on delivering a high-quality, performant public-facing website that meets the church's immediate needs for online presence, content accessibility, and community engagement. The CMS admin interface and advanced features are intentionally deferred to ensure timely delivery of core functionality and allow for user feedback before expanding scope.
