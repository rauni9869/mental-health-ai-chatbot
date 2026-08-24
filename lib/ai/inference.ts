export function chooseInferenceBackend(
  env: NodeJS.Dict<string> = process.env,
) {
  if (env.USE_OLLAMA === '1') {
    return 'ollama' as const;
  }

  if (env.GROQ_API_KEY?.trim()) {
    return 'groq' as const;
  }

  return 'ollama' as const;
}
