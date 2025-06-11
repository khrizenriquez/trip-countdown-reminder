# Backend - Bot WhatsApp

Bot de WhatsApp que envía recordatorios diarios sobre la cuenta regresiva del viaje.

## 🚀 Desarrollo Local

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env`:

```bash
WHATSAPP_GROUP_ID=123456789012-123456789@g.us
TZ=America/Guatemala
```

### 3. Primera ejecución (escanear QR)

```bash
node send-whatsapp.js
```

**Importante**: En la primera ejecución se mostrará un código QR que debes escanear con WhatsApp en tu teléfono. Esto creará la sesión persistente en la carpeta `session/`.

### 4. Ejecuciones posteriores

Una vez autenticado, el bot ejecutará automáticamente el envío de mensaje y se cerrará.

## 📋 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `WHATSAPP_GROUP_ID` | ID del grupo de WhatsApp | `123456789012-123456789@g.us` |
| `TZ` | Zona horaria | `America/Guatemala` |

## 🔍 Obtener ID del Grupo

1. Agrega tu número al grupo
2. Ejecuta el bot en modo desarrollo
3. Envía un mensaje al grupo
4. Revisa los logs para encontrar el ID del grupo

## ⏰ Configuración del Cron

El contenedor está configurado para ejecutar el bot todos los días a las **05:55 AM** hora local.

Para cambiar la hora, modifica la línea en el `Dockerfile`:

```dockerfile
RUN echo "55 5 * * * /usr/local/bin/node /usr/src/app/send-whatsapp.js" > /etc/crontabs/root
```

Formato del cron:
- `55`: Minuto (55)
- `5`: Hora (05:00 AM)
- `*`: Día del mes (cualquiera)
- `*`: Mes (cualquiera) 
- `*`: Día de la semana (cualquiera)

## 🐛 Solución de Problemas

### Error de autenticación

```bash
# Eliminar sesión y volver a autenticar
rm -rf session/*
node send-whatsapp.js
```

### Error de conexión

Verifica que:
- Tienes conexión a internet
- WhatsApp Web está funcionando
- El ID del grupo es correcto

### Error de permisos

Asegúrate de que el bot tenga permisos para enviar mensajes al grupo.

## 📁 Estructura

```
backend/
├── session/          # Sesión de WhatsApp (gitignored)
├── tests/           # Tests unitarios (futuro)
├── .env             # Variables de entorno (gitignored) 
├── send-whatsapp.js # Script principal
├── package.json     # Dependencias
├── Dockerfile       # Configuración del contenedor
└── README.md        # Esta documentación
```

## 🧪 Tests (Futuro)

La carpeta `tests/` está preparada para agregar tests unitarios que cubran:

- Cálculo de diferencias de fechas
- Generación de mensajes
- Manejo de errores
- Configuración de cliente WhatsApp 