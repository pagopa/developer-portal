export default ({ env }: any) => ({
  upload: {
    config: {
      provider: env('UPLOAD_PLUGIN_PROVIDER', 'aws-s3'),
      providerOptions: {
        baseUrl: env('CDN_URL'),
        s3Options: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_ACCESS_SECRET'),
          endpoint: env('AWS_BUCKET_ENDPOINT'),
          params: {
            ACL: 'private',
            signedUrlExpires: 15 * 60,
            Bucket: env('AWS_BUCKET_NAME'),
          },
        }
      },
    },
  },
  'update-static-content': {
    enabled: true,
    config: {
      githubToken: env('USC_GITHUB_PAT'),
      owner: env('USC_REPO_OWNER', 'pagopa'),
      repo: env('USC_REPO_NAME', 'developer-portal'),
      workflowId: env('USC_WORKFLOW_ID', 'deploy_website.yaml'),
      branch: env('USC_TARGET_BRANCH', 'main'),
    },
  },
});
