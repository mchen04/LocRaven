/**
 * Gets an environment variable value with enhanced error handling and Workers compatibility
 * @param varValue The environment variable value from process.env
 * @param varName The name of the environment variable for error reporting
 * @returns The environment variable value
 * @throws ReferenceError if the variable is undefined
 */
export function getEnvVar(varValue: string | undefined, varName: string): string {
  console.log(`[getEnvVar] Accessing ${varName}:`, {
    isDefined: varValue !== undefined,
    length: varValue?.length || 0,
    prefix: varValue?.substring(0, 7) || 'undefined'
  });

  if (varValue === undefined) {
    console.error(`[getEnvVar] Environment variable ${varName} is undefined`);
    console.error(`[getEnvVar] Available env keys:`, Object.keys(process.env).filter(key => 
      key.startsWith('NEXT_PUBLIC_') || 
      key.startsWith('STRIPE_') || 
      key.startsWith('SUPABASE_')
    ));
    
    throw new ReferenceError(`Reference to undefined env var: ${varName}. Check Cloudflare Workers environment configuration.`);
  }
  
  return varValue;
}

/**
 * Alternative environment variable getter that handles both Node.js and Workers environments
 * This function attempts multiple methods to access environment variables
 */
export function getEnvVarCompat(varName: string): string {
  console.log(`[getEnvVarCompat] Attempting to get ${varName} with compatibility mode`);
  
  // Method 1: Standard process.env (Node.js)
  let value = process.env[varName];
  
  if (value !== undefined) {
    console.log(`[getEnvVarCompat] Found ${varName} via process.env`);
    return value;
  }

  // Method 2: Check if we're in a Cloudflare Workers environment
  // In Workers, environment variables might be accessible through different means
  try {
    // Workers might pass env through globalThis or other mechanisms
    const globalEnv = (globalThis as any)?.env;
    if (globalEnv && globalEnv[varName] !== undefined) {
      console.log(`[getEnvVarCompat] Found ${varName} via globalThis.env`);
      return globalEnv[varName];
    }
  } catch (error) {
    console.log(`[getEnvVarCompat] globalThis.env access failed:`, error);
  }

  // Method 3: Log diagnostic information
  console.error(`[getEnvVarCompat] Failed to find ${varName} in any environment source`);
  console.error(`[getEnvVarCompat] Runtime info:`, {
    hasProcess: typeof process !== 'undefined',
    hasProcessEnv: typeof process?.env !== 'undefined',
    processEnvKeys: typeof process?.env === 'object' ? Object.keys(process.env).length : 'N/A',
    hasGlobalThis: typeof globalThis !== 'undefined',
    hasGlobalEnv: typeof (globalThis as any)?.env !== 'undefined',
    isEdgeRuntime: typeof EdgeRuntime !== 'undefined'
  });

  throw new ReferenceError(`Environment variable ${varName} not found. Check Cloudflare Workers environment configuration.`);
}
