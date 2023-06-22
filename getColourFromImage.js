const { createCanvas, loadImage } = require('canvas');

async function getAverageColor(imageUrl) {
	const image = await loadImage(imageUrl);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	let totalR = 0, totalG = 0, totalB = 0;
	const pixelCount = data.length / 4;

	for (let i = 0; i < data.length; i += 4) {
		totalR += data[i];
		totalG += data[i + 1];
		totalB += data[i + 2];
	}

	const averageR = Math.round(totalR / pixelCount);
	const averageG = Math.round(totalG / pixelCount);
	const averageB = Math.round(totalB / pixelCount);

	const averageColor = rgbToDecimal(averageR, averageG, averageB);
	return averageColor;
}

function rgbToHex(r, g, b) {
	const componentToHex = (c) => {
		const hex = c.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	const redHex = componentToHex(r);
	const greenHex = componentToHex(g);
	const blueHex = componentToHex(b);

	return `0x${redHex}${greenHex}${blueHex}`;
}

function rgbToDecimal(r, g, b) {
	const decimalValue = (r * 65536) + (g * 256) + b;
	return decimalValue;
}

module.exports = getAverageColor;