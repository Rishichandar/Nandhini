require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../node-mysql-server/db-con");
const nodemailer = require("nodemailer");
const { GenericResponse, ResponseStatus } = require("../../../GenericResponse");
const ErrorMessage = require("../../../ErrorMessage");

router.use(express.json());

router.get("/user/fetch", (req, res) => {
  const sql = "SELECT * FROM appuser";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err.message });
    return res.json(data);
  });
});

router.get("/singleData", (req, res) => {
  const userEmail = req.query.email;
  const sql = "SELECT * FROM time_table WHERE Userid=?";
  db.query(sql, userEmail, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    return res
      .status(200)
      .json(new GenericResponse(ResponseStatus.Success, null, data));
  });
});

router.post("/user/forgot", (req, res) => {
  const sql = "SELECT * FROM appuser WHERE Email=?";
  const user = req.body.Email;
  db.query(sql, user, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    const token = jwt.sign(data[0], process.env.JWT_SecretKey, {
      expiresIn: "1h", //one hour
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_API_PASSWORD,
      },
      Timeout: 20000,
    });

    // const mailOptions = {
    //   from: process.env.EMAIL_USERNAME, // Should be your email
    //   to: data[0].Email, // Assuming data[0].Email contains the user's email
    //   subject: "Reset your password",
    //   text: `http://localhost:3000/reset/?token=${token}`, // Assuming data[0].id exists

    // };

    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Should be your email
      to: data[0].Email, // The recipient's email address
      subject: "Reset your password",
      text: `You requested a password reset. Please use the link below to set a new password. This link is only valid for the next hour.\n\nReset your password: ${process.env.FORGET_PASSWORD_LINK}${token}\n\nPlease do not reply to this email as it is an automated response.`,
      html: `
          <p>You requested a password reset. Please use the link below to set a new password. This link is only valid for the next hour.</p>
          <p><a href="${process.env.FORGET_PASSWORD_LINK}${token}">Reset your password</a></p>
          <p><strong>Please do not reply to this email as it is an automated response.</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.FailedMail,
              null
            )
          );
      } else {
        console.log("Email sent successfully: " + info.response);
        return res
          .status(200)
          .json(
            new GenericResponse(
              ResponseStatus.Success,
              null,
              "Email sent successfully: " + info.response
            )
          );
      }
    });
  });
});

// ! REGISTER DATA WITH HASHED PASSWORD
router.post("/user/create", (req, res) => {
  const sql = "INSERT INTO appuser (Email, Password, RoleId) VALUES (?, ?, ?)";
  const { Email, RoleId } = req.body;
  const salt = 10;
  bcrypt.hash(req.body.Password.toString(), salt, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.HashError,
            null
          )
        );
    }

    // Construct the values array correctly to match the SQL placeholders.
    const values = [Email, hash, RoleId];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Database error:", err);
        // Handle duplicate entry error for emails
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(409)
            .json(
              new GenericResponse(
                ResponseStatus.Failure,
                ErrorMessage.DuplicateEmail,
                null
              )
            );
        }
        return res
          .status(401)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.SyntaxError,
              null
            )
          );
      }
      return res
        .status(200)
        .json(
          new GenericResponse(ResponseStatus.Success, null, "register success")
        );
    });
  });
});

// !    LOGINUSER
router.post("/user/login", (req, res) => {
  const sql = "SELECT * FROM appuser WHERE Email=?";
  const user = req.body.Email;
  db.query(sql, user, (err, data) => {
    if (err) {
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.SyntaxError,
            null
          )
        );
    }
    if (data.length > 0) {
      bcrypt.compare(
        req.body.Password.toString(),
        data[0].Password,
        (err, response) => {
          // Password Comparison Error
          if (err)
            return res
              .status(401)
              .json(
                new GenericResponse(
                  ResponseStatus.Failure,
                  ErrorMessage.MissMatch,
                  null
                )
              );
          if (response) {
            //  password comparison succeeds
            // JWT token is generated it contains (user data and secret key)
            const token = jwt.sign(data[0], process.env.JWT_SecretKey, {
              expiresIn: "6h",
            });
            // returned to the client it contains the token
            return res.status(200).json(
              new GenericResponse(ResponseStatus.Success, null, {
                Token: token,
              })
            );
          } else {
            // Password Mismatch
            return res
              .status(401)
              .json(
                new GenericResponse(
                  ResponseStatus.Failure,
                  ErrorMessage.Error,
                  null
                )
              );
          }
        }
      );
    } else {
      // User Existence Check
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.NoEmailExist,
            null
          )
        );
    }
  });
});

// !  AUTHENTICATING THE JWT TOKEN
router.get("/user/auth", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SecretKey);
      // If verification is successful, decoded will contain the payload of the token
      return res
        .status(200)
        .json(
          new GenericResponse(ResponseStatus.Success, null, { ...decoded })
        );
    } catch (error) {
      // If verification fails, jwt.verify() will throw an error
      return res
        .status(401)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.InvlidToken,
            null
          )
        );
    }
  } else {
    return res
      .status(401)
      .json(
        new GenericResponse(ResponseStatus.Failure, ErrorMessage.NoToken, null)
      );
  }
});

// !  UPDATE THE PASS

router.put("/user/reset", (req, res) => {
  // Assuming req.body contains 'Email' and 'NewPassword'
  const { Email, Password, ConfirmPassword } = req.body;

  // First, hash the new password
  const salt = 10;
  bcrypt.hash(Password.toString(), salt, (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json(
          new GenericResponse(
            ResponseStatus.Failure,
            ErrorMessage.HashError,
            null
          )
        );
    }

    // Then, update the password in the database
    const sql = `UPDATE appuser SET Password = ?,IsFirstLogin=0 WHERE Email = ?`;
    db.query(sql, [hashedPassword, Email], (err, data) => {
      if (err) {
        return res
          .status(401)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.MissMatch,
              null
            )
          );
      }

      if (data.affectedRows > 0) {
        // If the update was successful
        return res.status(200).json(
          new GenericResponse(ResponseStatus.Success, null, {
            message: "Password reset successfully",
          })
        );
      } else {
        return res
          .status(404)
          .json(
            new GenericResponse(
              ResponseStatus.Failure,
              ErrorMessage.UserNotFound,
              null
            )
          );
      }
    });
  });
});

module.exports = router;
