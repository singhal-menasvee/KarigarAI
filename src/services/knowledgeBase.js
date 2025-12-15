export const knowledgeBase = [
    {
        keywords: ["kyc", "verify", "documents", "id"],
        answer: "KYC means Know Your Customer. You need to submit your ID proof (Aadhaar/PAN) and address proof to verify your identity.",
        category: "banking"
    },
    {
        keywords: ["account", "open", "bank"],
        answer: "To open an artisan account, visit the nearest branch with your KYC documents and artisan card. You can also apply online via the portal.",
        category: "banking"
    },
    {
        keywords: ["interest", "rate", "savings"],
        answer: "Our special artisan savings accounts offer an interest rate of 4.5% per annum.",
        category: "banking"
    },
    {
        keywords: ["loan", "credit", "money"],
        answer: "We offer 'Mudra Loans' for artisans with low interest rates starting at 7%. No collateral is required for loans up to ₹50,000.",
        category: "banking"
    },
    {
        keywords: ["sell", "product", "marketplace"],
        answer: "You can list your products on the Global Marketplace tab. Take clear photos and add a good description to attract buyers.",
        category: "platform"
    },
    {
        keywords: ["story", "generate", "ai"],
        answer: "Use the 'Story Generator' tool to create compelling descriptions for your crafts automatically.",
        category: "platform"
    },
    {
        keywords: ["vishwakarma", "scheme", "modi", "government", "benefit"],
        answer: "The 'PM Vishwakarma' scheme offers training, toolkit incentives of ₹15,000, and collateral-free enterprise development loans up to ₹3 lakh (5% interest) for artisans.",
        category: "schemes"
    },
    {
        keywords: ["marketing", "online", "instagram", "facebook"],
        answer: "To sell online: 1. Take bright photos (daylight). 2. Use hashtags like #HandmadeIndia #VocalForLocal. 3. Engage with customers in comments. 4. Post reels showing your making process.",
        category: "growth"
    },
    {
        keywords: ["export", "international", "foreign"],
        answer: "To export: 1. You need an 'Import Export Code' (IEC). 2. Register with the Export Promotion Council for Handicrafts (EPCH). 3. Ensure high quality and eco-friendly packaging.",
        category: "growth"
    },
    {
        keywords: ["fair", "exhibition", "stall", "mela"],
        answer: "You can apply for stalls at managing events like 'Dilli Haat', 'Surajkund Mela', or 'Saras Mela' through the Ministry of Textiles portal or your local DC Handicrafts office.",
        category: "growth"
    },
    {
        keywords: ["gst", "tax", "bill"],
        answer: "GST is mandatory for selling online or outside your state. For handicrafts, rates vary (mostly 5% or 12%). You can register on the GST portal for free.",
        category: "compliance"
    },
    {
        keywords: ["packaging", "packing", "deliver"],
        answer: "Good packaging reduces breakage and increases value. Use bubble wrap (or eco-friendly paper), sturdy cardboard boxes, and a 'Thank You' note to delight customers.",
        category: "logistics"
    }
];

export const findAnswer = (query) => {
    const lowerQuery = query.toLowerCase();

    // Direct match
    const match = knowledgeBase.find(item =>
        item.keywords.some(keyword => lowerQuery.includes(keyword))
    );

    if (match) return match.answer;

    return null;
};
