const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const nodemailer = require("nodemailer");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.post("save", async function (doc) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "addushaiq367@gmail.com",
        pass: "tnprtrfketarhreu",
      },
    });

    const info = await transporter.sendMail({
      from: "Adnan Shaikh",
      to: `${doc.email}`,
      subject: "Account Created Successfully",
      text: "Welcome to Campus Connect!",
    });

    console.log("email sent ");
  } catch (error) {
    console.log(error);
  }
});

const UserModel = model("User", userSchema);
module.exports = UserModel;
