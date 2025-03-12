## Dynamo Next Gen
An application designed for uploading your CV, generating embeddings, and performing similarity searches to find the best job match.

## Frontend
A cross-platform mobile application built with React Native and Expo. Expo simplifies mobile app development, providing an easy-to-use framework for seamless deployment across iOS and Android. Learn more at [Expo](https://expo.dev/).

#### Steps to start the frontend
- `cd frontend/`
- `npm install`
- `npm run start` (use node v.20)
- Then follow the prompted instructions

## Backend
The backend is deployed on AWS using **Infrastructure as Code (IaC)**. It leverages [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) for storing job data, [Amazon API Gateway](https://aws.amazon.com/api-gateway/) for request routing, and [AWS Lambda](https://aws.amazon.com/lambda/) to handle the core application logic.

**Beware the costs:**  
When using AWS, be mindful of service costs, as resources like [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) can become expensive quickly. While [AWS Lambda](https://aws.amazon.com/lambda/) and [Amazon API Gateway](https://aws.amazon.com/api-gateway/) are generally cost-effective, costs can rise with high traffic. Always monitor usage, set budget alerts, and choose the appropriate **AWS region** to optimize expenses. For more details, visit [AWS Pricing](https://aws.amazon.com/pricing/).

### **1. Create an AWS Account**  
Before setting up the AWS CLI, you need an AWS account. If you don’t have one, follow these steps:  

1. Go to [AWS Sign Up](https://aws.amazon.com/) and create an account.  
2. Provide your **email, password, and account details**.  
3. Enter your **billing information** (a valid credit card is required).  
4. Verify your **phone number** via OTP.  
5. Choose a **support plan** (Free Tier is recommended for testing).  
6. Complete the registration and log in to the [AWS Management Console](https://aws.amazon.com/console/).  

---

### **2. Configure the AWS CLI**  
Once your AWS account is set up, install and configure the AWS CLI.

##### **Install AWS CLI**  
Follow the official guide to install the AWS CLI:  
🔗 [AWS CLI Installation](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)  

##### **Set Up AWS CLI**  
Run the following command:  
```sh
aws configure
```
You will be prompted to enter:  
- **AWS Access Key ID**  
- **AWS Secret Access Key**  
- **Default AWS Region** (e.g., `us-east-1`)  
- **Output format** (default: `json`)  

To verify the setup, run:  
```sh
aws sts get-caller-identity
```
This should return details about your AWS account, confirming successful configuration.

### Steps to deploy the backend
- Run `make build-layers` to install python deps in the lambda layer
- Run `sam build --template-file templates/functions_template.yaml` to build the lambda functions and the layers
- Run `sam deploy --template-file templates/functions_template.yaml` to actually deploy on AWS