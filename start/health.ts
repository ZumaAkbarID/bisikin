import { HealthChecks, DiskSpaceCheck, MemoryHeapCheck } from '@adonisjs/core/health'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'
import { DbCheck, DbConnectionCountCheck } from '@adonisjs/lucid/database'
import { RedisCheck, RedisMemoryUsageCheck } from '@adonisjs/redis'

export const healthChecks = new HealthChecks().register([
  new DiskSpaceCheck(),
  new MemoryHeapCheck(),
  new DbCheck(db.connection()),
  new DbConnectionCountCheck(db.connection()),
  new RedisCheck(redis.connection()),
  new RedisMemoryUsageCheck(redis.connection()),
])
