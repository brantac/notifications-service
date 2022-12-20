import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KafkaConsumerService],
})
export class MessagingModule {}
