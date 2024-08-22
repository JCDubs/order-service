import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { removeOrder } from '../../../services/delete-order-service/delete-order-service';

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {

    try {
        if(!event.pathParameters?.id) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Missing id",
                }),
            };
        }
    
        await removeOrder(event.pathParameters.id);
        return {
            statusCode: 200,
            body: `Order with ID "${event.pathParameters?.id}" deleted`,
        };
    } catch(err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: (err as Error).message,
            }),
        }
    }
};
