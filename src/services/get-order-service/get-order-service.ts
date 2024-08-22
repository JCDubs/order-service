import { getOrderById } from '../../adapters/secondary/dynamo-get-order-adapter';
import { Order } from '../../models/order';

export const getOrder = async (orderId: string) => {
    const order = await getOrderById(orderId);

    if (!order.validate()) {
        throw Error('Order is invalid');
    }

    return order;
}