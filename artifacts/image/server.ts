import { createDocumentHandler } from '@/lib/artifacts/server';

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async () => {
    return 'Image generation is disabled. Steady uses open-weight text models only.';
  },
  onUpdateDocument: async () => {
    return 'Image generation is disabled. Steady uses open-weight text models only.';
  },
});
