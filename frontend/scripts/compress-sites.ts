import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SITES_DIR = path.resolve(__dirname, '..', 'public', 'sites');

async function compressPng(filePath: string): Promise<void> {
	const original = await fs.promises.readFile(filePath);
	// Use lossless palette reduction and moderate compression level
	const optimized = await sharp(original)
		.png({ compressionLevel: 9, palette: true, quality: 80 })
		.toBuffer();

	if (optimized.length < original.length) {
		await fs.promises.writeFile(filePath, optimized);
		process.stdout.write(`Optimized: ${filePath} (${original.length} -> ${optimized.length} bytes)\n`);
	} else {
		process.stdout.write(`Skipped (no gain): ${filePath}\n`);
	}
}

async function walkAndCompress(dir: string): Promise<void> {
	const entries = await fs.promises.readdir(dir, { withFileTypes: true });
	await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				await walkAndCompress(fullPath);
				return;
			}
			const lower = entry.name.toLowerCase();
			if (lower.endsWith('.png')) {
				try {
					await compressPng(fullPath);
				} catch (err) {
					process.stderr.write(`Error optimizing ${fullPath}: ${(err as Error).message}\n`);
				}
			}
		})
	);
}

(async () => {
	try {
		process.stdout.write(`Scanning: ${SITES_DIR}\n`);
		await walkAndCompress(SITES_DIR);
		process.stdout.write('Done.\n');
	} catch (err) {
		process.stderr.write(`Failed: ${(err as Error).stack}\n`);
		process.exit(1);
	}
})();

