const orderLineSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        productId: { type: "string" },
        productName: { type: "string" },
        quantity: { type: "number" },
        price: { type: "number" },
        total: { type: "number" },
        createdDateTime: { type: "string", format: "date-time" },
        updatedDateTime: { type: "string", format: "date-time" }
    },
    required: ["id", "productId", "productName", "quantity", "price", "total", "createdDateTime", "updatedDateTime"],
    additionalProperties: false
};

const orderSchema = {
    type: "object",
    properties: {
        id: { type: "string" },
        customerId: { type: "string" },
        createdDateTime: { type: "string", format: "date-time" },
        updatedDateTime: { type: "string", format: "date-time" },
        createdBy: { type: "string" },
        status: {
            type: "string",
            enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]
        },
        totalAmount: { type: "number" },
        branchId: { type: "string" },
        comments: { type: "string" },
        orderLines: {
            type: "array",
            items: orderLineSchema
        }
    },
    required: ["id", "customerId", "createdDateTime", "updatedDateTime", "status", "totalAmount", "branchId", "comments", "orderLines"],
    additionalProperties: false
};

export { orderLineSchema, orderSchema };
