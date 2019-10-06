#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { GrafanaStack } from '../lib/grafana-stack';

const app = new cdk.App();
new GrafanaStack(app, 'GrafanaStack');
