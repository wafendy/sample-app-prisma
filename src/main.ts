import { db } from "./db";
import { logger } from "./utils/logger"

async function main() {  
  let message: string = 'Hello, World!';

  var rows = await db.teamsToUsers.findMany({
    where: {
      team: {
        id: {
          equals: 3,
        }
      }
    },
    select: {
      user: {
        select: {
          emailAddress: true
        }
      },
      team: {
        select: {
          name: true
        }
      },
      isAdmin: true
    },                  
  });

  logger.debug(rows);

  for(const row of rows) {
    logger.debug(`${row.user?.emailAddress} - ${row.team?.name} : ${row.isAdmin}`);
  }

  logger.info(message);
}

main()
  .catch(e => {
    console.error(e.message)
  })
  .finally(async() => {
    await db.$disconnect();
  })

  // 0: {
  //   "user": {
  //     "emailAddress": "hdb_user_003@hdb.gov.sg"
  //   },
  //   "team": {
  //     "name": "Team Rabbit"
  //   },
  //   "isAdmin": true
  // }
  // 1: {
  //   "user": {
  //     "emailAddress": "hdb_user_006@hdb.gov.sg"
  //   },
  //   "team": {
  //     "name": "Team Rabbit"
  //   },
  //   "isAdmin": false
  // }
  // 2: {
  //   "user": {
  //     "emailAddress": "hdb_user_009@hdb.gov.sg"
  //   },
  //   "team": {
  //     "name": "Team Rabbit"
  //   },
  //   "isAdmin": true
  // }


//   SELECT
//   "t1"."teamId",
//   "t1"."userId",
//   "TeamsToUsers_user"."__prisma_data__" AS "user",
//   "TeamsToUsers_team"."__prisma_data__" AS "team",
//   "t1"."isAdmin" 
// FROM
//   "public"."TeamsToUsers" AS "t1" 
// LEFT JOIN
//   "public"."Team" AS "j1" 
//       ON (
//           "j1"."id"
//       ) = (
//           "t1"."teamId"
//       ) 
// LEFT JOIN
//   LATERAL (SELECT
//       JSONB_BUILD_OBJECT('emailAddress',
//       "t2"."emailAddress") AS "__prisma_data__" 
//   FROM
//       "public"."User" AS "t2" 
//   WHERE
//       "t1"."userId" = "t2"."id" LIMIT $1) AS "TeamsToUsers_user" 
//       ON true 
// LEFT JOIN
//   LATERAL (SELECT
//       JSONB_BUILD_OBJECT('name',
//       "t3"."name") AS "__prisma_data__" 
//   FROM
//       "public"."Team" AS "t3" 
//   WHERE
//       "t1"."teamId" = "t3"."id" LIMIT $2) AS "TeamsToUsers_team" 
//       ON true 
// WHERE
//   (
//       "j1"."id" = $3
//       AND (
//           "j1"."id" IS NOT NULL
//       )
//   )