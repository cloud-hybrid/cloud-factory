# Resource Naming Conventions #

- [Google Cloud Platform Best Practices for Enterprises](https://cloud.google.com/docs/enterprise/best-practices-for-enterprise-organizations)
- [AWS Tagging Strategies & White Paper](https://d1.awsstatic.com/whitepapers/aws-tagging-best-practices.pdf)
- [The Azure Platform's Naming Convention Guide](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)

## General Resource Naming ##

| Naming component | Description                                                                                                                                                                                                    |
|:----------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|       Type       | An abbreviation that represents the type of cloud resource or asset. The component is often used as a prefix or suffix in the name                                                                             |
|  Business-Unit   | Top-level division of the company that owns the subscription or workload the resource belongs to. In smaller organizations, this component might represent a single corporate top-level organizational element |
|       Name       | Name of the application, workload, or service that the resource is a part of                                                                                                                                   |
|   Environment    | The stage of the development lifecycle for the workload that the resource supports                                                                                                                             |

## Personal Naming Pattern ##

|       Key        |                Description                |         Example(s)          |
|:----------------:|:-----------------------------------------:|:---------------------------:|
| **Organization** |                    ...                    |            `IBM`            |
| **Environment**  |       Network (L2) Seperated Alias        | `Development`, `Production` |
| **Application**  | Stack, Functional Purpose, or Common-Name |  `Financial-Audit-Service`  |
|   **Provider**   |  Service(s) either Consumed or Provided   |     `S3`, `EC2`, `CFN`      |
|   **Resource**   |          Descriptive Identifier           | `Log-Results`. `Artifacts`  |
|  **Identifier**  |        Additional, Optional String        |   `VPC-ID`, `Private-Key`   |

### Examples ###

- `IBM-Production-Financial-Audit-Service-S3-Artifacts`
    - `IBM/Production/Financial-Audit-Service/S3/Artifacts`

- `IBM-Staging-Bastion-Host-EC2-SSH-Private-Key`
    - `IBM/Staging/Bastion-Host/EC2/SSH/Private-Key`


