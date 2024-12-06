const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const getAllData = require("../services/getAllData");
const path = require('path');

const pathKey = path.resolve(__dirname, '../../submissionmlgc-farhan-443616-d76100e733b6.json');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  
  const { label, suggestion } = await predictClassification(model, image);
  
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

async function predictHistories(request, h) {
  try {

    const allData = await getAllData();

    const result = allData.map(doc => ({
      id: doc.id,
      history: {
        result: doc.data.result,
        createdAt: doc.data.createdAt,
        suggestion: doc.data.suggestion,
        id: doc.data.id,
      }
    }));

    return h.response({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error('Error fetching prediction histories:', error);
    return h.response({
      status: "fail",
      message: "Failed to fetch prediction histories",
    }).code(500);
  }
}

module.exports = { postPredictHandler, predictHistories };