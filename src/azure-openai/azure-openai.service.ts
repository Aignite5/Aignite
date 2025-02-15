import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AzureOpenAI } from 'openai';
import * as azureai from '@azure/openai'
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AzureOpenaiService {
  private client: AzureOpenAI;

  constructor(
    @Inject(forwardRef(() => UsersService))  readonly UserSrv: UsersService,
  ) {
    this.client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      apiVersion: process.env.OPENAI_API_VERSION,
      deployment:"gpt-4o"
    });
  }
  async getCompletion(prompt: string): Promise<any> {
    
    const response = await this.client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: prompt },
      ],
      model: "gpt-4o", // Azure OpenAI uses deployment names
      max_tokens: 128,
    });

    return response.choices
    return response.choices[0].message.content;
  }

  async generateCareerBlueprint(userId: string) {
    const user = await this.UserSrv.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prompt = `Create a detailed career blueprint for the following professional:
    - **Current Job Title:** ${user.data.currentJobTitle}
    - **Fields of Study:** ${user.data.fieldsOfStudy.join(', ')}
    - **Future Aspirations:** ${user.data.futureAspirations}
    - **Highest Education:** ${user.data.highestEducation}
    - **Hobbies:** ${user.data.hobbies.join(', ')}
    - **Industries of Interest:** ${user.data.industriesOfInterest.join(', ')}
    - **Skills:** ${user.data.skills.join(', ')}
    - **University/Institution:** ${user.data.universityOrInstitution}

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
      model: "gpt-4o",
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

/**
 * Formats AI response into a structured JSON format
 */
private formatCareerBlueprint(response: string) {
    const sections = response.split("\n\n").filter((section) => section.trim() !== "");
    let formattedBlueprint: any = {};

    sections.forEach((section) => {
        const [title, ...content] = section.split("\n");
        formattedBlueprint[title.trim()] = content.join("\n").trim();
    });

    return formattedBlueprint;
}

}
