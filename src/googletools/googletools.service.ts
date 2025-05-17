import { Injectable } from '@nestjs/common';
// import { google } from 'googleapis';
// import { JWT } from 'google-auth-library';
// import * as path from 'path';
// import * as fs from 'fs';

@Injectable()
export class GoogletoolsService {
  constructor() {}

// async createEventWithGoogleMeet({
//   summary,
//   description,
//   startDateTime,
//   endDateTime,
//   calendarId = 'primary',
// }: {
//   summary: string;
//   description: string;
//   startDateTime: string;
//   endDateTime: string;
//   calendarId?: string;
// }) {
//   try {
//     // Load service account credentials
//     const credentials = JSON.parse(
//       fs.readFileSync(
//         path.resolve(
//           __dirname,
//           '../../config/authentication-411609-dcd87bcd1c0b.json',
//         ),
//         'utf8',
//       ),
//     );

//     // Authenticate with Google
//     const auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: ['https://www.googleapis.com/auth/calendar'],
//     });

//     const authClient = await auth.getClient();
//     const calendar = google.calendar({ version: 'v3', auth });

//     const response = await calendar.events.insert({
//       calendarId,
//       requestBody: {
//         summary,
//         description,
//         start: {
//           dateTime: startDateTime,
//           timeZone: 'Africa/Lagos',
//         },
//         end: {
//           dateTime: endDateTime,
//           timeZone: 'Africa/Lagos',
//         },
//         // conferenceData: {
//         //   createRequest: {
//         //     requestId: Math.random().toString(36).substring(2),
//         //     conferenceSolutionKey: {
//         //       type: 'hangoutsMeet',
//         //     },
//         //   },
//         // },
//       },
//       conferenceDataVersion: 1,
//     });

//     return {
//       meetLink:
//         response.data.conferenceData?.entryPoints?.find(
//           (ep) => ep.entryPointType === 'video',
//         )?.uri || null,
//       calendarEventLink: response.data.htmlLink,
//     };
//   } catch (error) {
//     console.error('Google Calendar Error:', error);
//     throw error;
//   }
// }
}
