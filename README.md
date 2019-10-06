# Initialize Database:
```
customize lines 7-8 of bin/grafana.ts
customize lines 19-23 of lib/grafana-stack.ts

npm run build
cdk synth
cdk deploy

Grab the aurora endpoint name, and connect to it to create the database:
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
