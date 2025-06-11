# 🔒 Guía de Seguridad - Trip Countdown Reminder

## 🚨 **REGISTRO DE INCIDENTES DE SEGURIDAD**

### **✅ Incidente resuelto - Datos sensibles en archivos de ejemplo**
- **Fecha**: Enero 2025
- **Problema**: Credenciales reales y números de teléfono en archivos `.example` rastreados en Git
- **Impacto**: Exposición de:
  - Credenciales de Twilio (`AC421...xxxxx`, `db1d...xxxxx`)
  - Template ID real (`HXe9bd...xxxxx`)
  - Número de teléfono personal (`+502...xxxxx`)
- **Solución**: Reemplazados con placeholders en todos los archivos `.example` y documentación
- **Archivos limpiados**:
  - `env.local.example` ✅
  - `env.production.example` ✅
  - `config.local.example.json` ✅
  - `SETUP-GUIDE.md` ✅
  - `README.md` ✅
  - `PRODUCTION.md` ✅
- **Estado**: **RESUELTO** - Archivos de ejemplo ahora solo contienen placeholders

---

## 🚨 **DATOS CRÍTICOS - NUNCA COMMITEAR**

Los siguientes archivos y datos **NUNCA** deben ser incluidos en Git:

### **Archivos prohibidos:**
- `.env` (contiene credenciales reales)
- `backend/session/` (datos de WhatsApp Web)
- Cualquier archivo con credenciales reales

### **Datos sensibles que NO deben aparecer en código:**
- Credenciales de Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- Template ID real: `WHATSAPP_TEMPLATE_ID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Números de teléfono reales
- Nombres y apellidos reales

## ✅ **CONFIGURACIÓN SEGURA**

### **Desarrollo Local:**
```bash
# 1. Copia el archivo de ejemplo
cp env.local.example .env

# 2. Edita .env con TUS datos reales (este archivo NO se commitea)
nano .env

# 3. Tu .env debe contener datos REALES como:
# TWILIO_ACCOUNT_SID=ACtu_sid_real_aqui
# TWILIO_AUTH_TOKEN=tu_token_real_aqui
# WHATSAPP_TEMPLATE_ID=HXtu_template_id_real_aqui
```

### **Producción (Railway):**
1. Ve a https://railway.app → tu proyecto → Variables
2. Agrega variables una por una con valores REALES
3. NUNCA uses los valores de ejemplo (XXX) en producción

## 📋 **ARCHIVOS PERMITIDOS EN GIT**

### **Archivos de ejemplo (con placeholders):**
- `env.local.example` ✅
- `env.production.example` ✅
- `config.local.example.json` ✅

### **Archivos con datos reales (NUNCA commitear):**
- `.env` ❌
- `config.json` (si contiene datos reales) ❌
- `backend/session/` ❌

## 🛡️ **VERIFICACIÓN DE SEGURIDAD**

Antes de cada commit, verifica que no hay datos sensibles:

```bash
# Buscar credenciales en archivos rastreados
git grep -n "AC[a-f0-9]" -- "*.md" "*.json" "*.example"
git grep -n "+502" -- "*.md" "*.json" "*.example"
git grep -n "HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" -- "*.md" "*.json" "*.example"

# Verificar que .env NO está en staging
git status | grep -v ".env"
```

## 🚨 **SI YA COMMITEASTE DATOS SENSIBLES**

### **Limpieza inmediata:**
```bash
# 1. Remover archivo del historial completo
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch archivo_con_datos.extension' \
  --prune-empty --tag-name-filter cat -- --all

# 2. Forzar push (⚠️ PELIGROSO)
git push origin --force --all

# 3. Cambiar inmediatamente las credenciales expuestas
```

## 💡 **MEJORES PRÁCTICAS**

1. **Solo variables de entorno** para datos sensibles
2. **Archivos .example** solo con placeholders  
3. **Verificar antes de commit** que no hay datos reales
4. **Documentar claramente** qué archivos son seguros vs sensibles
5. **Usar .gitignore** apropiadamente

## 📞 **EN CASO DE EXPOSICIÓN ACCIDENTAL**

1. **Cambiar inmediatamente** todas las credenciales expuestas
2. **Limpiar historial de Git** con `git filter-branch`
3. **Notificar** si hay datos personales de terceros involucrados
4. **Revisar logs** de plataformas para accesos no autorizados

## 🚀 **Variables para GitHub Actions**

### **Variables para el frontend (GitHub Pages):**

No necesitas variables secretas para el frontend porque es estático.

### **Si quieres agregar secrets de GitHub (opcional):**

1. 🌐 Ve a tu repo en GitHub
2. ⚙️ **Settings** → **Secrets and variables** → **Actions**
3. ➕ **New repository secret**

```
# Para futuras funciones (opcional)
GITHUB_TOKEN # (ya incluido automáticamente)
```

---

## 🔒 **Mejores Prácticas de Seguridad**

### **1. Rotación de credenciales:**
- 🔄 Cambia las credenciales de Twilio cada 90 días
- 🔍 Monitorea el uso en Twilio Console
- 📊 Revisa logs regularmente

### **2. Limitación de acceso:**
- 🎯 Usa números específicos en sandbox
- 🌍 Configura IP allowlists en Twilio (opcional)
- 📱 Limita permisos de la API key

### **3. Monitoreo:**
- 📊 Revisa logs de Railway regularmente
- 💰 Monitorea costos de Twilio
- 🚨 Configura alertas de gasto

---

## 🛠️ **Comandos de Seguridad**

### **Verificar que no hay credenciales expuestas:**
```bash
# Buscar posibles credenciales en el código
grep -r "AC[0-9a-f]\{32\}" . --exclude-dir=node_modules
grep -r "SK[0-9a-f]\{32\}" . --exclude-dir=node_modules

# Verificar .gitignore
git check-ignore .env config.local.json
```

### **Limpiar historial si subiste credenciales por error:**
```bash
# ⚠️ CUIDADO: Esto reescribe el historial
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch archivo_con_credenciales" \
--prune-empty --tag-name-filter cat -- --all
```

---

## 📋 **Checklist Final de Seguridad**

Antes de hacer deploy, verifica:

- [ ] ✅ Variables de entorno configuradas en Railway
- [ ] ✅ `.env` files están en .gitignore
- [ ] ✅ No hay credenciales hardcodeadas en código
- [ ] ✅ Números de teléfono despersonalizados en docs
- [ ] ✅ `config.local.json` con datos reales (local only)
- [ ] ✅ Templates de configuración creados
- [ ] ✅ Documentación actualizada sin datos sensibles

---

## 🆘 **¿Qué hacer si expusiste credenciales?**

### **1. Acción inmediata:**
- 🚨 **Regenera credenciales en Twilio inmediatamente**
- 🔄 **Actualiza variables en Railway**
- 📧 **Notifica a tu equipo si aplica**

### **2. Prevenir futuros problemas:**
- 🔍 Usa pre-commit hooks
- 📊 Configura alertas de seguridad
- 🔄 Implementa rotación automática

---

⚠️ **RECUERDA**: La seguridad es un proceso continuo, no un evento único.

## 🚨 **Variables de Entorno para Railway**

### **✅ Variables REQUERIDAS en Railway:**

```
# Credenciales de Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_de_32_caracteres
TWILIO_WHATSAPP_NUMBER=+14155238886

# Configuración del viaje
TRIP_DATE=2025-06-26T09:40:00
TRIP_TIMEZONE=America/Guatemala
TRIP_DESCRIPTION=Vuelo - Jueves 26 de junio de 2025 a las 9:40 AM

# Configuración de WhatsApp
WHATSAPP_TEMPLATE_ID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_RECIPIENTS=[{"name":"Tu Nombre","lastName":"Tu Apellido","phone":"+502XXXXXXXX"}]

# Configuración del sistema
TZ=America/Guatemala
NODE_ENV=production
```

### **🌐 Variables OPCIONALES para GitHub Pages (Frontend):**

```
# Solo si quieres personalizar el frontend desde variables de entorno
PUBLIC_TRIP_DATE=2025-06-26T09:40:00
PUBLIC_TRIP_TIMEZONE=America/Guatemala
PUBLIC_TRIP_DESCRIPTION=Vuelo - Jueves 26 de junio de 2025 a las 9:40 AM
```

### **📋 Formato de WHATSAPP_RECIPIENTS:**

El formato debe ser un JSON array válido:

```json
[
  {
    "name": "Juan",
    "lastName": "Pérez",
    "phone": "+502XXXXXXXX"
  },
  {
    "name": "María",
    "lastName": "García",
    "phone": "+502YYYYYYYY"
  }
]
```

**⚠️ IMPORTANTE**: 
- Usar comillas dobles en JSON
- Incluir código de país en teléfonos (+502, +1, etc.)
- Todo en una sola línea para Railway

### **🔑 Cómo agregar variables en Railway:**
1. 🌐 Ve a tu proyecto en Railway
2. ⚙️ **Variables** tab
3. ➕ **Add Variable**
4. 🔒 Agrega cada variable una por una

---

## 🛡️ **Configuración Segura del Repositorio**

### **❌ NUNCA subas a Git:**
- ❌ Credenciales reales de Twilio
- ❌ Números de teléfono personales
- ❌ Archivos `.env` con datos reales
- ❌ Tokens de acceso
- ❌ Session folders de WhatsApp

### **✅ SÍ incluye en Git:**
- ✅ Archivos `.example` con placeholders
- ✅ Configuración de estructura
- ✅ Templates de configuración
- ✅ Documentación sin credenciales

---

## 📂 **Gestión de Configuración Local**

### **Para desarrollo local:**

1. **Copia la configuración de ejemplo:**
   ```bash
   cp config.local.example.json config.local.json
   ```

2. **Edita con tus datos reales:**
   ```json
   {
     "whatsapp": {
       "recipients": [
         {
           "name": "Tu Nombre Real",
           "lastName": "Tu Apellido Real",
           "phone": "+502XXXXXXXX"
         }
       ]
     }
   }
   ```

3. **El archivo `config.local.json` NUNCA se sube a Git** (está en .gitignore)

---

## 🔍 **Auditoría de Seguridad**

### **✅ Estado actual del proyecto:**
- ✅ `.gitignore`