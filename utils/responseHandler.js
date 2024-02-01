function isSuccess(statusCode) {
  const errorStatusCodes = [400, 401, 404, 403, 500, 469];
  return errorStatusCodes.every((status) => status !== statusCode);
}

function sendResponse(res, statusCode, payload, message) {
  return res.status(statusCode).json({
    success: isSuccess(statusCode) ? true : false,
    statusCode,
    payload,
    message: message,
  });
}

function serviceResponse(statusCode, payload, message) {
  return { statusCode, payload, message };
}
module.exports = { isSuccess, sendResponse, serviceResponse };
