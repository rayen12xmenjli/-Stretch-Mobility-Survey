const SPREADSHEET_ID = "17IvHROZjiQ-X8A5zh3iIFagO1brsX2XZHaUTv_u7B6Y";
const SHEET_NAME = "Applications";

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Application Form')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function getIndianStates() {
  return [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi (National Capital Territory)",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
}

function submitApplication(formData) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const expectedHeaders = ["Timestamp", "Name", "Mobile Number", "Email ID", "Date of Birth", "Gender", "Graduation", "State", "Applying For", "Contact Method", "IP Address"];
    
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      newSheet.appendRow(expectedHeaders);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = (data.length > 0) ? data[0] : [];
    const emailColumnIndex = headers.indexOf("Email ID");
    const mobileColumnIndex = headers.indexOf("Mobile Number");
    const startIndex = (data.length > 0 && data[0][0] === "Timestamp") ? 1 : 0;
    
    for (let i = startIndex; i < data.length; i++) {
      if (emailColumnIndex !== -1 && data[i][emailColumnIndex] && data[i][emailColumnIndex].toString().toLowerCase() === formData.email.toLowerCase()) {
        return { status: "error", message: "You have already applied with this email address." };
      }
      if (mobileColumnIndex !== -1 && data[i][mobileColumnIndex] && data[i][mobileColumnIndex].toString() === formData.mobile) {
        return { status: "error", message: "You have already applied with this mobile number." };
      }
    }
    
    const newRow = [
      new Date(),
      formData.name,
      formData.mobile,
      formData.email,
      formData.dob,
      formData.gender,
      formData.graduation,
      formData.state,
      formData.applyingFor,
      formData.contactMethod,
      formData.ipAddress
    ];
    
    sheet.appendRow(newRow);
    
    sendConfirmationEmail(formData);
    
    return { status: "success", message: "Your response has been submitted our HR team will get back to you shortly." };
  } catch (error) {
    Logger.log("Error in submitApplication: " + error.toString() + " Stack: " + error.stack);
    return { status: "error", message: "An error occurred while submitting your application: " + error.message };
  }
}

function sendConfirmationEmail(formData) {
  try {
    const subject = "Application Received - Thank You for Applying!";
    
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; }
        .info-box { background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: 600; color: #374151; }
        .info-value { color: #6b7280; }
        .next-steps { background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .next-steps h3 { color: #10b981; margin-top: 0; }
        .next-steps ul { margin: 0; padding-left: 20px; }
        .next-steps li { margin: 8px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .contact-info { margin-top: 15px; }
        .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .header { padding: 20px 15px; }
          .content { padding: 20px 15px; }
          .info-row { flex-direction: column; }
          .info-label { margin-bottom: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p>Thank you for your interest in joining our team</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear <strong>${formData.name}</strong>,
          </div>
          
          <p>Thank you for submitting your application! We have successfully received your information and our HR team will review it shortly.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #10b981;">📋 Application Summary</h3>
            <div class="info-row">
              <span class="info-label">Position Applied:</span>
              <span class="info-value"><span class="badge">${formData.applyingFor}</span></span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${formData.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Mobile:</span>
              <span class="info-value">+91 ${formData.mobile}</span>
            </div>
            <div class="info-row">
              <span class="info-label">State:</span>
              <span class="info-value">${formData.state}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Education:</span>
              <span class="info-value">${formData.graduation}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Preferred Contact:</span>
              <span class="info-value">${formData.contactMethod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Submitted:</span>
              <span class="info-value">${new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>🚀 What Happens Next?</h3>
            <ul>
              <li><strong>Review Process:</strong> Our HR team will carefully review your application within 2-3 business days</li>
              <li><strong>Initial Screening:</strong> If your profile matches our requirements, we'll contact you for an initial discussion</li>
              <li><strong>Interview Process:</strong> Qualified candidates will be invited for interviews based on the position requirements</li>
              <li><strong>Final Decision:</strong> We'll keep you updated throughout the process via your preferred contact method</li>
            </ul>
          </div>
          
          <p style="color: #059669; font-weight: 500;">💡 <strong>Tip:</strong> Please keep your phone accessible as our HR team may contact you soon!</p>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing to be part of our team!</strong></p>
          <div class="contact-info">
            <p>If you have any questions about your application, please don't hesitate to contact us.</p>
            <p style="margin-top: 10px; font-size: 12px;">This is an automated confirmation email. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
    
    const plainTextBody = `
    Dear ${formData.name},

    Thank you for submitting your application! We have successfully received your information.

    Application Summary:
    - Position Applied: ${formData.applyingFor}
    - Email: ${formData.email}
    - Mobile: +91 ${formData.mobile}
    - State: ${formData.state}
    - Education: ${formData.graduation}
    - Preferred Contact: ${formData.contactMethod}
    - Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

    What Happens Next?
    1. Our HR team will review your application within 2-3 business days
    2. If your profile matches our requirements, we'll contact you for an initial discussion
    3. Qualified candidates will be invited for interviews
    4. We'll keep you updated throughout the process

    Thank you for your interest in joining our team!

    Best regards,
    HR Team
    `;
    
    GmailApp.sendEmail(
      formData.email,
      subject,
      plainTextBody,
      {
        htmlBody: htmlBody,
        name: "HR Team"
      }
    );
    
    Logger.log("Confirmation email sent to: " + formData.email);
    
  } catch (error) {
    Logger.log("Error sending confirmation email: " + error.toString());
  }
}