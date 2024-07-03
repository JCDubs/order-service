#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OrdersStatefulStack } from '../lib/orders-stateful-stack';
import { OrdersStatelessStack } from '../lib/orders-stateless-stack';

const app = new cdk.App();
const ordersStatefulStack = new OrdersStatefulStack(app, 'OrdersStatefulStack', {});
new OrdersStatelessStack(app, 'OrdersStatelessStack', {orderTable: ordersStatefulStack.orderTable});