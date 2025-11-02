import { defineConfig, store, drivers } from '@adonisjs/cache'

const cacheConfig = defineConfig({
  default: 'redis',

  stores: {
    memoryOnly: store().useL1Layer(drivers.memory()),

    default: store()
      .useL1Layer(drivers.memory())

      .useL2Layer(
        drivers.redis({
          connectionName: 'main',
          prefix: 'ngl_cache:',
        })
      ),

    redis: store()
      .useL1Layer(drivers.memory({ maxSize: '100mb', prefix: 'ngl_cache:' }))
      .useL2Layer(drivers.redis({ connectionName: 'main', prefix: 'ngl_cache:' }))
      .useBus(drivers.redisBus({ connectionName: 'main' })),
  },
})

export default cacheConfig

declare module '@adonisjs/cache/types' {
  interface CacheStores extends InferStores<typeof cacheConfig> {}
}
