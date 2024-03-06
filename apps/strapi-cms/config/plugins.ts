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
      githubToken: env('GITHUB_PERSONAL_ACCESS_TOKEN'),
      owner: env('REPO_OWNER', 'pagopa'),
      repo: env('REPO_NAME', 'developer-portal'),
      workflowId: env('DEPLOY_WEBSITE_WORKFLOW_ID', 'deploy_website.yaml'),
      branch: env('DEPLOY_WEBSITE_TARGET_BRANCH', 'main'),
    },
  },
});
