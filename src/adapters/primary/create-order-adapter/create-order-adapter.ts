import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Order } from '../../../models/order';
import { createOrder } from '../../../services/create-order-service';

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Please provide an order"
            }),
        }
    }

    const newOrder = Order.fromDTO(JSON.parse(event.body!));
    const order = await createOrder(newOrder);
    const response = {
        statusCode: 201,
        body: JSON.stringify(order),
    };

    return response;
};
