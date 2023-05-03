let nodemailer = require("nodemailer")
async function mail() {
    // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '',
        pass: '',
      },
    });
  
    let info = await transporter.sendMail({
      from: 'b6217112@g.sut.ac.th',
      to: 'napakant1235@gmail.com',
      subject: 'hello world',
      html: "emailHtml",
    });
    console.log('Message sent: %s', info.messageId);
  }
  mail().catch(console.error);