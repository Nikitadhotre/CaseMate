const mongoose = require('mongoose');
const Case = require('./models/caseModel');
const Client = require('./models/clientModel');
const Lawyer = require('./models/lawyerModel');
const { sendHearingReminderEmail } = require('./utils/emailService');
require('dotenv').config();

async function sendHearingReminders() {
  try {
    console.log('Checking for hearing reminders...');

    // Get tomorrow's date range (start and end of tomorrow)
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(now.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0); // Start of tomorrow

    const tomorrowEnd = new Date(now);
    tomorrowEnd.setDate(now.getDate() + 1);
    tomorrowEnd.setHours(23, 59, 59, 999); // End of tomorrow

    // Find cases with hearings scheduled for tomorrow
    const upcomingCases = await Case.find({
      nextHearingDate: {
        $gte: tomorrowStart,
        $lte: tomorrowEnd
      }
    }).populate('clientId', 'name email').populate('lawyerId', 'name email');

    console.log(`Found ${upcomingCases.length} cases with hearings scheduled for tomorrow`);

    for (const caseItem of upcomingCases) {
      // Send email to client
      if (caseItem.clientId && caseItem.clientId.email) {
        await sendHearingReminderEmail(
          caseItem.clientId.email,
          caseItem.clientId.name,
          caseItem.caseTitle,
          caseItem.nextHearingDate,
          'client',
          null,
          caseItem.lawyerId ? caseItem.lawyerId.name : 'N/A'
        );
      }

      // Send email to lawyer
      if (caseItem.lawyerId && caseItem.lawyerId.email) {
        await sendHearingReminderEmail(
          caseItem.lawyerId.email,
          caseItem.lawyerId.name,
          caseItem.caseTitle,
          caseItem.nextHearingDate,
          'lawyer',
          caseItem.clientId ? caseItem.clientId.name : 'N/A',
          null
        );
      }
    }

    console.log('Hearing reminder emails sent successfully');
  } catch (error) {
    console.error('Error sending hearing reminders:', error);
  }
}

// If run directly, execute the function
if (require.main === module) {
  sendHearingReminders();
}

module.exports = sendHearingReminders;
