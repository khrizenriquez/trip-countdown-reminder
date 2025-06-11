# 🧳 Trip Countdown Reminder

Sistema automatizado de recordatorios de viaje que envía mensajes diarios por WhatsApp con cuenta regresiva hasta la fecha del viaje, con interfaz web moderna para visualización en tiempo real.

## ✨ Características

- 🤖 **Bot automatizado**: Envía recordatorios diarios por WhatsApp usando Twilio
- 🌐 **Frontend moderno**: Interfaz web responsiva con cuenta regresiva en tiempo real  
- ☁️ **Despliegue en Railway**: Backend automático con cron jobs
- 📱 **GitHub Pages**: Frontend estático desplegado automáticamente
- 🎨 **Modo oscuro/claro**: Tema adaptable con animaciones suaves
- 🔒 **Seguro**: Variables de entorno para credenciales sensibles

## 🚀 Demo en Vivo

- **Frontend**: [https://khrizenriquez.github.io/trip-countdown-reminder](https://khrizenriquez.github.io/trip-countdown-reminder)
- **Bot WhatsApp**: Envía mensajes automáticos diarios a las 5:55 AM (GMT-6)

## ⚡ Inicio Rápido

### 1. Configuración del Bot de WhatsApp

1. **Crear cuenta en Twilio**:
   - Regístrate en [Twilio](https://www.twilio.com)
   - Configura WhatsApp Sandbox o cuenta verificada
   - Crea un template de mensaje aprobado

2. **Configurar variables en Railway**:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_TEMPLATE_ID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_RECIPIENTS=["whatsapp:+502xxxxxxxx","whatsapp:+502xxxxxxxx"]
   TRIP_DATE=2024-12-15T06:00:00.000Z
   TRIP_DESCRIPTION=Viaje a Europa
   TZ=America/Guatemala
   ```

3. **Desplegar en Railway**:
   - Conecta tu repositorio de GitHub
   - Railway detectará automáticamente el backend Node.js
   - Las variables se configuran en el dashboard de Railway

### 2. Configuración del Frontend

1. **GitHub Pages se despliega automáticamente** desde la rama `main`
2. **Personalizar configuración** en `frontend/src/config.js`:
   ```javascript
   export default {
     trip: {
       date: new Date('2024-12-15T06:00:00.000Z').getTime(),
       description: 'Viaje a Europa 🇪🇺'
     },
     frontend: {
       title: '🧳 Trip Countdown',
       safe_travel_message: '¡Buen Viaje!'
     }
   };
   ```

## 📋 Requisitos Previos

- **Cuenta Twilio**: Para envío de mensajes WhatsApp
- **Cuenta Railway**: Para hosting del backend
- **Cuenta GitHub**: Para hosting del frontend con GitHub Pages

## 🏗️ Arquitectura

```
trip-countdown-reminder/
├── backend/          # Bot de WhatsApp (Node.js + Railway)
│   ├── send-whatsapp.js
│   ├── package.json
│   └── .env.example
├── frontend/         # Interfaz web (Astro + GitHub Pages)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   └── config.js
│   └── package.json
└── .github/workflows/ # CI/CD para GitHub Pages
```

## 🛠️ Scripts Disponibles

### Backend
```bash
npm install          # Instalar dependencias
npm start           # Ejecutar bot (Railway)
```

### Frontend
```bash
npm install          # Instalar dependencias
npm run dev         # Servidor desarrollo (localhost:4321)
npm run build       # Build para producción
npm run preview     # Preview del build
```

## 🔧 Configuración Avanzada

### Template de WhatsApp
El mensaje debe tener exactamente 3 variables:
```
¡Hola {{1}}! ¡Faltan {{2}} días para {{3}}! 🧳✈️
```

### Cron Schedule
```javascript
// Envío diario a las 5:55 AM Guatemala
cron.schedule('55 5 * * *', sendReminderMessage, {
  scheduled: true,
  timezone: process.env.TZ || 'America/Guatemala'
});
```

### Variables de Entorno
```bash
# Backend (.env)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  
WHATSAPP_TEMPLATE_ID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENTS=["whatsapp:+502xxxxxxxx"]
TRIP_DATE=2024-12-15T06:00:00.000Z
TRIP_DESCRIPTION=Viaje a Europa
TZ=America/Guatemala
```

## 📱 Uso

1. **Configurar fecha del viaje** en `config.js` y variables de entorno
2. **Deploy automático**: Push a `main` despliega ambos servicios
3. **Mensajes automáticos**: Bot envía recordatorios diarios
4. **Ver countdown**: Visita el sitio web para cuenta regresiva visual

## 🎨 Personalización

### Colores y Tema
Edita `frontend/src/styles/global.css`:
```css
:root {
  --primary-orange: #f97316;
  --bg-light: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bg-dark: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
}
```

### Mensaje de WhatsApp  
Personaliza en las variables de entorno:
```bash
TRIP_DESCRIPTION="Viaje familiar a Disney 🏰"
```

## 🔍 Troubleshooting

### GitHub Pages 404
1. Ve a Settings → Pages
2. Source: **GitHub Actions**
3. Asegúrate que el repo sea **público**

### Mensajes no llegan
1. Verifica credenciales Twilio
2. Confirma que el template esté **aprobado**
3. Revisa logs en Railway dashboard

### Frontend no actualiza
1. Verifica que el workflow de GitHub Actions se ejecute
2. Limpia cache del navegador
3. Confirma que `config.js` tenga la fecha correcta

## 📄 Licencia

MIT License - ve [LICENSE](LICENSE) para detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork del proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

> 💡 **Tip**: Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial limpio y versionado automático.