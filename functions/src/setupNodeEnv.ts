import { config as setupDotEnv } from 'dotenv'

export function mergeDotEnvToNodeEnv() {
  setupDotEnv()
}

export function mergeFirebaseConfigToNodeEnv(config: any) {
  Object.keys(config).forEach(key => {
    if (!(key in process.env)) {
      process.env[key] = config[key]
    }
  })
}
