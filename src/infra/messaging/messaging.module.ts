import { Module } from '@nestjs/common';
import { NotificationsController } from './kafka/controllers/notifications.controller';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [KafkaConsumerService],
})
export class MessagingModule {}
