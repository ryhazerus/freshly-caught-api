const sharp = require('sharp');

async function resizeImage(data) {
  const uri = data.split(';base64,').pop();
  const imgBuffer = Buffer.from(uri, 'base64');

  return await sharp(imgBuffer)
    .resize(150, 150)
    .jpeg({ mozjpeg: true })
    .toBuffer();
}

module.exports = resizeImage;
