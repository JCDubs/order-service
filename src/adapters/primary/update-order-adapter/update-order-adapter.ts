import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateOrder } from '../../../services/update-order-service/update-order-service';

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.pathParameters?.id || !event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Bad Request",
                }),
            };
        }
    
        const id = event.pathParameters?.id;
        const orderBody = JSON.parse(event.body);
    
        const updatedOrder = await updateOrder(id, orderBody);
    
        const response = {
            statusCode: 200,
            body: JSON.stringify(updatedOrder),
        };
    
        return response;
    } catch (err) {
        const error = err as Error;
        return {
            statusCode: error.message.includes('not found') ? 404 : 500,
            body: JSON.stringify(error.message),
        }
    }
};
