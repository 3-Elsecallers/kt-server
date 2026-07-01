import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../db/prisma";

const { NODE_ENV, KAFKA_CLIENT_ID, KAFKA_GROUP_ID, KAFKA_BROKERS, KAFKA_CREATE_TAB_TOPIC } = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS!.split(","),
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID! });

const initConsumer = async () => {
  try {
    await createTopicsIfNeeded([KAFKA_CREATE_TAB_TOPIC!]);

    await consumer.connect();
    await consumer.subscribe({
      topics: [KAFKA_CREATE_TAB_TOPIC!],
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());
        console.log(
          `Received message from Kafka topic ${topic}: ${JSON.stringify(event)}`,
        );

        if (topic === "create-tab") {
          const { tabId, userId, venueId, paymentMethodId, preAuthAmount } =
            event;

          const existingTab = await prisma.tab.findUnique({ where: { userId } });

          if (!existingTab) {
            await prisma.tab.create({
              data: {
                id: tabId,
                userId,
                venueId,
                paymentMethodId,
                preAuthAmount: preAuthAmount / 100, // converting from pesewas
              },
            });
          }

          // TODO: Call function to create tab in POS system and update tab in database with the posTabReference id returned
        }
      },
    });
    console.log("Kafka tab management consumer connected");
    // TODO: Lots more events to be added
  } catch (error) {
    console.log("Error connecting Kafka consumer:", error);
    setTimeout(initConsumer, 5000);
  }
};

async function createTopicsIfNeeded(topicNames: string[]) {
  if (NODE_ENV === "production") return;

  const admin = kafka.admin();
  await admin.connect();

  try {
    const topics = await admin.listTopics();
    for (let topicName of topicNames) {
      if (topics.includes(topicName)) return;

      console.log(`Creating the ${topicName} topic`);
      await admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 1,
          },
        ],
      });
    }
  } finally {
    await admin.disconnect();
  }
}

export { initConsumer };
