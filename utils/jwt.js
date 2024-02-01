const jwt = require("jsonwebtoken");
const { sendResponse } = require("./responseHandler");

const SECRET_KEY = process.env.JWT_SECRET_KEY || "sonidenakhresonelagde";
const verifyToken = (req, res, next) => {
  try {
    const { headers } = req;
    console.log(headers);

    if (!headers || !headers.authorization) {
      return sendResponse(res, 401, {
        status: false,
        data: {
          message: "Token is required for authentication.",
        },
      });
    }

    const token = headers.authorization.split(" ")[1];

    try {
      const result = jwt.verify(token, SECRET_KEY);

      req.userId = result.userId;
      next();
    } catch (err) {
      return sendResponse(res, 401, {
        status: false,
        data: {
          message: "Invalid token",
        },
      });
    }
  } catch (err) {
    return sendResponse(res, 401, {
      status: false,
      data: {
        message: "Unauthorized user",
      },
    });
  }
};

const generateToken = (tokenPayload) => {
  if (!tokenPayload) {
    console.log("Something went wrong");
    return;
  }

  const token = jwt.sign(tokenPayload, SECRET_KEY, {
    expiresIn: "20d",
  });

  return token;
};

module.exports = { verifyToken, generateToken };
