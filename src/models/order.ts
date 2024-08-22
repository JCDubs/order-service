import { OrderStatus } from '../types';
import { OrderDTO, OrderLineDTO, UpdateOrderDTO } from '../dto/order-dto';
import { v4 as uuid } from 'uuid';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { orderSchema } from '../schema/order-schema';
import { logger } from '../utils/logger';

const ajv = new Ajv();
addFormats(ajv);

export class OrderLine {
    readonly id: string;
    readonly productId: string;
    readonly productName: string;
    readonly quantity: number;
    readonly price: number;
    readonly total: number;
    readonly createdDateTime: string;
    readonly updatedDateTime: string;

    constructor(orderLineDTO: OrderLineDTO) {
        this.id = orderLineDTO.id ?? uuid();
        this.productId = orderLineDTO.productId;
        this.productName = orderLineDTO.productName;
        this.quantity = orderLineDTO.quantity;
        this.price = orderLineDTO.price;
        this.total = orderLineDTO.total;
        this.createdDateTime = orderLineDTO.createdDateTime ?? new Date().toISOString();
        this.updatedDateTime = orderLineDTO.updatedDateTime ?? new Date().toISOString();
    }

    static fromDTO(orderLineDTO: OrderLineDTO): OrderLine {
        return new OrderLine(orderLineDTO);
    }
}

export class Order {
    readonly id: string;
    readonly customerId: string;
    readonly createdDateTime: string;
    readonly updatedDateTime: string;
    readonly createdBy: string;
    readonly status: OrderStatus;
    readonly totalAmount: number;
    orderLines?: OrderLine[];
    readonly branchId: string;
    readonly comments: string;

    private constructor(orderDTO: OrderDTO) {
        this.id = orderDTO.id ?? uuid();
        this.customerId = orderDTO.customerId;
        this.createdDateTime = orderDTO.createdDateTime ?? new Date().toISOString();
        this.updatedDateTime = orderDTO.updatedDateTime ?? new Date().toISOString();
        this.createdBy = orderDTO.createdBy;
        this.status = orderDTO.status as OrderStatus ?? OrderStatus.PENDING;
        this.orderLines = (orderDTO.orderLines ?? []).map(orderLineDto => OrderLine.fromDTO(orderLineDto));
        this.branchId = orderDTO.branchId;
        this.comments = orderDTO.comments ?? '';
        this.totalAmount = orderDTO.totalAmount ?? this.orderLines.reduce((accumulator, orderLine) => accumulator + orderLine.total, 0);
    }

    validate(): boolean {
        try {
            const valid = ajv.validate(orderSchema, this);
            if (!valid) {
                logger.error('Order is not valid', {order: JSON.stringify(this), errors: ajv.errors});
                return false;
            }
            return true;
        } catch (err) {
            logger.error('Could not validate the order', {errors: (err as Error).message})
            return false;
        }
    }

    static fromDTO(orderDTO: OrderDTO): Order {
        logger.debug('Converting DTO to order', { orderDTO });
        return new Order(orderDTO);
    }
}