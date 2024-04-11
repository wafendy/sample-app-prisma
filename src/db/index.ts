import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger';

export const db = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

db.$on("query", async (e) => {
  logger.debug(`${e.query} ${e.params}`)
});