import { Order } from "../../models/order";
import { logger } from '../../utils/logger';
import { OrderDTO, UpdatedOrderDTO } from "../../dto/order-dto";
import { getOrderById } from "../../adapters/secondary/dynamo-get-order-adapter";
import { updateOrderAndLines } from "../../adapters/secondary/dynamo-update-order-adapter/dynamo-update-order-adapter";

export const updateOrder = async (orderId: string, updatedOrderDTO: UpdatedOrderDTO): Promise<Order> => {
    try {

        const order = await getOrderById(orderId);

        // get all order lines that have been deleted
        const orderLinesToDelete = order.orderLines?.filter(orderLine => !updatedOrderDTO.orderLines?.map(line => line.id).includes(orderLine.id)) ?? [];

        // Update the create date time for all lines to match original creation time.
        updatedOrderDTO.orderLines = updatedOrderDTO.orderLines?.map(line => {
            return {
                ...line,
                createdDateTime: order.orderLines?.filter(orderLine => orderLine.id === line.id)[0]?.createdDateTime
            }
        })
        const updatedOrder = Order.fromDTO({
            ...updatedOrderDTO, 
            id: orderId,
            createdDateTime: order.createdDateTime
        } as OrderDTO);

        if (!updatedOrder.validate()) {
            logger.debug('Validating order...');
            throw Error('Could not create the order, order is not valid');
        }

        // send updated order and the lines that need to be deleted to the secondary adapter.

        return await updateOrderAndLines(updatedOrder, orderLinesToDelete);
    } catch (err) {
        logger.error((err as Error).message, {updatedOrderDTO});
        throw err;
    }
}