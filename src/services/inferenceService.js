const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .div(tf.scalar(255));

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    console.log("Score Array:", score);

    const confidenceIndex = score.indexOf(Math.max(...score));
    
    const labels = ['Cancer', 'Non-cancer'];
    const label = labels[confidenceIndex];
    console.log("Predicted Label:", label);

    const confidenceScore = Math.max(...score) * 100;
    console.log("Confidence Score:", confidenceScore);

    let suggestion;
    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;
