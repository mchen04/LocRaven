/**
 * Gets an environment variable value with enhanced error handling and Workers compatibility
 * @param varValue The environment variable value from process.env
 * @param varName The name of the environment variable for error reporting
 * @returns The environment variable value
 * @throws ReferenceError if the variable is undefined
 */
export function getEnvVar(varValue: string | undefined, varName: string): string {
  if (varValue === undefined) {
    throw new ReferenceError(`Reference to undefined env var: ${varName}. Check Cloudflare Workers environment configuration.`);
  }
  return varValue;
}

/**
 * Alternative environment variable getter that handles both Node.js and Workers environments
 */
export function getEnvVarCompat(varName: string): string {
  // Method 1: Standard process.env (Node.js)
  let value = process.env[varName];
  
  if (value !== undefined) {
    return value;
  }

  // Method 2: Check if we're in a Cloudflare Workers environment
  try {
    const globalEnv = (globalThis as any)?.env;
    if (globalEnv && globalEnv[varName] !== undefined) {
      return globalEnv[varName];
    }
  } catch (error) {
    // Silent fallback
  }

  throw new ReferenceError(`Environment variable ${varName} not found. Check Cloudflare Workers environment configuration.`);
}
