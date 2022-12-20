import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ServerKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService
  extends ServerKafka
  implements OnModuleDestroy
{
  constructor() {
    super({
      client: {
        clientId: 'notifications',
        brokers: ['ideal-troll-12921-us1-kafka.upstash.io:9092'],
        sasl: {
          mechanism: 'scram-sha-256',
          username:
            'aWRlYWwtdHJvbGwtMTI5MjEkgB4l1GAP7JlkuQEpCdCjnU3T1vY3i87U96Q-rxc',
          password:
            'Xm7xxEAjwAtqVqvTqE8EOZDboW8GpZ53wZiNUgJnnzMogE-WsEhwDkCxfGNbr6iYehkaEw==',
        },
        ssl: true,
      },
    });
  }

  async onModuleDestroy() {
    await this.close();
  }
}
