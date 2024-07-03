import { Order } from "../models/order";
import { logger } from '../utils/logger';
import { saveOrder } from '../adapters/secondary/dynamo-save-order-adapter'

export const createOrder = async (order: Order): Promise<Order> => {
    try {
        if (!order.validate()) {
            logger.debug('Validating order...');
            throw Error('Could not create the order, order is not valid');
        }

        return await saveOrder(order);
    } catch (err) {
        logger.error((err as Error).message, {order});
        throw err;
    }
}