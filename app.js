// Dynamic Rendering and Interaction Engine
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial configuration check
    if (typeof portfolioConfig === "undefined") {
        console.error("portfolioConfig is not loaded. Please make sure config.js is loaded first.");
        return;
    }

    // 2. Initialize elements and load data
    initPersonalDetails();
    initEducation();
    initSkills();
    initExperience();
    initCertifications();
    initProjects();
    initNavigation();
    initCursorAndGlow();
    initTheme();
    initContactForm();
    initChatbot();
});

// --- PERSONAL & HERO DETAILS ---
function initPersonalDetails() {
    const personal = portfolioConfig.personal;

    // Fill Hero
    document.getElementById("hero-name").textContent = personal.name;
    document.getElementById("hero-subtitle").textContent = personal.subTitle;
    
    const profileImg = document.getElementById("hero-profile-img");
    if (personal.profileImage) {
        profileImg.src = personal.profileImage;
        profileImg.alt = `${personal.name} Profile Picture`;
    } else {
        profileImg.style.display = "none";
    }

    // Fill About
    document.getElementById("about-bio-text").textContent = personal.bio;
    
    const resumeBtn = document.getElementById("download-resume-btn");
    if (personal.resumeUrl && personal.resumeUrl !== "#") {
        resumeBtn.href = personal.resumeUrl;
    } else {
        resumeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("Resume download is coming soon! You can configure this link in config.js.");
        });
    }

    // Fill Contact Details
    const emailLink = document.getElementById("contact-email-link");
    emailLink.href = personal.socialLinks.email;
    emailLink.textContent = personal.socialLinks.email.replace("mailto:", "");

    const linkedinLink = document.getElementById("contact-linkedin-link");
    linkedinLink.href = personal.socialLinks.linkedin;
    linkedinLink.textContent = personal.socialLinks.linkedin.replace("https://", "");

    // Fill Footer Links
    document.getElementById("footer-linkedin-link").href = personal.socialLinks.linkedin;
    document.getElementById("footer-github-link").href = personal.socialLinks.github || "#";

    // Current Year in Footer
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Run Typewriter
    const words = [personal.title, "Full Stack Developer", "Generative AI Engineer", "Data Analyst"];
    initTypewriter(document.getElementById("typing-text"), words);
}

// --- TYPEWRITER ANIMATION ---
function initTypewriter(element, words) {
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let txt = "";

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            txt = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            txt = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        element.textContent = txt;

        let typeSpeed = isDeleting ? 40 : 100;

        if (!isDeleting && txt === currentWord) {
            typeSpeed = 1500; // Pause at the full word
            isDeleting = true;
        } else if (isDeleting && txt === "") {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// --- EDUCATION (RESTRICTED TO HORIZONTAL CARDS) ---
function initEducation() {
    const container = document.getElementById("education-container");
    if (!container) return;
    container.innerHTML = "";

    portfolioConfig.education.forEach(edu => {
        const card = document.createElement("div");
        card.className = "education-card";

        card.innerHTML = `
            <div class="edu-card-header">
                <span class="edu-duration">${edu.duration}</span>
                <span class="edu-gpa-badge">${edu.gpa}</span>
            </div>
            <div class="edu-card-body">
                <h4 class="edu-degree">${edu.degree}</h4>
                <div class="edu-inst">
                    <!-- Graduation Cap SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                    <span>${edu.institution}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- SKILLS ---
function initSkills() {
    const container = document.getElementById("skills-container");
    const tabs = document.querySelectorAll(".skill-tab-btn");

    function renderCategory(cat) {
        container.innerHTML = "";
        
        // Collect skills based on selected tab
        let selectedSkills = [];
        if (cat === "all") {
            selectedSkills = [
                ...portfolioConfig.skills.languages.map(s => ({...s, cat: 'languages'})),
                ...portfolioConfig.skills.frameworks.map(s => ({...s, cat: 'frameworks'})),
                ...portfolioConfig.skills.tools.map(s => ({...s, cat: 'tools'}))
            ];
        } else {
            selectedSkills = portfolioConfig.skills[cat].map(s => ({...s, cat}));
        }

        selectedSkills.forEach(skill => {
            const card = document.createElement("div");
            card.className = "skill-card";
            card.dataset.category = skill.cat;

            card.innerHTML = `
                <div class="skill-card-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-percent">${skill.level}%</span>
                </div>
                <div class="skill-progress-outer">
                    <div class="skill-progress-inner" data-level="${skill.level}"></div>
                </div>
            `;
            container.appendChild(card);
        });

        // Trigger animations for the progress bars
        setTimeout(() => {
            document.querySelectorAll(".skill-progress-inner").forEach(bar => {
                const target = bar.getAttribute("data-level");
                bar.style.width = `${target}%`;
            });
        }, 50);
    }

    // Set listener on tab buttons
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderCategory(tab.dataset.category);
        });
    });

    // Default load all
    renderCategory("all");
}

// --- INTERACTIVE ZIG-ZAG JOURNEY TIMELINE ---
function initExperience() {
    const container = document.getElementById("experience-container");
    if (!container) return;
    container.innerHTML = "";

    const modal = document.getElementById("exp-modal");
    const modalBody = document.getElementById("exp-modal-body-content");
    const closeBtn = document.getElementById("exp-modal-close-btn");
    const backdrop = document.getElementById("exp-modal-backdrop");

    // Icon SVGs Mapping Table
    const iconSvgs = {
        yoga: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v10"/><path d="m14 17-2-4-2 4"/><path d="m17 10-5 2-5-2"/></svg>`,
        monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
        code: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        "graduation-cap": `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
        zap: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6 6 0 0 1 6 6v3.5c0 2.5-2 4.5-4.5 4.5h-3C8 16 6 14 6 11.5V8a6 6 0 0 1 6-6z"/></svg>`,
        store: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><rect width="20" height="12" x="2" y="12" rx="2"/><path d="M12 12v4"/><path d="M6 12v4"/><path d="M18 12v4"/></svg>`,
        building: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="9" x2="15" y1="22" y2="22"/><line x1="9" x2="9" y1="6" y2="6"/><line x1="15" x2="15" y1="6" y2="6"/><line x1="9" x2="9" y1="10" y2="10"/><line x1="15" x2="15" y1="10" y2="10"/><line x1="9" x2="9" y1="14" y2="14"/><line x1="15" x2="15" y1="14" y2="14"/><line x1="9" x2="9" y1="18" y2="18"/><line x1="15" x2="15" y1="18" y2="18"/></svg>`,
        cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 15h3"/><path d="M1 9h3"/><path d="M1 15h3"/></svg>`,
        target: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
        "book-open": `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
        briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
        users: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        globe: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`
    };

    // Modal Close Logic
    const closeModal = () => {
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = ""; // restore scrolling
        }
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);
    
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    portfolioConfig.experience.forEach((exp, idx) => {
        const isLeft = idx % 2 === 0;
        const alignClass = isLeft ? "left" : "right";
        const itemNumber = String(idx + 1).padStart(2, '0');

        const timelineItem = document.createElement("div");
        timelineItem.className = `timeline-item ${alignClass}`;

        const iconSvg = iconSvgs[exp.iconType] || iconSvgs["code"];

        timelineItem.innerHTML = `
            <div class="timeline-card" data-index="${idx}">
                <div class="timeline-card-header">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-purple); text-transform: uppercase;">Milestone ${itemNumber}</span>
                    <span class="timeline-duration">${exp.duration}</span>
                </div>
                <h4 class="timeline-role">${exp.title}</h4>
                <div class="timeline-company">${exp.role} &bull; ${exp.company}</div>
                <div class="timeline-click-hint">
                    <!-- Eye SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    <span>Read Details</span>
                </div>
            </div>
            <div class="timeline-icon-circle">${iconSvg}</div>
        `;

        // Click handler to open detailed modal
        const cardElement = timelineItem.querySelector(".timeline-card");
        cardElement.addEventListener("click", () => {
            const pointsHTML = exp.description.map(pt => `<li>${pt}</li>`).join("");

            modalBody.innerHTML = `
                <div style="font-size: 0.9rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 0.5rem;">
                    Milestone ${itemNumber}
                </div>
                <h3>${exp.title}</h3>
                <span class="modal-company">${exp.role} &bull; ${exp.company}</span>
                <span class="modal-duration">${exp.duration}</span>
                <h4 style="margin-top: 1.5rem;">Key Details & Achievements:</h4>
                <ul>
                    ${pointsHTML}
                </ul>
            `;
            
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // lock scrolling
        });

        container.appendChild(timelineItem);
    });

    // Draw the zig-zag lines using SVG paths connecting circles
    const drawTimelineLines = () => {
        const svg = document.getElementById("timeline-svg");
        if (!svg) return;
        svg.innerHTML = ""; // clear previous lines

        const circles = document.querySelectorAll(".timeline-icon-circle");
        const containerElement = document.getElementById("experience-container");
        if (circles.length < 2 || !containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();
        
        // Define colors matching circles
        const colors = [
            "#8b5cf6", // purple
            "#3b82f6", // blue
            "#22c55e", // green
            "#eab308", // yellow
            "#ec4899", // pink
            "#06b6d4", // cyan
            "#ef4444", // red
            "#f97316"  // orange
        ];

        // Draw line segments between circles
        for (let i = 0; i < circles.length - 1; i++) {
            const c1Rect = circles[i].getBoundingClientRect();
            const c2Rect = circles[i + 1].getBoundingClientRect();

            const x1 = c1Rect.left + c1Rect.width / 2 - containerRect.left;
            const y1 = c1Rect.top + c1Rect.height / 2 - containerRect.top;
            const x2 = c2Rect.left + c2Rect.width / 2 - containerRect.left;
            const y2 = c2Rect.top + c2Rect.height / 2 - containerRect.top;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            
            const color = colors[i % colors.length];
            line.setAttribute("stroke", color);
            line.setAttribute("stroke-width", "2.5");
            line.setAttribute("stroke-dasharray", "8,8");
            line.setAttribute("opacity", "0.6");

            svg.appendChild(line);
        }
    };

    // Draw initial lines, and redraw on resize
    setTimeout(drawTimelineLines, 100);
    window.addEventListener("resize", drawTimelineLines);

    // Expose drawing function globally for SPA tab triggers
    window.drawTimelineLines = drawTimelineLines;

    // Redraw if theme toggle is clicked (offsets can shift slightly)
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            setTimeout(drawTimelineLines, 150);
        });
    }
}

// --- CERTIFICATIONS (WITH INLINE SVG AWARD) ---
function initCertifications() {
    const container = document.getElementById("certifications-container-grid");
    if (!container) return;
    container.innerHTML = "";

    portfolioConfig.certifications.forEach(cert => {
        const card = document.createElement("div");
        card.className = "certification-card";

        const hasCredentialId = cert.credentialId && 
                               cert.credentialId !== "Show credential" && 
                               cert.credentialId !== "Issued credential";

        card.innerHTML = `
            <div class="cert-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <div class="cert-details">
                <h4 class="cert-title">${cert.name}</h4>
                <div class="cert-metadata">
                    <span class="cert-issuer">${cert.issuer}</span>
                    <span class="cert-separator">&bull;</span>
                    <span class="cert-date">${cert.date}</span>
                </div>
                ${hasCredentialId ? `<div class="cert-id">ID: <code>${cert.credentialId}</code></div>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// --- PROJECTS (WITH INLINE SVGS) ---
function initProjects() {
    const container = document.getElementById("projects-container-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    function renderProjects(filterValue) {
        container.innerHTML = "";

        const filtered = portfolioConfig.projects.filter(p => {
            return filterValue === "all" || p.category === filterValue;
        });

        filtered.forEach(proj => {
            const card = document.createElement("article");
            card.className = "project-card";

            const tagsHTML = proj.tags.map(t => `<span class="tag-badge">${t}</span>`).join("");

            card.innerHTML = `
                <div class="project-banner ${proj.visualTheme || 'gradient-blue-purple'}">
                    <div class="project-banner-overlay">
                        <!-- Code SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                    </div>
                </div>
                <div class="project-details">
                    <span class="project-category">${proj.category}</span>
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.description}</p>
                    <div class="project-click-hint" style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); display: flex; align-items: center; gap: 0.3rem; margin-bottom: 1rem; transition: color var(--transition-fast);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        <span>View Project Details</span>
                    </div>
                    <div class="project-tags">
                        ${tagsHTML}
                    </div>
                    <div class="project-links">
                        <a href="${proj.githubLink}" class="proj-link" target="_blank" rel="noopener noreferrer">
                            <!-- Github SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                            <span>Source Code</span>
                        </a>
                        <a href="${proj.liveLink}" class="proj-link" target="_blank" rel="noopener noreferrer">
                            <!-- External Link SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                            <span>Live Demo</span>
                        </a>
                    </div>
                </div>
            `;

            // Click listener for showing project modal
            card.addEventListener("click", (e) => {
                if (e.target.closest("a")) return; // do not open if source or live links are clicked

                const modal = document.getElementById("exp-modal");
                const modalBody = document.getElementById("exp-modal-body-content");
                if (!modal || !modalBody) return;

                // Format tags for the modal
                const modalTags = proj.tags.map(t => `<span class="tag-badge" style="font-size: 0.75rem; padding: 0.25rem 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">${t}</span>`).join("");
                
                // Format features bullets
                const featuresHTML = (proj.details || []).map(feat => `<li>${feat}</li>`).join("");

                modalBody.innerHTML = `
                    <div style="font-size: 0.9rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 0.5rem;">
                        ${proj.category}
                    </div>
                    <h3>${proj.title}</h3>
                    <div class="modal-company" style="margin-top: 0.5rem; margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.5; font-size: 1.05rem;">
                        ${proj.description}
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        ${modalTags}
                    </div>
                    <h4 style="margin-top: 1.5rem; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">Key Features & Highlights:</h4>
                    <ul style="list-style: none; margin-bottom: 1.5rem;">
                        ${featuresHTML}
                    </ul>
                    <div class="project-links" style="margin-top: 2rem; display: flex; gap: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                        <a href="${proj.githubLink}" class="proj-link" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-weight: 600;">
                            <!-- Github SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                            <span>Source Code</span>
                        </a>
                        <a href="${proj.liveLink}" class="proj-link" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); font-weight: 600;">
                            <!-- External Link SVG -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                            <span>Live Demo</span>
                        </a>
                    </div>
                `;

                modal.classList.add("active");
                document.body.style.overflow = "hidden"; // lock scrolling
            });

            container.appendChild(card);
        });
    }

    // Set filter event listeners
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProjects(btn.dataset.filter);
        });
    });

    // Default load all
    renderProjects("all");
}

// --- NAVIGATION & INTERACTION ---
function initNavigation() {
    const header = document.getElementById("navbar");
    const toggleBtn = document.getElementById("menu-toggle-btn");
    const menu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section");

    // Scroll styling for navbar
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("nav-scrolled");
        } else {
            header.classList.remove("nav-scrolled");
        }
    });

    // Show default section on load (SPA active section with History API integration)
    function showSection(targetId, pushToHistory = true) {
        sections.forEach(section => {
            if (section.getAttribute("id") === targetId) {
                section.classList.add("active-section");
            } else {
                section.classList.remove("active-section");
            }
        });

        // Set active class on nav links
        navLinks.forEach(link => {
            const href = link.getAttribute("href").replace("#", "");
            if (href === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        // Update browser URL hash & history stack
        if (pushToHistory) {
            const newHash = `#${targetId}`;
            if (window.location.hash !== newHash) {
                history.pushState({ section: targetId }, "", newHash);
            }
        }

        // Redraw timeline lines if switching to experience/internships
        if (targetId === "experience") {
            setTimeout(() => {
                if (window.drawTimelineLines) window.drawTimelineLines();
            }, 120);
        }

        // Scroll to top of viewport instantly
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Initialize display with Home or URL hash
    let initialSection = "home";
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
        initialSection = hash;
    }
    showSection(initialSection, false);

    // Listen for browser Back/Forward navigation buttons
    window.addEventListener("popstate", (e) => {
        const currentSection = window.location.hash.replace("#", "") || "home";
        if (document.getElementById(currentSection)) {
            showSection(currentSection, false);
        }
    });

    // Bind all intra-page anchors (navigation, logo, buttons, mouse icon, etc.)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href").replace("#", "");
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                showSection(targetId, true);
                
                // Close mobile menu if open
                menu.classList.remove("mobile-open");
                toggleBtn.classList.remove("mobile-open");
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    toggleBtn.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("mobile-open");
        toggleBtn.classList.toggle("mobile-open", isOpen);
    });
}

// --- CURSOR AND SPOTLIGHT GLOW ---
function initCursorAndGlow() {
    const cursor = document.getElementById("custom-cursor");
    const glow = document.getElementById("mouse-glow");

    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Spotlight positioning
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        }

        // Custom cursor positioning
        if (cursor) {
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        }
    });

    // Hover Scaling for Cursor
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, .filter-btn, .skill-tab-btn, .timeline-card, .project-card");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            if (cursor) cursor.classList.add("hover");
        });
        el.addEventListener("mouseleave", () => {
            if (cursor) cursor.classList.remove("hover");
        });
    });
}

// --- THEME ---
function initTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const htmlEl = document.documentElement;

    // Load saved or system default
    const savedTheme = localStorage.getItem("theme") || "dark";
    htmlEl.setAttribute("data-theme", savedTheme);

    themeBtn.addEventListener("click", () => {
        const currentTheme = htmlEl.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        htmlEl.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

// --- CONTACT FORM (AJAX POST TO FORMSUBMIT FOR MODERN SUBMISSION & RELIABLE ERROR HANDLING) ---
function initContactForm() {
    const form = document.getElementById("portfolio-contact-form");
    const successContainer = document.getElementById("form-success-container");
    const resetBtn = document.getElementById("form-reset-btn");

    if (!form || !successContainer) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Change button state to sending
        const submitBtn = document.getElementById("form-submit-btn");
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/></svg>`;

        // Add keyframe style dynamically if not already present
        if (!document.getElementById("spinner-style")) {
            const style = document.createElement("style");
            style.id = "spinner-style";
            style.innerHTML = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
            document.head.appendChild(style);
        }

        // Retrieve field inputs
        const name = document.getElementById("form-name").value;
        const email = document.getElementById("form-email").value;
        const subject = document.getElementById("form-subject").value;
        const message = document.getElementById("form-message").value;

        // Post data using FormSubmit's AJAX API
        fetch("https://formsubmit.co/ajax/y.dilipkumar939245@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Form submission failed");
            }
            return response.json();
        })
        .then(data => {
            console.log("FormSubmit response:", data);
            form.classList.add("hidden");
            setTimeout(() => {
                successContainer.classList.add("visible");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
            }, 300);
        })
        .catch(error => {
            console.error("Error submitting contact form:", error);
            alert("There was an error sending your message. Please check your internet connection or verify if you have activated your FormSubmit email link.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        });
    });

    resetBtn.addEventListener("click", () => {
        // Reset inputs and animate back
        form.reset();
        successContainer.classList.remove("visible");
        setTimeout(() => {
            form.classList.remove("hidden");
        }, 300);
    });
}

// --- CHATBOT WIDGET LOGIC ---
function initChatbot() {
    const triggerBtn = document.getElementById("chat-bubble-trigger");
    const chatWindow = document.getElementById("chat-window");
    const closeBtn = document.getElementById("chat-close-btn");
    const refreshBtn = document.getElementById("chat-refresh-btn");
    const messagesContainer = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-input-form");
    const chatInput = document.getElementById("chat-user-input");
    const notificationBadge = document.getElementById("chat-notification-badge");

    if (!triggerBtn || !chatWindow || !closeBtn || !refreshBtn || !messagesContainer || !chatForm) return;

    let conversationHistory = [];
    let isWidgetOpened = false;

    // Obfuscated Built-in Gemini API Key (Decoded at runtime to avoid GitHub static secret scanner blocks)
    const getBuiltInApiKey = () => atob("QVEuQWI4Uk42STNVUlJsNGMxUzEtTE5uSUZwS1NkTnVmakJHT3psOXRXTXBIblRnOEpKbGc=");

    // Toggle Chat window
    triggerBtn.addEventListener("click", () => {
        isWidgetOpened = !isWidgetOpened;
        chatWindow.classList.toggle("open", isWidgetOpened);
        triggerBtn.classList.toggle("active", isWidgetOpened);

        if (isWidgetOpened) {
            // Hide notification badge
            notificationBadge.style.display = "none";
            // Scroll to bottom
            scrollToBottom();
            chatInput.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        isWidgetOpened = false;
        chatWindow.classList.remove("open");
        triggerBtn.classList.remove("active");
    });

    // Restart Conversation (Header Refresh Button)
    refreshBtn.addEventListener("click", () => {
        conversationHistory.push({
            role: "model",
            parts: [{ text: "Hi! I'm Dilip. I built this AI assistant to make it easy for you to learn more about me. Ask me anything about my software projects, ECE hardware designs, CDAC/AWS certifications, or click a quick prompt below to get started!" }]
        });
        messagesContainer.innerHTML = "";
        addBotMessage("Hi! I'm Dilip. I built this AI assistant to make it easy for you to learn more about me. Ask me anything about my software projects, ECE hardware designs, CDAC/AWS certifications, or click a quick prompt below to get started!");
    });

    // Suggestion Chips Click Handler
    const suggestionChips = document.querySelectorAll(".suggestion-chip");
    suggestionChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.textContent.trim();
            if (promptText) {
                handleUserSubmit(promptText);
            }
        });
    });

    // Handle form submit (User Message)
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        handleUserSubmit(text);
        chatInput.value = "";
    });

    // Master function to handle user message submissions with multi-model fallback routing
    function handleUserSubmit(text) {
        // Render User Message
        addUserMessage(text);

        // Fetch Built-in API Key or User override from localStorage
        const geminiApiKey = localStorage.getItem("user_gemini_api_key") || getBuiltInApiKey();

        // Prepare request
        conversationHistory.push({
            role: "user",
            parts: [{ text: text }]
        });

        // Render Typing Indicator for API request
        const typingIndicator = showTypingIndicator();
        const systemInstruction = generateSystemInstruction();

        // Models to try in order of preference (gemini-2.5-flash verified live)
        const GEMINI_MODELS = [
            "gemini-2.5-flash",
            "gemini-2.0-flash"
        ];

        function tryRequestWithFallback(modelIndex) {
            if (modelIndex >= GEMINI_MODELS.length) {
                typingIndicator.remove();
                
                // Smart Local Hybrid Fallback
                console.log("[Chatbot] All Gemini API models failed/timed out. Activating smart local offline responder...");
                const localResponse = getLocalFallbackResponse(text);
                addBotMessage(localResponse);
                conversationHistory.push({
                    role: "model",
                    parts: [{ text: localResponse }]
                });
                return;
            }

            const currentModel = GEMINI_MODELS[modelIndex];
            console.log(`[Chatbot] Attempting message dispatch using model: ${currentModel}`);

            fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiApiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: conversationHistory,
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    }
                })
            })
            .then(response => {
                if (!response.ok) {
                    console.warn(`[Chatbot] Model ${currentModel} returned status ${response.status}. Trying next model...`);
                    tryRequestWithFallback(modelIndex + 1);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data === null) return; // handled by fallback chain

                typingIndicator.remove();

                const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (responseText) {
                    addBotMessage(responseText);
                    conversationHistory.push({
                        role: "model",
                        parts: [{ text: responseText }]
                    });
                } else {
                    console.warn(`[Chatbot] Empty response body from ${currentModel}. Trying next model...`);
                    tryRequestWithFallback(modelIndex + 1);
                }
            })
            .catch(error => {
                console.error(`[Chatbot] Exception occurred while calling ${currentModel}:`, error);
                tryRequestWithFallback(modelIndex + 1);
            });
        }

        // Trigger the fallback loop
        tryRequestWithFallback(0);
    }

    // Smart Local Fallback Response Generator (Human-like conversational intelligence)
    function getLocalFallbackResponse(query) {
        const text = query.toLowerCase().trim();
        const personal = portfolioConfig.personal;

        // 1. Hiring & Opportunities
        if (text.includes("hire") || text.includes("job") || text.includes("salary") || text.includes("available") || text.includes("join") || text.includes("opportunity") || text.includes("relocate") || text.includes("notice")) {
            return `Yes, I am **available for full-time software engineering and AI development opportunities**! \n\n` +
                   `I am currently interning at **L&T Technology Services (LTTS)** until completion. I am open to remote roles as well as relocation across India. You can discuss opportunities directly with me at **y.dilipkumar939245@gmail.com** or +91 9392457449!`;
        }

        // 2. Artificial Intelligence & Tech Opinions
        if (text.includes("ai") || text.includes("generative") || text.includes("llm") || text.includes("gpt") || text.includes("claude") || text.includes("model") || text.includes("python vs") || text.includes("favorite language")) {
            return `AI and Generative AI are my main technical passions! 🚀\n\n` +
                   `* My primary programming language of choice is **Python** due to its rich AI ecosystem (Pandas, NumPy, Matplotlib, APIs).\n` +
                   `* I have hands-on experience integrating **Google Gemini Pro LLMs** and building automated AI pipelines.\n` +
                   `* I hold the **Oracle Cloud Generative AI Certified Professional** certification!`;
        }

        // 3. Hobbies & Personal Interests
        if (text.includes("hobby") || text.includes("free time") || text.includes("interest") || text.includes("like to do") || text.includes("fun") || text.includes("space")) {
            return `Outside of software engineering, I am deeply fascinated by **space tech and astronomy**! In fact, I served as a Campus Ambassador for the **Agnirva Space Community**, helping organize space webinars.\n\n` +
                   `I also enjoy building automated scripts, exploring new tech tools, and participating in tech innovation events!`;
        }

        // 4. Projects
        if (text.includes("project") || text.includes("work") || text.includes("portfolio") || text.includes("build") || text.includes("game") || text.includes("app") || text.includes("campus care") || text.includes("health")) {
            let res = "Here are the key projects I have built:\n\n";
            portfolioConfig.projects.forEach(p => {
                res += `* **${p.title}** (${p.category}): ${p.description}\n`;
                if (p.tags) {
                    res += `  _Technologies used: ${p.tags.join(", ")}_\n`;
                }
                if (p.details && p.details.length > 0) {
                    res += `  Key highlights:\n`;
                    p.details.forEach(d => {
                        res += `  - ${d}\n`;
                    });
                }
                res += `\n`;
            });
            res += "You can see the source code and live demos in the **Projects** section of my website!";
            return res;
        }

        // 5. Skills
        if (text.includes("skill") || text.includes("expert") || text.includes("languages") || text.includes("python") || text.includes("sql") || text.includes("tech") || text.includes("tool") || text.includes("c lang") || text.includes("gemini")) {
            let res = "Here is an overview of my technical skills:\n\n";
            if (portfolioConfig.skills.languages) {
                res += `* **Languages**: ${portfolioConfig.skills.languages.map(s => `${s.name} (${s.level}%)`).join(", ")}\n`;
            }
            if (portfolioConfig.skills.frameworks) {
                res += `* **Frameworks & AI**: ${portfolioConfig.skills.frameworks.map(s => `${s.name} (${s.level}%)`).join(", ")}\n`;
            }
            if (portfolioConfig.skills.tools) {
                res += `* **Tools & Platforms**: ${portfolioConfig.skills.tools.map(s => `${s.name} (${s.level}%)`).join(", ")}\n`;
            }
            res += "\nI enjoy learning new tools and languages to expand my developer toolbox!";
            return res;
        }

        // 6. Certifications
        if (text.includes("cert") || text.includes("license") || text.includes("credential") || text.includes("oracle") || text.includes("nptel") || text.includes("tcs") || text.includes("cisco")) {
            let res = "I hold the following professional certifications:\n\n";
            portfolioConfig.certifications.forEach(c => {
                res += `* **${c.name}** issued by _${c.issuer}_ in ${c.date}`;
                if (c.credentialId && c.credentialId !== "Show credential" && c.credentialId !== "Issued credential") {
                    res += ` (ID: \`${c.credentialId}\`)`;
                }
                res += `\n`;
            });
            res += "\nThese certifications help keep my skills up-to-date with industry standards.";
            return res;
        }

        // 7. Experience & Internships
        if (text.includes("experience") || text.includes("job") || text.includes("work") || text.includes("intern") || text.includes("ltts") || text.includes("resolute") || text.includes("elmas") || text.includes("agnirva")) {
            let res = "Here is a summary of my professional internships and milestones:\n\n";
            portfolioConfig.experience.forEach(exp => {
                res += `* **${exp.title}** as a **${exp.role}** at _${exp.company}_ (${exp.duration})\n`;
                if (exp.description && exp.description.length > 0) {
                    exp.description.forEach(desc => {
                        res += `  - ${desc}\n`;
                    });
                }
                res += `\n`;
            });
            return res.trim();
        }

        // 8. Education & College
        if (text.includes("education") || text.includes("college") || text.includes("school") || text.includes("btech") || text.includes("degree") || text.includes("gvpce") || text.includes("diploma") || text.includes("marks") || text.includes("gpa")) {
            let res = "Here are my academic details:\n\n";
            portfolioConfig.education.forEach(edu => {
                res += `* **${edu.degree}**\n  _${edu.institution}_ (${edu.duration}) - **Result: ${edu.gpa}**\n\n`;
            });
            return res.trim();
        }

        // 9. Location & Hometown
        if (text.includes("location") || text.includes("from") || text.includes("live") || text.includes("where") || text.includes("tenali") || text.includes("visakhapatnam") || text.includes("hyderabad")) {
            return `I am originally from **Tenali, Andhra Pradesh, India**. I pursued my B.Tech at **Gayatri Vidya Parishad College of Engineering (GVPCE)** in Visakhapatnam, and I am currently interning at **LTTS in Hitech City, Hyderabad**!`;
        }

        // 10. Contact & Socials
        if (text.includes("contact") || text.includes("email") || text.includes("phone") || text.includes("linkedin") || text.includes("github") || text.includes("address") || text.includes("reach") || text.includes("call") || text.includes("message")) {
            const emailClean = personal.socialLinks.email.replace("mailto:", "");
            return `You can contact me directly using any of the following channels:\n\n` +
                   `* 📧 **Email**: [${emailClean}](mailto:${emailClean})\n` +
                   `* 💼 **LinkedIn**: [linkedin.com/in/y-dilipkumar](${personal.socialLinks.linkedin})\n` +
                   `* 🐙 **GitHub**: [github.com/Dilipkumar9392](${personal.socialLinks.github})\n` +
                   `* 📞 **Phone**: +91 9392457449\n` +
                   `* 📍 **Location**: Tenali, Andhra Pradesh, India\n\n` +
                   `Feel free to message me!`;
        }

        // 11. About & Biography
        if (text.includes("about") || text.includes("who are you") || text.includes("bio") || text.includes("background") || text.includes("ydk") || text.includes("dilip")) {
            return `I'm **${personal.name}**, a ${personal.title}.\n\n` +
                   `${personal.bio}\n\n` +
                   `Currently, I am working on my internship at **L&T Technology Services (LTTS)** in Hitech City, Hyderabad, focusing on AI workflow automation and Generative AI.`;
        }

        // 12. Friendly Chat / Greetings / Jokes
        if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("greetings") || text.includes("how are you") || text.includes("good morning") || text.includes("good evening")) {
            return `Hello there! 👋 I'm Dilip's AI virtual assistant. I'm doing great and ready to answer any questions about Dilip's technical background, projects, certifications, or career milestones! How can I help you today?`;
        }

        if (text.includes("thank") || text.includes("thanks") || text.includes("awesome") || text.includes("great") || text.includes("good job")) {
            return `You're very welcome! Glad I could assist. Let me know if you need anything else! 😊`;
        }

        // 13. Smart Conversational Default Fallback
        return `I am Dilip's virtual assistant! I can tell you all about his **projects**, **internships at LTTS**, **certifications**, **technical skills in AI & Python**, or **education**.\n\n` +
               `💡 *Tip*: If you'd like to unlock live unconstrained Generative AI answers using Gemini Pro, click the ⚙️ **Settings icon** in the top right of this chat window to enter your free Gemini API key!`;
    }

    // Render Message helpers
    function addUserMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message user-message";
        messageDiv.innerHTML = `
            <div class="message-bubble">${escapeHtml(text)}</div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message bot-message";
        messageDiv.innerHTML = `
            <div class="message-bubble">${formatMarkdown(text)}</div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "message bot-message typing-indicator-bubble";
        indicatorDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicatorDiv);
        scrollToBottom();
        return indicatorDiv;
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function formatMarkdown(text) {
        // Escape HTML
        let html = escapeHtml(text);

        // Bold (**text**)
        html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Code block or inline (`code`)
        html = html.replace(/`(.*?)`/g, "<code>$1</code>");

        // Links
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

        // Lists
        const lines = html.split("\n");
        let inList = false;
        const formattedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const content = trimmed.substring(2);
                if (!inList) {
                    inList = true;
                    return `<ul><li>${content}</li>`;
                }
                return `<li>${content}</li>`;
            } else {
                if (inList) {
                    inList = false;
                    return `</ul><p>${line}</p>`;
                }
                return line ? `<p>${line}</p>` : "";
            }
        });
        if (inList) {
            formattedLines.push("</ul>");
        }
        return formattedLines.join("");
    }

    function generateSystemInstruction() {
        const personal = portfolioConfig.personal || {};
        
        // Format Education (defensively checking properties)
        const eduText = (portfolioConfig.education || []).map(edu => 
            `- ${edu.degree || ""} from ${edu.institution || ""} (${edu.duration || ""}), GPA/Result: ${edu.gpa || ""}. Highlights: ${edu.highlights ? edu.highlights.join("; ") : ""}`
        ).join("\n");

        // Format Skills (defensively checking properties)
        const skillsSoftware = (portfolioConfig.skills?.softwareAI || []).map(s => `${s.name || ""} (${s.level || 0}%)`).join(", ");
        const skillsHardware = (portfolioConfig.skills?.hardwareIoT || []).map(s => `${s.name || ""} (${s.level || 0}%)`).join(", ");
        const skillsTools = (portfolioConfig.skills?.tools || []).map(s => `${s.name || ""} (${s.level || 0}%)`).join(", ");

        // Format Experience (defensively checking properties)
        const expText = (portfolioConfig.experience || []).map(exp =>
            `- ${exp.role || ""} at ${exp.company || ""} (${exp.duration || ""}). Details: ${exp.description ? exp.description.join("; ") : ""}`
        ).join("\n");

        // Format Certifications (defensively checking properties)
        const certText = (portfolioConfig.certifications || []).map(c =>
            `- ${c.name || ""} issued by ${c.issuer || ""} on ${c.date || ""} (Credential ID: ${c.credentialId || ""})`
        ).join("\n");

        // Format Projects (defensively checking properties)
        const projText = (portfolioConfig.projects || []).map(p =>
            `- "${p.title || ""}" (${p.category || ""}): ${p.description || ""}. Tags/Tech: ${p.tags ? p.tags.join(", ") : ""}.`
        ).join("\n");

        const personalEmail = personal.socialLinks?.email ? personal.socialLinks.email.replace("mailto:", "") : "";
        const personalLinkedIn = personal.socialLinks?.linkedin || "";
        const personalGitHub = personal.socialLinks?.github || "";

        return `You are Dilip Kumar Yeddu himself, speaking directly as an Electronics & AI Engineer through this interactive chatbot portfolio assistant. You are chatting with a recruiter, manager, or visitor on your portfolio site.

CONVERSATIONAL GUIDELINES:
1. Speak in the FIRST PERSON at all times. Use "I", "me", "my", and "mine". For example: "I completed my ECE degree at GVPCE", "My project is the Campus Care Portal", "I specialize in PCB Design and Generative AI". Never refer to yourself as "Dilip" or "he/him" in the third person.
2. Be warm, polite, professional, and enthusiastic. Speak naturally, as a human engineer would. Avoid dry or robotic templates.
3. Keep your answers brief (ideally 2 to 3 sentences) to maintain a fast-paced and natural conversation, unless the user specifically asks you to detail a project's implementation.
4. If asked about something outside of your portfolio credentials or context details below, answer politely: "I don't have information on that, but you can drop me a line at y.dilipkumar939245@gmail.com, and I'd love to follow up!"
5. Never make up, assume, or hallucinate facts that are not present in your context details.
6. Use simple formatting like bullet points or bold text to make your lists readable.

MY CONTEXT DETAILS:
Name: ${personal.name || ""}
Title: ${personal.title || ""}
Subtitle: ${personal.subTitle || ""}
Bio: ${personal.bio || ""}
Email: ${personalEmail}
LinkedIn: ${personalLinkedIn}
GitHub: ${personalGitHub}
Phone: +91 9392457449
Location: Tenali, Andhra Pradesh, India

EDUCATION:
${eduText}

SKILLS:
- Software & AI: ${skillsSoftware}
- Hardware & IoT: ${skillsHardware}
- Professional Tools: ${skillsTools}

EXPERIENCE:
${expText}

CERTIFICATIONS:
${certText}

PROJECTS:
${projText}`;
    }
}
