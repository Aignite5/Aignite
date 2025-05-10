import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AzureOpenAI } from 'openai';
import * as azureai from '@azure/openai';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AzureOpenaiService {
  private client: AzureOpenAI;

  constructor(
    @Inject(forwardRef(() => UsersService)) readonly UserSrv: UsersService,
    @InjectModel(Users.name) private readonly UsersModel: Model<Users>,
  ) {
    this.client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.OPENAI_API_VERSION,
      deployment: 'gpt-4o',
    });
  }
  async getCompletion(prompt: string): Promise<any> {
    const response = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4o', // Azure OpenAI uses deployment names
      max_tokens: 128,
    });

    return response.choices;
    return response.choices[0].message.content;
  }

  async generateCareerBlueprint(userId: string) {
    const user = await this.UserSrv.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
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

  
    const response = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career coach AI assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4o',
      max_tokens: 2000,
    });
  
    const aiResponse = response.choices[0]?.message?.content?.trim();
  
    if (!aiResponse) {
      return {
        success: false,
        code: 500,
        message: 'AI did not return a response. Please try again.',
      };
    }
  
    const record = await this.UsersModel.findOne({ _id: userId });
    record.careerBlueprint = aiResponse;
    await record.save();
  
    const formatted = this.formatCareerBlueprint(aiResponse);
  
    return {
      success: true,
      code: 200,
      message: 'Career blueprint generated successfully',
      data: aiResponse,
      formatted
    };
  }



  formatCareerBlueprint(content: string) {
    const extractSection = (label: string) => {
      const regex = new RegExp(`\\*\\*${label}\\*\\*\\s*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n###|\\n---|$)`);
      const match = content.match(regex);
      return match ? match[1].trim() : '';
    };
  
    const extractJson = () => {
      const jsonMatch = content.match(/```json([\s\S]*?)```/);
      try {
        return jsonMatch ? JSON.parse(jsonMatch[1].trim()) : null;
      } catch (e) {
        return null;
      }
    };
  
    return {
      structuredJson: extractJson()
    };
  }
  

  async generateCareerBlueprintInHouse(userId: string) {
    const user = await this.UserSrv.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // List of professionals (replace with your actual array)
    const professionals = [
      {
        name: 'Sundar Pichai',
        company: 'Google',
        company_type: 'Search Engine, Cloud Computing, AI',
        role: 'CEO',
        notable_achievements:
          "Led the development of Chrome, Android, and Google's AI initiatives",
      },
      {
        name: 'Satya Nadella',
        company: 'Microsoft',
        company_type: 'Software, Cloud Computing, AI',
        role: 'CEO',
        notable_achievements:
          'Transformed Microsoft into a cloud-first company with Azure',
      },
      {
        name: 'Tim Cook',
        company: 'Apple',
        company_type: 'Consumer Electronics, Software, Hardware',
        role: 'CEO',
        notable_achievements:
          'Oversaw the launch of the iPhone X, Apple Watch, and M1 chip',
      },
      {
        name: 'Elon Musk',
        company: 'Tesla, SpaceX, Neuralink',
        company_type: 'Electric Vehicles, Space Exploration, AI',
        role: 'CEO',
        notable_achievements:
          'Revolutionized electric vehicles and private space travel',
      },
      {
        name: 'Jensen Huang',
        company: 'NVIDIA',
        company_type: 'GPU Manufacturing, AI, Gaming',
        role: 'CEO',
        notable_achievements:
          'Pioneered GPU technology for AI and gaming industries',
      },
      {
        name: 'Sheryl Sandberg',
        company: 'Meta (formerly Facebook)',
        company_type: 'Social Media, Advertising, VR',
        role: 'COO',
        notable_achievements:
          "Scaled Facebook's advertising business and operations",
      },
      {
        name: 'Reed Hastings',
        company: 'Netflix',
        company_type: 'Streaming Services, Entertainment',
        role: 'Co-CEO',
        notable_achievements:
          'Transformed Netflix from DVD rentals to a streaming giant',
      },
      {
        name: 'Susan Wojcicki',
        company: 'YouTube',
        company_type: 'Video Streaming, Social Media',
        role: 'CEO',
        notable_achievements:
          "Grew YouTube into the world's largest video platform",
      },
    ];

    // Match user profile with a professional
    const recommendedProfessional = this.recommendProfessional(
      user.data,
      professionals,
    );

    const prompt = `Create a detailed career blueprint for the following professional:
  - **Current Job Title:** ${user.data.currentJobTitle}
  - **Fields of Study:** ${user.data.fieldOfStudy.join(', ')}
  - **Future Aspirations:** ${user.data.futureAspirations}
  - **Highest Education:** ${user.data.highestLevelOfEducation}
  - **Hobbies:** ${user.data.hobbies.join(', ')}
  - **Industries of Interest:** ${user.data.industriesOfInterest.join(', ')}
  - **Skills:** ${user.data.skills.join(', ')}
  - **University/Institution:** ${user.data.universityOrInstitution}

  **Recommended Professional:** ${recommendedProfessional.name}, ${recommendedProfessional.role} at ${recommendedProfessional.company}. Notable Achievements: ${recommendedProfessional.notable_achievements}.

  **Structure the response as follows:**
  - Career Goals: Short-term and long-term objectives.
  - Skill Development: Key skills to learn, resources, and strategies.
  - Networking Recommendations: At least 3 LinkedIn influencers or communities to follow.
  - Learning Resources: At least 3 relevant YouTube videos with their links.
  - Suggested Next Steps: Actionable advice for the next 6 months.`;

    const response = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career coach AI assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4o',
      max_tokens: 700,
    });

    const aiResponse = response.choices[0]?.message?.content.trim();

    if (!aiResponse) {
      return {
        success: false,
        code: 500,
        message: 'AI did not return a response. Please try again.',
      };
    }

    return {
      success: true,
      code: 200,
      message: 'Career blueprint generated successfully',
      data: this.formatCareerBlueprint(aiResponse),
    };
  }

  // Function to recommend a professional based on user data
  recommendProfessional(userData: any, professionals: any[]) {
    let bestMatch = null;
    let highestScore = 0;

    for (const professional of professionals) {
      let score = 0;

      // Match skills
      const userSkills = userData.skills || [];
      const professionalSkills = professional.skills || [];
      const skillMatches = userSkills.filter((skill) =>
        professionalSkills.includes(skill),
      );
      score += skillMatches.length;

      // Match industries
      const userIndustries = userData.industriesOfInterest || [];
      const professionalIndustries = professional.industries || [];
      const industryMatches = userIndustries.filter((industry) =>
        professionalIndustries.includes(industry),
      );
      score += industryMatches.length;

      // Match education (optional)
      if (userData.highestEducation && professional.education) {
        if (
          userData.highestEducation
            .toLowerCase()
            .includes(professional.education.toLowerCase())
        ) {
          score += 2;
        }
      }

      // Update best match
      if (score > highestScore) {
        highestScore = score;
        bestMatch = professional;
      }
    }

    return bestMatch || professionals[0]; // Default to the first professional if no match is found
  }
}
