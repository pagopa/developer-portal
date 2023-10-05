# How To: Update the documents from GitBook

1. Open the file `/apps/nextjs-website/package.json`
2. Update the commit id (in this example the value `6f8fe27`) used by the `download-docs` script with the new commit id to use:
```typescript
{
  "name": "nextjs-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    // replace this value --------------------vvvvvvv 
    "download-docs": "./scripts/fetch-docs.sh 6f8fe27",
    // ... other stuff
  },
  
  // ... other stuff 
}
```
