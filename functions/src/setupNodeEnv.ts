import { config as functionConfig } from 'firebase-functions'
import { config as setupDotEnv } from 'dotenv'

export function mergeDotEnvToNodeEnv() {
  setupDotEnv()
}

export function mergeFirebaseConfigToNodeEnv(config: functionConfig.Config) {
  Object.keys(config).forEach((key) => {
    if (!(key in process.env)) {
      process.env[key] = config[key]
    }
  })
}
