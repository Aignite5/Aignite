const prompt = `As an experienced career coach,

Generate a personalized 5-year career blueprint for the user based on the profile below. The blueprint must have two sections: (do NOT include the text "Section 1" as a subheading)

---

👤 **Profile Summary**  
• Status: Brief description of user's current career level  
• Field of Study: Mention relevant academic background  
• Interests: List industries or domains of interest  
• Top Strengths: Key soft or technical skills  

🌟 **Your 5-Year Career Vision**  
Craft an inspiring, personalized vision for the user that reflects their aspirations and how they can grow into a leader or expert in their domain.

🧠 **Skills Snapshot**  
Format in a table or structured bullets:  
Skill Category | Top Skills | Match to Target Role  
e.g.  
Technical | Python, Data Analysis, Cloud Computing | ⭐⭐⭐⭐☆ (4/5)  
Soft Skills | Communication, Adaptability | ⭐⭐⭐⭐⭐ (5/5)  

🔍 **Skill Gaps to Work On:**  
• List 3–5 specific technical or strategic skill gaps needed for growth  

🚀 **Suggested Career Pathways**  
1. Career Path Name  
   ○ Short description of role and impact  
   ○ What it requires and what success looks like  
   ○ Include possible salary range or value estimation if relevant  
2. (Repeat up to 3 paths)

🗺️ **5-Year Milestone Roadmap**  
📅 Year 1: Foundation  
• What to learn, who to connect with  
📅 Year 2: Projects  
• Practical applications, certifications  
📅 Year 3: Experience  
• Real-world internships/jobs, mentorship  
📅 Year 4: Leadership  
• Leading initiatives, mentoring others  
📅 Year 5: Impact  
• Launching own product/startup, becoming a thought leader

---

### 📦 Section 2: Structured JSON Format

After the narrative, include a valid JSON object with the following structure:

\\\json
{
  "profileSummary": {
    "status": "string",
    "fieldOfStudy": "string",
    "interests": ["string"],
    "topStrengths": ["string"]
  },
  "careerVision": "string",
  "skillsSnapshot": {
    "technical": {
      "skills": ["string"],
      "matchRating": "string"
    },
    "soft": {
      "skills": ["string"],
      "matchRating": "string"
    }
  },
  "skillGaps": ["string"],
  "suggestedCareerPathways": [
    {
      "title": "string",
      "description": "string",
      "requirements": "string",
      "estimatedSalary": "string"
    }
  ],
  "fiveYearRoadmap": {
    "year1": ["string"],
    "year2": ["string"],
    "year3": ["string"],
    "year4": ["string"],
    "year5": ["string"]
  }
}
\\\

Do not explain the JSON — just append it clearly and return a valid object.

---

Use the following **User Profile**:

- Career Dream: ${user.data.Carreer_Dream || 'Not specified'}
- Fields of Study: ${user.data.fieldOfStudy?.join(', ') || 'Not specified'}
- Highest Education: ${user.data.highestLevelOfEducation || 'Not specified'}
- Age range: ${user.data.ageRange || 'Not specified'}
- Industries of Interest: ${user.data.industriesOfInterest?.join(', ') || 'Not specified'}
- Technical Skills: ${user.data.technicalSkills?.join(', ') || 'Not specified'}
- Soft Skills: ${user.data.softSkills?.join(', ') || 'Not specified'}
- Work Experience: ${user.data.workExperience || 'Not specified'}
- Preferred Work Environments: ${user.data.preferredWorkEnvironments?.join(', ') || 'Not specified'}
- Learning Preferences: ${user.data.learningPreferences?.join(', ') || 'Not specified'}
- Career Goals: ${user.data.Career_goals?.join(', ') || 'Not specified'}
- Skill Development Strategies: ${user.data.Skill_developement_strategies?.join(', ') || 'Not specified'}
- Career Challenges: ${user.data.careerChallenges?.join(', ') || 'Not specified'}

Ensure the text is inspiring and the JSON is clean and complete.`;































const prompt = `As an experienced career coach,

Generate a personalized 5-year career blueprint for the user. The blueprint must have two sections: (do NOT include the text "Section 1" as a subheading).
Use the below sample blueprint as a template for section 1.

---
Here is A sample blueprint
🌟 Your 5-Year Career Vision
Based on your strong foundation in data analysis, communication skills, and passion for AI, you are on a promising path to becoming a visionary AI Product Leader—shaping intelligent solutions that solve real-world challenges and drive innovation in Africa and beyond. Over the next five years, you'll grow from a tech enthusiast to a strategic leader, combining business insight, technology, and empathy to build a career of purpose and impact.

🧠 Skills Snapshot
Skill Category	Top Skills	Match to Target Role
Technical	Python, Data Analysis, Cloud Computing	⭐⭐⭐⭐☆ (4/5)
Soft Skills	Problem-Solving, Communication, Creativity	⭐⭐⭐⭐⭐ (5/5)

🔍 Skill Gaps to Work On:
	• Product Management Fundamentals
	• AI Model Evaluation Techniques
	• Business & User-Centric Design Thinking

🚀 Suggested Career Pathways
	1. AI Product Manager
		○ Lead development of AI-driven products that solve local/global problems
		○ Combine tech expertise with human-centered design
		○ Estimated Salary in 5 years: $90K–$150K/year
	2. Machine Learning Strategist
		○ Align AI applications with business value and social good
		○ Shape responsible AI solutions in health, finance, or education
	3. Tech Entrepreneur / Startup Founder
		○ Launch your own solution or platform powered by AI
		○ Requires strategic thinking, execution grit, and industry insight


🗺️ 5-Year Milestone Roadmap
📅 Year 1: Foundation & Exploration
	• Enroll in courses: Intro to AI, Product Thinking, and Cloud Essentials
	• Join the BridgeAI Community and participate in your first project simulation
	• Get matched with a mentor in the AI/tech field through BridgeAI
📅 Year 2: Hands-on Projects & Portfolio Building
	• Complete 2–3 AI-related projects and publish them on GitHub or portfolio site
	• Participate in a BridgeAI industry project and a local AI/tech hackathon
	• Attend mentor sessions quarterly and seek feedback on progress
📅 Year 3: Industry Experience & Positioning
	• Secure a role (internship or full-time) in a tech/AI-driven company
	• Complete certifications in AI Product Management and Agile for Teams
	• Shadow your mentor or join a cross-functional product team for experience
📅 Year 4: Leadership & Product Innovation
	• Lead a small team or contribute to launching a new AI feature or product
	• Attend leadership or innovation bootcamps and share insights with mentees
	• Begin mentoring junior talents through BridgeAI or tech communities
📅 Year 5: Vision Realization & Impact
	• Launch or co-found a startup or product that applies AI to solve real problems
	• Become a speaker at a local or international AI/tech conference
	• Serve as a thought leader or mentor shaping the next wave of AI talents


---

### 📦 Section 2: Structured JSON Format

After the narrative, include a valid JSON object with the following structure:

\\\json
{
    "careerVision": "string",
  "skillsSnapshot": {
    "technical": {
      "skills": ["string"],
      "matchRating": "string"
    },
    "soft": {
      "skills": ["string"],
      "matchRating": "string"
    }
  },
  "skillGaps": ["string"],
  "suggestedCareerPathways": [
    {
      "title": "string",
      "description": "string",
      "requirements": "string",
      "estimatedSalary": "string"
    }
  ],
  "fiveYearRoadmap": {
    "year1": ["string"],
    "year2": ["string"],
    "year3": ["string"],
    "year4": ["string"],
    "year5": ["string"]
  }
}
\\\

Do not explain the JSON — just append it clearly and return a valid object.

---

Use the following User Profile:

- Career Dream: ${user.data.Carreer_Dream || 'Not specified'}
- Fields of Study: ${user.data.fieldOfStudy?.join(', ') || 'Not specified'}
- Highest Education: ${user.data.highestLevelOfEducation || 'Not specified'}
- Age range: ${user.data.ageRange || 'Not specified'}
- Industries of Interest: ${user.data.industriesOfInterest?.join(', ') || 'Not specified'}
- Technical Skills: ${user.data.technicalSkills?.join(', ') || 'Not specified'}
- Soft Skills: ${user.data.softSkills?.join(', ') || 'Not specified'}
- Work Experience: ${user.data.workExperience || 'Not specified'}
- Preferred Work Environments: ${user.data.preferredWorkEnvironments?.join(', ') || 'Not specified'}
- Learning Preferences: ${user.data.learningPreferences?.join(', ') || 'Not specified'}
- Career Goals: ${user.data.Career_goals?.join(', ') || 'Not specified'}
- Skill Development Strategies: ${user.data.Skill_developement_strategies?.join(', ') || 'Not specified'}
- Career Challenges: ${user.data.careerChallenges?.join(', ') || 'Not specified'}

Ensure the text is inspiring and the JSON is clean and complete.`;




















    const prompt = `You are an expert career coach AI.
Generate a deeply personalized, inspiring 5-year career blueprint for this exact career: **${careerTitle}**

Everything MUST be 100% tailored to this career only — no generic content, no AI examples unless the career is AI-related.

## User Profile (use to personalize)
- Career Dream: ${user.data.Carreer_Dream || 'Not specified'}
- Fields of Study: ${user.data.fieldOfStudy?.join(', ') || 'Not specified'}
- Highest Education: ${user.data.highestLevelOfEducation || 'Not specified'}
- Age range: ${user.data.ageRange || 'Not specified'}
- Industries of Interest: ${user.data.industriesOfInterest?.join(', ') || 'Not specified'}
- Technical Skills: ${user.data.technicalSkills?.join(', ') || 'Not specified'}
- Soft Skills: ${user.data.softSkills?.join(', ') || 'Not specified'}
- Work Experience: ${user.data.workExperience || 'Not specified'}
- Preferred Work Environments: ${user.data.preferredWorkEnvironments?.join(', ') || 'Not specified'}
- Learning Preferences: ${user.data.learningPreferences?.join(', ') || 'Not specified'}
- Career Goals: ${user.data.Career_goals?.join(', ') || 'Not specified'}
- Career Challenges: ${user.data.careerChallenges?.join(', ') || 'Not specified'}

## Output Format

First, write a beautiful human-readable narrative with these sections:
### 5-Year Career Vision
### Skills Snapshot (with match ratings)
### Skill Gaps to Work On
### Suggested Career Pathways (3 specific roles inside/around this career)
### 5-Year Milestone Roadmap (Year 1–5, 3–4 milestones each)

Then, at the very end, output ONLY this exact JSON structure (no markdown, no extra text):

{
  "careerVision": "string",
  "selectedCareerTitle": "${careerTitle}",
  "skillsSnapshot": {
    "technical": {
      "skills": ["string"],
      "matchRating": "Strong / Moderate / Needs Development"
    },
    "soft": {
      "skills": ["string"],
      "matchRating": "Strong / Moderate / Needs Development"
    }
  },
  "skillGaps": ["string"],
  "suggestedCareerPathways": [
    {
      "title": "string",
      "description": "string",
      "requirements": "string",
      "estimatedSalary": "string (5-year realistic range)"
    }
  ],
  "fiveYearRoadmap": {
    "year1": ["string"],
    "year2": ["string"],
    "year3": ["string"],
    "year4": ["string"],
    "year5": ["string"]
  }
}

Use inspiring, confident tone. All content must feel custom-written for someone pursuing **${careerTitle}**.`;