kubectl -n library-system apply -f library-system-core.yaml
kubectl -n library-system apply -f library-system.yaml

kubectl -n library-system create configmap mysql-initdb --from-file library_system.sql
kubectl -n library-system apply -f library-system-mysql.yaml

kubectl -n library-system rollout restart deploy/library-system-core-v1
kubectl -n library-system rollout restart deploy/library-system-v1

kubectl -n library-system apply -f library-system-gateway.yaml
