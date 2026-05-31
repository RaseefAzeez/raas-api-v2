#!/bin/bash
echo "Deploying RaaS v2.0 Local Infra Layout..."

# 1. Deploy Data Infrastructure
kubectl apply -f k8s/redis/deployment.yaml
kubectl apply -f k8s/redis/service.yaml

# 2. Deploy API Infrastructure
kubectl apply -f k8s/api-service/deployment.yaml
kubectl apply -f k8s/api-service/service.yaml
kubectl apply -f k8s/api-service/configmap.yaml

# 3. Deploy Worker Infrastructure (Processing Core)
kubectl apply -f k8s/worker-service/deployment.yaml
kubectl apply -f k8s/worker-service/configmap.yaml

echo "Querying current cluster deployment status."
kubectl get pods -w