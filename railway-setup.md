# 🚂 Railway: Setup en 5 Minutos

## 🎯 **Opción 1: Solo Backend en Railway (Recomendada)**

### **Paso 1: Preparar el código**
```bash
# Ya tienes todo listo, solo necesitas hacer push
git add .
git commit -m "feat: ready for Railway deployment"
git push origin main
```

### **Paso 2: Desplegar en Railway**
1. 🌐 Ve a https://railway.app
2. 🔑 **Sign in with GitHub**
3. 🆕 **New Project** → **Deploy from GitHub repo**
4. 📂 **Selecciona tu repositorio** `trip-countdown-reminder`
5. ⚙️ **Add Variables**:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=tu_auth_token_aqui_32_caracteres
   TWILIO_WHATSAPP_NUMBER=+14155238886
   TZ=America/Guatemala
   NODE_ENV=production
   ```
6. 🚀 **Deploy** - ¡Automático!

### **Paso 3: Verificar**
- 📊 Ver logs en tiempo real
- ✅ Confirmar que el bot funciona
- ⏰ Los mensajes se enviarán automáticamente

**🎯 Resultado:**
- 🌐 Frontend: `https://tu-usuario.github.io/trip-countdown-reminder` (gratis)
- 🖥️ Backend: Railway bot ejecutándose 24/7
- 💰 Total: $5/mes

---

## 🎯 **Opción 2: Todo en Railway**

Si prefieres tener todo centralizado:

### **Modificar para servir frontend desde Railway:**

```bash
# Crear un servidor express simple que sirva el frontend
cd backend
npm install express
```

Crear `backend/server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Todas las rutas devuelven el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend servidor en puerto ${PORT}`);
});

// Mantener el bot funcionando
require('./send-whatsapp.js');
```

Actualizar `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "node backend/server.js",
    "restartPolicyType": "ALWAYS"
  }
}
```

**🎯 Resultado:**
- 🌐 Frontend + Backend: Todo en Railway
- 🌍 Una sola URL para todo
- 💰 Total: $5-7/mes

---

## 💡 **Mi Recomendación Personal:**

### **🥇 Para ti: Opción 1 (Separado)**
```
✅ Frontend en GitHub Pages (gratis, súper rápido)
✅ Backend en Railway (fácil, automático)
✅ Costo mínimo: $5/mes
✅ Setup: 10 minutos total
```

### **¿Por qué separado es mejor?**
- 🚀 **GitHub Pages es súper rápido** para sitios estáticos
- 💰 **Más económico** - Frontend gratis
- 🔧 **Menos complejo** - Cada cosa hace lo suyo
- 📈 **Mejor para escalar** - Frontend puede servir millones de visits gratis

## 🚀 **¿Empezamos con Railway?**

¿Quieres que configuremos Railway ahora? Solo necesitas:
1. Crear cuenta en railway.app
2. Conectar tu repositorio GitHub
3. Agregar las variables de entorno (con TUS credenciales reales)
4. ¡Deploy automático!

⚠️ **IMPORTANTE**: Nunca agregues credenciales reales en archivos de documentación. Úsalas solo en las variables de entorno de la plataforma de hosting. 