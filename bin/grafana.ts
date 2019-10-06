#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { GrafanaStack } from '../lib/grafana-stack';

const env = {
    region: 'us-east-1',
    account: '651426287273'
};

const app = new cdk.App();

new GrafanaStack(app, 'GrafanaStack', { env });
