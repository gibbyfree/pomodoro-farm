import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } from '$env/static/private'

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export async function saveToS3(data: any, key: string): Promise<any> {
    const uploadCommand = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: data,
        ACL: "public-read",
    });
    try {
        const response = await s3.send(uploadCommand);
        return response;
    }
    catch (error) {
        return error;
    }
};