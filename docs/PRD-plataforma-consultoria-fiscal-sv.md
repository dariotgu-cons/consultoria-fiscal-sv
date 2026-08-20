# PRD — Plataforma de consultoría fiscal y estratégica para El Salvador

| Campo | Valor |
|---|---|
| Versión | 2.0 — documento único, sustituye la v1.0 y su adenda |
| Fecha | Agosto 2026 |
| Responsable de producto | Darío Torres |
| Equipo de construcción | Un desarrollador (el mismo autor), 14 horas semanales |
| Hito ancla | **Informes de enero de 2027** |
| Alcance institucional del MVP | Ministerio de Hacienda (DGII) + Alcaldía de San Salvador |
| Mantenimiento normativo | Curaduría humana con vigilante automatizado |
| Acceso en fase 1 | Solo el consultor titular |
| Estado de partida | Prototipo funcional en HTML con motor determinista, facsímiles verificados y configuración versionada |

---

## 1. Problema

El consultor fiscal salvadoreño enfrenta tres cuellos de botella que se repiten cliente por cliente y año por año:

1. **Reconstrucción manual del expediente.** Cada cliente entrega su información en una estructura distinta y cada año la vuelve a cambiar. El consultor remapea desde cero en Excel, sin memoria de lo que hizo el año anterior.
2. **Detección tardía de incongruencias.** Las diferencias entre contabilidad, libros de IVA, planilla y declaraciones presentadas se descubren cuando ya se presentó, o cuando la DGII las encuentra primero.
3. **El cumplimiento desplaza al trabajo de valor.** El tiempo se consume llenando formularios y no en lo que el cliente realmente paga: decirle cómo administrar mejor su empresa.

El resultado es un servicio que se percibe como digitación de formularios y se cobra como tal, cuando el conocimiento aplicado justificaría una tarifa distinta.

## 2. Visión

Una plataforma donde el consultor concentre todos sus clientes, cargue su información en cualquier estructura, obtenga los formularios de sus obligaciones ya llenos y validados, y **libere tiempo para el análisis estratégico** — que la herramienta también alimenta con hallazgos.

El cumplimiento es la puerta de entrada. La estrategia es el producto.

### Posicionamiento

> Para el consultor financiero y fiscal que atiende empresas medianas y grandes en El Salvador, que hoy pierde la mayor parte de su tiempo reconstruyendo información en Excel, esta plataforma convierte los archivos del cliente en obligaciones presentadas y en hallazgos de negocio, con la normativa salvadoreña ya modelada, a diferencia de un software contable genérico o de una hoja de cálculo heredada.

### No es

| No es | Por qué queda fuera |
|---|---|
| Un sistema contable | No sustituye al libro del cliente; lo consume |
| Un portal operativo para el cliente | El cliente revisa y aprueba, no trabaja dentro |
| Un presentador automático ante el MH | No hay API pública, y automatizar con credenciales del cliente es riesgo legal |
| Un custodio de los registros del cliente | El Art. 147 CT es obligación del contribuyente (§10) |
| Un SaaS multi-despacho | Preparado en el modelo de datos, no habilitado |

---

## 3. La restricción que gobierna el documento

**Un constructor, 14 horas semanales.** No es un detalle de recursos: es el criterio de diseño principal.

| Implicación | Consecuencia |
|---|---|
| No hay capacidad para 44 ordenanzas municipales | Solo San Salvador en el MVP |
| No hay equipo de contenido normativo | El catálogo crece formulario por formulario, por demanda real |
| No hay QA dedicado | Todo cálculo fiscal debe ser determinista y verificable contra un caso de prueba cuadrado |
| El autor es punto único de falla | El conocimiento normativo vive en configuración versionada, no en código ni en su memoria |
| El tiempo compite con trabajo facturable | Cada bloque debe ser útil por sí solo el día que se termina |

**Regla de priorización:** ningún módulo entra al MVP si no sirve para cerrar los informes de enero o para vender la herramienta a los clientes en negociación.

---

## 4. Decisiones de producto tomadas

| # | Decisión | Valor | Efecto |
|---|---|---|---|
| D1 | Cartera | 0 clientes activos · 5 en negociación | El MVP es también material de venta: requiere modo demostración |
| D2 | Hito ancla | Informes de enero de 2027 | Recorta el MVP a la mitad (§6) |
| D3 | Municipios | Solo San Salvador | Una ordenanza a modelar |
| D4 | Capacidad | 14 h semanales, ~294 h hasta el 15 de enero | Presupuesto planificado contra 256 h |
| D5 | Línea base de horas por cierre | **Sin definir** — pendiente de reunión con socios | Riesgo abierto (§13, R11) |
| D6 | Ventana de datos en tránsito | Al marcar el ejercicio como revisado, **con tope de 90 días** | Evita custodia por olvido |
| D7 | Retención de papeles propios | Vigencia del contrato **más período de defensa profesional** | Pendiente de precisar con abogado |
| D8 | Conectores a sistemas del cliente | Ninguno disponible hoy | Se diseña la interfaz, no se implementa |
| D9 | Base técnica | Construir sobre el prototipo, escalable a módulos | El primer bloque es migración, no reescritura |
| D10 | Usuarios | Solo el titular | El rol de asistente sale del MVP; la estructura de roles se conserva |

---

## 5. Usuarios y roles

### Fase 1 — interno

| Rol | Estado | Permisos |
|---|---|---|
| **Consultor titular** | Activo en el MVP | Todo, incluida la configuración normativa y la aprobación |
| **Asistente** | Modelado, no habilitado | Operar expedientes; no aprueba ni cambia reglas |
| **Revisor / lectura** | Modelado, no habilitado | Solo lectura sobre expedientes asignados |

### Fases posteriores

| Rol | Fase | Permisos |
|---|---|---|
| **Cliente** | 2 | Ver estado, aprobar cifras, subir archivos de su expediente |
| **Despacho suscriptor** | 5 | Aislado en su propio tenant |

---

## 6. Casos de uso

| ID | Como… | Quiero… | Para… |
|---|---|---|---|
| CU-01 | consultor | tener todos mis clientes con su historial por año en un solo lugar | dejar de buscar en carpetas y correos |
| CU-02 | consultor | cargar el Excel del cliente aunque cambie de estructura cada año | no remapear desde cero |
| CU-03 | consultor | saber qué obligaciones aplican a cada cliente y cuándo vencen | no depender de mi memoria |
| CU-04 | consultor | que el sistema detecte incongruencias antes de presentar | no descubrir el error cuando ya es multa |
| CU-05 | consultor | generar los formularios llenos y listos para revisión | eliminar la digitación |
| CU-06 | consultor | saber dónde está el error cuando algo no cuadra | no perder horas buscando una diferencia |
| CU-07 | consultor | entregar hallazgos del negocio, no solo formularios | justificar tarifa de consultoría, no de digitación |
| CU-08 | consultor | enterarme cuando el MH o la alcaldía cambien un formulario o una tasa | no presentar con plantilla vencida |
| CU-09 | consultor | mostrar la herramienta funcionando en una reunión de venta | cerrar los 5 clientes en negociación |
| CU-10 | cliente | revisar y aprobar cifras sin entender de formularios | firmar con confianza |
| CU-11 | consultor | reconstruir qué decidí y por qué, dos años después | defender el trabajo en una fiscalización |

---

## 7. Fases y alcance

| Fase | Nombre | Objetivo medible | Instituciones |
|---|---|---|---|
| **F0** | Prototipo validado | Cumplido: consola con motor determinista, facsímiles y configuración versionada | Hacienda |
| **F1 — MVP** | Informes de enero | Presentar F-910, F-915 y F-987 de los clientes que firmen, sin salir de la plataforma | Hacienda |
| **F2** | Cierre anual | Completar el cierre de abril y el dictamen de mayo | Hacienda + San Salvador |
| **F3** | Estrategia y cliente | Entregar informe de hallazgos estratégicos y habilitar aprobación del cliente | + ISSS, AFP, INSAFORP |
| **F4** | Cobertura ampliada | Cubrir obligaciones sectoriales de la cartera real | + SSF, Regulación Sanitaria, CNR según cartera |
| **F5** | SaaS | Segundo despacho operando aislado | — |

### 7.1 El hito de enero recorta el MVP a la mitad

Las obligaciones de enero **no requieren determinar el ISR**. Esto elimina del MVP la mitad de lo planificado.

**Insumos necesarios (cinco):**

| Insumo | Para qué |
|---|---|
| Planilla anual | F-910, códigos 01 y 60 |
| Retenciones a terceros | F-910, códigos 11, 12, 27, 37, 38, 40 |
| Socios y dividendos | F-910 códigos 43 y 44, y F-915 completo |
| Libro de compras de IVA | F-987, agrupación de proveedores |
| Libro de ventas a contribuyentes | F-987, agrupación de clientes |
| *Declaraciones mensuales presentadas* | *Opcional: cruce de retenido contra enterado* |

**Formularios del hito:**

| Formulario | Plazo | Facsímil |
|---|---|---|
| F-910 V9 — Informe anual de retención del ISR | 31 de enero | **Verificado** |
| F-915 V4 — Distribución de utilidades y listado de socios | Enero | **Verificado** |
| F-987 — Proveedores, clientes, acreedores y deudores | Enero y julio | **Falta plantilla oficial — bloqueante** |
| F-211 — Actualización de dirección | Primeros 10 días hábiles de enero | Trámite simple |

**Postergado al hito de abril:** balanza de comprobación, catálogo de cuentas, inventario, activo fijo, operaciones con relacionados, conciliación fiscal, liquidación del ISR, estados financieros, diagnóstico de descuadres contables, F-11, F-971, F-944, F-983, F-982, y el dictamen F-455 y F-456. Ya están construidos en el prototipo, así que no se pierden: solo no compiten por horas hasta febrero.

**Acción bloqueante inmediata:** descargar del portal del MH la plantilla oficial del F-987 con sus nueve anexos. Sin ella, uno de los tres formularios del hito no se puede construir.

---

## 8. Requerimientos funcionales

Prioridad: **E** = MVP de enero · **A** = hito de abril · **F3/F4/F5** = fase indicada · **W** = fuera de alcance.
Esfuerzo relativo de 1 a 5. Son estimaciones, no compromisos.

### M1 — Clientes y expedientes

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M1.1 | Alta de cliente: identificación fiscal, giro, sector, régimen especial, municipios | E | 1 |
| M1.2 | Expediente por ejercicio con estados: borrador, esperando insumos, mapeado, procesado, revisado, aprobado, presentado, archivado | E | 2 |
| M1.3 | Apertura de ejercicio que clona configuración y perfil de mapeo del año anterior | E | 1 |
| M1.4 | Vista de cartera con estado de cumplimiento y próximos vencimientos | E | 2 |
| M1.5 | **Modo demostración** con data dummy, para reuniones de venta sin exponer información real | E | 1 |
| M1.6 | Bloqueo de expediente aprobado; toda corrección genera versión nueva | E | 2 |
| M1.7 | Comparativo interanual de cifras clave por cliente | A | 2 |

### M2 — Ingesta

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M2.1 | Carga de CSV, TXT, XLSX y XLS, con lectura de todas las hojas | E | 2 |
| M2.2 | Detección automática de la fila de encabezado | E | 2 |
| M2.3 | **Plantillas Excel propias descargables** por tipo de insumo, con validación al recargarlas | E | 2 |
| M2.4 | Detección del tipo de insumo por encabezados y nombre de archivo | E | 2 |
| M2.5 | Huella (hash) de cada archivo recibido | E | 1 |
| M2.6 | Despivotado de archivos en formato ancho (un mes por columna) | A | 3 |
| M2.7 | Interfaz de conector para orígenes por API u OAuth: adaptador, sin implementación | F3 | 3 |
| M2.8 | Conector a base de datos de solo lectura del cliente | W | 4 |
| M2.9 | Lectura de PDF con OCR | W | 5 |

**Nota sobre M2.7 y M2.8.** Ninguno de los clientes en negociación tiene sistema contable con API o base de datos accesible desde internet. El archivo plano será el camino dominante durante años. Se construye la interfaz para no bifurcar el motor después; los conectores se implementan solo cuando exista un cliente concreto que los use.

### M3 — Normalización y mapeo

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M3.1 | Esquema canónico por tipo de insumo | E | 2 |
| M3.2 | Mapeo automático determinista por sinónimos de encabezado | E | 2 |
| M3.3 | Corrección manual de cualquier columna mapeada | E | 1 |
| M3.4 | **Perfil de mapeo persistente por cliente**, reutilizable el año siguiente | E | 2 |
| M3.5 | Mapeo asistido por IA para lo que el motor determinista no resuelve | E | 2 |
| M3.6 | Alerta cuando el archivo del cliente cambió de estructura respecto al año anterior | A | 2 |

### M4 — Reglas y parámetros

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M4.1 | Configuración versionada **por ejercicio fiscal**: tasas, umbrales, tolerancias | E | 2 |
| M4.2 | Bitácora de todo cambio: quién, qué, cuándo, valor anterior, motivo | E | 2 |
| M4.3 | Reprocesar un ejercicio anterior con las reglas vigentes en ese año | E | 2 |
| M4.4 | Herencia en cuatro capas: base nacional, plantilla sectorial, perfil del cliente, ajuste del ejercicio | A | 3 |
| M4.5 | Reglas de gastos no deducibles configurables por patrón, con base legal | A | 2 |
| M4.6 | Plantillas sectoriales: comercio, construcción, servicios, manufactura | A | 2 |

### M5 — Validación e incongruencias

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M5.1 | Cruces con tres estados: conforme, hallazgo, **no evaluable por falta de insumo** | E | 3 |
| M5.2 | Cruces del hito de enero (§8.1) | E | 2 |
| M5.3 | Cuantificación del efecto fiscal de cada hallazgo, con base legal | E | 2 |
| M5.4 | Severidad y materialidad configurables por tolerancia | E | 1 |
| M5.5 | Cruces del cierre anual (§8.2) | A | 3 |
| M5.6 | **Diagnóstico determinista de descuadres**: divisibilidad entre 9, coincidencia con la mitad, coincidencia exacta, pares que suman la diferencia | A | 3 |
| M5.7 | Hipótesis de causa asistidas por IA, solo sobre lo que el motor no resolvió | A | 2 |
| M5.8 | Estimación de exposición a multas con la regla de sanción citada | A | 2 |

#### 8.1 Cruces del hito de enero

| # | Cruce | Efecto si falla |
|---|---|---|
| 1 | ISR de planilla retenido contra lo enterado en los F-14 | Retención practicada y no enterada |
| 2 | Retenciones a terceros contra lo enterado | Diferencia a enterar con mora |
| 3 | Tasa aplicada por concepto contra la tasa legal del código asignado | Retención practicada por debajo de lo debido |
| 4 | Pagos al exterior sin retención practicada | Retención omitida y gasto no deducible |
| 5 | Dividendos: retención del 5%, o 25% si el receptor está en régimen preferente | Retención insuficiente |
| 6 | Suma del F-910 contra la suma de los insumos de origen | Registros omitidos en el informe |
| 7 | Umbral del F-987: 2,753 salarios mínimos | Obligatoriedad del informe |
| 8 | Proveedores y clientes sin NIT válido | Rechazo del anexo en el portal |
| 9 | Códigos de ingreso sin asignar o no catalogados | Informe rechazado |

#### 8.2 Cruces del cierre anual

| # | Cruce | Efecto si falla |
|---|---|---|
| 10 | Balanza cuadrada: deudor contra acreedor | Ningún estado financiero es confiable |
| 11 | Ecuación contable: activo contra pasivo más patrimonio | Cuentas mal clasificadas |
| 12 | Ingresos contables contra ventas declaradas en IVA | Ingreso no facturado: IVA e ISR omitidos |
| 13 | Libros de IVA contra F-07 presentados | Diferencia entre libros y declaración |
| 14 | Débito fiscal al 13% contra el registrado | Error de tasa o de facturación |
| 15 | Crédito fiscal al 13% contra el registrado | Crédito reclamado en exceso o de menos |
| 16 | Pago a cuenta al 1.75% contra lo enterado | Diferencia a enterar con mora |
| 17 | Inventario físico contra saldo contable | Faltante o sobrante con efecto en costo |
| 18 | Umbral de precios de transferencia: US$571,429 | F-982 obligatorio |
| 19 | Umbral de dictamen fiscal por activo: US$1,142,857.14 | Nombramiento de auditor y F-455 |
| 20 | Impuesto municipal de activos contra el balance declarado | Diferencia con la declaración jurada municipal |

### M6 — Conciliación fiscal y liquidación

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M6.1 | Conciliación entre utilidad contable y renta imponible, con ajustes clasificados | A | 3 |
| M6.2 | Ajustes propuestos por reglas, editables, con origen visible | A | 2 |
| M6.3 | Liquidación del ISR con tasa según umbral de renta gravada | A | 2 |
| M6.4 | Ganancia de capital liquidada por separado al 10% | A | 1 |
| M6.5 | Créditos: pago a cuenta y retenciones a favor | A | 1 |
| M6.6 | Cada ajuste exige base legal y trazabilidad a la cuenta o fila de origen | A | 2 |

### M7 — Generación de formularios

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M7.1 | **Matriz de obligatoriedad**: qué formularios aplican, con razón y base legal | E | 2 |
| M7.2 | **Facsímil imprimible** que replique el formulario oficial, con secciones y casillas numeradas | E | 4 |
| M7.3 | Exportación a PDF | E | 2 |
| M7.4 | Anexo de carga en CSV y XLSX, con layout oficial configurable | E | 3 |
| M7.5 | Catálogos oficiales de códigos, empezando por los 48 códigos de ingreso del F-910 V9 | E | 2 |
| M7.6 | Asignación automática de código por concepto, editable, con las reglas del formulario aplicadas | E | 3 |
| M7.7 | Bloqueo de generación cuando falta un insumo obligatorio: no generar con ceros | E | 2 |
| M7.8 | Versionado de formularios generados; los modificatorios no sobrescriben | E | 2 |
| M7.9 | Registro del acuse de presentación (carga manual del comprobante) | E | 1 |
| M7.10 | Formularios del cierre anual y del dictamen | A | 4 |
| M7.11 | Declaración jurada municipal de San Salvador | A | 2 |

**Estado de los formularios (§16 anexo B).** Un formulario pasa a estado *verificado* solo cuando su facsímil se construyó contra la plantilla oficial vigente descargada de la fuente, con versión, fecha y huella registradas.

### M8 — Catálogo normativo y vigilante

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M8.1 | Catálogo de obligaciones por institución: base legal, plazo, sujeto obligado, condición de aplicabilidad | E | 3 |
| M8.2 | Registro de versión, fuente, fecha y huella de cada plantilla | E | 2 |
| M8.3 | **Vigilante automatizado** que descarga las fuentes, compara huellas y notifica cambios | E | 2 |
| M8.4 | **Adopción siempre humana**: el sistema avisa, el consultor actualiza y versiona | E | 1 |
| M8.5 | Histórico normativo: qué reglas estaban vigentes en un ejercicio pasado | E | 2 |
| M8.6 | Ordenanza de San Salvador modelada: tarifa de activos, tasas, plazos | A | 3 |
| M8.7 | Fuentes vigiladas configurables | A | 2 |
| M8.8 | Extracción automática del layout desde el PDF oficial | W | 5 |

### M9 — Inteligencia artificial

Dos usos autorizados. Ninguna cifra fiscal se calcula con IA.

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M9.1 | **Uso 1 — Llenado de formularios**: mapeo de columnas, asignación de códigos de catálogo, campos narrativos | E | 3 |
| M9.2 | **Uso 2 — Hallazgos**: redacción a partir de cifras agregadas y resultados de cruces | E | 3 |
| M9.3 | **Evidencia obligatoria**: todo hallazgo señala origen y referencia de fila, cuenta o período; sin evidencia se marca como no verificable | E | 2 |
| M9.4 | Contrato de salida validado con esquema en el servidor; respuesta que no cumple se rechaza | E | 2 |
| M9.5 | Prompts editables por el consultor; el contrato de salida no es editable | E | 2 |
| M9.6 | La IA recibe agregados y resultados, **nunca el detalle transaccional completo** | E | 2 |
| M9.7 | Proveedor de modelo sustituible detrás de una sola interfaz | E | 1 |
| M9.8 | Registro de cada llamada: prompt, versión, costo, resultado aceptado o rechazado | E | 2 |
| M9.9 | Notas del informe fiscal y borrador de dictamen, con campos a completar marcados | A | 2 |

**Guardrails no negociables:**

1. Ningún cálculo fiscal proviene del modelo.
2. Ninguna salida se incorpora al papel de trabajo sin evidencia trazable.
3. La credencial del proveedor vive en el servidor. Con Gemini sobre Vertex AI en el mismo proyecto, la autenticación es por cuenta de servicio y **no existe clave que filtrar**.
4. Toda salida es borrador hasta que el consultor la acepta explícitamente.
5. Sin IA disponible, el sistema calcula, valida y genera formularios igual.

### M10 — Estrategia y análisis de negocio

El diferenciador comercial. Sin este módulo la plataforma es un generador de formularios; está anotado como riesgo R9.

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M10.1 | Tasa efectiva de tributación por cliente y evolución interanual | F3 | 2 |
| M10.2 | Indicadores derivados de la balanza: liquidez, endeudamiento, rotación de inventario y cartera, margen | F3 | 2 |
| M10.3 | Oportunidades de planificación: incentivos y regímenes aplicables al perfil del cliente | F3 | 3 |
| M10.4 | Alertas de riesgo de negocio: concentración de clientes o proveedores, deterioro de márgenes, capital de trabajo | F3 | 3 |
| M10.5 | Informe de hallazgos estratégicos entregable al cliente | F3 | 3 |
| M10.6 | Comparativo sectorial entre clientes del despacho, anonimizado | F4 | 3 |
| M10.7 | Proyección de carga tributaria del ejercicio siguiente | F4 | 3 |

**Restricción de contenido.** El sistema puede identificar que un régimen o incentivo aplica al perfil del cliente y explicar sus requisitos. Recomendar estructurar operaciones de una forma determinada es juicio profesional del consultor y debe quedar registrado como tal, con su autor.

### M11 — Revisión, aprobación y entrega

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M11.1 | Checklist de cierre con estado calculado por el sistema y observación del consultor | E | 2 |
| M11.2 | Papel de trabajo maestro exportable: cifras, ajustes, cruces, diagnóstico, bitácora | E | 2 |
| M11.3 | **Limitaciones al alcance**: insumos declarados no disponibles con responsable, fecha y motivo | E | 2 |
| M11.4 | Paquete de entrega: formularios en PDF, resumen ejecutivo y puntos que requieren confirmación del cliente | E | 3 |
| M11.5 | Aprobación del cliente registrada con fecha, identidad y cifras aprobadas | A | 3 |
| M11.6 | Portal de revisión para el cliente | F3 | 4 |

### M12 — Calendario y cumplimiento periódico

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M12.1 | Diagnóstico de aplicabilidad de obligaciones según el perfil del cliente | E | 2 |
| M12.2 | Vencimientos por **días hábiles reales**, descontando fines de semana y asuetos oficiales | E | 2 |
| M12.3 | Calendario consolidado de la cartera con estado de presentación y evidencia | E | 3 |
| M12.4 | Alertas de vencimiento próximo y de obligación vencida sin presentar | E | 2 |
| M12.5 | Obligaciones de cumplimiento continuo, sin fecha fija, con estado propio | A | 1 |
| M12.6 | Notificaciones por correo | A | 2 |

### M13 — Seguridad, confidencialidad y no custodia

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M13.1 | Autenticación con segundo factor obligatorio | E | 2 |
| M13.2 | Autorización por rol y por cliente asignado | E | 3 |
| M13.3 | **Zona de tránsito**: los archivos de origen se eliminan al marcar el ejercicio como revisado, o a los 90 días de la última carga, con aviso 7 días antes | E | 2 |
| M13.4 | Zona de producto propio: agregados, ajustes, bitácora y formularios generados se conservan | E | 2 |
| M13.5 | **Exportación dual**: sesión completa con datos del cliente y vida corta, frente a expediente archivable sin detalle crudo | E | 2 |
| M13.6 | Bitácora de acceso y de cambios, inmutable | E | 2 |
| M13.7 | Cifrado en tránsito y en reposo | E | 1 |
| M13.8 | Respaldo programado de metadatos a destino separado | E | 2 |
| M13.9 | Exportación total del expediente al terminar la relación con un cliente | A | 2 |

### M14 — Preparación para SaaS

| ID | Requerimiento | Prio | Esf. |
|---|---|---|---|
| M14.1 | Nivel de despacho en el modelo de datos desde el día uno, aunque exista uno solo | E | 2 |
| M14.2 | Aislamiento verificado por pruebas automatizadas de reglas de acceso | E | 2 |
| M14.3 | Catálogo normativo compartido, configuración propia por despacho | F5 | 3 |
| M14.4 | Facturación, planes y autoservicio | F5 | 5 |

**Justificación de M14.1 en el MVP:** agregar el nivel de despacho después obliga a migrar todos los datos y reescribir las reglas de acceso. Cuesta poco ahora y mucho después.

---

## 9. Requerimientos no funcionales

| Categoría | Requerimiento |
|---|---|
| **Determinismo** | Mismos insumos y misma configuración producen el mismo resultado, sin intervención de IA |
| **Trazabilidad** | Todo número presentable se rastrea hasta su fila de origen |
| **Auditabilidad** | Reconstruir qué reglas y qué versión de formulario se usaron en cualquier ejercicio pasado |
| **Rendimiento** | Expediente típico procesado en menos de 60 segundos |
| **Disponibilidad** | Sin compromiso formal en fase 1. La estacionalidad importa más que el promedio: enero, abril y mayo son críticos |
| **Costo de operación** | Menos de US$15 mensuales en fase 1, con presupuesto y alertas antes de habilitar facturación |
| **Portabilidad del conocimiento** | La normativa vive en configuración versionada, no en código |
| **Degradación** | Sin IA, el sistema sigue calculando, validando y generando formularios |

---

## 10. Política de datos y no custodia

**Principio rector:** guardar de más genera responsabilidad, no la evita. La plataforma es un procesador, no un custodio.

### Dos zonas con reglas opuestas

| Zona | Contenido | Regla |
|---|---|---|
| **Tránsito** | Archivos de origen del cliente: balanza, libros, planilla | Se eliminan al marcar el ejercicio como revisado o a los 90 días, lo que ocurra primero |
| **Producto propio** | Agregados, ajustes con su justificación, hallazgos, bitácora, formularios generados, perfiles de mapeo | Se conservan |

La línea divisoria: una balanza de comprobación es data del cliente; el papel de trabajo que el consultor redactó a partir de ella es su producto profesional.

### Reparto de responsabilidad legal

El Art. 147 del Código Tributario obliga al **contribuyente** a conservar su documentación diez años. La plataforma no asume esa obligación. Esto requiere cláusula en el contrato de servicios:

> El cliente es responsable, en su calidad de contribuyente, de la conservación de sus registros contables conforme al Art. 147 del Código Tributario. La plataforma procesa dicha información de forma transitoria, con fines exclusivos de análisis y generación de los informes contratados, sin asumir su custodia ni conservación. El consultor conserva únicamente los productos de su propio trabajo profesional.

Esto también reduce la exposición del consultor: si el cliente pierde su balanza, no es responsabilidad del despacho tenerla, porque nunca la conservó más allá de la ventana de procesamiento.

### Retención de los papeles propios

Vigencia del contrato más un período de defensa profesional posterior. La DGII puede fiscalizar un ejercicio años después de terminado el contrato; destruir los papeles al cerrarlo deja al consultor sin respaldo frente a un reclamo. El plazo exacto es decisión legal pendiente (§14, D7).

---

## 11. Arquitectura

### Componentes

| Capa | Componente | Rol |
|---|---|---|
| Frontend | Aplicación de página única sobre alojamiento estático, con verificación de integridad | Interfaz del consultor |
| Identidad | Servicio administrado con reclamos personalizados: despacho, rol, clientes asignados | Autenticación y autorización |
| Metadatos | Base documental | Expedientes, mapeos, ajustes, estados, bitácora, configuración versionada |
| Archivos | Almacenamiento de objetos en dos zonas: tránsito con expiración, salida sin expiración | Insumos crudos y entregables generados |
| Cómputo | Funciones administradas; contenedor administrado para procesos largos y PDF | Ingesta, procesamiento, generación |
| Modelo | Servicio de IA con autenticación por cuenta de servicio | Los dos usos de M9 |
| Vigilante | Automatización externa (§12) | Monitoreo normativo |

**Almacenamiento de objetos, aclaración:** es almacenamiento de propósito general para cualquier archivo binario. Excel, PDF y texto son su caso de uso normal; fotos y video son solo el ejemplo más citado en la documentación.

### Frontera frontend / backend

| Frontend | Backend |
|---|---|
| Interfaz, edición de mapeos y ajustes | **Cálculo fiscal definitivo del expediente** |
| Vista previa de cálculos para retroalimentación inmediata | Llamadas al modelo de IA |
| Generación del facsímil para impresión | Validación del contrato de salida del modelo |
| — | Credenciales de cualquier tipo |
| — | Bitácora inmutable |

**Regla:** el frontend puede calcular para dar respuesta inmediata, pero **la cifra que se presenta la calcula el backend**. De lo contrario no hay reproducibilidad ni auditoría.

### Ingesta: interfaz única, tres orígenes

```
Origen (archivo | api | base de datos)
    → Adaptador específico del origen
    → Filas canónicas {encabezados, filas}
    → Motor de mapeo y cálculo (sin cambios según el origen)
    → Resultado (lo único que se retiene)
```

Solo el adaptador de archivo se implementa en el MVP. La interfaz existe para no bifurcar el motor cuando aparezca el primer cliente con API.

### Costo de operación en fase 1

| Componente | Consumo estimado | Costo |
|---|---|---|
| Base documental, identidad y alojamiento | Muy por debajo de las cuotas sin costo | US$0 |
| Almacenamiento de objetos | Menos de 5 GB | US$0 en la capa siempre gratuita, requiere cuenta de facturación vinculada |
| Funciones | Cientos de invocaciones mensuales | US$0 |
| Vigilante normativo | Ver §12 | US$4 a US$24 mensuales |
| Modelo de IA | El único costo variable | Centavos por expediente |

El riesgo de costo no es el volumen: es una función en bucle o una instancia de base relacional encendida sin necesidad. De ahí el requerimiento de presupuesto con alertas antes de habilitar facturación.

---

## 12. Vigilante normativo

### Diseño

Descarga periódica de las fuentes oficiales, cálculo de huella, comparación con la almacenada y, si difiere, creación de una tarea para el consultor con el enlace y la fecha. **Nunca adopción automática:** una plantilla nueva mal interpretada produce presentaciones erróneas en todos los clientes a la vez.

### Herramienta

Se implementa en **n8n**, con dos justificaciones: el vigilante es periférico al producto y no toca información de clientes. La regla que se mantiene es **automatización de código bajo para lo periférico, código propio para todo lo que toque data fiscal**.

| Necesidad | Nodo o mecanismo |
|---|---|
| Ejecución diaria | Schedule Trigger |
| Descarga de la fuente | HTTP Request |
| Huella | Crypto en modo hash |
| Estado anterior | Nodo nativo de la base documental, o almacenamiento de objetos |
| Notificación | Correo o mensajería |
| Alta de la tarea en la plataforma | HTTP Request a una función, o escritura directa |
| Autenticación | Credencial de cuenta de servicio del mismo proyecto |

No requiere alojarse dentro del proveedor de nube para integrarse: se conecta por API.

### Alojamiento y costo (referencias de julio de 2026, verificar antes de contratar)

| Opción | Costo aproximado | Veredicto |
|---|---|---|
| Servicio administrado del proveedor, plan inicial | €20 anual a €24 mensual, 2,500 ejecuciones | Cero mantenimiento, capacidad de sobra |
| Autoalojado en servidor virtual propio | US$5 a US$7 mensuales, 30 a 60 minutos de configuración | Más barato; el mantenimiento y el HTTPS son propios |
| Autoalojado en host administrado | Desde US$3.70 mensuales | Buen punto medio |
| Instancia mínima en la capa siempre gratuita | US$0 | 1 GB de memoria es justo; viable solo para este vigilante liviano |
| Contenedor sin estado | Más caro de lo que aparenta | **Descartado:** requiere estado persistente y base relacional |

**Presupuesto de ejecuciones.** La facturación es por corrida de flujo, no por paso. Un flujo diario que recorra todas las fuentes en un bucle interno consume unas 30 ejecuciones mensuales y cualquier plan sobra. El error a evitar es crear un flujo por fuente vigilada: eso multiplica el consumo sin beneficio.

### Dos advertencias de diseño

1. **No hashear la página completa.** Los portales institucionales cambian de huella a diario por banners, fechas y tokens de sesión. Hay que hashear el **PDF binario del formulario** o un extracto normalizado, con espacios y fechas eliminados. Este es el punto donde este tipo de vigilante suele fallar en la práctica: los falsos positivos hacen que el consultor deje de leer los avisos.
2. **Instancia propia, separada de la infraestructura del empleador.** Correr el vigilante de la práctica independiente en infraestructura corporativa mezcla dos ámbitos que conviene mantener separados; en el momento en que el flujo toque datos de clientes de consultoría, deja de ser un problema de orden y pasa a ser de confidencialidad.

### Fuentes del MVP

| Fuente | Qué se vigila | Frecuencia |
|---|---|---|
| Portal de formularios del MH | Versión de F-910, F-915 y F-987 | Diaria |
| Calendario tributario del MH | Publicación del calendario 2027 y sus asuetos | Semanal |
| Normativa y decretos del MH | Tasas, umbrales, tablas de retención | Diaria |
| Alcaldía de San Salvador | Ordenanza de tasas e impuestos vigente | Semanal |
| Diario Oficial | Decretos que afecten obligaciones tributarias | Diaria |

Empezar con las tres primeras. El Diario Oficial se añade cuando el vigilante funcione sin falsos positivos: es la fuente más ruidosa.

---

## 13. Modelo de datos conceptual

```
Despacho
 └── Usuario (rol, clientes asignados)
 └── Cliente (identificación, giro, sector, régimen, municipios)
      └── PerfilDeMapeo (reutilizable entre ejercicios)
      └── Ejercicio (año, estado, responsable)
           ├── Configuración (tasas, umbrales, tolerancias, reglas, prompts) — versionada
           ├── Insumo (tipo, huella, filas, estado, indisponibilidad)
           ├── Resultado (agregados, cruces, liquidación)
           ├── Ajuste (concepto, tipo, monto, base legal, origen, autor)
           ├── Formulario (código, versión, estado, ruta del PDF, acuse)
           └── Bitácora (evento, autor, fecha, valor anterior, valor nuevo, motivo)

CatálogoNormativo (transversal, compartido entre despachos)
 └── Obligación (institución, base legal, plazo, condición de aplicabilidad)
 └── PlantillaFormulario (código, versión, fuente, fecha, huella, layout)
 └── OrdenanzaMunicipal (municipio, tarifas, plazos, vigencia)
```

**Regla de diseño:** en la base documental van agregados y decisiones, no filas de detalle. Una balanza de 4,000 cuentas no se escribe como 4,000 documentos; se normaliza a un archivo y en la base queda el puntero más los totales por grupo.

---

## 14. Hoja de ruta

**Ventana:** 18 de agosto de 2026 al 15 de enero de 2027 ≈ 21 semanas × 14 h = **294 horas**.
Planificado contra **256 h**, con 38 h de reserva. Estimaciones, no compromisos.

| Bloque | Contenido | Horas | Sem. | Entregable verificable |
|---|---|---|---|---|
| **B0** | Obtener la plantilla del F-987 y verificar vigencia de F-910 y F-915 | 6 | 1 | Tres plantillas oficiales con versión, fecha y huella |
| **B1** | Migrar el prototipo a aplicación: autenticación, multi-cliente, nivel de despacho, modo demostración | 45 | 3 | Cinco clientes de prueba con expediente por año y demo lista para venta |
| **B2** | Ingesta de los cinco insumos, plantillas Excel propias, mapeo con perfil persistente | 45 | 3 | Remapear el archivo de un cliente en menos de 15 minutos |
| **B3** | Configuración versionada y los nueve cruces del hito de enero | 30 | 2 | Cruces con los tres estados operando |
| **B4** | Facsímiles y anexos de F-910, F-915 y F-987, con catálogo de códigos | 55 | 4 | Tres formularios listos para revisión, con PDF y anexo |
| **B5** | Calendario de cartera y alertas por días hábiles | 25 | 2 | Calendario de los clientes con asuetos 2027 cargados |
| **B6** | IA: mapeo, asignación de códigos y hallazgos con evidencia | 25 | 2 | Hallazgos con referencia de fila obligatoria |
| **B7** | No custodia, exportación dual y paquete de entrega | 15 | 1 | Los archivos de origen se eliminan al cerrar el ejercicio |
| **B8** | Vigilante normativo | 10 | 1 | Aviso ante cambio en cualquiera de las fuentes vigiladas |
| | **Total** | **256** | **19** | |

**Ruta crítica:** `B0 → B2 → B4`. Si la plantilla del F-987 no aparece a tiempo, se entrega con dos formularios y el tercero en modo papel de trabajo; no se retrasa el hito completo.

**Después de enero:** el hito de abril reutiliza lo ya construido en el prototipo (conciliación, liquidación, estados financieros, diagnóstico de descuadres) más los formularios del cierre y del dictamen.

---

## 15. Métricas de éxito

### Métrica principal

**Horas de consultor por cierre completado.** Es la única que captura la promesa del producto.

Como no hay cartera activa, no existe línea base histórica. La medición posible: **cronometrar el primer cierre de enero del primer cliente que firme, hecho al modo tradicional en Excel**, y usarlo como referencia. Es una sola medición, pero es real, y la oportunidad de tomarla existe una sola vez.

### Métricas de apoyo

| Métrica | Meta en F1 | Cómo se mide |
|---|---|---|
| Formularios generados sin retrabajo manual | ≥ 80% | Conteo de correcciones tras la generación |
| Incongruencias detectadas antes de presentar | 100% de las sembradas en el caso de prueba | Caso de prueba con hallazgos conocidos |
| Tiempo de remapeo en el segundo año de un cliente | < 15 minutos | Cronometrado |
| Presentaciones fuera de plazo | 0 | Calendario contra acuses registrados |
| Hallazgos de IA aceptados sin corrección | ≥ 60% | Tasa de aceptación registrada |
| Clientes cerrados de los 5 en negociación | ≥ 3 | Contratos firmados |
| Costo de infraestructura mensual | < US$15 | Facturación |

---

## 16. Riesgos

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | Constructor único a tiempo parcial: el proyecto se detiene si el autor se ocupa | Alto | Bloques útiles de forma independiente; nada a medio terminar entre entregas |
| R2 | Conocimiento normativo concentrado en una persona | Alto | Normativa en configuración versionada con base legal citada |
| R3 | Un formulario mal modelado afecta a todos los clientes a la vez | Alto | Adopción humana obligatoria; caso de prueba cuadrado antes de liberar |
| R4 | Cambio normativo no detectado | Alto | Vigilante automatizado y verificación manual antes de cada temporada |
| R5 | La plantilla del F-987 no se obtiene a tiempo | Medio | Entregar dos formularios y el tercero como papel de trabajo |
| R6 | Cliente entrega información incompleta | Medio | Estado no evaluable, declaración de indisponibilidad y limitación al alcance |
| R7 | La IA produce una cifra o un hallazgo sin respaldo | Alto | Evidencia obligatoria, contrato validado, ningún cálculo fiscal por IA |
| R8 | Fuga de información confidencial | Alto | Zona de tránsito con borrado automático, segundo factor, bitácora, credenciales solo en backend |
| R9 | El módulo de estrategia nunca se construye y el producto queda como digitador | Medio | M10 planificado en F3 con requerimientos numerados, no como intención |
| R10 | Falsos positivos del vigilante hacen que se ignoren los avisos | Medio | Hashear el PDF binario o un extracto normalizado, no la página completa |
| R11 | Sin línea base, el producto no puede demostrar su propio valor | Medio | Cronometrar el primer cierre tradicional del primer cliente que firme |
| R12 | Ninguno de los 5 clientes en negociación firma | Alto | El modo demostración se adelanta a B1 para apoyar la venta |

---

## 17. Criterios de aceptación del MVP

1. Los clientes que hayan firmado tienen expediente completo del ejercicio con perfil de mapeo guardado, y el modo demostración opera con data dummy.
2. Los nueve cruces del hito de enero se ejecutan y distinguen correctamente los tres estados.
3. El caso de prueba con hallazgos sembrados levanta el 100% de ellos.
4. F-910 y F-915 se generan con facsímil verificado contra plantilla oficial, con PDF y anexo descargable. F-987 igual, o documentado como papel de trabajo si su plantilla no se obtuvo.
5. La configuración de un ejercicio anterior puede reprocesarse con las reglas de ese año.
6. Toda cifra de un formulario generado se rastrea hasta su fila de origen.
7. Sin IA disponible, el sistema calcula, valida y genera formularios igual.
8. Los archivos de origen se eliminan al marcar el ejercicio como revisado o a los 90 días.
9. Un usuario de un cliente no puede leer datos de otro, verificado por prueba automatizada.
10. La bitácora permite reconstruir quién cambió qué, cuándo y por qué.
11. El vigilante notifica un cambio simulado en una fuente vigilada, sin falsos positivos durante dos semanas de operación.

---

## 18. Decisiones abiertas

| # | Decisión | Por qué importa | Dónde se resuelve |
|---|---|---|---|
| D5 | Línea base de horas por cierre | Sin ella la métrica principal no tiene referencia | Reunión con socios, antes de enero |
| D7 | Plazo exacto de retención de los papeles propios | Define la política de archivo y la cláusula contractual | Con abogado, junto con el contrato de servicios |
| D11 | Redacción final de la cláusula de tratamiento de datos | Requisito para operar con clientes reales | Con abogado |
| D12 | Precio y estructura del servicio con la herramienta | Determina si el producto cambia el modelo de negocio o solo la eficiencia | Reunión con socios |

---

## Anexo A — Insumos y esquemas canónicos

| Insumo | Campos canónicos | Hito |
|---|---|---|
| Planilla anual | nombre, DUI, NIT, cargo, sueldo, ISSS, AFP, ISR retenido | Enero |
| Retenciones a terceros | fecha, proveedor, NIT, concepto, monto, tasa, retenido | Enero |
| Socios y dividendos | socio, NIT, participación, dividendo, tasa, retenido, condición | Enero |
| Libro de compras de IVA | fecha, proveedor, NIT, gravadas, exentas, importaciones, crédito | Enero |
| Libro de ventas a contribuyentes | fecha, cliente, NIT, gravadas, exentas, débito | Enero |
| Declaraciones presentadas | período, ventas, ingresos, pago a cuenta, ISR de planilla | Enero (opcional) |
| Catálogo de cuentas | código, nombre, clasificación, naturaleza | Abril |
| Balanza de comprobación | cuenta, descripción, saldo deudor, saldo acreedor | Abril |
| Libro de ventas a consumidor final | período, gravadas, exentas, exportaciones, débito | Abril |
| Inventario físico | código, descripción, unidad, cantidad, costo unitario, valor | Abril |
| Activo fijo enajenado | descripción, fechas, costo, depreciación, valor en libros, precio, resultado | Abril |
| Operaciones con relacionados | parte, país, relación, concepto, monto, método | Abril |

## Anexo B — Formularios y estado de verificación

| Formulario | Nombre | Base legal | Plazo | Estado | Hito |
|---|---|---|---|---|---|
| F-910 V9 | Informe anual de retención del ISR | Art. 123 CT | 31 de enero | Verificado | Enero |
| F-915 V4 | Distribución de utilidades y listado de socios | Art. 124 CT | Enero | Verificado | Enero |
| F-987 | Proveedores, clientes, acreedores y deudores | Art. 125 CT | Enero y julio | **Falta plantilla** | Enero |
| F-211 | Actualización de dirección | Arts. 86 y 90 CT | 10 días hábiles de enero | Trámite simple | Enero |
| F-455 | Carta de presentación del dictamen fiscal | Art. 132 lit. c CT | 31 de mayo | Verificado | Abril |
| F-456 v2 | Nombramiento de auditor fiscal | Art. 131 CT | 31 de mayo | Verificado | Abril |
| F-460 V3 | Registro de auditores LSI | Reglamento LSI | Al inscribirse | Verificado | Según cartera |
| F-11 | Declaración anual de ISR | Art. 48 LISR | 30 de abril | Falta plantilla | Abril |
| F-971 | Balance general y estado de resultados | CT | 30 de abril | Falta plantilla | Abril |
| F-944 | Ganancias y pérdidas de capital | Art. 42 LISR | 30 de abril | Falta plantilla | Abril |
| F-983 | Informe sobre inventario físico | Art. 142 CT | Primeros meses | Falta plantilla | Abril |
| F-982 | Operaciones con sujetos relacionados | Art. 124-A CT | 3 meses tras cierre | Falta plantilla | Abril |
| F-07 | Declaración de IVA | Art. 94 LIVA | Mensual, 10 días hábiles | Falta plantilla | Abril |
| F-14 | Pago a cuenta y retenciones | Art. 151 CT | Mensual, 10 días hábiles | Falta plantilla | Abril |
| Municipal | Declaración jurada anual de balance | Ley General Tributaria Municipal | Según ordenanza | Falta modelar | Abril |

## Anexo C — Umbrales y parámetros de referencia

Todos configurables por ejercicio. Verificar vigencia antes de cada temporada.

| Parámetro | Valor de referencia | Base legal |
|---|---|---|
| Tasa de ISR general | 30% | Art. 41 LISR |
| Tasa de ISR reducida | 25% si la renta gravada no supera US$150,000 | Art. 41 LISR |
| Ganancia de capital | 10% | Art. 42 LISR |
| IVA | 13% | LIVA |
| Pago a cuenta | 1.75% de los ingresos brutos mensuales | Art. 151 CT |
| Retención por servicios a persona natural | 10% | Art. 156 CT |
| Retención a no domiciliados | 20% | Art. 158 CT |
| Retención a regímenes preferentes | 25% | Art. 158-A CT |
| Retención sobre dividendos | 5% | Art. 72 LISR |
| Umbral del F-987 | 2,753 salarios mínimos mensuales | Art. 125 CT |
| Umbral de precios de transferencia | US$571,429 | Art. 124-A CT |
| Umbral de dictamen por activo | US$1,142,857.14 | Art. 131 CT |
| Umbral de retención y percepción de IVA | Operaciones mayores a US$100 | Arts. 162 y 163 CT |
| Conservación de documentación | 10 años, a cargo del contribuyente | Art. 147 CT |
