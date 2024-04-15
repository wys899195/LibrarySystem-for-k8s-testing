kubectl -n library-system apply -f library-system-backend.yaml
kubectl -n library-system apply -f library-system-frontend.yaml

kubectl -n library-system create configmap mysql-initdb --from-file library_system.sql
kubectl -n library-system apply -f library-system-mysql.yaml

kubectl -n library-system rollout restart deploy/library-system-backend-v1
kubectl -n library-system rollout restart deploy/library-system-frontend-v1

kubectl -n library-system apply -f library-system-gateway.yaml
