export function makeSlackMessage(text: string, err: any): object {
  return {
    attachments: [
      {
        color: 'danger',
        text: text,
        fields: [
          {
            title: `Error Message: ${err.message}`,
            value: err.stack || JSON.stringify(err),
            short: false,
          },
        ],
        ts: Math.floor(new Date().getTime() / 1000).toString(),
      },
    ],
  };
}
