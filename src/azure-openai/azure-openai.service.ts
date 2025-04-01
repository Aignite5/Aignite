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

    const prompt = `Generate a personalized 5-year career blueprint for the user based on the following details. 
The blueprint should be motivating, realistic, and structured for actionable growth.

**User Profile:**
- **Current Job Title:** ${user.data.currentJobTitle || 'Not specified'}
- **Fields of Study:** ${user.data.fieldOfStudy?.join(', ') || 'Not specified'}
- **Future Aspirations:** ${user.data.futureAspirations || 'Not specified'}
- **Highest Education:** ${user.data.highestLevelOfEducation || 'Not specified'}
- **Industries of Interest:** ${user.data.industriesOfInterest?.join(', ') || 'Not specified'}
- **Technical Skills:** ${user.data.technicalSkills?.join(', ') || 'Not specified'}
- **Soft Skills:** ${user.data.softSkills?.join(', ') || 'Not specified'}
- **University/Institution:** ${user.data.universityOrInstitution || 'Not specified'}
- **Work Experience:** ${user.data.workExperience || 'Not specified'}
- **Exciting Work:** ${user.data.excitingWork || 'Not specified'}
- **Preferred Work Environments:** ${user.data.preferredWorkEnvironments?.join(', ') || 'Not specified'}
- **Learning Preferences:** ${user.data.learningPreferences?.join(', ') || 'Not specified'}
- **Career Goals:** ${user.data.Career_goals?.join(', ') || 'Not specified'}
- **Skill Developement Strategies:** ${user.data.Skill_developement_strategies?.join(', ') || 'Not specified'}
- **Career Challenges:** ${user.data.careerChallenges?.join(', ') || 'Not specified'}

**Career Blueprint Structure:**
1. **A Picture of the Future (5-Year Vision):**
   - Describe where the user could be in five years if they follow this career blueprint.
   - Include potential job titles, industries, skills mastered, estimated income range, and notable career achievements.
   - Highlight lifestyle aspects such as professional networks, leadership roles, and personal growth.

2. **Current Position & Gap Analysis:**
   - Summarize the user's current skills, education, experience, and interests.
   - Clearly outline the key gaps they need to address to reach their 5-year vision.

3. **Learning & Skill Development Path:**
   - Recommend specific courses, certifications, and real-world projects.
   - Cover both technical and soft skills required for career progression.

4. **Mentorship & Networking Plan:**
   - Suggest potential mentors and professional communities to engage with.
   - Recommend industry events and strategies to build a strong professional network.

5. **Career Milestones & Opportunities:**
   - Outline key career milestones to achieve at short-term (1 year), mid-term (3 years), and long-term (5 years).
   - Suggest internships, projects, or job roles to pursue at each phase.

6. **Progress Tracking & Refinement:**
   - Provide a structured plan for tracking progress, adjusting the roadmap based on achievements, and staying aligned with evolving industry trends.

Ensure the response is structured, actionable, and motivational, guiding the user step by step in their career journey.`;

    const response = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career coach AI assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4o',
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content.trim();

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

    return {
      success: true,
      code: 200,
      message: 'Career blueprint generated successfully',
      data: this.formatCareerBlueprint(aiResponse),
    };
  }

  //   async generateCareerBlueprint(userId: string) {
  //     const user = await this.UserSrv.findUserById(userId);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     const prompt = `Create a detailed career blueprint for the following professional:
  //     - **Current Job Title:** ${user.data.currentJobTitle}
  //     - **Fields of Study:** ${user.data.fieldOfStudy.join(', ')}
  //     - **Future Aspirations:** ${user.data.futureAspirations}
  //     - **Highest Education:** ${user.data.highestLevelOfEducation}
  //     - **Hobbies:** ${user.data.hobbies.join(', ')}
  //     - **Industries of Interest:** ${user.data.industriesOfInterest.join(', ')}
  //     - **Skills:** ${user.data.skills.join(', ')}
  //     - **University/Institution:** ${user.data.universityOrInstitution}

  //     **Structure the response as follows:**
  //     - Career Goals: Short-term and long-term objectives.
  //     - Skill Development: Key skills to learn, resources, and strategies.
  //     - Networking Recommendations: At least 3 LinkedIn influencers or communities to follow.
  //     - Learning Resources: At least 3 relevant YouTube videos with their links.
  //     - Suggested Next Steps: Actionable advice for the next 6 months.`;

  //     const response = await this.client.chat.completions.create({
  //       messages: [
  //         { role: 'system', content: 'You are a career coach AI assistant.' },
  //         { role: 'user', content: prompt },
  //       ],
  //       model: "gpt-4o",
  //       max_tokens: 700,
  //     });

  //     const aiResponse = response.choices[0]?.message?.content.trim();

  //     if (!aiResponse) {
  //       return {
  //         success: false,
  //         code: 500,
  //         message: 'AI did not return a response. Please try again.',
  //       };
  //     }

  //     return {
  //       success: true,
  //       code: 200,
  //       message: 'Career blueprint generated successfully',
  //       data: this.formatCareerBlueprint(aiResponse),
  //     };
  // }

  /**
   * Formats AI response into a structured JSON format
   */
  private formatCareerBlueprint(response: string) {
    const sections = response
      .split('\n\n')
      .filter((section) => section.trim() !== '');
    let formattedBlueprint: any = {};

    sections.forEach((section) => {
      const [title, ...content] = section.split('\n');
      formattedBlueprint[title.trim()] = content.join('\n').trim();
    });

    return formattedBlueprint;
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
