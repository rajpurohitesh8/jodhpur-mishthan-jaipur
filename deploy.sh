#!/bin/bash

# AWS S3 Deployment Script for Jodhpur Mishthan Website

BUCKET_NAME="jodhpur-mishthan-website"
REGION="us-east-1"

echo "Starting deployment to AWS S3..."

# Create S3 bucket if it doesn't exist
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket already exists"

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload files to S3
aws s3 sync . s3://$BUCKET_NAME --exclude "*.git/*" --exclude "*.md" --exclude "deploy.sh" --exclude "aws-template.yml" --exclude "buildspec.yml" --delete

# Set bucket policy for public read access
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
    }
  ]
}'

echo "Deployment completed!"
echo "Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"