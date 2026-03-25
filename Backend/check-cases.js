const mongoose = require('mongoose');
const Case = require('./models/caseModel');
const Client = require('./models/clientModel');
const Lawyer = require('./models/lawyerModel');
require('dotenv').config();

async function checkCases() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://nikitaa:nikitaa@cluster0.ltj5z7y.mongodb.net/casemate?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    const cases = await Case.find({}).populate('clientId', 'name email').populate('lawyerId', 'name email');
    console.log('Total cases in database:', cases.length);
    cases.forEach((c, i) => {
      console.log(`Case ${i+1}:`, {
        id: c._id,
        title: c.caseTitle,
        client: c.clientId?.name || 'N/A',
        clientEmail: c.clientId?.email || 'N/A',
        clientId: c.clientId?._id || 'N/A',
        lawyer: c.lawyerId?.name || 'N/A',
        status: c.status || c.caseStatus
      });
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCases();
