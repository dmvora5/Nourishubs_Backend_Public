

export const TAMPLATES = {
  SIGNUPTEMPLATE: "SIGNUPTEMPLATE",
  LOGINWITHPASSWORD: "LOGINWITHPASSWORD",
  LOGIN: "LOGIN",
  RESENDOTP: "RESENDOTP",
  FORGETPASSWORD: "FORGETPASSWORD"
}


export const TAMPLATES_FUNCTIONS = {
  SIGNUPTEMPLATE:({ email, otp }) => {
    return `
       <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Success</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            .footer {
              font-size: 12px;
              color: #888;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>SignUp Successful</h1>
            <p>Hello ${email},</p>
            <p>We wanted to let you know that you have successfully signup on our platform. If this wasn't you, please contact our support team immediately.</p>
              <p>To complete your registrationathe following One-Time Password (OTP):</p>
            <p class="otp-code"><b>${otp}</b></p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <div class="footer">
                        <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                    </div>
          </div>
        </body>
        </html>
      `
  },
  LOGINWITHPASSWORD: ({ email, otp }) => {
    return `
        <!DOCTYPE html>
         <html lang="en">
         <head>
           <meta charset="UTF-8">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Login Success</title>
           <style>
             body {
               font-family: Arial, sans-serif;
               background-color: #f4f4f4;
               margin: 0;
               padding: 0;
             }
             .container {
               max-width: 600px;
               margin: 0 auto;
               background-color: #ffffff;
               padding: 20px;
               border-radius: 8px;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
             }
             h1 {
               color: #333;
             }
             p {
               font-size: 16px;
               color: #555;
             }
             .footer {
               font-size: 12px;
               color: #888;
               text-align: center;
               margin-top: 20px;
             }
           </style>
         </head>
         <body>
           <div class="container">
             <h1>Login Successful</h1>
             <p>Hello ${email},</p>
             <p>We wanted to let you know that you have successfully logged into your account on our platform. If this wasn't you, please contact our support team immediately.</p>
               <p>To complete your login, please use the following One-Time Password (OTP):</p>
             <p class="otp-code"><b>${otp}</b></p>
             <p>If you did not request this OTP, please ignore this email.</p>
             <div class="footer">
                         <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                     </div>
           </div>
         </body>
         </html>
       `
  },
  LOGIN: ({ email, otp }) => {
    return `
           <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login Success</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                p {
                  font-size: 16px;
                  color: #555;
                }
                .footer {
                  font-size: 12px;
                  color: #888;
                  text-align: center;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Login Successful</h1>
                <p>Hello ${email},</p>
                <p>We wanted to let you know that you have successfully logged into your account on our platform. If this wasn't you, please contact our support team immediately.</p>
                  <p>To complete your login, please use the following One-Time Password (OTP):</p>
                <p class="otp-code"><b>${otp}</b></p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <div class="footer">
                            <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                        </div>
              </div>
            </body>
            </html>
          `
  },
  RESENDOTP: ({ email, otp }) => {
    return `
            <!DOCTYPE html>
             <html lang="en">
             <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>Login Success</title>
               <style>
                 body {
                   font-family: Arial, sans-serif;
                   background-color: #f4f4f4;
                   margin: 0;
                   padding: 0;
                 }
                 .container {
                   max-width: 600px;
                   margin: 0 auto;
                   background-color: #ffffff;
                   padding: 20px;
                   border-radius: 8px;
                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                 }
                 h1 {
                   color: #333;
                 }
                 p {
                   font-size: 16px;
                   color: #555;
                 }
                 .footer {
                   font-size: 12px;
                   color: #888;
                   text-align: center;
                   margin-top: 20px;
                 }
               </style>
             </head>
             <body>
                 <div class="container">
        <div class="header">
          Resend OTP Code
        </div>
    
        <div class="content">
          <p>Hello ${email},</p>
          <p>We received a request to resend your One-Time Password (OTP) for logging in to your account.</p>
          <p>Please use the following OTP to complete the login process:</p>
          <div class="otp"><b>${otp}</b></div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
                 <div class="footer">
                             <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                         </div>
               </div>
             </body>
             </html>
           `
  },
  FORGETPASSWORD: ({ email, otp }) => {
    return `
           <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Login Success</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                p {
                  font-size: 16px;
                  color: #555;
                }
                .footer {
                  font-size: 12px;
                  color: #888;
                  text-align: center;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Forgot Password Request</h1>
                <p>Hello ${email},</p>
                <p>We have get request for forgot Password.</p>
                  <p>To Reset the password, please use the following One-Time Password (OTP):</p>
                <p class="otp-code"><b>${otp}</b></p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <div class="footer">
                            <p>&copy; 2024 Nourishubs. All rights reserved.</p>
                        </div>
              </div>
            </body>
            </html>
          `
  }
}