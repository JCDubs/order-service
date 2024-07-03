import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';

export class OrdersStatefulStack extends cdk.Stack {

  readonly orderTable: dynamo.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.orderTable = new dynamo.Table(this, 'OrderTable', {
      tableName: 'OrderTable',
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'PK',
        type: dynamo.AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: dynamo.AttributeType.STRING
      }
    });
  }
}
