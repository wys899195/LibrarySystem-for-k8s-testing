kubectl -n library-system delete -f library-system.yaml
kubectl -n library-system delete configmap mysql-initdb 
kubectl -n library-system delete -f library-system-mysql.yaml
kubectl -n library-system delete -f library-system-gateway.yaml