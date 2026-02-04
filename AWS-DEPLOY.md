# AWS Deployment Guide - Jodhpur Mishthan Website

## Quick Deploy to AWS S3

### Prerequisites
- AWS CLI installed and configured
- AWS account with S3 permissions

### Option 1: Automated Script Deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual S3 Deployment
```bash
# Create S3 bucket
aws s3 mb s3://jodhpur-mishthan-website --region us-east-1

# Enable static website hosting
aws s3 website s3://jodhpur-mishthan-website --index-document index.html

# Upload files
aws s3 sync . s3://jodhpur-mishthan-website --exclude "*.git/*" --exclude "*.md"

# Set public read policy
aws s3api put-bucket-policy --bucket jodhpur-mishthan-website --policy file://bucket-policy.json
```

### Option 3: CloudFormation Deployment
```bash
aws cloudformation create-stack --stack-name jodhpur-mishthan-stack --template-body file://aws-template.yml
```

### Option 4: AWS Amplify Deployment
1. Connect GitHub repository to AWS Amplify
2. Auto-deploy on every push to master branch
3. Custom domain and SSL included

## Website Features
- ✅ Mobile-responsive design
- ✅ Working mobile navigation menu
- ✅ Product catalog with cart functionality
- ✅ User authentication system
- ✅ Contact forms and maps
- ✅ Optimized for AWS hosting

## Live URLs
- **GitHub:** https://github.com/rajpurohitesh8/jodhpur-mishthan-jaipur
- **Vercel:** https://jodhpur-mishthan-jaipur1.vercel.app/
- **AWS S3:** http://jodhpur-mishthan-website.s3-website-us-east-1.amazonaws.com