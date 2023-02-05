require('dotenv').config();

import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';

import { Request, Response } from 'express';

import { users } from './users';

const PORT: number | string = process.env.PORT || 4000;

const server = express();

server.use(express.json());
server.use(cors());

const sendEmail = (whomToSend: string) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: whomToSend,
      subject: 'Testing Email',
      text: 'Join Us!',
      html: '<h2 style="color: red"><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank">Click here!</a></h2>',
    };

    transporter.sendMail(mailOptions, (error: any, info) => {
      if (error) {
        return reject({ message: `Error: ${error}` });
      }
      return resolve({ message: 'Mail sent succesfuly' });
    });
  });
};

server.get('/', (req: Request, res: Response) => {
  users.forEach((userEmail: string) => {
    sendEmail(userEmail)
      .then((response: any) => {
        res.send(response.message);
      })
      .catch((error: any) => {
        res.status(500).send(error.message);
      });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
