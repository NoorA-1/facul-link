# facul-link
Fyp Project.

CSS framework:
<ul><li>Bootstrap</li></ul>

Frontend Packages:
<ol>
  <li>Vite</li>
  <li>Material UI</li>
  <li>Material UI X</li>
  <li>Dayjs</li>
  <li>React Router</li>
  <li>React Icons</li>
  <li>MUI Tel Input (unused)</li>
  <li>Formik</li>
  <li>Yup</li>
  <li>Axios</li>
  <li>Lottie-React</li>
</ol>

Backend Packages:
<ol>
  <li>Express</li>
  <li>Express-async-erros</li>
  <li>Express-validator</li>
  <li>Bcrypt</li>
  <li>Concurrently</li>
  <li>Cookie-parser</li>
  <li>Dayjs</li>
  <li>Dotenv</li>
  <li>Http-status-codes</li>
  <li>Jsonwebtoken</li>
  <li>Mongoose</li>
  <li>Morgan</li>
  <li>Multer</li>
  <li>Nanoid</li>
  <li>Nodemon</li>
</ol>

The emailConfig.js file is excluded from the repository as I do not want my credentials to be shared. It contains the code:

```
const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  // service: process.env.SMTP_SERVICE,
  auth: {
    user: email,
    pass: app_password,
  },
};

export default config;
```
