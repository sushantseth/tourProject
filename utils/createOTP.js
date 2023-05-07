exports.generateOTP = () => {
    // Generate a random 6 digit number
    const otp =  Math.floor(100000 + Math.random() * 900000);
    const now = new Date(); // get the current date and time
    const expiresIn = new Date(now.getTime() + 10 * 60000); // add 10 minutes (10 * 60000 milliseconds)
     return {
        otp : otp,
        expiresIn : expiresIn
     }
  }