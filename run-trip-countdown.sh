#!/bin/bash

# Trip Countdown Reminder - Script de automatización
# Este script construye y ejecuta el proyecto completo

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Trip Countdown Reminder - Script de Despliegue Completo${NC}"
echo "========================================================="

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

function error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Función para verificar si Podman está instalado
check_podman() {
    if ! command -v podman &> /dev/null; then
        echo -e "${RED}❌ Error: Podman no está instalado${NC}"
        echo "Por favor instala Podman primero:"
        echo "  Ubuntu/Debian: sudo apt install podman"
        echo "  macOS: brew install podman"
        exit 1
    fi
}

# Función para limpiar contenedores e imágenes existentes
cleanup_existing() {
    echo -e "${YELLOW}🧹 Limpiando contenedores e imágenes existentes...${NC}"
    
    # Parar y eliminar contenedores si existen
    if podman ps -a | grep -q "trip-frontend"; then
        podman stop trip-frontend 2>/dev/null
        podman rm trip-frontend 2>/dev/null
        echo "  ✅ Contenedor trip-frontend eliminado"
    fi
    
    if podman ps -a | grep -q "trip-backend"; then
        podman stop trip-backend 2>/dev/null
        podman rm trip-backend 2>/dev/null
        echo "  ✅ Contenedor trip-backend eliminado"
    fi
    
    # Eliminar imágenes si existen
    if podman images | grep -q "trip-frontend"; then
        podman rmi trip-frontend 2>/dev/null
        echo "  ✅ Imagen trip-frontend eliminada"
    fi
    
    if podman images | grep -q "trip-backend"; then
        podman rmi trip-backend 2>/dev/null
        echo "  ✅ Imagen trip-backend eliminada"
    fi
    
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para construir el frontend
build_frontend() {
    echo -e "${BLUE}📦 Construyendo frontend (Astro + Tailwind)...${NC}"
    
    if podman build -t trip-frontend frontend/; then
        echo -e "${GREEN}✅ Frontend construido exitosamente${NC}"
        
        # Mostrar información de la imagen
        local size=$(podman images trip-frontend --format "{{.Size}}")
        echo -e "${BLUE}  📊 Tamaño de imagen: ${size}${NC}"
    else
        echo -e "${RED}❌ Error construyendo el frontend${NC}"
        exit 1
    fi
}

# Función para construir el backend
build_backend() {
    echo -e "${BLUE}📦 Construyendo backend (Bot WhatsApp)...${NC}"
    
    if podman build -f backend/Dockerfile -t trip-backend .; then
        echo -e "${GREEN}✅ Backend construido exitosamente${NC}"
        
        # Mostrar información de la imagen
        local size=$(podman images trip-backend --format "{{.Size}}")
        echo -e "${BLUE}  📊 Tamaño de imagen: ${size}${NC}"
    else
        echo -e "${RED}❌ Error construyendo el backend${NC}"
        exit 1
    fi
}

# Función para ejecutar el frontend
run_frontend() {
    echo -e "${BLUE}🌐 Ejecutando frontend...${NC}"
    
    if podman run -d --name trip-frontend -p 8080:80 trip-frontend; then
        echo -e "${GREEN}✅ Frontend ejecutándose en http://localhost:8080${NC}"
        
        # Verificar que el contenedor esté corriendo
        sleep 2
        if podman ps | grep -q "trip-frontend"; then
            echo -e "${GREEN}  🔄 Contenedor frontend activo${NC}"
        else
            echo -e "${RED}  ❌ Error: Contenedor frontend no está activo${NC}"
            podman logs trip-frontend
        fi
    else
        echo -e "${RED}❌ Error ejecutando el frontend${NC}"
        exit 1
    fi
}

# Función para mostrar instrucciones del backend
show_backend_instructions() {
    echo -e "${YELLOW}📱 Configuración del Backend WhatsApp${NC}"
    echo "========================================"
    echo ""
    echo -e "${BLUE}Para configurar el bot de WhatsApp, ejecuta:${NC}"
    echo -e "${GREEN}./run-backend.sh${NC}"
    echo ""
    echo -e "${BLUE}O ejecuta manualmente con tus credenciales:${NC}"
    echo ""
    echo "podman run --rm -it --name trip-backend \\"
    echo "     -e TWILIO_ACCOUNT_SID=\"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\" \\"
    echo "     -e TWILIO_AUTH_TOKEN=\"tu_auth_token_aqui\" \\"
    echo "     -e TWILIO_WHATSAPP_NUMBER=\"+14155238886\" \\"
    echo "     -e RECIPIENT_PHONE_NUMBERS=\"+502XXXXXXXX,+502YYYYYYYY\" \\"
    echo "     -e TZ=\"America/Guatemala\" \\"
    echo "     trip-backend node send-whatsapp.js"
    echo ""
    echo -e "${BLUE}Para ejecutar con cron automático (producción):${NC}"
    echo ""
    echo "podman run -d --name trip-backend \\"
    echo "     -e TWILIO_ACCOUNT_SID=\"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\" \\"
    echo "     -e TWILIO_AUTH_TOKEN=\"tu_auth_token_aqui\" \\"
    echo "     -e TWILIO_WHATSAPP_NUMBER=\"+14155238886\" \\"
    echo "     -e RECIPIENT_PHONE_NUMBERS=\"+502XXXXXXXX,+502YYYYYYYY\" \\"
    echo "     -e TZ=\"America/Guatemala\" \\"
    echo "     trip-backend"
    echo ""
}

# Función para mostrar el resumen final
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 ¡Despliegue Completado!${NC}"
    echo "=========================="
    echo ""
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    
    # Verificar frontend
    if podman ps | grep -q "trip-frontend"; then
        echo -e "  🌐 Frontend: ${GREEN}✅ Activo${NC} - http://localhost:8080"
    else
        echo -e "  🌐 Frontend: ${RED}❌ No activo${NC}"
    fi
    
    # Verificar backend
    if podman ps | grep -q "trip-backend"; then
        echo -e "  📱 Backend: ${GREEN}✅ Activo${NC} - Bot WhatsApp con cron"
    else
        echo -e "  📱 Backend: ${YELLOW}⏳ Listo para configurar${NC} - Usar ./run-backend.sh"
    fi
    
    echo ""
    echo -e "${BLUE}🛠️ Comandos útiles:${NC}"
    echo "  Ver logs frontend: podman logs -f trip-frontend"
    echo "  Ver logs backend:  podman logs -f trip-backend"
    echo "  Parar todo:        ./stop-trip-countdown.sh"
    echo "  Configurar bot:    ./run-backend.sh"
    echo ""
    echo -e "${GREEN}¡Disfruta tu cuenta regresiva para el viaje! ✈️${NC}"
}

# Script principal
main() {
    check_podman
    cleanup_existing
    
    echo ""
    build_frontend
    echo ""
    build_backend
    echo ""
    run_frontend
    echo ""
    show_backend_instructions
    show_summary
}

# Ejecutar script principal
main 