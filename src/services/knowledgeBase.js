export const knowledgeBase = [
    {
        keywords: ["kyc", "verify", "documents", "id"],
        answer: "KYC stands for Know Your Customer. To verify your identity, you simply need to submit your ID proof, such as your Aadhaar or PAN card, along with your address proof.",
        category: "banking"
    },
    {
        keywords: ["account", "open", "bank"],
        answer: "Opening an artisan account is straightforward. You can visit your nearest branch with your KYC documents and artisan card, or if you prefer, you can apply online through our portal.",
        category: "banking"
    },
    {
        keywords: ["interest", "rate", "savings"],
        answer: "We offer special artisan savings accounts that provide an attractive interest rate of 4.5% per annum.",
        category: "banking"
    },
    {
        keywords: ["loan", "credit", "money"],
        answer: "For financial support, we offer Mudra Loans specifically for artisans, with interest rates starting as low as 7%. You don't need to provide collateral for loans up to ₹50,000.",
        category: "banking"
    },
    {
        keywords: ["sell", "product", "marketplace"],
        answer: "You can easily showcase your work on our Global Marketplace. Just take clear photos of your products and add a nice description to attract potential buyers.",
        category: "platform"
    },
    {
        keywords: ["story", "generate", "ai"],
        answer: "Our Story Generator tool is here to help you automatically create compelling and beautiful descriptions for your crafts.",
        category: "platform"
    },
    {
        keywords: ["vishwakarma", "scheme", "modi", "government", "benefit"],
        answer: "The PM Vishwakarma scheme is a great initiative offering training, a toolkit incentive of ₹15,000, and collateral-free loans up to ₹3 lakh at just 5% interest for artisans.",
        category: "schemes"
    },
    {
        keywords: ["marketing", "online", "instagram", "facebook"],
        answer: "To successfully sell online, try taking bright photos in natural daylight. Use hashtags like #HandmadeIndia and #VocalForLocal, engage with your customers in the comments, and share reels that show your creative process.",
        category: "growth"
    },
    {
        keywords: ["export", "international", "foreign"],
        answer: "If you're looking to export, you'll need an Import Export Code (IEC). It's also important to register with the Export Promotion Council for Handicrafts (EPCH) and ensure your packaging is high-quality and eco-friendly.",
        category: "growth"
    },
    {
        keywords: ["fair", "exhibition", "stall", "mela"],
        answer: "Participating in events like Dilli Haat, Surajkund Mela, or Saras Mela is a great opportunity. You can apply for stalls through the Ministry of Textiles portal or your local DC Handicrafts office.",
        category: "growth"
    },
    {
        keywords: ["gst", "tax", "bill"],
        answer: "GST is mandatory for online sales or interstate trade. For handicrafts, the rates are usually 5% or 12%. Registration on the GST portal is completely free.",
        category: "compliance"
    },
    {
        keywords: ["packaging", "packing", "deliver"],
        answer: "Good packaging not only protects your items but also adds value. We recommend using bubble wrap or eco-friendly paper options, sturdy boxes, and including a thank you note to make your customers feel special.",
        category: "logistics"
    }
];

export const findAnswer = (query) => {
    const lowerQuery = query.toLowerCase();

    const match = knowledgeBase.find(item =>
        item.keywords.some(keyword => lowerQuery.includes(keyword))
    );

    if (match) return match.answer;

    return null;
};
