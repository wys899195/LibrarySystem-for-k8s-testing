kubectl -n library-system delete -f library-system-backend.yaml
kubectl -n library-system delete -f library-system-frontend.yaml

kubectl -n library-system delete configmap mysql-initdb --from-file library_system.sql
kubectl -n library-system delete -f library-system-mysql.yaml

kubectl -n library-system delete -f library-system-gateway.yaml