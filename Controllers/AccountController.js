const User = require("../Modals/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
dotenv.config();
const secret = process.env.SECRET;

const ERRORS = {
  USER_EXISTS: "User already exists",
  NO_USER: "No User Exists with the Given Mail Id/Mobile Number",
  USER_ACCESS_REMOVED: "User Access Denied Contact Customer Support",
  INVALID_CREDENTIALS: "Invalid Credentials",
  INTERNAL_ERROR: "Internal Server Error",
  BAD_REQUEST: "Bad Request Invalid Data Recived",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

const registerUser = async (req, res) => {
  try {
    const { FirstName, LastName, EmailId, PhoneNo, Password, Role } = req.body;
    // console.log(req.body);

    const existingUser = await User.findOne({
      $or: [{ EmailId }, { PhoneNo }],
    });
    if (existingUser) {
      if (!existingUser.IsVerified) {
        await User.findByIdAndDelete(existingUser._id);
      } else if (existingUser) {
        return res.status(400).json({ message: ERRORS.USER_EXISTS });
      }
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hash = await bcrypt.hash(Password, 10);

    const user = new User({
      FirstName: FirstName,
      LastName: LastName,
      PhoneNo: PhoneNo,
      EmailId: EmailId,
      Password: hash,
      Role: Role,
      Otp: otp,
    });

    await user.save();
    try {
      const mailOptions = {
        from: process.env.USER_MAIL,
        to: EmailId,
        subject: "OTP Verification",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <div href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My Ecommerce Store</div>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing MyEcommerceStore. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />MyEcommerceStore</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>My Ecommerce Store</p>
            <p>Heaven's Gate</p>
            <p>Above Cloud's</p>
          </div>
        </div>
      </div>`,
      };
      await transporter.sendMail(mailOptions);
    } catch (e) {
      return res
        .status(500)
        .json({ message: ERRORS.INTERNAL_ERROR, error: e.message });
    }

    return res.status(200).json({
      message: "Otp Send to your maild Id",
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: ERRORS.BAD_REQUEST, error: e.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ EmailId: email });

    if (user.Otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    user.IsVerified = true;

    await user.save();

    try {
      const mailOptions = {
        from: process.env.USER_MAIL,
        to: email,
        subject: "Registration Success",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <div style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">My Ecommerce Store</div>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for registering at MyEcommerceStore. Now you can login with your credentials.</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">Thanks</h2>
          <p style="font-size:0.9em;">Regards,<br />MyEcommerceStore</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>My Ecommerce Store</p>
            <p>Heaven's Gate</p>
            <p>Above Cloud's</p>
          </div>
        </div>
      </div>`,
      };
      await transporter.sendMail(mailOptions);
    } catch (e) {
      return res
        .status(500)
        .json({ message: ERRORS.INTERNAL_ERROR, error: e.message });
    }
    return res
      .status(201)
      .json({ message: "Registration Successfull", user: user });
  } catch (e) {
    return res
      .status(400)
      .json({ message: ERRORS.BAD_REQUEST, error: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUser = isNaN(Number(username))
      ? await User.findOne({ EmailId: username })
      : await User.findOne({ PhoneNo: username });

    if (!isUser || !isUser.IsVerified) {
      return res.status(404).json({ message: ERRORS.NO_USER });
    } else if (isUser.IsDeleted) {
      return res.status(400).json({ message: ERRORS.USER_ACCESS_REMOVED });
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser.Password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: ERRORS.INVALID_CREDENTIALS });
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: isUser._id,
      },
      secret
    );

    return res.status(200).json({
      message: `Welcome ${isUser.FirstName}`,
      token: token,
      user: isUser,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: ERRORS.INTERNAL_ERROR, error: e.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
};
