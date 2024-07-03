import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as njsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import path from 'path';

export interface OrdersStatelessStackProps extends cdk.StackProps{
  orderTable: dynamo.Table
}

export class OrdersStatelessStack extends cdk.Stack {

  readonly orderAPI: apigw.LambdaRestApi;

  constructor(scope: Construct, id: string, props: OrdersStatelessStackProps) {
    super(scope, id, props);

    const lambdaProps = {
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        LOG_LEVEL: 'DEBUG',
        POWERTOOLS_LOG_LEVEL: 'DEBUG',
        // POWERTOOLS_LOGGER_SAMPLE_RATE	: '1',  
        TABLE_NAME: props.orderTable.tableName      
      },
      bundling: {
        minify: true,
      }
    }

    const createOrderServiceName = 'CreateOrderService';
    const createOrderLambda = new njsLambda.NodejsFunction(this, createOrderServiceName, {
      functionName: createOrderServiceName,
      entry: path.resolve(__dirname, '../../src/adapters/primary/create-order-adapter/create-order-adapter.ts'),
      ...lambdaProps,
      environment: {
        ...lambdaProps.environment,
        POWERTOOLS_SERVICE_NAME: createOrderServiceName,
      }
    });
    props.orderTable.grantReadWriteData(createOrderLambda);

    const updateOrderServiceName = 'UpdateOrderService';
    const updateOrderLambda = new njsLambda.NodejsFunction(this, updateOrderServiceName, {
      functionName: updateOrderServiceName,
      entry: path.resolve(__dirname, '../../src/adapters/primary/update-order-adapter/update-order-adapter.ts'),
      ...lambdaProps,
      environment: {
        ...lambdaProps.environment,
        POWERTOOLS_SERVICE_NAME: updateOrderServiceName,
      }
    });
    props.orderTable.grantReadWriteData(updateOrderLambda);

    const deleteOrderServiceName = 'DeleteOrderService';
    const deleteOrderLambda = new njsLambda.NodejsFunction(this, deleteOrderServiceName, {
      functionName: deleteOrderServiceName,
      entry: path.resolve(__dirname, '../../src/adapters/primary/delete-order-adapter/delete-order-adapter.ts'),
      ...lambdaProps,
      environment: {
        ...lambdaProps.environment,
        POWERTOOLS_SERVICE_NAME: deleteOrderServiceName,
      }
    });
    props.orderTable.grantReadWriteData(deleteOrderLambda);

    const getOrderServiceName = 'GetOrderService';
    const getOrderLambda = new njsLambda.NodejsFunction(this, getOrderServiceName, {
      functionName: getOrderServiceName,
      entry: path.resolve(__dirname, '../../src/adapters/primary/get-order-adapter/get-order-adapter.ts'),
      ...lambdaProps,
      environment: {
        ...lambdaProps.environment,
        POWERTOOLS_SERVICE_NAME: getOrderServiceName,
      }
    });
    props.orderTable.grantReadData(getOrderLambda);

    const listOrderServiceName = 'ListOrderService';
    const listOrderLambda = new njsLambda.NodejsFunction(this, listOrderServiceName, {
      functionName: listOrderServiceName,
      entry: path.resolve(__dirname, '../../src/adapters/primary/list-order-adapter/list-order-adapter.ts'),
      ...lambdaProps,
      environment: {
        ...lambdaProps.environment,
        POWERTOOLS_SERVICE_NAME: listOrderServiceName,
      }
    });
    props.orderTable.grantReadData(listOrderLambda);

    this.orderAPI = new apigw.LambdaRestApi(this, 'OrderAPI', {
      handler: getOrderLambda,
      proxy: false
    });

    const orderResource = this.orderAPI.root.addResource('orders');
    const orderIdResource = orderResource.addResource('{id}');
    orderResource.addMethod('POST', new apigw.LambdaIntegration(createOrderLambda));
    orderResource.addMethod('GET', new apigw.LambdaIntegration(listOrderLambda));
    orderIdResource.addMethod('POST', new apigw.LambdaIntegration(updateOrderLambda));
    orderIdResource.addMethod('DELETE', new apigw.LambdaIntegration(deleteOrderLambda));
    orderIdResource.addMethod('GET', new apigw.LambdaIntegration(getOrderLambda));
  }
}
