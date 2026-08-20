/**
 * Modelo de datos de Firestore para la plataforma de consultoría fiscal.
 * Traduce el modelo conceptual del PRD (§13) a colecciones concretas.
 *
 * Jerarquía de rutas:
 *   usuarios/{uid}                             (top-level, no anidada; ver
 *                                                firestore.rules para el porqué)
 *   despachos/{despachoId}
 *     clientes/{clienteId}
 *       perfilesDeMapeo/{tipoInsumo}
 *       ejercicios/{ejercicioId}
 *         configuraciones/{versionId}
 *         insumos/{insumoId}
 *         resultados/{resultadoId}
 *         ajustes/{ajusteId}
 *         formularios/{formularioId}
 *         bitacora/{eventoId}
 *   catalogoNormativo/{obligacionId}          (compartido entre despachos)
 *   plantillasFormulario/{codigoVersionId}    (compartido entre despachos)
 *   ordenanzasMunicipales/{municipioId}       (compartido entre despachos)
 *
 * Regla de diseño (PRD §13): en Firestore van agregados y decisiones, no
 * filas de detalle. Las filas de un insumo se normalizan a un archivo en
 * Cloud Storage (zona de tránsito, M13.3); en Firestore solo queda el
 * puntero, la huella (hash) y los totales agregados.
 */

/** Estructura mínima común a Timestamp del SDK cliente y del SDK admin. */
export interface FirestoreTimestampLike {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

// ---------------------------------------------------------------------------
// Roles y usuarios (PRD §5)
// ---------------------------------------------------------------------------

/** Fase 1 = interno (titular/asistente/lectura). Fase 2+ agrega cliente. */
export type Rol = "titular" | "asistente" | "lectura" | "cliente";

export interface Usuario {
  /** Igual al uid de Firebase Auth; también es el ID del documento. */
  uid: string;
  despachoId: string;
  email: string;
  nombre: string;
  rol: Rol;
  /**
   * IDs de Cliente a los que tiene acceso. Ignorado para rol "titular"
   * (acceso a todo el despacho). Relevante para "asistente" y "lectura".
   */
  clientesAsignados: string[];
  activo: boolean;
  creadoEn: FirestoreTimestampLike;
}

// ---------------------------------------------------------------------------
// Despacho (PRD §14 — M14.1: nivel de tenant desde el día uno)
// ---------------------------------------------------------------------------

export interface Despacho {
  id: string;
  nombre: string;
  creadoEn: FirestoreTimestampLike;
}

// ---------------------------------------------------------------------------
// Cliente y perfil de mapeo (PRD M1, M3.4)
// ---------------------------------------------------------------------------

export interface Cliente {
  id: string;
  despachoId: string;
  /** NIT o NRC. */
  identificacionFiscal: string;
  razonSocial: string;
  giro: string;
  sector: string;
  regimenEspecial: string | null;
  municipios: string[];
  creadoEn: FirestoreTimestampLike;
  actualizadoEn: FirestoreTimestampLike;
}

export type TipoInsumo =
  | "planilla_anual"
  | "retenciones_terceros"
  | "socios_dividendos"
  | "libro_compras_iva"
  | "libro_ventas_contribuyentes"
  | "declaraciones_mensuales";

/** Reutilizable entre ejercicios de un mismo cliente (M3.4). */
export interface PerfilDeMapeo {
  id: string;
  clienteId: string;
  tipoInsumo: TipoInsumo;
  /** Encabezado de origen -> campo canónico. */
  mapeoColumnas: Record<string, string>;
  actualizadoEn: FirestoreTimestampLike;
}

// ---------------------------------------------------------------------------
// Ejercicio y sus subcolecciones (PRD M1.2, M4, M5, M6, M7)
// ---------------------------------------------------------------------------

export type EstadoEjercicio =
  | "borrador"
  | "esperando_insumos"
  | "mapeado"
  | "procesado"
  | "revisado"
  | "aprobado"
  | "presentado"
  | "archivado";

export interface Ejercicio {
  id: string;
  clienteId: string;
  despachoId: string;
  /** Año fiscal, ej. 2026. */
  anio: number;
  estado: EstadoEjercicio;
  responsableUid: string;
  /** M1.6: un ejercicio aprobado queda bloqueado; corregirlo crea versión nueva. */
  bloqueado: boolean;
  creadoEn: FirestoreTimestampLike;
  actualizadoEn: FirestoreTimestampLike;
}

/** Versionada por ejercicio (M4.1): tasas, umbrales, tolerancias, reglas. */
export interface Configuracion {
  id: string;
  ejercicioId: string;
  version: number;
  tasas: Record<string, number>;
  umbrales: Record<string, number>;
  tolerancias: Record<string, number>;
  reglas: Record<string, unknown>;
  vigenteDesde: FirestoreTimestampLike;
  creadoPorUid: string;
}

export type EstadoInsumo =
  | "pendiente"
  | "cargado"
  | "mapeado"
  | "procesado"
  | "con_error";

/**
 * Metadatos de un insumo cargado. Las filas crudas NO viven aquí: se
 * normalizan a un archivo en Storage (zona de tránsito) referenciado por
 * `storagePath`, borrado por M13.3 (revisión del ejercicio o 90 días).
 */
export interface Insumo {
  id: string;
  ejercicioId: string;
  tipo: TipoInsumo;
  nombreArchivoOriginal: string;
  /** Hash SHA-256 del archivo recibido (M2.5). */
  huella: string;
  storagePath: string | null;
  estado: EstadoInsumo;
  filasAgregadas: Record<string, unknown> | null;
  cargadoPorUid: string;
  cargadoEn: FirestoreTimestampLike;
  /** Fecha programada de borrado del archivo crudo (M13.3). */
  borrarEn: FirestoreTimestampLike;
}

export interface Resultado {
  id: string;
  ejercicioId: string;
  agregados: Record<string, unknown>;
  cruces: Record<string, unknown>;
  liquidacion: Record<string, unknown> | null;
  generadoEn: FirestoreTimestampLike;
}

export interface Ajuste {
  id: string;
  ejercicioId: string;
  concepto: string;
  tipo: string;
  monto: number;
  baseLegal: string;
  origen: string;
  autorUid: string;
  creadoEn: FirestoreTimestampLike;
}

export type EstadoFormulario = "generado" | "revisado" | "presentado";

export interface Formulario {
  id: string;
  ejercicioId: string;
  /** Ej. "F-910", "F-915", "F-987". */
  codigo: string;
  version: string;
  estado: EstadoFormulario;
  rutaPdf: string | null;
  acuseRecibo: string | null;
  generadoEn: FirestoreTimestampLike;
}

/** Inmutable: solo create, nunca update ni delete (M13.6). */
export interface BitacoraEvento {
  id: string;
  ejercicioId: string;
  evento: string;
  autorUid: string;
  fecha: FirestoreTimestampLike;
  valorAnterior: unknown;
  valorNuevo: unknown;
  motivo: string;
}

// ---------------------------------------------------------------------------
// Catálogo normativo — compartido entre despachos (PRD §13, M8, M14.3)
// ---------------------------------------------------------------------------

export interface Obligacion {
  id: string;
  institucion: string;
  baseLegal: string;
  plazo: string;
  condicionAplicabilidad: string;
  actualizadoEn: FirestoreTimestampLike;
}

export interface PlantillaFormulario {
  id: string;
  codigo: string;
  version: string;
  fuente: string;
  fecha: FirestoreTimestampLike;
  huella: string;
  layout: Record<string, unknown>;
}

export interface OrdenanzaMunicipal {
  id: string;
  municipio: string;
  tarifas: Record<string, number>;
  plazos: Record<string, string>;
  vigenciaDesde: FirestoreTimestampLike;
  vigenciaHasta: FirestoreTimestampLike | null;
}
