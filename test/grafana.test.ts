import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Grafana = require('../lib/grafana-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Grafana.GrafanaStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});