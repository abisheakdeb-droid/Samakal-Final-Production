import sharp from 'sharp';

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const TARGET_SIZE_MB = 1;
const TARGET_SIZE_BYTES = TARGET_SIZE_MB * 1024 * 1024;

export async function optimizeImage(buffer: Buffer): Promise<{ buffer: Buffer; format: string; width: number; height: number }> {
    let pipeline = sharp(buffer);
    const metadata = await pipeline.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error('Could not read image metadata');
    }

    // 1. Resize if needed
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
        pipeline = pipeline.resize({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            fit: 'inside',
            withoutEnlargement: true
        });
    }

    // 2. Convert to WebP and try to meet size limit
    let quality = 85;
    let outputBuffer = await pipeline
        .webp({ quality })
        .toBuffer();

    // 3. Iteratively reduce quality if still too large
    while (outputBuffer.length > TARGET_SIZE_BYTES && quality > 20) {
        quality -= 10;
        outputBuffer = await sharp(buffer)
            .resize({
                width: MAX_WIDTH,
                height: MAX_HEIGHT,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality })
            .toBuffer();
    }

    const finalMetadata = await sharp(outputBuffer).metadata();

    return {
        buffer: outputBuffer,
        format: 'webp',
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0
    };
}
