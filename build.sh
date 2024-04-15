# 後端
docker rmi -f wys899195/fastapi_library_system_backend
DOCKER_BUILDKIT=1 docker build ./BackEnd -t wys899195/fastapi_library_system_backend
docker push wys899195/fastapi_library_system_backend

# 前端
docker rmi -f wys899195/fastapi_library_system_frontend
DOCKER_BUILDKIT=1 docker build ./FrontEnd -t wys899195/fastapi_library_system_frontend
docker push wys899195/fastapi_library_system_frontend