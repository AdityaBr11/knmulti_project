import path from "path";
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const sendMail = async ({ 
  to, 
  body, 
  subject, 
  fileName, 
  context, 
  template,
  pdf_url
}: any) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.agumentikgroup.com',
    port: 465,
    secure: true,
    auth: {
      user: 'testemail@agumentikgroup.com',
      pass: 'Agumentik@123',
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.join(__dirname,'/templates'),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname,'/templates'),
    extName: '.handlebars'
  };

  transporter.use('compile', hbs(handlebarOptions));

  let info;

  if(pdf_url){
    info = await transporter.sendMail({
      from: 'testemail@agumentikgroup.com',
      to: to,
      subject: subject,
      template: `${template}`,
      text: body,
      context: context,
      attachments: [
        {
          filename: `${fileName}.pdf`,
          href: `${pdf_url}`,
        }
      ],
    });
  } else {
    info = await transporter.sendMail({
      from: 'testemail@agumentikgroup.com',
      to: to,
      subject: subject,
      template: `${template}`,
      text: body,
      context: context
    });
  }
  
  return info;

}

export default sendMail;