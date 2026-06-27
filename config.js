// Portfolio Configuration for Dilip Kumar Yeddu
const portfolioConfig = {
    personal: {
        name: "Dilip Kumar Yeddu",
        title: "Software Engineer & AI Developer",
        subTitle: "ECE Graduate from GVPCE interested in AI, Generative AI, and Software Development.",
        bio: "B.Tech graduate in Electronics and Communication Engineering from Gayatri Vidya Parishad College of Engineering with experience in AI, Generative AI, and software development through academic projects and an AI internship at LTTS. Skilled in Python, SQL, Pandas, NumPy, and API integration, with a strong interest in building intelligent and data-driven solutions.",
        profileImage: "profile.jpg", // Local professional profile image
        resumeUrl: "resume.pdf", // Can be replaced by 'assets/resume.pdf'
        socialLinks: {
            linkedin: "https://linkedin.com/in/y-dilipkumar",
            github: "https://github.com/Dilipkumar9392",
            email: "mailto:y.dilipkumar939245@gmail.com"
        }
    },
    education: [
        {
            degree: "Bachelor of Technology in Electronics and Communication Engineering",
            institution: "Gayatri Vidya Parishad College of Engineering (Autonomous), Visakhapatnam",
            duration: "Aug 2023 - May 2026",
            gpa: "7.5 CGPA"
        },
        {
            degree: "Diploma in Electronics and Communication Engineering",
            institution: "Government Polytechnic, Vijayawada",
            duration: "Oct 2020 - Apr 2023",
            gpa: "80.08%"
        },
        {
            degree: "Secondary School Certificate (SSC)",
            institution: "Montessori (EM) school, Tenali",
            duration: "Jun 2019 - Apr 2020",
            gpa: "8.0 CGPA"
        }
    ],
    skills: {
        languages: [
            { name: "Python", level: 90 },
            { name: "C Language", level: 80 },
            { name: "SQL", level: 80 }
        ],
        frameworks: [
            { name: "Pandas & NumPy", level: 85 },
            { name: "Matplotlib & Seaborn", level: 80 },
            { name: "Generative AI & LLMs", level: 90 },
            { name: "Gemini API / Claude", level: 85 }
        ],
        tools: [
            { name: "Git & GitHub", level: 85 },
            { name: "VS Code", level: 90 },
            { name: "Cisco Packet Tracer", level: 75 },
            { name: "MS Office & Canva", level: 80 }
        ]
    },
    experience: [
        {
            title: "Resolute Group",
            role: "Intern",
            company: "Skyquad Electronics & Appliances Pvt. Ltd., Medchal, Hyderabad",
            duration: "July 2022 - Sep 2022",
            iconType: "briefcase",
            description: [
                "Conducted testing and troubleshooting of electronic appliances.",
                "Assisted in identifying technical issues to improve product reliability."
            ]
        },
        {
            title: "ELMAS (ELECTROMAGNETIC SYSTEMS)",
            role: "Intern",
            company: "Kushaiguda, Hyderabad",
            duration: "Sep 2022 - Jan 2023",
            iconType: "cpu",
            description: [
                "Completed training at Star Solar Inverter Manufacturing Company.",
                "Worked as a Tester and R&D Assistant.",
                "Involved in device testing and basic research activities."
            ]
        },
        {
            title: "Agnirva Space Community",
            role: "Campus Ambassador",
            company: "Agnirva.com Space Community (Remote)",
            duration: "Jun 2024 - Oct 2024",
            iconType: "globe",
            description: [
                "Promoted space science education and astronomy awareness among students.",
                "Represented Agnirva Space Community to organize space-tech webinars and connect peers with space exploration opportunities.",
                "Coordinated outreach events and digital campaigns for the space community."
            ]
        },
        {
            title: "NEC 2024 Team Member",
            role: "Team Member",
            company: "ECELL IIT Bombay",
            duration: "Aug 2024 - Feb 2025",
            iconType: "users",
            description: [
                "Collaborated with a team to promote tech-driven solutions.",
                "Participated in startup pitch events, mentoring sessions, and innovation challenges at GVPCE."
            ]
        },
        {
            title: "L&T Technology Services (LTTS)",
            role: "Intern",
            company: "Hitech City, Hyderabad",
            duration: "June 2026 - Present",
            iconType: "code",
            description: [
                "Working on AI-based internal projects, leveraging Generative AI and LLM technologies.",
                "Designing and implementing intelligent workflow automation scripts using Python.",
                "Participating in agile software cycles, code reviews, and technical documentation development."
            ]
        }
    ],
    certifications: [
        {
            name: "Python Essentials 1 & 2",
            issuer: "Cisco",
            date: "May 2025",
            credentialId: "Cisco NetAcad"
        },
        {
            name: "TCS iON Career Edge – Young Professional Certification",
            issuer: "TCS",
            date: "October 2024",
            credentialId: "TCS iON"
        },
        {
            name: "Introduction to Internet of Things",
            issuer: "NPTEL",
            date: "October 2024",
            credentialId: "NPTEL"
        },
        {
            name: "Oracle Cloud Infrastructure 2024 Generative AI Certified Professional",
            issuer: "Oracle",
            date: "June 2024",
            credentialId: "100685229OCI2024GAIOCP"
        }
    ],
    projects: [
        {
            title: "Campus Care Portal",
            category: "Web Development",
            description: "A centralized lost-and-found and student feedback portal for GVPCE.",
            tags: ["Firebase", "Gemini AI", "JavaScript", "HTML/CSS"],
            githubLink: "#",
            liveLink: "#",
            visualTheme: "gradient-blue-purple",
            details: [
                "Developed a real-time lost-and-found tracking system with image attachments and automated claim validation.",
                "Integrated Firebase Authentication for secure student login and Firestore database for instant messaging updates.",
                "Engineered a campus inquiry chatbot using the Gemini AI API to answer common student questions instantly.",
                "Designed a fully responsive web interface with clean CSS layouts, transition animations, and dark mode support."
            ]
        },
        {
            title: "AI Health Assistant",
            category: "AI & Data Science",
            description: "A virtual health assistant providing preliminary medical guidance and wellness suggestions using Gemini AI.",
            tags: ["Python", "Gemini API", "Chore API", "LLMs"],
            githubLink: "#",
            liveLink: "#",
            visualTheme: "gradient-cyan-blue",
            details: [
                "Built an automated patient symptoms analysis pipeline leveraging Gemini Pro LLM.",
                "Integrated Chore API to schedule health check reminders and manage notification requests.",
                "Designed an interactive chat UI preserving context across multiple conversation turns.",
                "Implemented strict input validation and integrated standard medical disclaimers to ensure safe operation."
            ]
        }
    ]
};
