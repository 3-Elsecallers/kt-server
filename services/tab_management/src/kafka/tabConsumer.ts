import { Kafka } from "kafkajs";

// import config from "../config";

import { prisma } from "../db/prisma";

const config = {
  environment: "",
  kafka: {
    clientId: "",
    groupId: "",
    brokers: [],
    topics: [],
  },
};

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.kafka.groupId });

const initConsumer = async () => {
  try {
    await createTopicsIfNeeded(config.kafka.topics);

    await consumer.connect();
    await consumer.subscribe({
      topics: config.kafka.topics,
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
          const { userId, venueId, paymentMethodId, preAuthAmountPesewas } =
            event;

          await prisma.tab.create({
            data: {
              userId,
              venueId,
              paymentMethodId,
              preAuthAmountPesewas,
            },
          });

          // TODO: Call function to create tab in POS system and update tab in database with the posTabReference id returned
        }
      },
    });
    console.log("Kafka notification consumer connected");
    // TODO: Lots more events to be added
  } catch (error) {
    console.log("Error connecting Kafka consumer:", error);
    setTimeout(initConsumer, 5000);
  }
};

async function createTopicsIfNeeded(topicNames: string[]) {
  if (config.environment === "production") return;

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
