import { listOrders } from '../../adapters/secondary/dynamo-list-order-adapter/dynamo-list-order-adapter';
import { Order } from '../../models/order';
import { ListItems, PaginationParams } from '../../types';

export const getOrders = async ({offset, limit}: PaginationParams): Promise<ListItems<Order>> => {
    const ordersList = await listOrders({offset, limit});

    let validOrders = true;

    for (const order of ordersList.items) {
        validOrders = validOrders && order.validate();
    }

    if (!validOrders) {
        throw Error('Order is invalid');
    }

    return ordersList;
}