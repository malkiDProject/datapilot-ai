import getLLM from '../llm/langchainClient';
import { z } from 'zod';

const MappingItemSchema = z.object({
  targetField: z.string(),
  sourceColumn: z.string().nullable(),
  transformation: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

const MappingResponseSchema = z.object({
  mappings: z.array(MappingItemSchema),
});

export type MappingItem = z.infer<typeof MappingItemSchema>;
export type MappingResponse = z.infer<typeof MappingResponseSchema>;

function buildPrompt(sampleRows: Record<string, any>[], targetSchema: Record<string, string>, userInstruction?: string) {
  let prompt = `You are a helpful assistant that suggests mappings from a CSV's columns to a target schema.

Input:
Sample rows (first 5 rows): ${JSON.stringify(sampleRows, null, 2)}
Target schema (field: type): ${JSON.stringify(targetSchema, null, 2)}

Provide only the structured output that matches the required schema.`;

  if (userInstruction && userInstruction.trim().length > 0) {
    prompt += `\n\nAdditional user instruction: ${userInstruction.trim()}`;
  }

  return prompt;
}

export async function suggestMappings(
  sampleRows: Record<string, any>[],
  targetSchema: Record<string, string>,
  userInstruction?: string,
): Promise<MappingResponse> {
  const llm = getLLM();

  const prompt = buildPrompt(sampleRows, targetSchema, userInstruction);

  const structured = llm.withStructuredOutput(MappingResponseSchema, { name: 'MappingResponse', strict: true });
  const result = await structured.invoke(prompt);
  return result as MappingResponse;
}

export default {
  suggestMappings,
};
