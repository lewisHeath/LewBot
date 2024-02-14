
async function getAverageColor(imageUrl) {
	const averageColor = rgbToDecimal(0,0,0);
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
