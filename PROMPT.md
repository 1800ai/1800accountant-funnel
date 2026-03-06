# MEGA PROMPT V2: 1-800Accountant Conversion Funnel — Research-Backed Build

> **IMPORTANT**: This is a complete rebuild. Delete ALL existing files in `src/` and start fresh. Do not attempt to patch the existing broken code.

---

## CONTEXT FOR THE AI BUILDER

You are building the most important prototype in 1-800Accountant's history — a transformation from a "schedule a call" landing page into an intelligent e-commerce qualifier funnel. This will be demoed to company leadership. It must look and feel like a **real, shipped product** — not a hackathon project.

**The data backing this transformation:**
- Multi-step qualifier funnels convert 86% higher than single-page forms
- Financial services landing pages convert at 8.4% median (vs. 3.2% all-industry)
- Companies like Lemonade reached 1M customers in 4 years using conversational quiz flows
- Theatrical loading screens increase perceived value (Harvard Business School research)
- Single-page checkout with digital wallets increases completion by 15–58%

**The company:** 1-800Accountant — America's leading virtual accounting firm for small businesses. 250,000+ businesses served. Featured in Forbes, Entrepreneur, NYT, WSJ. SOC 2 certified, A- BBB rating.

**The products:**
- **DIY** — $49/mo: Tax Prep, AI Bookkeeping, Unlimited Chat Support, Free Onboarding
- **Do It With Me** — $149/mo: Tax Prep, AI Bookkeeping, On-Demand Accountant, Free Onboarding
- **Full Service** — $299/mo: Business & Personal Tax Prep, Dedicated Bookkeeping, Payroll Setup, Proactive Tax Advisory, Invoicing & Monthly Reports, Quarterly Tax Estimates. Requires consultation.

---

## TECH STACK

- **React** via Vite
- **Tailwind CSS** via `@tailwindcss/vite` plugin
- **Framer Motion** for all animations
- **React Router DOM** for routing
- **Lucide React** for icons

### Critical Setup — Do This First

**vite.config.js:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**index.css** — must start with:
```css
@import "tailwindcss";
```
Then add Google Font imports and CSS custom properties after.

**Verify Tailwind works before building anything.** Create a test div with `className="bg-red-500 text-white p-8"` and confirm it renders with red background. If it doesn't, fix the config before proceeding.

---

## BRAND & DESIGN SYSTEM

### Colors
```css
:root {
  --orange: #FA8200;
  --orange-hover: #E87600;
  --navy: #0F1923;
  --navy-light: #1A2836;
  --dark: #0D0D0D;
  --white: #FFFFFF;
  --off-white: #F8F6F3;
  --warm-gray: #F9F1E8;
  --blue: #307CFF;
  --green: #01CAA5;
  --text-primary: #1A1A1A;
  --text-secondary: #6B7280;
  --text-light: #9CA3AF;
  --border: #E5E7EB;
}
```

### Typography
Import from Google Fonts in index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```
- **Headings**: Plus Jakarta Sans (800 for heroes, 700 for sections, 600 for cards)
- **Body**: DM Sans (400 for text, 500 for labels, 600 for buttons)
- **DO NOT** use Inter, Roboto, Arial, or system-ui anywhere

### Logo
- File: `public/1800A_Full-Logo.png` — use in navbar, sized `h-10` on desktop, `h-8` on mobile
- LegalZoom logo: `public/legalzoom-logo.png` — use on "no business" path cards

### Design Aesthetic
Think **Stripe meets Linear meets Vercel** — premium, dark hero sections, crisp white content areas, surgical precision in spacing. The vibe is: "this company is way more sophisticated than you expected."

**Specific rules:**
- Every section has `py-20 lg:py-28` vertical padding minimum
- Max content width: `max-w-7xl mx-auto px-6`
- Cards: `rounded-2xl` with subtle `shadow-lg` and `hover:shadow-xl transition-all duration-300`
- Buttons: `rounded-xl` (not fully round, not square), `font-semibold`, `px-8 py-4` minimum
- Primary buttons: `bg-[#FA8200] hover:bg-[#E87600] text-white` with `hover:scale-[1.02] transition-all`
- Form inputs: `rounded-xl border-2 border-gray-200 focus:border-[#FA8200] focus:ring-2 focus:ring-[#FA8200]/20` with smooth transition
- Dark sections: Use gradient `bg-gradient-to-br from-[#0F1923] to-[#0D0D0D]`
- Light sections: Alternate between `bg-white` and `bg-[#F8F6F3]`
- **Generous whitespace everywhere.** When in doubt, add more padding.
- Subtle noise/grain texture overlay on dark hero sections (CSS background-image with inline SVG data URI)

---

## ARCHITECTURE: 7 SCREENS, NOT 10

Research shows every additional step loses users. We consolidated to 7 screens with maximum conversion at each:

```
/                    → Landing Page (hero + social proof + calculator + CTA)
/get-started         → Qualifier Flow (ALL questions in one smart multi-step)
/analyzing           → Theatrical Loading Screen
/your-plan           → Personalized Offer Page
/checkout            → Single-Page Checkout
/schedule            → Schedule Consultation
/welcome             → Confirmation & Next Steps
```

### State Management

Use React Context (`FunnelContext`) to store all qualifier data:

```js
{
  // Qualifier data
  hasExistingBusiness: null,  // true/false
  revenue: null,              // "<50k" | "50k-150k" | "150k-500k" | "500k+"
  industry: null,             // string
  state: null,                // US state abbreviation
  companyName: "",
  fullName: "",
  email: "",
  phone: "",

  // Selection data
  selectedPlan: null,         // "diy" | "diwm" | "full-service" | "consultation"
  selectedDate: null,
  selectedTime: null,
}
```

### Page Transitions

Wrap ALL routes in Framer Motion `AnimatePresence`. Every page transition:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
```

---

## SCREEN 1: LANDING PAGE (`/`)

This page must be **beautiful, fast, and conversion-focused**. One primary CTA repeated throughout: "Get Your Custom Plan →"

### Navbar (sticky, on every page)
- Glassmorphic: `backdrop-blur-xl bg-white/80` (light pages) or `bg-[#0F1923]/80` (dark hero)
- Left: Logo (`h-10`)
- Center: Services, Pricing, Resources, Support (desktop only)
- Right: "Sign In" (text link) + "Get Started" (small orange button)
- Mobile: hamburger menu
- On scroll past hero, navbar bg becomes solid with shadow

### Hero Section (full viewport, dark)
- Background: `bg-gradient-to-br from-[#0F1923] via-[#0D1117] to-[#0D0D0D]` with a subtle animated radial gradient orb (CSS animation, slow pulse, orange-tinted, positioned top-right at 20% opacity)
- Optional: faint dot grid pattern overlay at 5% opacity

**Content (left-aligned on desktop, centered on mobile):**
- Eyebrow: "TRUSTED BY 250,000+ SMALL BUSINESSES" in small caps, tracked wide, `text-[#FA8200]`
- Headline: **"Stop Overpaying on Taxes.\nStart Growing Your Business."**
  - "Stop Overpaying on Taxes." in white
  - "Start Growing Your Business." in `text-[#FA8200]` with subtle gradient
  - Font: Plus Jakarta Sans, 800 weight, `text-5xl lg:text-7xl`, tight leading
- Subheadline: "Get a personalized accounting plan in 2 minutes. AI-powered bookkeeping, expert tax prep, and proactive advisory — starting at $49/mo."
  - `text-lg text-gray-400 max-w-xl mt-6`
- **Primary CTA**: "Get Your Custom Plan →" — large orange button with hover animation
- **Secondary CTA**: "See Pricing" — ghost button, white border
- Below CTAs: Trust strip: "SOC 2 Certified · A- BBB Rating · 250K+ Businesses Served" with small icons, `text-sm text-gray-500 mt-8`

**Right side (desktop only):** Floating card mockup showing a dashboard-style UI with savings number, or skip and let the left-aligned text breathe with the gradient orb as visual interest.

### Social Proof Marquee
- Full-width strip, dark charcoal bg (`bg-[#111]`)
- "FEATURED IN" label left, then scrolling logos: Entrepreneur, Forbes, The New York Times, The Wall Street Journal
- Use actual text styled in appropriate serif fonts (e.g., Georgia for NYT), not broken raw text
- CSS `@keyframes scroll` infinite loop, smooth, `50s linear`
- Duplicate the list for seamless loop
- Proper gaps: `gap-16` between items, `text-xl font-semibold text-gray-500 tracking-wide`

### Value Props Section (light bg: `bg-[#F8F6F3]`)
- Heading: "Why 250,000+ Businesses Choose Us"
- Subheading: "We combine cutting-edge technology with real human expertise."
- **3 cards** in `grid grid-cols-1 md:grid-cols-3 gap-8`:
  1. **Proactive Tax Advisory** — Shield icon — "We don't just file — we find savings year-round and plan ahead so you never overpay."
  2. **AI-Powered Bookkeeping** — Cpu icon — "Automated transaction categorization, real-time P&L, and financial insights — without the spreadsheets."
  3. **Dedicated Expert Team** — Users icon — "A real CPA or EA who knows your business by name, available when you need them."
- Each card: `bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`
- Icon in orange circle: `w-14 h-14 rounded-xl bg-[#FA8200]/10 flex items-center justify-center` with orange icon
- **All 3 cards must be equal height, fully visible, properly spaced**

### Tax Savings Calculator (dark section)
- Heading: "See How Much You Could Save"
- 3 sliders, each in its own row with clear label, current value display, and range markers:
  - **Annual Revenue**: $50K → $2M+ (default $200K)
  - **Number of Employees**: 1 → 100+ (default 5)
  - **Current Tax Rate**: 15% → 40% (default 25%)
- Each slider: custom styled range input (orange thumb, gray track, filled portion in orange)
- Labels and values clearly above/beside each slider, not overlapping
- **Animated savings number** below: big green `text-5xl font-extrabold text-[#01CAA5]` with a count-up animation on value change
- CTA below: "Get Your Custom Plan →"

### Testimonial (light section)
- Single featured testimonial in a centered card
- Star rating (5 orange stars) above the quote
- Quote in `text-xl italic text-gray-700` with proper quotation marks
- "— Carrie Stone, Massage Logic LLC" below, with company name in `text-[#FA8200]`
- Card: `max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-lg`

### Final CTA (dark section)
- Centered, full-width padding
- Heading: "Ready to stop leaving money on the table?" in `text-4xl lg:text-5xl font-extrabold text-white`
- CTA: "Get Your Custom Plan →"
- Below: "Free consultation · No credit card required · Cancel anytime" in `text-gray-400`

### Footer
- Dark bg, 4-column grid on desktop
- Cols: Services (Tax Prep, Bookkeeping, Payroll, Tax Advisory, Entity Formation), Company (About, Careers, Partners, Reviews), Resources (Blog, Tax Calculator, FAQ, Small Business Guide), Legal (Privacy, Terms, Do Not Sell, Data Security)
- Logo at top of footer
- Bottom bar: "© 2026 1-800Accountant. All rights reserved." + social icons
- **Proper grid gaps and padding, not cramped**

---

## SCREEN 2: QUALIFIER FLOW (`/get-started`)

**One page, multi-step. NOT separate routes.** Use internal state to track which step is active. Steps animate in/out using Framer Motion.

### Layout
- Clean centered layout, white bg, `max-w-2xl mx-auto`
- **Progress bar** at top: labeled steps with current step highlighted
  - Show as: "1 → 2 → 3 → 4" with step names underneath
  - Current step: orange fill, completed steps: green checkmark
  - Progress bar positioned at bottom of viewport area (research shows bottom placement converts better)
- No navbar links (just logo), minimal distractions — funnel mode

### Step 1: Business Status
- Heading: "First, do you already have a registered business?"
- **Two large cards** side-by-side:
  1. **"Yes, I have a business"** — Building2 icon, subtitle: "I'm looking for tax & accounting support"
  2. **"Not yet — I'm just getting started"** — Rocket icon, subtitle: "I want to form my business and get set up right"
- Cards: `min-h-[200px] flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-[#FA8200] hover:shadow-lg transition-all`
- Selected state: `border-[#FA8200] bg-[#FA8200]/5 shadow-lg` with animated checkmark
- **Auto-advance** 500ms after selection

### Step 2: Business Details (Revenue + Industry + State)
- Heading: "Tell us about your business"
- **Each question appears sequentially with smooth animation** (answer one, next fades in below)

**Revenue:** "What's your annual revenue?"
- 4 pill-shaped options in a 2x2 grid:
  - "Less than $50K" | "$50K – $150K" | "$150K – $500K" | "$500K+"
- `rounded-xl border-2 p-4 text-center cursor-pointer` with same hover/selected states as above

**Industry:** "What industry are you in?"
- Visual card grid, 3 columns on desktop, 2 on mobile
- Each card: icon + label, `p-4 rounded-xl border-2 text-center`
- Industries with Lucide icons:
  - Hammer → Construction & Trades
  - ShoppingCart → E-Commerce & Retail
  - Monitor → Technology & SaaS
  - Heart → Healthcare & Wellness
  - UtensilsCrossed → Food & Restaurant
  - Home → Real Estate
  - Palette → Creative & Marketing
  - Truck → Transportation & Logistics
  - Briefcase → Consulting & Professional Services
  - MoreHorizontal → **Other** (on select, smoothly expand a text input below the grid)

**State:** "Where is your business based?"
- Custom searchable select (NOT default browser select)
- Type-ahead filtering, styled dropdown panel
- `rounded-xl border-2 p-4` with same focus styles
- Show popular states at top: CA, TX, FL, NY, IL

**Continue button** appears after all 3 answered: "Continue →" with animated entrance

### Step 3: Contact Info
- Heading: "Almost there — tell us about you"
- Subheading: "We'll use this to set up your account."
- **4 form fields** with floating labels:
  - Company Name (if no business: "Planned Business Name (optional)")
  - Full Name
  - Email Address (with email validation)
  - Phone Number (with mask: (XXX) XXX-XXXX)
- Each field: `rounded-xl border-2 border-gray-200 p-4 w-full` with floating label animation on focus
- Real-time validation: green checkmark on valid, red border + shake on invalid
- CTA: "See My Personalized Plan →" (orange, full-width)
- Small print: "By continuing, you agree to our Terms of Service and Privacy Policy"

### Step 4: (there is no step 4 — submitting step 3 routes to /analyzing)

---

## SCREEN 3: THEATRICAL LOADING (`/analyzing`)

**Purpose:** Build perceived value. Harvard research proves users prefer services that show effort.

### Layout
- Full-screen dark bg, centered content
- NO navbar, NO progress bar — immersive
- Subtle animated gradient background (slow color shift between navy and dark teal)

### Animation Sequence (~15 seconds total, then auto-navigate)

1. **"Analyzing your tax profile..."** (0–3s)
   - Pulsing circle animation → green checkmark
2. **"Searching {STATE} tax regulations..."** (3–7s)
   - Use actual state from context
   - Pulsing → checkmark
3. **"Identifying deductions for {INDUSTRY}..."** (7–11s)
   - Use actual industry from context
   - Pulsing → checkmark
4. **"Building your personalized plan..."** (11–15s)
   - Pulsing → checkmark → auto-navigate to /your-plan

Each step: `motion.div` with staggered fade-in + slide-up. Use `spring` animations for the checkmark pop-in.

- Circular progress indicator or horizontal progress bar filling as steps complete
- Each completed step text fades to `text-gray-500`, current step in `text-white`
- Optional: faint particle/sparkle effect in background
- **Must feel premium, not cheesy. Think credit score reveal, not pizza tracker.**

---

## SCREEN 4: PERSONALIZED OFFER PAGE (`/your-plan`)

This is the money screen. Two completely different layouts based on `hasExistingBusiness`.

### Common Header
- Heading: "Your Personalized Plan" in large bold
- Subheading with personalized context: "Based on your {INDUSTRY} business in {STATE} generating {REVENUE}/year, here's what we recommend."

---

### PATH A: Has Existing Business

**Three pricing cards** + consultation sidebar

**Desktop layout:** 3 pricing cards in a row (left) taking 70% width + "Talk to a Specialist" card (right) taking 30%. On mobile, stack all 4.

**IMPORTANT — Card order: $299 first (left), $149 center (highlighted), $49 right.** Research shows leftmost anchoring makes the middle tier feel like the best value.

**Card 1: Full Service — $299/mo**
- Subtle "Premium" label
- All features with checkmarks
- CTA: "Schedule Free Consultation" (outline button → routes to /schedule)
- Note: "Includes dedicated onboarding call"
- Recommended badge if revenue is $150K+ or $500K+

**Card 2: Do It With Me — $149/mo** ⭐
- "MOST POPULAR" badge in orange at top, card slightly elevated/scaled
- Glowing orange border: `border-2 border-[#FA8200] shadow-[0_0_30px_rgba(250,130,0,0.15)]`
- All features with checkmarks
- CTA: "Get Started — $149/mo" (solid orange button → routes to /checkout)
- Recommended badge if revenue is $50K–$150K

**Card 3: DIY — $49/mo**
- "Best for Starters" label
- Features with checkmarks
- CTA: "Get Started — $49/mo" (solid orange button → routes to /checkout)
- Recommended badge if revenue < $50K

**Recommendation logic:** The card matching the user's revenue bracket gets a "✨ Recommended for You" badge with animated shimmer border. The recommended card is visually emphasized regardless of position.

**Sidebar: "Talk to a Specialist"**
- Card with headset/user icon
- "Prefer a human touch?"
- "Schedule a free consultation with a tax specialist who'll review your situation and recommend the best path."
- CTA: "Schedule Free Call" → /schedule
- Below: small note "30-minute Google Meet · No obligation"

**Below the cards:** Simple comparison table (expandable accordion) showing all features across tiers with checkmarks/x marks

---

### PATH B: No Existing Business

**Three cards** — modified for pre-business owners:

**Card 1: DIY + Free Entity Formation — $49/mo**
- All DIY features PLUS:
  - "🎁 FREE Business Entity Formation" (highlighted in green)
  - "🎁 FREE EIN Filing"
- Small "Entity formation powered by LegalZoom" with legalzoom-logo.png (`h-5` inline)
- CTA: "Get Started — $49/mo" → /checkout

**Card 2: Do It With Me + Free Entity Formation — $149/mo** ⭐ MOST POPULAR
- Same treatment as above, highlighted card
- All DIWM features PLUS free formation + EIN
- LegalZoom logo
- CTA: "Get Started — $149/mo" → /checkout

**Card 3: "Let a Specialist Handle Everything"**
- Different card style — warm bg (`bg-[#F9F1E8]`), more personal
- Handshake icon
- Heading: "Not sure where to start? We'll do it all."
- "A dedicated specialist will help you choose the right business structure, handle all formation paperwork, and build a complete tax strategy."
- CTA: "Schedule Free Consultation" → /schedule
- No price displayed — positions as premium/custom

---

### Social Proof on This Page
- Below pricing cards: "Join 250,000+ small business owners" with scrolling logo bar of customer types
- 2-3 mini testimonials: "Saved $8,200 in my first year" style quotes with name, business
- Trust badges row: SOC 2, BBB, "Cancel Anytime", "30-Day Money-Back"

---

## SCREEN 5: CHECKOUT (`/checkout`)

**Single page. This is critical — research shows single-page checkout converts 7.5–21.8% higher for subscriptions.**

### Layout: Two columns on desktop

**LEFT: Payment (60% width)**

**Header:** "Complete Your Purchase"

**Express Checkout (top, most prominent):**
- Apple Pay button: black pill, white Apple logo + "Pay" text, full-width
- Google Pay button: white pill with border, colored G logo + "Pay" text, full-width
- Both are simulated — on click, show a success animation and skip to /welcome
- Divider: thin line with "or pay with card" centered

**Card Form (Stripe-style):**
- Single card number field (auto-detect Visa/MC/Amex icon based on first digits)
- Expiration (MM/YY) + CVC side by side
- Cardholder Name
- Billing ZIP
- Styled to look exactly like Stripe Elements: light gray bg fields, subtle borders, clean focus states
- Inline validation with green checkmarks

**CTA button:** "Subscribe — ${price}/mo" in large orange button, full width
- Loading state: spinner replaces text on click
- Below: 🔒 "Secured by 256-bit SSL encryption" + tiny trust badge icons (Norton, BBB)

**RIGHT: Order Summary (40% width)**
- Sticky card on scroll
- Plan name + "Monthly Subscription"
- Feature list (condensed, 4-5 items with checkmarks)
- If no-business path: "✨ Includes Free Entity Formation" highlighted in green banner
- Divider
- Subtotal: $XX/mo
- Total: $XX/mo (bold)
- "Cancel anytime — no contracts"
- Expandable promo code input

**On submit** → routes to /welcome (skip account creation for prototype simplicity, or show a quick Google SSO screen)

---

## SCREEN 6: SCHEDULE CONSULTATION (`/schedule`)

### Layout: Centered, clean

- Heading: "Schedule Your Free Tax Strategy Call"
- Subheading: "Pick a time that works. You'll meet with a tax specialist via Google Meet."

**Simulated Calendar:**
- Week view showing next 2 weeks
- Date buttons in a row, selectable
- When date selected, show time slots below as a grid of pill buttons:
  - 9:00 AM, 10:00 AM, 11:00 AM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM (EST)
  - 2-3 random slots grayed out ("Unavailable") for realism
  - Selected slot: orange bg, white text
- Selected date/time displayed in a confirmation card below
- "Confirm Booking" button (orange)
- Small: "Confirmation will be sent to {email}"

**On confirm** → routes to /welcome with consultation-specific confirmation

---

## SCREEN 7: CONFIRMATION (`/welcome`)

### For E-Commerce Buyers:
- Animated green checkmark (Framer Motion spring animation)
- Light confetti burst (CSS-only or Framer, nothing heavy)
- Heading: "Welcome to 1-800Accountant! 🎉"
- Subheading: "Your {Plan Name} plan is now active."
- **Next Steps** (vertical timeline with icons):
  1. "📅 Schedule your free onboarding appointment" — with inline CTA button → /schedule
  2. "📧 Check your email for your welcome guide and login details"
  3. "💬 Your support team is standing by — reach out anytime"
- "Questions? Call us at 1-800-ACCOUNTANT" with click-to-call link

### For Consultation Bookers:
- Same checkmark animation
- Heading: "Your Consultation is Confirmed!"
- Card showing: Date, Time, "Via Google Meet — link sent to {email}"
- What to expect:
  1. "A tax specialist will review your business profile"
  2. "You'll get a personalized savings estimate"
  3. "No obligation — just expert advice tailored to your situation"
- "Add to Calendar" button (simulated)

---

## ANIMATION GUIDELINES (Framer Motion)

**DO:**
- Page transitions: `AnimatePresence` with y-offset fade (20px)
- Staggered children: `staggerChildren: 0.1` for lists and card grids
- Button hovers: `whileHover={{ scale: 1.02 }}` (subtle)
- Card hovers: `whileHover={{ y: -4 }}` (subtle lift)
- Loading screen steps: `spring` with `stiffness: 260, damping: 20`
- Count-up numbers: animate value with `useSpring` or `useMotionValue`
- Progress bar: `layout` animation on width

**DON'T:**
- No jarring movements
- No excessive bounce
- No animations longer than 600ms (except loading screen)
- No animation on scroll for core content (it slows perceived speed)

---

## RESPONSIVE DESIGN

- Desktop-first but must work on mobile
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Navbar: hamburger on mobile
- Cards: stack vertically on mobile
- Hero: centered text on mobile, left-aligned on desktop
- Pricing cards: horizontal scroll or stack on mobile
- Checkout: single column on mobile (summary above, payment below)
- Minimum tap target: 48x48px on all interactive elements
- Mobile: add sticky bottom CTA bar on landing page ("Get Your Custom Plan →")

---

## FILE STRUCTURE

```
src/
  App.jsx
  main.jsx
  index.css
  context/
    FunnelContext.jsx
  components/
    Navbar.jsx
    Footer.jsx
    ProgressBar.jsx
    PricingCard.jsx
    TaxCalculator.jsx
    CalendarPicker.jsx
    Marquee.jsx
    TestimonialCard.jsx
    TrustBadges.jsx
  pages/
    LandingPage.jsx
    QualifierFlow.jsx
    AnalyzingScreen.jsx
    YourPlan.jsx
    Checkout.jsx
    ScheduleConsultation.jsx
    Confirmation.jsx
  utils/
    recommendations.js
    states.js
    industries.js
```

---

## BUILD ORDER

1. Set up Vite config, Tailwind, fonts. Verify Tailwind works.
2. Build FunnelContext
3. Build Navbar + Footer (shared layout)
4. Build LandingPage (hero first, then sections top to bottom)
5. Build QualifierFlow (all steps in one component)
6. Build AnalyzingScreen
7. Build YourPlan (both Path A and Path B)
8. Build Checkout
9. Build ScheduleConsultation
10. Build Confirmation
11. Wire up all routes in App.jsx with AnimatePresence
12. Test full flow end-to-end
13. Polish: animations, spacing, responsiveness
14. Verify `npm run dev` works and the full flow is navigable

---

## FINAL CHECKLIST

- [ ] Tailwind classes actually apply (no broken utility classes)
- [ ] All sections have generous padding (`py-20` minimum)
- [ ] No overlapping elements anywhere
- [ ] Marquee scrolls smoothly with spaced items (not raw mashed text)
- [ ] 3 value prop cards are equal height and properly gridded
- [ ] Tax calculator sliders don't overlap labels
- [ ] All form inputs have proper focus states
- [ ] Progress bar in qualifier shows current step
- [ ] Loading screen uses personalized state/industry names
- [ ] Pricing cards have proper recommendation logic
- [ ] Checkout looks like a real Stripe-style form
- [ ] Calendar picker has clickable dates and time slots
- [ ] Confirmation page has subtle confetti animation
- [ ] Page transitions work smoothly between all routes
- [ ] Mobile responsive — nothing breaks at 375px width
- [ ] Logo displays at proper size on all screens
- [ ] No console errors
