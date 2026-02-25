const { FormSubmission } = require('../models/model');
const sendEmail = require('../utils/email');
const sendWhatsApp = require('../utils/whatsapp');

// @desc    Submit Go Diamond form
// @route   POST /api/forms
// @access  Public
const submitForm = async (req, res) => {
  try {
    const {
      email, mobile, officialName, gender, age, address,
      currentOccupation, monthlyIncome, openToOpportunities,
      wantBusiness, businessType
    } = req.body;

    const uploadedFile = req.file ? req.file.path : '';

    const submission = new FormSubmission({
      email,
      mobile,
      officialName,
      gender,
      age,
      address,
      currentOccupation,
      monthlyIncome,
      openToOpportunities: openToOpportunities === 'Yes',
      wantBusiness: wantBusiness === 'Yes',
      businessType,
      uploadedFile
    });

    const saved = await submission.save();

    // ----- Send notifications (async, don't await) -----
    (async () => {
      try {
        console.log('📧 Starting notification process...');

        // Admin email
        console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Go Diamond Project Submission',
          html: `<h2>New Form Submission</h2>
                 <p><strong>Name:</strong> ${officialName}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Mobile:</strong> ${mobile}</p>`
        });
        console.log('✅ Admin email sent');

        // Admin WhatsApp
        if (process.env.ADMIN_PHONE) {
          console.log('📱 Sending WhatsApp to:', process.env.ADMIN_PHONE);
          await sendWhatsApp(
            process.env.ADMIN_PHONE,
            `New Go Diamond submission from ${officialName} (${email})`
          );
          console.log('✅ WhatsApp sent');
        } else {
          console.log('⚠️ ADMIN_PHONE not set, skipping WhatsApp');
        }

        // User confirmation email
        console.log('📧 Sending user confirmation email to:', email);
        await sendEmail({
          to: email,
          subject: 'We received your Go Diamond Project application',
          html: `<p>Dear ${officialName},</p>
                 <p>Thank you for submitting your application. Our team will contact you shortly.</p>`
        });
        console.log('✅ User email sent');

      } catch (err) {
        console.error('❌ Notification error:', err);
      }
    })();
    // ----------------------------------------------------

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully. We will contact you soon.',
      data: saved
    });

  } catch (error) {
    console.error('❌ Form submission error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions (admin only)
// @route   GET /api/forms
// @access  Private/Admin
const getSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort('-createdAt');
    res.json(submissions);
  } catch (error) {
    console.error('❌ Get submissions error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitForm, getSubmissions };