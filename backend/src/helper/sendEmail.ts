import nodemailer from 'nodemailer'

import { dev } from '../config'
import { EmailDataType } from '../types'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.smtpUsername,
    pass: dev.app.smtpPassword,
  },
})

export const handelSendEmail = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: dev.app.smtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }
    const info = await transporter.sendMail(mailOptions)
    console.log('Message sent : %s', info.response)
  } catch (error) {
    throw console.error('Error encountered while sending email', error)
  }
}
