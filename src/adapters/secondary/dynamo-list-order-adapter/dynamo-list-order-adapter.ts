import {
  DynamoDBClient,
  QueryCommand,
  QueryInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { logger } from '../../../utils/logger';
import { OrderDTO } from '../../../dto/order-dto';
import { Order } from '../../../models/order';
import { ListItems, PaginationParams } from '../../../types';
const client = new DynamoDBClient();

const tableName = process.env.TABLE_NAME;

export const listOrders = async ({
  offset,
  limit,
}: PaginationParams): Promise<ListItems<Order>> => {
  logger.debug('Listing Orders.', { offset, limit });

  const queryParams: QueryInput = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :partitionKeyValue',
    ExpressionAttributeValues: marshall({
      ':partitionKeyValue': 'ORDER',
    }),
    Limit: limit,
  };

  if (offset) {
    queryParams.ExclusiveStartKey = {
      PK: {
        S: 'ORDER',
      },
      SK: {
        S: `ID#${offset}`,
      },
    };
  }

  logger.debug('The params is: ', { queryParams });
  const response = await client.send(new QueryCommand(queryParams));
  logger.debug('Response is: ', { response });

  const orders = response.Items?.map((item) => unmarshall(item)).map((item) => {
    delete item.PK;
    delete item.SK;
    return Order.fromDTO(item as OrderDTO);
  });
  logger.debug('unmarshalledItems IS: ', { orders });

  return {
    items: orders as Order[],
    offset: response.LastEvaluatedKey?.SK.S?.replace('ID#', ''),
  };
};
