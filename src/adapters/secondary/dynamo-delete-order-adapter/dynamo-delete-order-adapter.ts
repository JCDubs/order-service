import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Order } from '../../../models/order';
import { logger } from '../../../utils/logger';
const client = new DynamoDBClient();

const tableName = process.env.TABLE_NAME;

export const deleteOrder = async (order: Order): Promise<void> => {
  const deleteTransactions = [
    {
      Delete: {
        Key: marshall({
          PK: 'ORDER',
          SK: `ID#${order.id}`,
        }),
        TableName: tableName,
      },
    },
  ];

  const deleteLineTransactions = order.orderLines?.map((line) => {
    return {
      Delete: {
        Key: marshall({
          PK: 'ORDER_LINE',
          SK: `ORDER_ID#${order.id}#LINE_ID#${line.id}`,
        }),
        TableName: tableName,
      },
    };
  }) ?? [];

  deleteTransactions.push(...deleteLineTransactions);
  logger.debug(`Deleteing order with ID ${order.id}`, {deleteTransactions});
  const transactWriteItemsCommand = new TransactWriteItemsCommand({
    TransactItems: deleteTransactions,
  });

  const response = await client.send(transactWriteItemsCommand);
  logger.debug(`Delete response`, {response});
  if (!response || response.$metadata.httpStatusCode !== 200) {
    throw Error('Could not delete order.');
  }
};
