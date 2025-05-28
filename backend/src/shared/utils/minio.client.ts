import { Client } from 'minio';

const { S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY } = process.env;

const endpointUrl = new URL(S3_ENDPOINT || 'http://localhost:9000');

export const minioClient = new Client({
  endPoint: endpointUrl.hostname, // 'minio'
  port: +endpointUrl.port || 9000,
  useSSL: endpointUrl.protocol === 'https:',
  accessKey: S3_ACCESS_KEY!,
  secretKey: S3_SECRET_KEY!,
});

const BUCKET = 'songs';

(async () => {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET, 'us-east-1');
    console.log(`✅ Bucket "${BUCKET}" creado en MinIO`);
  }
})();