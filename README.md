# Notifications service

This app is a service responsible for creating and mananging notifications. It was developed during the [Rocketseat](https://github.com/Rocketseat) *Ignite Lab | Node.js* course.

### Stack used in this project:
- NestJS
- TypeScript
- Prisma

### Other tools:
- Eslint
- Prittier
- Jest: unit tests
- SOLID: Single Responsibility Principle; Dependency Inversion Principle;
- Factory pattern
- DDD

## Features ✨
- ✅ [Create a notification](#create-a-notification)
- ✅ [Read a notification](#read-unread-or-cancel-a-notification)
- ✅ [Unread a notification](#read-unread-or-cancel-a-notification)
- ✅ [Cancel a notification](#read-unread-or-cancel-a-notification)
- ✅ [Count the amount of notifications](#count-notifications-by-recipient)
- ✅ [Get the notifications](#get-notifications-by-recipient)
- 🙅🏽‍♂️ (WIP) Communicate with a async messaging platform

## What you need to run this project

- Node.js

## Set up

### 1. Install the dependencies
```bash
# If you use yarn
yarn install

# If you use npm
npm install
```

### 2. Set up prisma

```
npx prisma init --datasource-provider sqlite
```

The `init` command creates a `prisma` directory with your schema file and configures SQLite as your database. Inside `./prisma/schema.prisma`, append the `Notification` model below.

```prisma
model Notification {
  id          String    @id
  recipientId String
  content     String
  category    String
  readAt      DateTime?
  canceledAt  DateTime?
  createdAt   DateTime  @default(now())

  @@index([recipientId])
}
```

### Create your database

Run the `migrate` command to create your database and the `Notification` table.

```bash
npx prisma migrate dev --name init
```

### Explore your database

Run this command to open a browser UI and explore your database.

```
npx prisma studio
```

## Run the app
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn test

# unit tests in watch mode
$ yarn test:watch
```
## Create a notification
To create a notification, the client needs to send a *Post*
request with the `recipientId`, `content` and `category` described by the `CreateNotificationBody` DTO class

```ts
export class CreateNotificationBody {
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;

  @IsNotEmpty()
  @Length(5, 240)
  content: string;

  @IsNotEmpty()
  category: string;
}
```

to the `/notifications` API.

```ts
@Controller('notifications')
export class Notifications {
  constructor(
    private sendNotification: SendNotification,
  ) {}

  @Post()
  async create(@Body() body: CreateNotificationBody) {
    const { recipientId, content, category } = body;

    const { notification } = await this.sendNotification.execute({
      recipientId,
      category,
      content,
    });

    return {
      notification: NotificationViewModel.toHttp(notification),
    };
  }
}
```

<sup>The `recipientId` refers to the destination of the notification. It could be  the *userId*.</sup>

## Read, unread or cancel a notification
To *read*, *unread* and *cancel* notifications, the requests are pretty similar. You have to send the `id` of the notification in a *Patch* request to `/notifications/:id/<operation>`. Replace `<operation>` by the operation that you want to choose.

```ts
@Controller('notifications')
export class Notifications {
  constructor(
    private cancelNotification: CancelNotification,
    private readNotification: ReadNotification,
    private unreadNotification: UnreadNotification,
  ) {}

  @Patch(':id/read')
  async read(@Param('id') id: string) {
    await this.readNotification.execute({
      notificationId: id,
    });
  }

  @Patch(':id/unread')
  async unread(@Param('id') id: string) {
    await this.unreadNotification.execute({
      notificationId: id,
    });
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    await this.cancelNotification.execute({
      notificationId: id,
    });
  }
}
```
## Count notifications by recipient
To count how many notifications were created for a *recipient*, you have to send
the `recipientId` in a *Get* request to `/notifications/count/from/:recipientId`.

```ts
@Controller('notifications')
export class Notifications {
  constructor(
    private countRecipientNotifications: CountRecipientNotifications,
  ) {}

  @Get('count/from/:recipientId')
  async countFromRecipient(@Param('recipientId') recipientId: string) {
    const { count } = await this.countRecipientNotifications.execute({
      recipientId,
    });

    return {
      count,
    };
  }
}
```

## Get notifications by recipient
To get all notifications that were created for a *recipient*, you have to send
the `recipientId` in a *Get* request to `/notifications/from/:recipientId`.

```ts
@Controller('notifications')
export class Notifications {
  constructor(
    private getRecipientNotifications: GetRecipientNotifications,
  ) {}

  @Get('from/:recipientId')
  async getFromRecipient(@Param('recipientId') recipientId: string) {
    const { notifications } = await this.getRecipientNotifications.execute({
      recipientId,
    });

    return {
      notifications: notifications.map(NotificationViewModel.toHttp),
    };
  }
}
```

[Back to the top](#notifications-service)