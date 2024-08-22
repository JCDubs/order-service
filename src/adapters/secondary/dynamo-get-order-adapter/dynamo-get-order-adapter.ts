import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { logger } from '../../../utils/logger';
import { OrderDTO, OrderLineDTO } from '../../../dto/order-dto';
import { Order } from '../../../models/order';
const client = new DynamoDBClient();

const tableName = process.env.TABLE_NAME;

export const getOrderById = async (id: string): Promise<Order> => {
  let params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :partitionKeyValue AND SK = :sortKeyPrefix',
    ExpressionAttributeValues: marshall({
      ':partitionKeyValue': 'ORDER',
      ':sortKeyPrefix': `ID#${id}`,
    }),
  };
  logger.debug('The params is: ', { params });
  let response = await client.send(new QueryCommand(params));
  logger.debug('Response is: ', { response });

  const orderHead = response.Items?.map((item) => unmarshall(item))[0];

  if (!orderHead) {
    throw new Error(`Order with id ${id} not found`);
  }

  delete orderHead?.PK;
  delete orderHead?.SK;

  params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :partitionKeyValue AND begins_with(SK, :sortKeyPrefix)',
    ExpressionAttributeValues: marshall({
      ':partitionKeyValue': 'ORDER_LINE',
      ':sortKeyPrefix': `ORDER_ID#${id}`,
    }),
  };
  
  response = await client.send(new QueryCommand(params));
  const orderLines = response.Items?.map((item) => unmarshall(item)).map(line => {
    delete line.PK;
    delete line.SK;
    return line;
  });
  
  return Order.fromDTO({
    ...orderHead,
    orderLines: orderLines as OrderLineDTO[],
  } as OrderDTO);
};
