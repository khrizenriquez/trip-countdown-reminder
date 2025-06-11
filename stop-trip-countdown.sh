#!/bin/bash

# Trip Countdown Reminder - Script de limpieza
# Este script para y elimina todo el proyecto

echo "🧹 Parando y limpiando Trip Countdown Reminder..."
echo "============================================="

# Función para mostrar mensajes con colores
function info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

function success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

function warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

# 1. Parar contenedores
info "Parando contenedores..."
podman stop trip-frontend trip-backend 2>/dev/null || warning "Contenedores ya estaban parados"
success "Contenedores parados"

# 2. Eliminar contenedores
info "Eliminando contenedores..."
podman rm trip-frontend trip-backend 2>/dev/null || warning "Contenedores ya estaban eliminados"
success "Contenedores eliminados"

# 3. Eliminar imágenes
info "Eliminando imágenes..."
podman rmi trip-frontend trip-backend 2>/dev/null || warning "Imágenes ya estaban eliminadas"
success "Imágenes eliminadas"

# 4. Limpiar sistema podman
info "Limpiando sistema podman..."
podman system prune -f 2>/dev/null || true
success "Sistema limpio"

# 5. Mostrar estado final
echo ""
echo "============================================="
success "🎉 Limpieza completada!"
echo ""
info "📊 Contenedores actuales:"
podman ps -a --format "table {{.Names}}\t{{.Status}}" | grep trip || echo "   No hay contenedores de trip-countdown"

echo ""
info "🗂️  Para volver a ejecutar:"
echo "   ./run-trip-countdown.sh"
echo "=============================================" 