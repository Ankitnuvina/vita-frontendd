// types/blog.ts  ← yeh file banao
export interface Blog {
    id: number
    authorName: string
    specialist: string
    imageUrl: string
    title: string
    desc: string
    cat: string
    read: string
    date: string
    featured: boolean
    color: string
    textColor: string
    content: BlogSection[]   // ← yeh add karo
}

export interface BlogSection {
    type: 'intro' | 'heading' | 'para' | 'keybox' | 'table' | 'tip' | 'list'  // ← union type
    text?: string
    items?: string[]
    rows?: { label: string; value: string; note?: string }[]
}

export const BLOGS: Blog[] = [
    {
        id: 1,
        authorName: "Dr. Ananya Sharma",
        specialist: "Clinical Nutritionist",
        imageUrl: "https://s7d1.scene7.com/is/image/KeminIndustries/shutterstock_2330992171%3ASmall?$heroBannerCrop$",
        title: "How to start taking supplements — a complete beginner's guide for Indians",
        desc: "Most Indians are deficient in Vitamin D, B12, and Iron. Here's exactly what to test and buy.",
        cat: "Supplements",
        read: "12 min",
        date: "Apr 2026",
        featured: true,
        color: "#3D8F5A",
        textColor: "#5DCAA5",
        content: [
            {
                type: 'keybox',
                items: [
                    'Most Indians are deficient in Vitamin D, B12, and Iron — check these first.',
                    'Get a blood test before buying anything — costs ₹800–2,500 and saves thousands.',
                    'A beginner stack of D3 + B12 + Omega-3 costs ₹800–1,500/month.',
                    'Always look for FSSAI registration on the label.',
                    'Supplements support your health but do not replace food, sleep, or exercise.',
                ],
            },
            {
                type: 'intro',
                text: 'The Indian supplement market is growing fast — but so is the confusion. Brands promise everything from glowing skin to better memory. This guide cuts through all of that.',
            },
            { type: 'heading', text: 'Why do Indians need supplements at all?' },
            {
                type: 'para',
                text: 'India has one of the most diverse food cultures in the world. So why do so many Indians have nutritional deficiencies? The answer comes down to three things: what we eat, how our bodies absorb it, and the environment we live in.',
            },
            {
                type: 'list',
                items: [
                    'Vitamin D — Despite being a tropical country, 70–80% of urban Indians are deficient. We spend most time indoors and have higher melanin levels that reduce Vitamin D synthesis.',
                    'Vitamin B12 — India has one of the highest vegetarian populations in the world. B12 is found almost exclusively in animal products, so vegetarians are almost always deficient.',
                    'Iron — NFHS data shows 53% of Indian women aged 15–49 are anaemic. Plant-based iron absorbs at a fraction of the rate of meat-based iron.',
                    'Protein — A study across 16 Indian cities found 73% of Indians do not meet their daily protein requirement.',
                ],
            },
            { type: 'heading', text: 'Step 1 — Get tested before you buy anything' },
            {
                type: 'para',
                text: 'A basic blood test in India costs ₹800–2,500. That one-time investment tells you exactly what your body needs. Without it, you are guessing — and could easily spend ₹3,000/month on supplements you do not need.',
            },
            {
                type: 'table',
                rows: [
                    { label: 'Vitamin D (25-OH)', value: '₹400–800', note: 'Must-do' },
                    { label: 'Vitamin B12', value: '₹300–600', note: 'Must-do' },
                    { label: 'CBC (Complete Blood Count)', value: '₹300–500', note: 'Must-do' },
                    { label: 'Ferritin', value: '₹400–700', note: 'High priority' },
                    { label: 'TSH (Thyroid)', value: '₹300–500', note: 'Recommended' },
                ],
            },
            {
                type: 'tip',
                text: 'Labs like Thyrocare, Redcliffe, or Dr Lal PathLabs offer panel packages for ₹1,500–2,500 with home collection. Results arrive within 24 hours.',
            },
            { type: 'heading', text: 'Step 2 — Your beginner stack' },
            {
                type: 'list',
                items: [
                    'Vitamin D3 + K2 — 1,000–2,000 IU daily. Always with K2 so calcium goes to bones, not arteries. Take with a fatty meal.',
                    'Vitamin B12 (Methylcobalamin) — 500–1,000 mcg daily. Sublingual tablets absorb best. Take on an empty stomach.',
                    'Omega-3 (EPA + DHA) — 1,000–2,000 mg daily. Fish oil is most bioavailable; algae oil for vegetarians.',
                ],
            },
            { type: 'heading', text: 'Common mistakes to avoid' },
            {
                type: 'list',
                items: [
                    'Buying before testing — you miss what you actually need.',
                    'Taking cyanocobalamin instead of methylcobalamin — form matters enormously.',
                    'Expecting results in 2 weeks — give any supplement 60–90 days minimum.',
                    'Taking calcium and iron together — they compete for absorption.',
                    'Thinking supplements replace a good diet — dal, sabzi, fruits still matter most.',
                ],
            },
        ],
    },

    {
        id: 2,
        authorName: "Dr. Dev Sharma",
        specialist: "Psychologist",
        imageUrl: "https://thumbs.dreamstime.com/b/different-foods-ingredients-rich-vitamin-d-flatlay-composition-products-dark-table-diet-concept-above-216268801.jpg",
        title: "Vitamin D deficiency in India — why even sunny countries struggle",
        desc: "70–80% of urban Indians are deficient despite living in a tropical country. The science explained.",
        cat: "Vitamin D",
        read: "8 min",
        date: "Apr 2026",
        featured: false,
        color: "#E1F5EE",
        textColor: "#0F6E56",
        content: [
            {
                type: 'keybox',
                items: [
                    '70–80% of urban Indians are Vitamin D deficient despite abundant sunshine.',
                    'Below 20 ng/mL is deficient. Below 30 ng/mL is insufficient.',
                    'Indoor lifestyle, sunscreen use, and high melanin all reduce synthesis.',
                    'Supplement with 1,000–2,000 IU D3 daily. Always pair with K2.',
                    'Get tested first — a 25-OH Vitamin D test costs ₹400–800.',
                ],
            },
            {
                type: 'intro',
                text: "India sits between 8° and 37° North latitude — closer to the equator than most countries. We have sunshine almost year-round. So why do studies consistently show that 70–80% of urban Indians are Vitamin D deficient? The answer reveals something important about how modern life has changed our biology.",
            },
            { type: 'heading', text: 'Why sunshine alone is not enough' },
            {
                type: 'list',
                items: [
                    'Indoor lifestyle — Most urban Indians spend 90%+ of their day indoors. Office jobs, air-conditioned commutes, and screen time means almost zero sun exposure during peak synthesis hours (10am–3pm).',
                    'High melanin levels — Darker skin requires significantly more sun exposure to produce the same amount of Vitamin D as lighter skin. This is an evolutionary adaptation that now works against us in modern indoor environments.',
                    'Sunscreen use — SPF 30 blocks about 95% of Vitamin D synthesis. Necessary for skin health, but it comes at a cost.',
                    'Air pollution — Dense smog in cities like Delhi and Mumbai blocks UVB rays before they reach your skin, even when you are outdoors.',
                    'Covered clothing — Cultural dress practices that cover arms and legs further limit skin exposure.',
                ],
            },
            { type: 'heading', text: 'What do the numbers actually mean?' },
            {
                type: 'table',
                rows: [
                    { label: 'Below 20 ng/mL', value: 'Deficient', note: 'Supplement immediately' },
                    { label: '20–30 ng/mL', value: 'Insufficient', note: 'Supplement recommended' },
                    { label: '30–60 ng/mL', value: 'Optimal', note: 'Maintain with daily dose' },
                    { label: 'Above 100 ng/mL', value: 'Potentially toxic', note: 'Only from over-supplementing' },
                ],
            },
            { type: 'heading', text: 'Symptoms of deficiency' },
            {
                type: 'list',
                items: [
                    'Persistent fatigue and low energy — even after adequate sleep.',
                    'Bone pain and muscle weakness — especially lower back and legs.',
                    'Frequent infections — Vitamin D is critical for immune function.',
                    'Low mood and brain fog — receptors for Vitamin D exist throughout the brain.',
                    'Hair loss — often overlooked but strongly associated with deficiency.',
                ],
            },
            { type: 'heading', text: 'How to supplement correctly' },
            {
                type: 'para',
                text: 'Always choose D3 (cholecalciferol), not D2 (ergocalciferol). D3 is the form your skin naturally produces and raises blood levels more effectively. Pair it with Vitamin K2 (MK-7 form) — K2 ensures the calcium that Vitamin D helps absorb goes to your bones and teeth, not your arteries.',
            },
            {
                type: 'list',
                items: [
                    'Maintenance dose (levels 30–50 ng/mL) — 1,000–2,000 IU D3 daily with a fatty meal.',
                    'Correction dose (levels below 20 ng/mL) — 4,000–5,000 IU daily for 8–12 weeks, then retest.',
                    'Always take with food containing fat — D3 is fat-soluble and absorbs poorly on an empty stomach.',
                    'Retest after 8–12 weeks to confirm levels have risen adequately.',
                ],
            },
            {
                type: 'tip',
                text: 'A 25-OH Vitamin D blood test costs ₹400–800 at most labs in India. Book home collection via Thyrocare or Redcliffe — results arrive in 24 hours.',
            },
        ],
    },


    {
        id: 3,
        authorName: "Dr. Deepak",
        specialist: "Nutritionist",
        imageUrl: "https://thumbs.dreamstime.com/b/diet-healthy-food-lifestyle-health-concept-sport-exercise-equipment-workout-and-gym-background-nutrition-detox-salad-f-179855057.jpg",
        title: "Healthy Eating Habits for Energy, Immunity, and Better Daily Wellness",
        desc: "Good nutrition is the foundation of a healthy lifestyle. Balanced meals rich in vitamins, proteins, fiber, and healthy fats help improve energy levels, strengthen immunity, and support physical and mental well-being. ",
        cat: "Nutrition", read: "10 min", date: "Mar 2026", featured: false,
        color: "#FAEEDA", textColor: "#854F0B", content: [],
    },
    {
        id: 4,
        authorName: "Dr. Emily Richardson",
        specialist: "Mental Health",
        imageUrl: "https://img.magnific.com/premium-photo/human-profile-with-nature-mental-health-earth-day_1001450-4614.jpg",
        title: "Daily Habits That Improve Emotional Balance and Reduce Stress",
        desc: "Learn how emotional resilience, mindfulness, and healthy daily habits can improve mental health, reduce stress, and support emotional wellness.",
        cat: "Health", read: "9 min", date: "Mar 2026", featured: false,
        color: "#FAECE7", textColor: "#993C1D", content: [],
    },
    {
        id: 5,
        authorName: "Varun Choudhary",
        specialist: "Trainer",
        imageUrl: "https://thumbs.dreamstime.com/b/women-doing-stretching-exe-13813791.jpg",
        title: "Daily Workouts and Healthy Habits for Strength, Energy, and Better Health",
        desc: "Fitness is essential for maintaining physical strength, mental clarity, and overall wellness. Regular exercise, balanced nutrition, and healthy recovery routines improve energy levels, support heart health, and reduce stress.",
        cat: "Fitness", read: "7 min", date: "Feb 2026", featured: false,
        color: "#E1F5EE", textColor: "#0F6E56", content: [],
    },
    {
        id: 6,
        authorName: "Dr. Tushar",
        specialist: "Mindfulness ",
        imageUrl: "https://images.stockcake.com/public/4/8/d/48daa9fd-9dfb-4c11-b0f5-b5c8fad3e245_large/peaceful-mountain-meditation-stockcake.jpg",
        title: "Simple Daily Habits for Inner Peace, Focus, and Emotional Balance",
        desc: "Consistent mindfulness habits support balance and positivity in everyday life.",
        cat: "Mindfulness", read: "6 min", date: "Feb 2026", featured: false,
        color: "#E6F1FB", textColor: "#185FA5", content: [],
    },
    {
        id: 7,
        authorName: "Dr. Raj Sharma",
        specialist: "Longevity ",
        imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/077/967/387/small/holding-hands-friends-and-back-with-old-women-at-beach-for-bonding-retirement-and-happiness-summer-vacation-travel-trip-and-adventure-with-senior-people-for-carefree-paradise-and-health-photo.jpg",
        title: "Longevity and Healthy Aging",
        desc: "Longevity focuses on improving quality of life through healthy habits, balanced nutrition, regular exercise, proper sleep, and stress management.",
        cat: "Longevity", read: "8 min", date: "Jan 2026", featured: false,
        color: "#EEEDFE", textColor: "#534AB7", content: [],
    },
   
]
