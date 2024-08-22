import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../../../utils/logger';
import { getOrder } from '../../../services/get-order-service';

export const handler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {

    if (!event.pathParameters || !event.pathParameters.id) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Please provide a valid Order ID.',
            }),
        };
    }

    const order = await getOrder(event.pathParameters.id);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(order),
    };

    return response;
};
