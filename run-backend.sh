#!/bin/bash

# Script para ejecutar solo el backend WhatsApp con Twilio
# Uso: ./run-backend.sh [cargar desde .env]

echo "💬 Ejecutando Backend WhatsApp con Twilio..."
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

function error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Verificar si existe archivo .env
ENV_FILE=".env"
USE_ENV_FILE=false

if [ -f "$ENV_FILE" ]; then
    info "Archivo .env encontrado. ¿Deseas usarlo?"
    echo "1) Sí, cargar desde .env"
    echo "2) No, proporcionar variables manualmente"
    echo ""
    read -p "Selecciona una opción (1 o 2): " ENV_CHOICE
    
    if [ "$ENV_CHOICE" = "1" ]; then
        USE_ENV_FILE=true
        info "Cargando configuración desde .env"
    fi
else
    warning "No se encontró archivo .env"
    echo "Puedes crearlo con: cp env.example .env"
    echo ""
fi

# Configurar variables
if [ "$USE_ENV_FILE" = true ]; then
    # Cargar desde .env
    DOCKER_ENV_ARGS="--env-file $ENV_FILE"
    info "Variables cargadas desde $ENV_FILE"
else
    # Solicitar variables manualmente
    echo ""
    info "Configuración manual de Twilio WhatsApp:"
    read -p "TWILIO_ACCOUNT_SID (ACxxx...): " TWILIO_ACCOUNT_SID
    read -s -p "TWILIO_AUTH_TOKEN: " TWILIO_AUTH_TOKEN
    echo ""
    read -p "TWILIO_WHATSAPP_NUMBER (+14155238886 para sandbox): " TWILIO_WHATSAPP_NUMBER
    read -p "RECIPIENT_PHONE_NUMBERS (+502xxx,+502yyy): " RECIPIENT_PHONE_NUMBERS
    
    DOCKER_ENV_ARGS="-e TWILIO_ACCOUNT_SID=\"$TWILIO_ACCOUNT_SID\" -e TWILIO_AUTH_TOKEN=\"$TWILIO_AUTH_TOKEN\" -e TWILIO_WHATSAPP_NUMBER=\"$TWILIO_WHATSAPP_NUMBER\" -e RECIPIENT_PHONE_NUMBERS=\"$RECIPIENT_PHONE_NUMBERS\" -e TZ=\"America/Guatemala\""
fi

# Limpiar contenedor del backend si existe
info "Limpiando contenedor trip-backend existente..."
podman stop trip-backend 2>/dev/null || true
podman rm -f trip-backend 2>/dev/null || true

# Verificar que la imagen existe
if ! podman image exists trip-backend; then
    error "La imagen trip-backend no existe. Ejecuta primero:"
    echo "   ./run-trip-countdown.sh"
    exit 1
fi

# Preguntar modo de ejecución
echo ""
info "¿Cómo quieres ejecutar el backend WhatsApp?"
echo "1) Manual (envío de prueba inmediato)"
echo "2) Automático con cron (producción)"
echo ""
read -p "Selecciona una opción (1 o 2): " MODO

case $MODO in
    1)
        info "Ejecutando backend en modo manual (envío inmediato)..."
        echo ""
        warning "INSTRUCCIONES PARA WHATSAPP:"
        echo "   1. Se verificará la configuración de Twilio"
        echo "   2. Se enviará un WhatsApp de prueba inmediatamente"
        echo "   3. Verifica que los números tengan formato +código_país"
        echo "   4. Para sandbox: Los destinatarios deben haberse unido primero"
        echo "   5. Envía 'join <codigo>' al número sandbox desde WhatsApp"
        echo ""
        read -p "Presiona Enter para continuar..."
        
        if [ "$USE_ENV_FILE" = true ]; then
            podman run --rm -it --name trip-backend \
                --env-file "$ENV_FILE" \
                trip-backend node send-whatsapp.js
        else
            eval "podman run --rm -it --name trip-backend $DOCKER_ENV_ARGS trip-backend node send-whatsapp.js"
        fi
        ;;
    2)
        info "Ejecutando backend en modo automático con cron..."
        
        if [ "$USE_ENV_FILE" = true ]; then
            CONTAINER_ID=$(podman run -d --name trip-backend \
                --env-file "$ENV_FILE" \
                trip-backend)
        else
            CONTAINER_ID=$(eval "podman run -d --name trip-backend $DOCKER_ENV_ARGS trip-backend")
        fi
        
        if [ $? -eq 0 ]; then
            success "Backend WhatsApp ejecutándose con cron automático"
            echo ""
            info "📋 Información del contenedor:"
            podman ps --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}" --filter "name=trip-backend"
            
            echo ""
            info "💬 Configuración WhatsApp:"
            echo "   • WhatsApp diarios a las 5:55 AM (zona configurada)"
            echo "   • Costo aproximado: $0.005 USD por mensaje"
            echo "   • Los números deben incluir código de país"
            echo "   • Para sandbox: Los destinatarios deben estar unidos"
            
            echo ""
            info "🔧 Comandos útiles:"
            echo "   Ver logs:        podman logs -f trip-backend"
            echo "   Envío manual:    podman exec trip-backend node send-whatsapp.js"
            echo "   Parar backend:   podman stop trip-backend"
            echo "   Estado:          podman ps | grep trip-backend"
            
        else
            error "Error ejecutando el backend"
            exit 1
        fi
        ;;
    *)
        error "Opción inválida. Usa 1 o 2."
        exit 1
        ;;
esac

echo ""
success "🎉 Backend WhatsApp configurado correctamente!"
echo ""
info "💡 Notas importantes para WhatsApp:"
echo "   • Verifica que los números tengan formato +código_país"
echo "   • Para sandbox: Los destinatarios deben unirse enviando 'join <codigo>'"
echo "   • Para producción: Requiere número WhatsApp Business verificado"
echo "   • Revisa los logs si hay errores de envío"
echo "   • WhatsApp es ~33% más barato que SMS"
echo "=============================================" 