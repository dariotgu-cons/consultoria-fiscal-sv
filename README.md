# Plataforma de Consultoría Fiscal para El Salvador

Herramienta para transformar archivos de clientes en obligaciones tributarias presentadas, con validación automática y hallazgos de negocio. SaaS en desarrollo para despacho de consultoría fiscal.

## Stack

- **Frontend**: Next.js (TypeScript, React)
- **Backend**: Firebase (Firestore, Cloud Functions, Cloud Run)
- **Identidad**: Firebase Auth + custom claims
- **Almacenamiento**: Cloud Storage (dos zonas: tránsito + producto)
- **IA**: Vertex AI (Gemini)
- **Vigilancia normativa**: n8n (repo separado)

## Estructura del proyecto

```
consultoria-fiscal-sv/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── tsconfig.json
├── functions/
│   ├── src/
│   │   ├── ingesta/
│   │   ├── cruces/
│   │   ├── validacion/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   ├── src/
│   │   ├── schemas/
│   │   ├── types.ts
│   │   └── constants.ts
│   └── package.json
├── normativa/
│   ├── 2025/
│   │   ├── tasas.json
│   │   ├── umbrales.json
│   │   └── reglas.json
│   ├── 2026/
│   └── README.md
├── docs/
│   ├── PRD-plataforma-consultoria-fiscal-sv.md
│   ├── ARQUITECTURA.md
│   └── DESARROLLO.md
├── .firebaserc
├── firebase.json
├── .gitignore
├── package.json
└── README.md
```

## Comenzar en desarrollo

### Requisitos

- Node.js 18+ y npm
- Firebase CLI (`npm install -g firebase-tools`)
- Credenciales de Firebase (archivo JSON)

### Instalación

```bash
git clone https://github.com/tu-usuario/consultoria-fiscal-sv.git
cd consultoria-fiscal-sv
npm ci

# Instalar dependencias de cada workspace
npm install -w frontend
npm install -w functions
npm install -w shared
```

### Ejecutar en local

```bash
# Emulator Suite + frontend dev server
npm run dev

# Solo emuladores (Firestore, Functions, Auth, Storage)
npm run emulator

# Solo frontend (conecta a dev si existe credencial)
npm run dev:frontend
```

### Pruebas

```bash
# Casos de prueba con hallazgos sembrados
npm test

# Watch mode
npm test -- --watch
```

### Build para producción

```bash
npm run build
```

## Deployar

La rama `develop` se despliega automáticamente a Firebase dev.
La rama `main` se despliega automáticamente a Firebase prod (requiere aprobación en GitHub).

Deployar manual:

```bash
firebase deploy --project=dev      # a ambiente de desarrollo
firebase deploy --project=prod     # a ambiente de producción
```

## Fases del producto

| Fase | Objetivo | Plazo |
|---|---|---|
| **F1 — MVP** | F-910, F-915, F-987 + 9 cruces de enero | Enero 2027 |
| **F2** | Cierre anual: ISR, estados, dictamen | Abril 2027 |
| **F3** | Análisis estratégico: ratios, oportunidades | F3 |
| **F4** | Cobertura ampliada por sector | F4 |
| **F5** | Multi-despacho (SaaS) | F5 |

Ver [PRD completo](docs/PRD-plataforma-consultoria-fiscal-sv.md).

## Reglas no negociables

1. Ningún cálculo fiscal proviene del modelo de IA
2. Toda cifra presentable se rastrea hasta su fila de origen
3. Configuración normativa versionada (no en código)
4. Datos de clientes en tránsito se eliminan a 90 días o al cerrar el ejercicio
5. Bitácora inmutable de toda operación

## Contacto

Darío Torres — dariotgu@consultant.com

---

**Licencia**: MIT
