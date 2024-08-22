import { logger } from '../../utils/logger';
import { getOrderById } from "../../adapters/secondary/dynamo-get-order-adapter";
import { deleteOrder } from "../../adapters/secondary/dynamo-delete-order-adapter/dynamo-delete-order-adapter";

export const removeOrder = async (orderId: string): Promise<void> => {
    try {
        logger.debug(`Retrieving order with ID ${orderId}`);
        const order = await getOrderById(orderId);
        await deleteOrder(order);
    } catch (err) {
        logger.error((err as Error).message, {orderId});
        throw err;
    }
}