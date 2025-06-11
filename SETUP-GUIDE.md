# 📱 Guía Práctica: Configurar Nombres y Números

## 🏠 **Para Pruebas Locales**

### **Paso 1: Crear archivo .env local**

```bash
# Copia el archivo de ejemplo
cp env.local.example .env

# Edita con tus datos reales
nano .env
```

### **Paso 2: Configurar tus destinatarios**

Edita la línea `WHATSAPP_RECIPIENTS` en tu archivo `.env`:

#### **Para UN destinatario:**
```bash
WHATSAPP_RECIPIENTS=[{"name":"TuNombre","lastName":"TuApellido","phone":"+502XXXXXXXX"}]
```

#### **Para VARIOS destinatarios:**
```bash
WHATSAPP_RECIPIENTS=[{"name":"Persona1","lastName":"Apellido1","phone":"+502XXXXXXXX"},{"name":"Persona2","lastName":"Apellido2","phone":"+502YYYYYYYY"},{"name":"Persona3","lastName":"Apellido3","phone":"+502ZZZZZZZZ"}]
```

### **Paso 3: Probar localmente**

```bash
# Ejecutar el backend en modo desarrollo
node backend/send-whatsapp.js --dev

# O ejecutar con el frontend
npm run dev
```

### **📋 Tu archivo .env completo:**

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
TRIP_DATE=2025-06-26T09:40:00
TRIP_TIMEZONE=America/Guatemala
TRIP_DESCRIPTION=Vuelo - Jueves 26 de junio de 2025 a las 9:40 AM
WHATSAPP_TEMPLATE_ID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENTS=[{"name":"TuNombre","lastName":"TuApellido","phone":"+502XXXXXXXX"}]
TZ=America/Guatemala
NODE_ENV=development
```

---

## 🚀 **Para Producción (Railway)**

### **Paso 1: Ir a Railway**

1. 🌐 Ve a https://railway.app
2. 📂 Selecciona tu proyecto
3. ⚙️ Click en **Variables** tab

### **Paso 2: Agregar variables una por una**

Agrega estas variables exactamente como aparecen:

| Variable | Valor |
|----------|-------|
| `TWILIO_ACCOUNT_SID` | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_WHATSAPP_NUMBER` | `+14155238886` |
| `TRIP_DATE` | `2025-06-26T09:40:00` |
| `TRIP_TIMEZONE` | `America/Guatemala` |
| `TRIP_DESCRIPTION` | `Vuelo - Jueves 26 de junio de 2025 a las 9:40 AM` |
| `WHATSAPP_TEMPLATE_ID` | `HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `WHATSAPP_RECIPIENTS` | Ver ejemplos abajo ⬇️ |
| `TZ` | `America/Guatemala` |
| `NODE_ENV` | `production` |

### **Paso 3: Configurar WHATSAPP_RECIPIENTS**

⚠️ **IMPORTANTE**: Debe ser JSON válido en **UNA SOLA LÍNEA**

#### **Para un destinatario:**
```json
[{"name":"TuNombre","lastName":"TuApellido","phone":"+502XXXXXXXX"}]
```

#### **Para múltiples destinatarios:**
```json
[{"name":"Persona1","lastName":"Apellido1","phone":"+502XXXXXXXX"},{"name":"Persona2","lastName":"Apellido2","phone":"+502YYYYYYYY"}]
```

#### **Para agregar más destinatarios:**
```json
[{"name":"Persona1","lastName":"Apellido1","phone":"+502XXXXXXXX"},{"name":"Persona2","lastName":"Apellido2","phone":"+502YYYYYYYY"},{"name":"Persona3","lastName":"Apellido3","phone":"+502ZZZZZZZZ"}]
```

---

## 🛠️ **Comandos Útiles**

### **Desarrollo local:**
```bash
# Probar backend con variables de entorno
node backend/send-whatsapp.js --dev

# Probar envío manual
curl -X POST http://localhost:3001/api/send-whatsapp

# Ver variables cargadas
node -e "require('dotenv').config(); console.log(process.env.WHATSAPP_RECIPIENTS)"
```

### **Producción (Railway):**
```bash
# Ver logs en tiempo real
railway logs

# Deploy manual
git push origin main  # Auto-deploy se ejecuta
```

---

## 🔍 **Troubleshooting**

### **❌ Error: "Error parsing WHATSAPP_RECIPIENTS JSON"**

**Problema**: El JSON no es válido

**Solución**: Verifica que:
- Uses comillas dobles `"` no simples `'`
- No hay espacios o saltos de línea
- Cada campo está separado por comas

```bash
# ❌ INCORRECTO
WHATSAPP_RECIPIENTS=[{'name':'Juan','lastName':'Pérez','phone':'+502XXXXXXXX'}]

# ✅ CORRECTO  
WHATSAPP_RECIPIENTS=[{"name":"Juan","lastName":"Pérez","phone":"+502XXXXXXXX"}]
```

### **❌ Error: "No recipients configured"**

**Problema**: La variable no se está leyendo

**Solución**: 
- **Local**: Verifica que el archivo `.env` existe
- **Railway**: Verifica que la variable `WHATSAPP_RECIPIENTS` está configurada

### **❌ WhatsApp no llega**

**Problema**: Destinatarios no están en sandbox

**Solución**:
1. Cada número debe enviar `join tu-codigo` al +1 415 523 8886
2. Verificar formato de números (+502, +1, etc.)

---

## 📝 **Ejemplos Prácticos**

### **Configuración para familia (3 personas):**
```json
[{"name":"Persona1","lastName":"Apellido1","phone":"+502XXXXXXXX"},{"name":"Persona2","lastName":"Apellido2","phone":"+502YYYYYYYY"},{"name":"Persona3","lastName":"Apellido3","phone":"+502ZZZZZZZZ"}]
```

### **Configuración para amigos (5 personas):**
```json
[{"name":"Amigo1","lastName":"Apellido1","phone":"+502XXXXXXXX"},{"name":"Amigo2","lastName":"Apellido2","phone":"+502YYYYYYYY"},{"name":"Amigo3","lastName":"Apellido3","phone":"+502ZZZZZZZZ"},{"name":"Amigo4","lastName":"Apellido4","phone":"+502AAAAAAAA"},{"name":"Amigo5","lastName":"Apellido5","phone":"+502BBBBBBBB"}]
```

---

## 🚨 **Recordatorios de Seguridad**

- ❌ **NUNCA** commites el archivo `.env` a Git
- ✅ **SIEMPRE** usa el archivo `env.local.example` como plantilla
- 🔒 **Variables sensibles** solo en plataforma de hosting
- 📱 **Números reales** solo en variables de entorno, nunca en código
- 🚫 **Los archivos .example NO contienen datos reales** - solo placeholders 