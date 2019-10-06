import cdk = require('@aws-cdk/core');
import rds = require('@aws-cdk/aws-rds');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import { SubnetType } from '@aws-cdk/aws-ec2';
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");

export class GrafanaStack extends cdk.Stack {
//  public readonly vpc: IVpc
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// change the below values to fit your environment
    const dbpassword = "CHANGEME";
    const vpcid = "vpc-0725094f3a85b23ec";
    const sgip = "192.168.0.0/16";
// end of customization

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', { vpcId: vpcid });
    const privatesubnets = vpc.selectSubnets({ subnetType: SubnetType.PRIVATE })
    const rdsdbsubnets = new rds.CfnDBSubnetGroup(this, 'rdsdbsubnets', {
        dbSubnetGroupDescription: "grafana rds db subnet group",
        dbSubnetGroupName: "grafana-db-subnet-group",
        subnetIds: privatesubnets.subnetIds
    });
    const dbsecuritygroup = new ec2.CfnSecurityGroup(this, 'dbsecuritygroup', {
        groupDescription: "grafana db security group",
        groupName: "grafana-db-sg",
        vpcId: vpcid,
        securityGroupIngress: [
            {
                cidrIp: sgip,
                fromPort: 3306,
                ipProtocol: "tcp",
                toPort: 3306
            }
        ],
        securityGroupEgress: [
            {
                cidrIp: "0.0.0.0/0",
                ipProtocol: "-1"
            }
        ]
    });
    const rdsdb = new rds.CfnDBCluster(this, 'rdsdb', {
        availabilityZones: vpc.availabilityZones,
        backupRetentionPeriod: 7,
        dbClusterIdentifier: "grafana-db",
        dbSubnetGroupName: rdsdbsubnets.dbSubnetGroupName,
        engine: "aurora",
        port: 3306,
        masterUsername: "admin",
        masterUserPassword: dbpassword,
        vpcSecurityGroupIds: [
            dbsecuritygroup.ref
        ],
        storageEncrypted: true,
        engineMode: "serverless",
        scalingConfiguration: {
            autoPause: true,
            minCapacity: 1
        },
        deletionProtection: false
    });
    const cluster = new ecs.Cluster(this, 'grafanacluster', { vpc: vpc, clusterName: 'grafana' });
    const taskdef = new ecs.FargateTaskDefinition(this, 'taskdef', { cpu: 256, memoryLimitMiB: 512, });
    const logging: ecs.LogDriver = new ecs.AwsLogDriver({ streamPrefix: this.node.id });
    const container = taskdef.addContainer("grafana", {
        image: ecs.ContainerImage.fromRegistry("grafana/grafana"),
        logging,
        environment: {
            TEST_ENVIRONMENT_VARIABLE: "test-value",
            GF_INSTALL_PLUGINS: "grafana-clock-panel,grafana-simple-json-datasource",
            GF_DATABASE_TYPE: "mysql",
            GF_DATABASE_PASSWORD: String(rdsdb.masterUserPassword),
            GF_DATABASE_USER: String(rdsdb.masterUsername),
            GF_DATABASE_HOST: rdsdb.attrEndpointAddress,
            GF_SECURITY_ADMIN_PASSWORD: dbpassword,
            GF_AWS_default_REGION: this.region
        }
    });
    container.addPortMappings({ containerPort: 3000 })
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "grafanaservice", {
        cluster: cluster,
        taskDefinition: taskdef,
        serviceName: 'grafana',
        publicLoadBalancer: true,
    });
    service.targetGroup.configureHealthCheck({ path: "/login" })
  }
}
