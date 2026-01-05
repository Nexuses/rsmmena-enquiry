const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files (including hre.html)
app.use(express.static(__dirname));

// Parse URL-encoded bodies (for non-file fields)
app.use(express.urlencoded({ extended: true }));

// SMTP / email configuration from user
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'AKIAUMX3EPJMRNDUKYNU',
    pass: 'BHOh3WcvE9UKhAuB0XBO5yTDFqFTXYpLaZ3h8/Nj0Thy'
  }
});

// Form submission route
app.post(
  '/submit',
  upload.fields([{ name: 'leaderCV[]', maxCount: 20 }]),
  async (req, res) => {
    try {
      const {
        country,
        contactName,
        contactEmail,
        niche
      } = req.body;

      // services may be a string or array depending on how many were selected
      let services = req.body.services || [];
      if (!Array.isArray(services) && services) {
        services = [services];
      }

      // Map service keys to full labels & descriptions (match the form)
      const serviceMeta = {
        vCISO: {
          label: 'vCISO Services',
          description:
            'Cyber defence strategy, policy, architecture & org planning.'
        },
        MaturityAssessment: {
          label: 'Maturity Assessment (NIST)',
          description:
            'Scoring maturity based on NIST framework & People/Controls readiness.'
        },
        GRC: {
          label: 'GRC Automation & Assessment',
          description:
            'Compliance (ISO, COSO, SOX, Central Bank) & ITGC/Enterprise Risk.'
        },
        DigitalFootprint: {
          label: 'Digital Footprint Mapping',
          description:
            'Analysis of external exposure and brand sentiment.'
        },
        VAPT: {
          label: 'Vulnerability Assessment (VAPT)',
          description:
            'Blackbox/Greybox/Whitebox (Outside-in & Inside-out).'
        },
        RedTeaming: {
          label: 'Red Teaming',
          description:
            'Adversary simulation to test detection/response.'
        },
        DevSecOps: {
          label: 'DevSecOps / Security as Code',
          description:
            'Securing the SDLC and Cloud Applications.'
        },
        BAS: {
          label: 'Breach & Attack Simulation',
          description:
            'Lab-based continuous validation of controls.'
        },
        SOC: {
          label: 'SOC as a Service',
          description:
            '24x7 Monitoring, Incident Management (Captive or Managed).'
        },
        ThreatIntel: {
          label: 'Threat Monitoring',
          description:
            'Dark web monitoring & threat intelligence.'
        },
        IncidentResponse: {
          label: 'Incident Response & Forensics',
          description:
            'Root cause analysis, kill-chain reconstruction (e.g. Ransomware/DDoS).'
        },
        OTSecurity: {
          label: 'OT Security',
          description:
            'Assessments for Operational Technology & Industrial Control Systems.'
        },
        CyberDrills: {
          label: 'Cyber Drills / Table-Top',
          description:
            'Workshops for IT/Non-IT Executives.'
        },
        Training: {
          label: 'Skill Assurance Programs',
          description:
            'Lab-based training (B2B/B2C) & Onboarding programs.'
        }
      };

      const servicesList = services.length
        ? services
            .map(key => {
              const meta = serviceMeta[key] || {};
              const label = meta.label || key;
              const desc = meta.description || '';
              return `
                <li style="margin-bottom:6px;">
                  <strong>${label}</strong>
                  ${desc ? `<br><span style="font-size:12px;color:#666;">${desc}</span>` : ''}
                </li>
              `;
            })
            .join('')
        : '<li>No services selected</li>';

      // Normalize leader fields so single entries also become arrays
      // Support both "leaderName[]" and "leaderName" style keys
      let leaderNames =
        req.body['leaderName[]'] ||
        req.body.leaderName ||
        [];
      let leaderRoles =
        req.body['leaderRole[]'] ||
        req.body.leaderRole ||
        [];
      let leaderSkills =
        req.body['leaderSkill[]'] ||
        req.body.leaderSkill ||
        [];

      if (!Array.isArray(leaderNames) && leaderNames) {
        leaderNames = [leaderNames];
      }
      if (!Array.isArray(leaderRoles) && leaderRoles) {
        leaderRoles = [leaderRoles];
      }
      if (!Array.isArray(leaderSkills) && leaderSkills) {
        leaderSkills = [leaderSkills];
      }

      const leaders = [];
      const maxLeaders = Math.max(
        leaderNames.length || 0,
        leaderRoles.length || 0,
        leaderSkills.length || 0
      );
      for (let i = 0; i < maxLeaders; i++) {
        leaders.push({
          name: leaderNames[i] || '',
          role: leaderRoles[i] || '',
          skill: leaderSkills[i] || ''
        });
      }

      const leadersRows = leaders
        .filter(l => l.name || l.role || l.skill)
        .map(
          (l, idx) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${l.name || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;">${l.role || ''}</td>
            <td style="padding:8px;border:1px solid #ddd;">${l.skill || ''}</td>
          </tr>
        `
        )
        .join('') || `
        <tr>
          <td colspan="4" style="padding:8px;border:1px solid #ddd;text-align:center;">
            No leader profiles provided.
          </td>
        </tr>
      `;

      const htmlBody = `
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;background:#f4f6f8;padding:24px;">
          <div style="max-width:800px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;
                      box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            <div style="background:#005C94;padding:16px 24px;color:#ffffff;">
              <h2 style="margin:0;font-size:20px;">RSM MENA Cyber Security Capability Submission</h2>
              <p style="margin:4px 0 0 0;font-size:13px;opacity:0.9;">
                A new capability map form has been submitted.
              </p>
            </div>

            <div style="padding:20px 24px 24px 24px;">
              <h3 style="color:#005C94;border-bottom:1px solid #e3e7eb;padding-bottom:6px;margin-top:0;">
                1. Member Firm Identification
              </h3>
              <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
                <tr>
                  <td style="width:220px;font-weight:bold;padding:8px;border:1px solid #e0e4ea;background:#f7f9fb;">
                    RSM Member Firm / Country
                  </td>
                  <td style="padding:8px;border:1px solid #e0e4ea;">${country || ''}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;padding:8px;border:1px solid #e0e4ea;background:#f7f9fb;">
                    Primary Cyber Security Lead
                  </td>
                  <td style="padding:8px;border:1px solid #e0e4ea;">${contactName || ''}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;padding:8px;border:1px solid #e0e4ea;background:#f7f9fb;">
                    Contact Email
                  </td>
                  <td style="padding:8px;border:1px solid #e0e4ea;">${contactEmail || ''}</td>
                </tr>
              </table>

              <h3 style="color:#005C94;border-bottom:1px solid #e3e7eb;padding-bottom:6px;">
                2. Service Capabilities
              </h3>
              <ul style="margin:0 0 16px 20px;padding:0;">
                ${servicesList}
              </ul>

              <h3 style="color:#005C94;border-bottom:1px solid #e3e7eb;padding-bottom:6px;">
                3. Niche & Unique Capabilities
              </h3>
              <div style="border:1px solid #e0e4ea;padding:10px 12px;margin-bottom:16px;background:#fafbfd;">
                ${niche ? niche.replace(/\n/g, '<br>') : '<em style="color:#777;">No additional notes provided.</em>'}
              </div>

              <h3 style="color:#005C94;border-bottom:1px solid #e3e7eb;padding-bottom:6px;">
                4. Leadership & Expertise Profile
              </h3>
              <table style="border-collapse:collapse;width:100%;margin-bottom:8px;">
                <thead>
                  <tr style="background:#f0f7fb;">
                    <th style="padding:8px;border:1px solid #e0e4ea;text-align:left;">#</th>
                    <th style="padding:8px;border:1px solid #e0e4ea;text-align:left;">Name</th>
                    <th style="padding:8px;border:1px solid #e0e4ea;text-align:left;">Designation</th>
                    <th style="padding:8px;border:1px solid #e0e4ea;text-align:left;">Primary Technical Expertise</th>
                  </tr>
                </thead>
                <tbody>
                  ${leadersRows}
                </tbody>
              </table>

              <p style="font-size:11px;color:#999;margin-top:16px;">
                This email was generated automatically from the RSM MENA Cyber Security Capability Map form.
              </p>
            </div>
          </div>
        </div>
      `;

      // Attach uploaded CV files (if any)
      const cvFiles = (req.files && req.files['leaderCV[]']) || [];
      const attachments = cvFiles.map(file => ({
        filename: file.originalname,
        content: file.buffer
      }));

      await transporter.sendMail({
        from: 'noreply.rsmmena@nexuses.online',
        to: 'arpit.m@nexuses.in',
        subject: `RSM MENA Cyber Capability Submission - ${country || 'Unknown Country'} - ${contactName || 'Unknown Contact'}`,
        html: htmlBody,
        attachments
      });

      res.send(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Submission received</title>
          </head>
          <body style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;margin:0;padding:40px;">
            <div style="max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:6px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.08);">
              <h2 style="color:#005C94;margin-top:0;">Thank you, ${contactName || ''}.</h2>
              <p>Your capability profile for <strong>RSM ${country || ''}</strong> has been recorded.</p>
              <p style="margin-top:24px;">
                <a href="/hre.html" style="color:#005C94;text-decoration:none;">&larr; Back to form</a>
              </p>
            </div>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).send('An error occurred while sending the email. Please try again later.');
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


