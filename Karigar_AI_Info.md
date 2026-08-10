# KarigarAI Repository Understanding

Analysis was based on the current source code, configuration, README files, backend documentation, existing master reference, lint/build output, and Git metadata. No files were modified.

## A. Executive Product Understanding

KarigarAI is currently a web application intended to connect Indian artisans with digital commerce and AI-assisted storytelling.

The implemented product combines:

- A public homepage describing artisan empowerment and heritage preservation.
- An artisan marketplace for browsing products stored in MongoDB.
- Clerk-based sign-in and sign-up UI.
- A user dashboard for profile management.
- Artisan registration with craft, business, media, and payment details.
- Product creation for registered artisans.
- An AI Story Generator for creating short marketing stories about handmade products.
- An AI chat assistant with Hindi/English selection and browser voice input.
- A small static knowledge base covering banking, schemes, compliance, marketing, logistics, and platform topics.

The actual implementation is closer to an early marketplace and AI-support prototype than a complete production marketplace.

Important distinction:

- The repository documentation describes support for banking information, government schemes, and business growth.
- The application itself does not implement banking, government-scheme applications, payments, orders, checkout, or delivery workflows.
- The current chatbot is not KarigarAI-product-specific enough to safely guide users through all implemented application workflows.

## B. Product Vision

### Verified product value proposition

The product is explicitly positioned as a bridge between traditional craftsmanship and modern commerce.

Evidence:

- `README.md` describes support for Indian artisans through banking information, government schemes, AI marketing tools, and business growth.
- `Homepage.jsx` describes preserving heritage and connecting buyers with Indian craftsmanship.
- `StoryGenerator.jsx` helps artisans create marketing stories.
- `Marketplace.jsx` exposes artisan products to prospective buyers.
- `RegisterArtisanPage.jsx` collects artisan and shop information.

### Strong inference

KarigarAI is intended to help artisans:

- Present themselves and their craft online.
- Publish product listings.
- Reach potential buyers through a marketplace.
- Create more compelling product or artisan stories.
- Access general business, banking, compliance, and government-scheme information.

### Not currently verified

The following longer-term goals cannot be established from implementation:

- Whether KarigarAI is intended to process real transactions.
- Whether it will provide actual banking services.
- Whether it will submit government-scheme applications.
- Whether it will manage orders, payments, fulfillment, or inventory.
- Whether it is intended to be a marketplace business or primarily an artisan-support platform.
- Whether all homepage statistics are real production metrics.

The homepage numbers such as `2000+ Artisans`, `50+ Crafts`, and `₹5L+ Earnings Generated` are hardcoded and have no corresponding data source.

## C. User Types

| User type | Status | Evidence |
|---|---|---|
| Unauthenticated visitor | `implemented` | Can view homepage, marketplace, and Story Generator UI. |
| Authenticated general user/buyer | `implemented` | Clerk sign-up/sign-in and profile bootstrap use the default `buyer` role. |
| Artisan applicant | `implemented` | `RegisterArtisanPage.jsx` submits an artisan application. |
| Registered artisan | `partially_implemented` | Artisan profile creation and product creation exist, but authorization and approval enforcement are incomplete. |
| Marketplace buyer | `partially_implemented` | Can browse products and open product details, but cart and purchasing do not work. |
| Administrator/moderator | `unknown` | Artisan status has `pending`, `approved`, and `rejected`, but no admin role, admin UI, or approval API was found. |
| Community member | `documented_but_unverified` | Dashboard displays a Community section, but the forum action has no implementation. |

There is no verified role-based access control beyond the profile role field and a Clerk authentication middleware used on one product route.

## D. Complete Feature Inventory

| Feature | Status | Evidence | Description |
|---|---|---|---|
| Homepage | `implemented` | `src/components/Homepage/Homepage.jsx` | Hero content, marketplace navigation, story navigation, authentication prompts, mission text, and hardcoded statistics. |
| Manual client-side navigation | `implemented` | `src/App.jsx` | Switch-based navigation using `currentPage` and `navigate-to` custom events. |
| Responsive navigation | `implemented` | `Navigation.jsx` | Desktop buttons and mobile drawer. |
| Clerk sign-in | `partially_implemented` | `LoginPage.jsx`, `main.jsx` | Clerk `<SignIn />` is configured, but behavior depends on Clerk configuration. |
| Clerk sign-up | `partially_implemented` | `SignUpPage.jsx`, `main.jsx`, `App.jsx` | Component exists, but `SignUpPage` is not imported into `App.jsx`; the sign-up route will fail when rendered. |
| User profile bootstrap | `implemented` | `Dashboard.jsx`, `profileController.js` | Creates a profile using email and username with an idempotent upsert. |
| Profile viewing | `implemented` | `Dashboard.jsx`, `GET /api/profile` | Loads profile by email. |
| Profile editing | `partially_implemented` | `Dashboard.jsx`, `PUT /api/profile` | Updates username, phone, address, bio, and profile image. Endpoint is not authenticated and uses email as the identity boundary. |
| Profile image upload | `partially_implemented` | `upload.js`, `profileController.js`, Cloudinary config | Uploads through memory storage to Cloudinary when configured. |
| Artisan registration | `implemented` | `RegisterArtisanPage.jsx`, `POST /api/artisan/register` | Collects personal, craft, shop, media, and payment information. |
| Artisan status workflow | `partially_implemented` | `Artisan.js`, `artisanController.js` | Stores `pending`, `approved`, or `rejected`, but no approval process was found. |
| Artisan profile retrieval | `implemented` | `GET /api/artisan/:id`, `GET /api/artisans/:id` | Retrieves artisan records. Two route namespaces expose similar functionality. |
| Artisan product retrieval | `implemented` | `GET /api/artisan/:id/products`, `GET /api/artisans/:id/products` | Retrieves products associated with an artisan. |
| Product creation | `partially_implemented` | `Dashboard.jsx`, `productController.js` | Product form and multipart uploads exist. The UI uses the unauthenticated test endpoint. |
| Product image upload | `partially_implemented` | Multer and Cloudinary integration | Supports up to six files and 8 MB per file. |
| Product marketplace listing | `implemented` | `Marketplace.jsx`, `GET /api/products` | Loads products from the backend and renders product cards. |
| Product search | `partially_implemented` | `Marketplace.jsx`, `productController.js` | Backend supports text search, but frontend loads all products and filters locally. |
| Product category filtering | `partially_implemented` | `Marketplace.jsx` | Client-side filtering exists with hardcoded categories. |
| Product details | `implemented` | `ProductModal.jsx`, `GET /api/products/:id` | UI displays product information and supports image navigation. The marketplace currently passes the already-loaded product rather than fetching by ID. |
| Product view tracking | `implemented` | `productController.js` | `GET /api/products/:id` increments `views`. |
| Add to Cart | `planned` / `non-functional UI` | `Marketplace.jsx`, `ProductModal.jsx` | Buttons are visible but have no cart state, API, persistence, or checkout behavior. |
| Favorites | `planned` / `non-functional UI` | `Marketplace.jsx` | Favorite icon has no behavior. |
| Orders | `planned` | No order model, route, controller, or API found | Dashboard table contains hardcoded order-like values, but no order workflow exists. |
| Payments | `planned` / `data-only` | `Artisan.js`, `RegisterArtisanPage.jsx` | Artisan payment details are collected, but no payment processing or payment-status workflow exists. |
| Inventory | `partially_implemented` | Product `stock` field and product form | Stock is stored, but there is no stock adjustment, reservation, decrement, or inventory management workflow. |
| Dashboard overview | `partially_implemented` | `Dashboard.jsx` | Product count, views, and calculated revenue are shown, but sales and revenue are not backed by sales data. |
| Dashboard product performance table | `partially_implemented` | `ArtisanDetailsTable.jsx` | Component displays hardcoded sample rows and ignores the `products` prop passed by the dashboard. |
| Sales tips | `implemented` as static content | `Dashboard.jsx` | Static advice about photos, WhatsApp, communication, and pricing. |
| Community | `planned` | `Dashboard.jsx` | Static text and a non-functional “Join Community Forum” button. |
| AI chat assistant | `partially_implemented` | `ChatModal.jsx`, `aiService.js` | Keyword-based answers plus Hugging Face fallback. |
| Local chatbot knowledge base | `implemented` but unsafe for product support | `knowledgeBase.js` | Static keyword matching for banking, schemes, marketing, compliance, and logistics. |
| Hindi chatbot response mode | `partially_implemented` | `aiService.js`, `ChatModal.jsx` | Hindi prompt mode exists, but keyword responses are fixed English and UI translation is incomplete. |
| Hinglish understanding | `partially_implemented` | Keyword matching and LLM fallback | No explicit Hinglish normalization or intent model exists. |
| Voice input | `implemented` with browser dependency | `ChatModal.jsx` | Uses Web Speech API with `hi-IN` and `en-US`. |
| AI Story Generator | `implemented` but externally dependent | `StoryGenerator.jsx`, `aiService.js` | Generates marketing stories using artisan-entered details. |
| Story language selection | `implemented` | `StoryGenerator.jsx`, `aiService.js` | English and Hindi output modes. |
| Copy generated story | `implemented` | `StoryGenerator.jsx` | Uses browser clipboard API. |
| Banking information | `implemented` as static chatbot content | `knowledgeBase.js` | Provides KYC, account, interest, and loan answers. These are informational responses, not banking functionality. |
| Government-scheme information | `implemented` as static chatbot content | `knowledgeBase.js` | Includes PM Vishwakarma information. Accuracy and freshness are not verified in code. |
| Export and GST guidance | `implemented` as static chatbot content | `knowledgeBase.js` | Static responses about IEC, EPCH, GST, and packaging. |
| Backend health check | `implemented` | `GET /api/health` | Returns backend status. |
| API validation | `implemented` | `validate.js`, Zod schemas | Validates body, query, and params. |
| API error handling | `implemented` | `errorHandler.js` | Provides JSON errors; development responses include stack traces. |
| Security headers and CORS | `implemented` | `server.js` | Uses Helmet and configured CORS. |
| Deployment | `unknown` | No hosting or CI/CD configuration found | Local development setup is documented; deployment is not. |

## E. Technical Stack

### Frontend

| Area | Verified implementation |
|---|---|
| Framework | React `19.1.1` |
| Language | JavaScript with JSX |
| Build system | Vite `7.1.6` |
| UI framework | Material UI `7.3.2` |
| Styling | MUI `sx` styling, `src/index.css`, theme configuration |
| Routing | No React Router; manual switch navigation in `App.jsx` |
| State management | Local React state with `useState`, `useEffect`, and `useMemo`; no global state library |
| Authentication SDK | `@clerk/clerk-react` |
| HTTP clients | Native `fetch` for application APIs and Axios for AI |
| Charts | Recharts and MUI X Charts dependencies; current dashboard imports Recharts but does not render charts |
| Data grid | MUI X Data Grid |
| Date handling | `date-fns` and MUI Date Pickers |
| Voice | Browser Web Speech API |
| Testing | No test files found |

### Backend

| Area | Verified implementation |
|---|---|
| Runtime | Node.js with ES modules |
| Framework | Express `5.1.0` |
| API style | REST-style JSON and multipart HTTP endpoints |
| Validation | Zod `4.1.5` |
| Authentication verification | Clerk JWT verification through `jose` |
| Upload processing | Multer memory storage |
| Error handling | Central `notFound` and `errorHandler` middleware |
| Security middleware | Helmet |
| CORS | `cors` with configurable frontend origin |
| Logging | Morgan |
| Development server | Nodemon |
| Business logic | Controllers under `backend/controllers` |

### Database

| Area | Verified implementation |
|---|---|
| Database | MongoDB, expected to be MongoDB Atlas based on documentation and environment naming |
| ORM/ODM | Mongoose `8.18.0` |
| Models | `Profile`, `Artisan`, `Product` |
| Persistence | Backend startup requires `MONGODB_URI` and connects before listening |
| Indexing | Unique email indexes, category/artisan/date indexes, product text index |

### AI

| Area | Verified implementation |
|---|---|
| Provider | Hugging Face Inference Router |
| Model | `meta-llama/Llama-3.2-3B-Instruct` |
| SDK | No dedicated Hugging Face SDK; Axios HTTP requests |
| AI use cases | Chat assistant and story generation |
| Prompt architecture | Inline system and user prompt strings in `src/services/aiService.js` |
| Local knowledge | Keyword-based static array in `knowledgeBase.js` |
| Embeddings/RAG | None found |
| Gemini | No Gemini SDK, API endpoint, model, or configuration found |
| Conversation history | `aiService.chatWithAI` accepts history, but `ChatModal` always passes an empty array |
| Token management | No token counting or context trimming |
| Rate limits | No application-level rate limit found |
| Safety settings | No explicit safety settings found |
| Secret handling | `VITE_HF_TOKEN` is a frontend environment variable and therefore exposed in the client bundle |

### Infrastructure and external services

| Service | Status |
|---|---|
| Clerk | Integrated for frontend authentication and backend JWT verification |
| MongoDB Atlas | Configured by environment variable; actual runtime availability unknown |
| Cloudinary | Integrated for profile, artisan, sample-product, and product images |
| Hugging Face | Integrated through Vite development proxy |
| Gemini | Not integrated |
| Payments | Not integrated |
| Email | Not integrated |
| SMS/messaging | Not integrated |
| Analytics | Not integrated |
| Monitoring | Not found |
| CI/CD | Not found |
| Docker/deployment manifests | Not found |
| Production hosting | Unknown |

## F. Current Architecture

### Existing runtime model

```text
Browser
  |
  v
React/Vite frontend
  |
  +--> Clerk frontend SDK for identity UI
  |
  +--> /api/* through Vite proxy
  |       |
  |       v
  |   Express backend :5001
  |       |
  |       +--> Zod validation
  |       +--> Optional Clerk JWT middleware
  |       +--> Controllers
  |       +--> Mongoose
  |       |       |
  |       |       v
  |       |   MongoDB
  |       |
  |       +--> Multer memory uploads
  |               |
  |               v
  |           Cloudinary
  |
  +--> /api/hf/* through Vite proxy
          |
          v
      Hugging Face Router
```

### Frontend architecture

`App.jsx` acts as:

- The top-level layout.
- A manual router.
- The owner of selected product state.
- The owner of chat modal visibility.
- The source of global navigation events.

Feature components manage their own local state:

- Dashboard manages profile, product form, and artisan products.
- Marketplace manages loading, search, and filtering.
- ChatModal manages messages, language, voice state, and loading.
- StoryGenerator manages form values and generated text.

There is no shared API client, authentication-token helper, global data cache, or formal route guard.

### Backend architecture

```text
Express server
  |
  +--> /api/products
  +--> /api/artisan
  +--> /api/artisans
  +--> /api/profile
  +--> /api/health
  |
  +--> route middleware
  |     +--> Clerk auth on one product route
  |     +--> Multer uploads
  |     +--> Zod validation
  |
  +--> controllers
  |
  +--> Mongoose models
  |
  +--> MongoDB / Cloudinary
```

### Authentication flow

The intended authentication flow is:

1. Clerk renders sign-in/sign-up UI.
2. Clerk provides the authenticated frontend user.
3. Backend-protected routes expect a Bearer session token.
4. `requireClerkAuth` verifies that token using Clerk’s JWKS endpoint.

The implemented application does not consistently complete this flow:

- Profile APIs are queried by email and are not protected.
- Artisan registration is not protected.
- Public product reads are intentionally unauthenticated.
- Product creation in the UI uses `/api/products/test`, which explicitly bypasses auth.
- The frontend does not call Clerk’s `getToken()` when making backend requests.

### Upload flow

```text
Browser file input
  ↓
FormData
  ↓
Multer memory storage
  ↓
Cloudinary upload stream
  ↓
Secure Cloudinary URL
  ↓
MongoDB document
```

The configured limit is 8 MB per file and six files through Multer. The artisan registration route separately limits sample products to five fields.

### Error handling

Backend errors use a central JSON error format:

```json
{
  "error": {
    "message": "..."
  }
}
```

In non-production mode, stack traces are also returned.

Frontend errors are handled inconsistently:

- Dashboard uses Snackbar and Alert.
- Marketplace displays error text.
- Chat returns error strings as assistant messages.
- Voice errors are logged to the console.
- Some failures rely on generic messages.

## G. Database

### Profile

Purpose: Stores the application profile associated with an email.

Important fields:

- `username`
- `email`
- `phone`
- `address`
- `bio`
- `profileImage`
- `role`
- `artisanId`
- timestamps

Relationships:

```text
Profile.artisanId -> Artisan._id
```

Created by:

- `POST /api/profile/bootstrap`

Used by:

- Dashboard profile view and editing.
- Artisan registration linkage.
- Role determination in the dashboard.

### Artisan

Purpose: Stores artisan identity, craft, business, media, payment, and approval information.

Important fields:

- `userId` reference to `Profile`
- `email`
- `name`
- `phone`
- `location`
- `craftType`
- `experienceYears`
- `story`
- `shopName`
- `shopDescription`
- `productCategories`
- `monthlyProduction`
- `artisanPhoto`
- `workshopPhoto`
- `sampleProducts`
- `paymentDetails`
- `status`

Relationships:

```text
Artisan.userId -> Profile._id
Artisan._id <- Product.artisanId
```

Created or updated by:

- `POST /api/artisan/register`

Used by:

- Artisan registration.
- Artisan profile retrieval.
- Artisan product retrieval.
- Product association.

Sensitive data:

- UPI ID.
- Bank account number.
- IFSC code.

These fields are stored but currently have no documented privacy, authorization, masking, or encryption policy beyond database storage.

### Product

Purpose: Represents a product listing shown in the marketplace.

Important fields:

- `title`
- `description`
- `price`
- `category`
- `artisanId`
- `artisanName`
- `location`
- `images`
- `stock`
- `views`
- timestamps

Relationships:

```text
Product.artisanId -> Artisan._id
```

Created by:

- `POST /api/products`
- `POST /api/products/test`

Used by:

- Marketplace listing.
- Product filtering.
- Product details.
- Artisan product list.
- Dashboard product counts and view calculations.

The model has a text index across:

- `title`
- `description`
- `artisanName`
- `location`

### Data model concerns

- Product ownership is not verified against the authenticated Clerk user.
- Profile access is based on a client-supplied email.
- Artisan registration can be submitted for an arbitrary email because the route is not authenticated.
- Payment details are collected without a corresponding payment workflow.
- There are no models for orders, carts, transactions, customers, messages, notifications, or community posts.

## H. AI Functionality

### Current assistant behavior

The assistant follows this flow:

```text
User message
  ↓
findAnswer()
  |
  +--> Keyword match found: return static answer
  |
  +--> No match: send message to Hugging Face Llama
```

The static knowledge base contains entries for:

- KYC.
- Bank accounts.
- Interest rates.
- Loans.
- Selling products.
- Story Generator.
- PM Vishwakarma.
- Marketing.
- Export.
- Exhibitions.
- GST.
- Packaging.

### Current Story Generator behavior

The form accepts:

- Artisan name.
- Craft type.
- Location.
- Materials.
- Techniques.
- Inspiration.
- Experience.
- Product type.

The service sends those values to Hugging Face with a prompt asking for a short emotional marketing story under 150 words.

The service’s destructuring currently uses only:

- `artisanName`
- `craftType`
- `location`
- `materials`
- `inspiration`

The `techniques`, `experience`, and `productType` values are collected by the UI but are not interpolated into the generated story prompt. This is a frontend-to-AI data-flow gap.

### Hindi support

Hindi mode:

- Changes the LLM system instruction to Devanagari Hindi.
- Changes voice recognition to `hi-IN`.
- Changes some button and placeholder text.

Limitations:

- Static keyword answers remain in English.
- Most application UI remains English.
- There is no language preference persistence.
- There is no robust Hindi/Hinglish intent normalization.
- There is no verified support for other Indian languages.

### AI risks

The current assistant should not yet be treated as a reliable KarigarAI support assistant because:

- Its system prompt says it assists with broad banking, product sales, and storytelling topics.
- It has no knowledge of actual screen names, API states, validation rules, or application workflows.
- The LLM fallback can answer questions outside verified product functionality.
- Static answers contain potentially time-sensitive financial and government information.
- The Hugging Face token is exposed through `VITE_HF_TOKEN`.
- The chat UI does not send conversation history despite the service supporting it.
- There is no citation, source, confidence, or escalation mechanism.
- There is no Gemini integration currently.

## I. Current Development Stage

### Overall maturity

**Development prototype / early MVP**

The product has a functioning frontend build and a partially functioning backend, but it is not production-ready.

### Frontend

**Status: partially implemented**

Present:

- React/Vite application.
- Responsive MUI UI.
- Main navigation.
- Marketplace page.
- Authentication UI.
- Dashboard.
- Artisan registration.
- AI chat.
- Story generation.

Blockers:

- `SignUpPage` is referenced but not imported in `App.jsx`.
- `signOut` is called but not defined in `Dashboard.jsx`.
- Product modal violates React Hook rules and fails lint.
- Product and dashboard data are partly hardcoded.
- Add to Cart does nothing.
- Community action does nothing.
- Favorite action does nothing.
- Some screen behavior depends on Clerk being configured.
- No automated frontend tests exist.

### Backend

**Status: partially implemented**

Present:

- Express server.
- MongoDB connection.
- Mongoose models.
- Zod validation.
- Cloudinary upload integration.
- Clerk JWT verification middleware.
- Product, artisan, profile, and health routes.

Blockers:

- Authentication is only applied to one product creation route.
- The frontend does not use that protected route correctly.
- An unauthenticated product creation endpoint is active.
- Profile and artisan APIs use email supplied by the client.
- Duplicate artisan route namespaces exist.
- Backend README describes routes that do not match the current implementation, including a POST artisan route that was not found.
- No backend test suite exists.

### Database

**Status: implemented for current prototype scope**

Implemented entities:

- Profile.
- Artisan.
- Product.

Missing for a full marketplace:

- Cart.
- Order.
- Payment/transaction.
- Customer address.
- Shipment/fulfillment.
- Product update/delete.
- Reviews.
- Favorites.
- Notifications.
- Community content.

### AI

**Status: partially implemented**

Implemented:

- Hugging Face Llama chat completion calls.
- Keyword knowledge base.
- Hindi prompt option.
- Browser voice input.
- AI story generation.

Missing:

- Gemini API.
- Product-specific support knowledge base.
- Retrieval architecture.
- Grounding/citations.
- Conversation persistence.
- Intent classification.
- Safe fallback behavior.
- Prompt versioning.
- Rate limiting.
- Server-side secret protection.

### Deployment

**Status: unknown**

Verified:

- Local Vite development setup.
- Local Express backend setup.
- Environment examples.

Not found:

- Hosting configuration.
- CI/CD.
- Docker.
- Production reverse proxy.
- Monitoring.
- Logging aggregation.
- Health-check deployment configuration.
- Production database migration/index procedure.

### Known bugs and technical risks

High priority:

- Unauthenticated product creation endpoint is used by the frontend.
- Profile and artisan operations are not bound to authenticated identity.
- Hugging Face API token is exposed in the frontend bundle.
- `SignUpPage` is missing from `App.jsx` imports.
- `signOut` is undefined in `Dashboard.jsx`.

Medium priority:

- Product modal conditionally calls hooks.
- Dashboard “sales” uses product views as sales.
- Dashboard “revenue” multiplies price by views.
- Performance table displays hardcoded sample records.
- Quick artisan registration calls a nonexistent route.
- Backend pagination/search is not used by the marketplace.
- Product detail API view increment is not used by the marketplace modal.
- Artisan route duplication creates maintenance ambiguity.
- Financial and government guidance has no source/date/version metadata.

Verification result:

- `npm run build`: passes, with a large JavaScript bundle warning.
- `npm run lint`: fails with 28 errors and 5 warnings.
- Automated tests: none found.

## J. Documentation Gaps

The repository does not currently define enough information for a reliable support chatbot.

Missing or unclear product information:

- The authoritative product scope.
- Whether KarigarAI is a marketplace, support platform, or both.
- Whether real purchases will be supported.
- Buyer purchase journey.
- Artisan approval/rejection process.
- Meaning of `pending`, `approved`, and `rejected`.
- Who can approve artisans.
- What happens after artisan registration.
- Product editing and deletion behavior.
- Whether stock represents available inventory or is currently informational only.
- Whether product views are intended to represent sales.
- Whether dashboard statistics are real or placeholders.
- Actual business rules for prices, categories, products, and uploads.
- Maximum image dimensions and supported formats as presented to users.
- Account recovery and authentication support procedure.
- Support escalation channel.
- Data retention and deletion policy.
- Handling of bank-account and UPI information.
- Whether banking and government information is advisory only.
- Sources and last-updated dates for financial and government answers.
- Supported languages beyond English and Hindi.
- Expected Hinglish behavior.
- AI acceptable-use and safety rules.
- Gemini migration plan.
- Production deployment target.
- Production monitoring and incident process.

### Documentation/implementation mismatches

1. `README.md` and `KARIGARAI_MASTER_REFERENCE.md` accurately identify Hugging Face Llama, while the requested future plan refers to Gemini. Gemini is not currently implemented.
2. The master reference describes a secured product path but also correctly notes that the UI uses `/api/products/test`.
3. The backend README describes `POST /products` and says `POST /artisans` creates an artisan, but the actual artisan creation endpoint is `POST /api/artisan/register`.
4. The dashboard contains orders and earnings-looking data, but the backend has no order or sales model.
5. The static chatbot says “Global Marketplace,” while the actual UI is named “Artisan Marketplace.”
6. The knowledge base provides financial figures and scheme details but does not establish their source or validity period.

## K. Chatbot Knowledge Architecture

### Recommended first version

The current knowledge base is small enough that a structured JSON knowledge base is preferable to introducing RAG immediately.

Recommended structure:

```text
knowledge/
├── product.json
├── features/
│   ├── marketplace.json
│   ├── profile.json
│   ├── artisan-registration.json
│   ├── product-listing.json
│   ├── dashboard.json
│   ├── ai-chat.json
│   └── story-generator.json
├── workflows/
│   ├── sign-up-to-dashboard.json
│   ├── artisan-registration.json
│   ├── create-product.json
│   └── generate-story.json
├── support/
│   ├── faq.json
│   ├── troubleshooting.json
│   └── escalation.json
├── glossary.json
└── metadata.json
```

### Feature record format

```json
{
  "id": "product-listing",
  "name": "Add Product",
  "status": "partially_implemented",
  "user_goal": "Publish a handmade product in the marketplace",
  "entry_points": [
    {
      "screen": "Dashboard",
      "section": "Add Product"
    }
  ],
  "steps": [
    {
      "step": 1,
      "instruction": "Open Dashboard and select Add Product"
    },
    {
      "step": 2,
      "instruction": "Enter the product name, category, price, and stock"
    }
  ],
  "inputs": [
    {
      "field": "title",
      "label": "Product Name",
      "required": true,
      "meaning": "The name shown to buyers"
    }
  ],
  "outputs": [
    "A product record is created",
    "Uploaded images are stored as Cloudinary URLs"
  ],
  "known_limitations": [
    "The current frontend uses an unauthenticated test endpoint"
  ],
  "troubleshooting": [],
  "related_features": [
    "artisan-registration",
    "marketplace"
  ],
  "evidence": [
    "src/components/Dashboard/Dashboard.jsx",
    "backend/controllers/productController.js"
  ],
  "last_verified": "2026-08-09"
}
```

### Status vocabulary

Use the requested statuses consistently:

- `implemented`
- `partially_implemented`
- `planned`
- `documented_but_unverified`
- `deprecated`
- `unknown`

For support answers, the chatbot should only give step-by-step instructions for features marked `implemented` or clearly documented portions of `partially_implemented` features.

### Chatbot response policy

The assistant should receive system instructions equivalent to:

```text
You are the KarigarAI Support Assistant.

Help users understand and use the actual KarigarAI application.

Use only the supplied KarigarAI knowledge context.
Do not invent screens, buttons, workflows, APIs, payments, orders, or features.
If a feature is planned, say that it is planned and not currently available.
If a feature is partially implemented, explain the verified behavior and mention the limitation when relevant.
If the available context is insufficient, say:
"I don't have enough information to safely guide you through this."
Ask for the exact screen, button, or error message when clarification is needed.
Use simple English, Hindi, or Hinglish based on the user's message.
Prefer short numbered steps.
Do not expose secrets, database credentials, tokens, or internal security details.
```

### Intent structure

Each intent should map to a verified feature:

```json
{
  "intent": "create_product",
  "aliases": [
    "product add kaise karu",
    "naya product banana hai",
    "product upload karna hai"
  ],
  "feature_id": "product-listing",
  "required_context": [
    "current_screen",
    "user_role",
    "error_message"
  ],
  "answer_strategy": "step_by_step",
  "escalate_if": [
    "data_loss_suspected",
    "authentication_failure",
    "documented_steps_fail"
  ]
}
```

### Error record structure

```json
{
  "problem": "Product creation fails",
  "status": "partially_implemented",
  "possible_causes": [
    "Required field validation failed",
    "The user is not registered as an artisan",
    "Cloudinary is not configured",
    "The backend is unavailable"
  ],
  "checks": [
    "Confirm product name, category, price, and stock are filled",
    "Confirm the user has an artisan profile",
    "Check the displayed error message"
  ],
  "recommended_action": [
    "Correct the highlighted fields",
    "Try submitting again",
    "Escalate if the same documented error persists"
  ],
  "expected_result": "A new product appears in My Products",
  "evidence": [
    "src/components/Dashboard/Dashboard.jsx",
    "backend/controllers/productController.js"
  ]
}
```

The actual possible causes should be verified against runtime behavior before being presented to users.

### Future RAG architecture

RAG is not necessary for the current small knowledge base. It becomes appropriate when the documentation includes:

- Many features.
- Multiple language variants.
- Detailed troubleshooting.
- Versioned application behavior.
- Government and financial source documents.
- Long user manuals.
- Support tickets and resolved incidents.

Future architecture:

```text
Verified source documents
  ↓
Chunking and metadata tagging
  ↓
Embeddings
  ↓
Vector store
  ↓
Retrieve by feature, intent, language, and application version
  ↓
Gemini API
  ↓
Grounded answer with source metadata
```

Recommended metadata:

- `feature_id`
- `status`
- `screen`
- `user_role`
- `language`
- `application_version`
- `source_file`
- `last_verified`
- `sensitivity`
- `confidence`

### Gemini migration note

Gemini should not be documented as a current integration. If it becomes the target provider:

- The API call should move behind the backend.
- The Gemini API key must remain server-side.
- The context should be supplied from the structured knowledge base.
- The assistant should be grounded using only retrieved or explicitly supplied content.
- Provider-specific model and request details should be added only after implementation.

## L. Questions That Need Product Decisions

These cannot be reliably answered from the repository alone:

1. Is the primary goal a working artisan marketplace, an artisan-support portal, or both?
2. Will buyers eventually place real orders and make payments?
3. Should orders, cart, favorites, and delivery be implemented, or removed from the UI?
4. Who reviews and approves artisan applications?
5. What does the artisan `pending` status mean operationally?
6. Are the homepage statistics real, and if so, what is their source?
7. Should the AI chatbot provide only KarigarAI product support, or also retain banking, government, GST, export, and marketing guidance?
8. Are the financial and government-scheme answers authoritative, and what sources should be used?
9. Is Gemini replacing Hugging Face, or is Hugging Face expected to remain the current provider?
10. Which languages must be supported initially?
11. What support channel should the chatbot use when escalation is required?
12. Is collection of bank account number, UPI ID, and IFSC code necessary at artisan registration?
13. What is the intended production hosting environment?
14. Should artisans be allowed to publish products before approval?
15. What should “sales,” “earnings,” and “revenue” mean in the dashboard?

## Overall Conclusion

KarigarAI has a meaningful early product foundation: artisan identity, artisan registration, product publishing, marketplace discovery, AI storytelling, and a basic assistant are all represented in code.

Its current verified state is:

```text
Product maturity: Development prototype / early MVP

Frontend: Functional prototype with several runtime and UX gaps
Backend: Partially implemented REST API
Database: Profile, Artisan, and Product models implemented
Authentication: Clerk UI integrated, backend enforcement incomplete
AI: Hugging Face Llama integration implemented; Gemini absent
Knowledge base: Small keyword-based informational dataset
Marketplace: Browsing and product publishing partially functional
Orders/payments: Not implemented
Testing: No automated tests
Deployment: Unknown
Production readiness: Not ready
```

The most important next step before building the Gemini support chatbot is to create a verified product knowledge base from the current screens and workflows, while explicitly excluding or labeling planned functionality. The chatbot should not currently claim to support orders, payments, checkout, community forums, real sales tracking, or other features that exist only as UI placeholders or documentation assumptions.