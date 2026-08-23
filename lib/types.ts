import { z } from 'zod';
import type { getWeather } from './ai/tools/get-weather';
import type { createDocument } from './ai/tools/create-document';
import type { updateDocument } from './ai/tools/update-document';
import type { requestSuggestions } from './ai/tools/request-suggestions';
import type { retrieveKnowledge } from './ai/tools/retrieve-knowledge';
import type { guideCopingSkill } from './ai/tools/guide-coping-skill';
import type { getCrisisResources } from './ai/tools/get-crisis-resources';
import type { logMoodCheckIn } from './ai/tools/log-mood-check-in';
import type { InferUITool, UIMessage } from 'ai';

import type { ArtifactKind } from '@/components/artifact';
import type { Suggestion } from './db/schema';

export type DataPart = { type: 'append-message'; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;
type retrieveKnowledgeTool = InferUITool<typeof retrieveKnowledge>;
type guideCopingSkillTool = InferUITool<typeof guideCopingSkill>;
type getCrisisResourcesTool = InferUITool<typeof getCrisisResources>;
type logMoodCheckInTool = InferUITool<ReturnType<typeof logMoodCheckIn>>;

export type ChatTools = {
  getWeather: weatherTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
  retrieveKnowledge: retrieveKnowledgeTool;
  guideCopingSkill: guideCopingSkillTool;
  getCrisisResources: getCrisisResourcesTool;
  logMoodCheckIn: logMoodCheckInTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
