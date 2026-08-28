# FitConnect Kubernetes

Apply all manifests:

```bash
kubectl apply -f k8s/
```

Check resources:

```bash
kubectl get pods
kubectl get svc
```

Open the frontend with NodePort:

```text
http://localhost:30080
```

