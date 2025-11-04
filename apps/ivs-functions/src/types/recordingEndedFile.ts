export type RecordingEndedFile = {
  readonly recording_started_at: string;
  readonly recording_ended_at: string;
  readonly media: {
    readonly hls: {
      readonly path: string;
      readonly playlist: string;
    };
  };
};
