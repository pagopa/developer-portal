import { Metadata, ResolvedMetadata } from 'next';

export type MakeMetadataParams = {
  readonly parent?: ResolvedMetadata;
  readonly title?: string;
  readonly description?: string;
  readonly url?: string;
  readonly image?: string;
};

export type MakeMetadataFunction = (params: MakeMetadataParams) => Metadata;
