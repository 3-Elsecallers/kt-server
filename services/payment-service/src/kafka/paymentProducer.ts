import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

import { ICreateTabDetails } from "../types/custom";

const { KAFKA_CLIENT_ID, KAFKA_BROKERS, KAFKA_CREATE_TAB_TOPIC } = process.env;

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS!.split(","),
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka payment producer connected");
  } catch (error) {
    console.log("Error connecting Kafka producer:", error);
    setTimeout(connectProducer, 5000);
  }
};

const sendCreateTabEvent = async (details: ICreateTabDetails) => {
  try {
    await producer.send({
      topic: KAFKA_CREATE_TAB_TOPIC!,
      messages: [{ value: JSON.stringify(details) }],
    });
    console.log("Sent create tab details to Kafka");
  } catch (error) {
    console.log("Error sending create tab details to Kafka:", error);
  }
};

export { connectProducer, sendCreateTabEvent };