# Initialize Database:
```
mysql -u admin -p -h grafana-db.cluster-endpoint.us-east-1.rds.amazonaws.com

create database grafana;
```

# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
