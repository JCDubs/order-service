import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getOrders } from '../../../services/list-order-service';
import { logger } from '../../../utils/logger';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {

    logger.debug('Event is: ', {event});
    const offset = event.queryStringParameters?.offset;
    const limit = Number(event.queryStringParameters?.limit ?? 10);
    logger.debug('Query params are: ', {offset, limit});
    let orderList = await getOrders({offset, limit});

    orderList.items = orderList.items.map(order => {
      delete order.orderLines;
      return order;
    })
    logger.debug('Returning list of orders.', {offset, limit, orderList});
    return {
      statusCode: 200,
      body: JSON.stringify(orderList),
    };
  } catch (err) {
    logger.error((err as Error).message, {err});
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
