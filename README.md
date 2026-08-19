# Plataforma de Consultoría Fiscal para El Salvador

Herramienta para transformar archivos de clientes en obligaciones tributarias presentadas, con validación automática y hallazgos de negocio. SaaS en desarrollo para despacho de consultoría fiscal.

## Stack

- **Frontend**: Next.js (TypeScript, React)
- **Backend**: Firebase (Firestore, Cloud Functions, Cloud Run)
- **Identidad**: Firebase Auth + custom claims
- **Almacenamiento**: Cloud Storage (dos zonas: tránsito + producto)
- **IA**: Vertex AI (Gemini)
- **Vigilancia normativa**: n8n (repo separado)

## Estructura

  ├── frontend/ SPA con Next.js
  ├── functions/ Cloud Functions (ingesta, cruces, validación)
  ├── shared/ Esquemas y tipos TypeScript compartidos
  ├── normativa/ Configuración versionada (tasas, umbrales, reglas)
  ├── docs/ Documentación
  │ └── PRD-plataforma-consultoria-fiscal-sv.md
  └── firebase.json Configuración Firebase


## Desarrollo

```bash
npm ci
npm run dev          # Emulator Suite + frontend dev server
npm test             # Casos de prueba con hallazgos sembrados
npm run build        # Build producción
```

## Fases

- **F1 — MVP (enero 2027)**: F-910, F-915, F-987 + 9 cruces validatorios
- **F2 — Cierre anual**: ISR, estados financieros, dictamen
- **F3 — Estrategia**: Análisis de negocio, indicadores, oportunidades
- **F4+**: Cobertura ampliada, multi-despacho

Sujeto a las especificaciones del [PRD](docs/PRD-plataforma-consultoria-fiscal-sv.md).
