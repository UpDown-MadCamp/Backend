const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const File = require('../models/FileModel'); // 파일 모델 경로에 맞게 조정

// nodemailer transporter 설정
const transporter = nodemailer.createTransport({
    service: 'gmail', // 사용할 이메일 서비스
    auth: {
        user: 'seoyunchocolate@gmail.com', // 이메일 주소
        pass: 'rongttjhcvqullvs' // 이메일 비밀번호
    }
});

router.post('/send', async (req, res) => {
    const { email } = req.body;

    try {
        // 해당 이메일로 등록된 파일들 검색
        const files = await File.find({ email: email });

        if (!files.length) {
            return res.status(404).send('No files found for this email.');
        }

        let emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <center>
                <img src="https://drive.google.com/uc?export=view&id=1fFXCpcbxiOrWzxtnNvnYBw7_lLVR8kR6"
                alt="UpDown Logo" style="width: 150px;">
                <h1 style="color: #4A90E2;">Welcome to UpDown!</h1>
            </center>
            <p style="font-size: 16px;">Here are the files you requested from UpDown:</p>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Filename</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Key</th>
                </tr>
                ${files.map(file => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${file.filename}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${file.key}</td>
                </tr>`).join('')}
            </table>
            <p style="font-size: 16px;">Thank you for using UpDown, the best service for managing and sharing your files!</p>
        </div>`;


        // 이메일 보내기
        const mailOptions = {
            from: 'seoyunchocolate@gmail.com',
            to: email,
            subject: 'Your Files',
            html: emailBody
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving files');
    }
});

module.exports = router;
