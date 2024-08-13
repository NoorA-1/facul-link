const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: "587",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

// const hotmailConfig = {
//   service: "hotmail",
//   port: "587",
//   auth: {
//     user: "bcsbs2112282@szabist.pk",
//     pass: "rcmmxnqdpsmtuebg",
//   },
// };

// const config = hotmailConfig;

export default config;
