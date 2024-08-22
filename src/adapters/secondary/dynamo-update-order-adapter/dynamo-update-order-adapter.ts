import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Order, OrderLine } from '../../../models/order';
import { logger } from '../../../utils/logger';
const client = new DynamoDBClient();

const tableName = process.env.TABLE_NAME;

export const updateOrderAndLines = async (order: Order, orderLinesToDelete: OrderLine[]) => {
  const items = [convertOrder(order), ...convertOrderLine(order.id, order.orderLines!), ...convertOrderLineToDelete(order.id, orderLinesToDelete)];
  logger.debug('Items are: ',  {items});
  const transactWriteItemsCommand = new TransactWriteItemsCommand({TransactItems: items});
  logger.debug('Transaction write is: ',  {transactWriteItemsCommand});
  const response = await client.send(transactWriteItemsCommand);
  logger.debug('Response is: ',  {response});
  if (!response || response.$metadata.httpStatusCode !== 200) {
    throw Error('Could not save order.');
  }

  return order;
};

const convertOrder = (order: Order) => {
  const orderCopy = JSON.parse(JSON.stringify(order));
  delete orderCopy.orderLines;
  return {
    Put: {
      Item: marshall({PK: `ORDER`,
      SK: `ID#${order.id}`, ...orderCopy}, {convertClassInstanceToMap:true}),
      TableName: tableName,
    },
  };
};

const convertOrderLine = (orderId: string, orderLines: OrderLine[]) => {
  return orderLines.map((orderLine) => {
    return {
      Put: {
        Item: marshall({PK: `ORDER_LINE`,
        SK: `ORDER_ID#${orderId}#LINE_ID#${orderLine.id}`, ...orderLine}, {convertClassInstanceToMap:true}),
        TableName: tableName,
      },
    };
  });
};

const convertOrderLineToDelete = (orderId: string, orderLinesToDelete: OrderLine[]) => {
  return orderLinesToDelete.map((orderLine) => {
    return {
      Delete: {
        Key: marshall({
          PK: 'ORDER_LINE',
          SK: `ORDER_ID#${orderId}#LINE_ID#${orderLine.id}`,
        }),
        TableName: tableName,
      },
    };
  });
}
