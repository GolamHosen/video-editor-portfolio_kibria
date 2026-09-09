import { v2 as cloudinary } from "cloudinary";

const getCloudName = () => process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

cloudinary.config({
  cloud_name: getCloudName(),
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: string;
    crop?: string;
  } = {}
) {
  const { width, height, quality = "auto", format = "auto", crop = "fill" } = options;
  
  const transforms: string[] = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${getCloudName()}/image/upload/${transforms.join(",")}/${publicId}`;
}

export function getCloudinaryVideoUrl(
  publicId: string,
  options: {
    width?: number;
    quality?: number | "auto";
    format?: string;
  } = {}
) {
  const { width, quality = "auto", format = "auto" } = options;
  const transforms: string[] = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);

  return `https://res.cloudinary.com/${getCloudName()}/video/upload/${transforms.join(",")}/${publicId}`;
}

export async function generateUploadSignature(
  folder: string = "portfolio"
): Promise<{ signature: string; timestamp: number; cloudName: string; apiKey: string }> {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );
  return {
    signature,
    timestamp,
    cloudName: getCloudName(),
    apiKey: process.env.CLOUDINARY_API_KEY!,
  };
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}
