#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { createCanvas } = require("canvas");
const fs = require("fs");
const colors = require("colors").default;
const fetch = require("node-fetch");
const argv = yargs(hideBin(process.argv))
	.option("n", {
		alias: "numlogos",
		describe: "Number of logos to generate",
		type: "number",
	})
	.option("w", {
		alias: "width",
		describe: "Width of the canvas",
		type: "number",
	})
	.option("h", {
		alias: "height",
		describe: "Height of the canvas",
		type: "number",
	})
	.option("s", {
		alias: "shape",
		describe: "Shape of the logo",
		type: "string",
	})
	.option("b", {
		alias: "border",
		describe: "Border width",
		type: "number",
	})
	.option("t", {
		alias: "text",
		describe: "Text to display on the logo",
		type: "string",
	})
	.option("f", {
		alias: "format",
		describe: "Format of the logo (png/svg/jpg/gif)",
		type: "string",
	})
	.option("c", {
		alias: "color",
		describe: "Color of the logo shape (hex)",
		type: "string",
	})
	.version()
	.alias("v", "version")
	.help().argv; // Automatically generates help text

let randomWords;

const loadDependencies = async () => {
	randomWords = await import("random-words");
};

const randomSystemFont = () => {
	const fonts = fs.readdirSync("/System/Library/Fonts");
	return fonts[Math.floor(Math.random() * fonts.length)];
};

const randomFontSize = (min = 40, max = 60) => {
	return Math.floor(Math.random() * (max - min + 1) + min) + "px";
};

const randomFont = async () => {
	const fonts = await Promise.all([randomSystemFont()]);
	return fonts[Math.floor(Math.random() * fonts.length)];
};

const transparentBg = (canvas) => {
	const ctx = canvas.getContext("2d");
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;
	for (let i = 0; i < data.length; i += 4) {
		if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
			data[i + 3] = 0;
		}
	}
	ctx.putImageData(imageData, 0, 0);
};

const generateRandomLogo = async ({ width, height, text, shape, border, format, color }) => {
	const canvas = format === "svg" ? createCanvas(width, height, "svg") : createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// make colors
	const canvasColor = "#fff";
	const shapeColor = color.startsWith("#") ? color : `#${color}`;
	const borderColor = `#${Math.floor(parseInt(shapeColor.substring(1), 16) * 0.85)
		.toString(16)
		.padStart(6, "0")}`;
	const textColor = canvasColor;

	// Draw background
	ctx.fillStyle = canvasColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Determine shape type
	if (width === height) {
		shape = shape || (Math.random() > 0.5 ? "circle" : "square");
	} else {
		shape = "rectangle";
	}

	// Draw shape
	ctx.fillStyle = shapeColor;
	switch (shape) {
		case "rectangle":
			ctx.fillRect(10, 10, width - 20, height - 20);
			// if border, draw border rectangle
			if (border) {
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = border;
				ctx.strokeRect(1, 1, width - 2, height - 2);
			}
			break;
		case "circle":
			ctx.beginPath();
			// cricle radius is half if the smaller of the width or height
			const radius = Math.min(width, height) / 2 - 10;
			ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
			ctx.fill();
			// if border, then draw border circle
			if (border) {
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = border;
				ctx.stroke();
			}
			break;
		default:
			// Defaults to square
			ctx.fillRect(10, 10, width - 20, height - 20);
			// if border, draw border square
			if (border) {
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = border;
				ctx.strokeRect(1, 1, width - 2, height - 2);
			}
			break;
	}

	// Draw text if specified.  position in the center of the canvas
	if (text) {
		ctx.font = `${randomFontSize()} ${await randomFont()}`;
		ctx.fillStyle = textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, width / 2, height / 2);
	}

	// Save canvas to desired format.
	// if format allows, convert to transparent background
	// if (format === "png" || format === "svg") {
	// 	transparentBg(canvas);
	// }
	const buffer = canvas.toBuffer(`image/${format}`);
	const filename = new Date().toISOString().replace(/:/g, "-");
	fs.writeFileSync(`./output/logo-${filename}.${format}`, buffer);
	console.log("Generated logo".cyan, `logo-${filename}.${format}`.green);
};

(async () => {
	await loadDependencies();

	const numLogos = argv.n || 1;
	const width = argv.w || 200;
	const height = argv.h || 200;
	const shape = argv.s || "circle";
	const border = argv.b || 0;
	const text = argv.t || randomWords.generate();
	const format = argv.f || "png";
	const color = argv.c || `#${Math.floor(Math.random() * 16777215).toString(16)}`;

	if (!["png", "jpg", "jpeg", "gif", "svg"].includes(format))
		throw new Error("Invalid format specified. Must be one of png, jpg, jpeg, gif, or svg.");

	for (let i = 0; i < numLogos; i++) {
		await generateRandomLogo({ width, height, text, shape, border, format, color });
	}
})().catch(console.error);
