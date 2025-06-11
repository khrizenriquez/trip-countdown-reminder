#!/bin/bash

# ====================================
# 🚀 DESPLIEGUE AUTOMÁTICO EN PRODUCCIÓN
# ====================================
# Este script despliega el backend en DigitalOcean
# Uso: ./deploy-production.sh

set -e

echo "🚀 Trip Countdown - Despliegue en Producción"
echo "============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Función para imprimir con colores
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "config.json" ]; then
    print_error "No se encontró config.json. Ejecuta desde la raíz del proyecto."
    exit 1
fi

print_step "Verificando herramientas necesarias..."

# Verificar Podman
if ! command -v podman &> /dev/null; then
    print_error "Podman no está instalado. Instálalo primero:"
    echo "sudo apt update && sudo apt install -y podman"
    exit 1
fi

print_success "Podman está instalado"

# Solicitar configuración de producción
print_step "Configuración de Twilio (producción)..."

echo -n "🔑 TWILIO_ACCOUNT_SID: "
read -r TWILIO_ACCOUNT_SID

echo -n "🔑 TWILIO_AUTH_TOKEN: "
read -s TWILIO_AUTH_TOKEN
echo

echo -n "📱 TWILIO_WHATSAPP_NUMBER (ej: +14155238886): "
read -r TWILIO_WHATSAPP_NUMBER

echo -n "🌍 Zona horaria (ej: America/Guatemala): "
read -r TZ

# Validar configuración
if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_WHATSAPP_NUMBER" ]; then
    print_error "Todos los campos de Twilio son obligatorios"
    exit 1
fi

print_step "Construyendo imagen de producción..."

# Construir imagen del backend
podman build -f backend/Dockerfile -t trip-backend-prod .

if [ $? -eq 0 ]; then
    print_success "Imagen construida exitosamente"
else
    print_error "Error construyendo la imagen"
    exit 1
fi

print_step "Parando contenedor anterior (si existe)..."
podman stop trip-backend-prod 2>/dev/null || true
podman rm trip-backend-prod 2>/dev/null || true

print_step "Ejecutando backend en producción..."

# Ejecutar contenedor en producción con cron automático
podman run -d \
    --name trip-backend-prod \
    --restart unless-stopped \
    -e TWILIO_ACCOUNT_SID="$TWILIO_ACCOUNT_SID" \
    -e TWILIO_AUTH_TOKEN="$TWILIO_AUTH_TOKEN" \
    -e TWILIO_WHATSAPP_NUMBER="$TWILIO_WHATSAPP_NUMBER" \
    -e TZ="$TZ" \
    -e NODE_ENV=production \
    --memory=200m \
    --cpus=0.5 \
    trip-backend-prod

if [ $? -eq 0 ]; then
    print_success "Backend ejecutándose en producción"
else
    print_error "Error ejecutando el backend"
    exit 1
fi

print_step "Verificando estado del contenedor..."
sleep 3

# Verificar que el contenedor está ejecutándose
if podman ps | grep -q trip-backend-prod; then
    print_success "Contenedor ejecutándose correctamente"
    
    # Mostrar logs iniciales
    print_step "Logs iniciales del backend:"
    podman logs --tail 20 trip-backend-prod
    
    print_success "🎉 ¡Despliegue completado exitosamente!"
    echo
    echo "📊 Información del despliegue:"
    echo "   🏷️  Nombre del contenedor: trip-backend-prod"
    echo "   ⏰ Cron job: Todos los días a las 5:55 AM ($TZ)"
    echo "   💾 Límites: 200MB RAM, 0.5 CPU"
    echo "   👥 Destinatarios: $(jq '.whatsapp.recipients | length' config.json)"
    echo
    echo "🔧 Comandos útiles:"
    echo "   Ver logs:     podman logs -f trip-backend-prod"
    echo "   Estado:       podman ps"
    echo "   Parar:        podman stop trip-backend-prod"
    echo "   Reiniciar:    podman restart trip-backend-prod"
    echo "   Prueba:       podman exec trip-backend-prod node send-whatsapp.js"
    
else
    print_error "El contenedor no está ejecutándose correctamente"
    print_step "Logs de error:"
    podman logs trip-backend-prod
    exit 1
fi

print_step "Configurando firewall (opcional)..."
echo "¿Quieres configurar el firewall UFW? (y/N)"
read -r configure_firewall

if [ "$configure_firewall" = "y" ] || [ "$configure_firewall" = "Y" ]; then
    print_step "Configurando UFW..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw --force enable
    print_success "Firewall configurado"
fi

echo
print_success "🚀 ¡Despliegue en producción completado!"
print_warning "Recuerda:"
echo "   1. 📱 Los destinatarios deben estar unidos al sandbox (si usas sandbox)"
echo "   2. 🔑 Las credenciales de Twilio deben tener saldo suficiente"
echo "   3. ⏰ Los mensajes se enviarán automáticamente a las 5:55 AM"
echo "   4. 🌐 El frontend se despliega separadamente en GitHub Pages" 