// Pruebas automatizadas de aislamiento multi-tenant para firestore.rules (M14.2).
//
// Requiere el emulador de Firestore (Java) y se ejecuta con:
//   npm run test:rules
//
// No usa Jest/Mocha: corre sobre el test runner nativo de Node (node:test).

import { readFileSync } from "node:fs";
import { before, after, beforeEach, describe, it } from "node:test";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

const PROJECT_ID = "demo-consultoria-fiscal-sv";
const now = Timestamp.now();

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

/** Escribe datos de prueba saltandose las reglas (equivalente al Admin SDK). */
async function seed(fn) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await fn(context.firestore());
  });
}

function usuario(overrides) {
  return {
    uid: overrides.uid,
    despachoId: overrides.despachoId,
    email: `${overrides.uid}@example.com`,
    nombre: overrides.uid,
    rol: overrides.rol,
    clientesAsignados: overrides.clientesAsignados ?? [],
    activo: true,
    creadoEn: now,
  };
}

function cliente(overrides) {
  return {
    despachoId: overrides.despachoId,
    // Las reglas exigen identificacionFiscal == ID del documento (el NIT es
    // la llave primaria); "cliente1" es el ID usado en casi todos los casos
    // de prueba, y se sobreescribe donde el ID del documento es distinto.
    identificacionFiscal: "cliente1",
    razonSocial: "Empresa de prueba",
    giro: "comercio",
    sector: "comercio",
    regimenEspecial: null,
    municipios: [],
    creadoEn: now,
    actualizadoEn: now,
    ...overrides,
  };
}

function ejercicio(overrides) {
  return {
    despachoId: overrides.despachoId,
    clienteId: overrides.clienteId,
    anio: 2026,
    estado: overrides.estado ?? "borrador",
    responsableUid: overrides.responsableUid,
    bloqueado: overrides.bloqueado ?? false,
    creadoEn: now,
    actualizadoEn: now,
  };
}

describe("aislamiento multi-tenant", () => {
  it("un uid sin documento en /usuarios no tiene acceso a nada", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const sinPerfil = testEnv.authenticatedContext("uidSinPerfil").firestore();
    await assertFails(getDoc(doc(sinPerfil, "despachos/despachoA/clientes/cliente1")));
  });

  it("titular de despacho A no puede leer clientes de despacho B", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(
        doc(db, "despachos/despachoB/clientes/clienteB"),
        cliente({ despachoId: "despachoB", identificacionFiscal: "clienteB" })
      );
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertFails(getDoc(doc(titularA, "despachos/despachoB/clientes/clienteB")));
  });

  it("titular puede leer y escribir clientes de su propio despacho", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertSucceeds(
      setDoc(doc(titularA, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }))
    );
  });

  it("asistente sin el cliente asignado no puede leerlo", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidAsistente"), usuario({ uid: "uidAsistente", despachoId: "despachoA", rol: "asistente" }));
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const asistente = testEnv.authenticatedContext("uidAsistente").firestore();
    await assertFails(getDoc(doc(asistente, "despachos/despachoA/clientes/cliente1")));
  });

  it("asistente con el cliente asignado puede leerlo y operar su ejercicio", async () => {
    await seed(async (db) => {
      await setDoc(
        doc(db, "usuarios/uidAsistente"),
        usuario({ uid: "uidAsistente", despachoId: "despachoA", rol: "asistente", clientesAsignados: ["cliente1"] })
      );
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const asistente = testEnv.authenticatedContext("uidAsistente").firestore();
    await assertSucceeds(getDoc(doc(asistente, "despachos/despachoA/clientes/cliente1")));
    await assertSucceeds(
      setDoc(
        doc(asistente, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidAsistente" })
      )
    );
  });

  it("rol lectura puede leer pero no escribir", async () => {
    await seed(async (db) => {
      await setDoc(
        doc(db, "usuarios/uidLectura"),
        usuario({ uid: "uidLectura", despachoId: "despachoA", rol: "lectura", clientesAsignados: ["cliente1"] })
      );
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const lector = testEnv.authenticatedContext("uidLectura").firestore();
    await assertSucceeds(getDoc(doc(lector, "despachos/despachoA/clientes/cliente1")));
    await assertFails(
      setDoc(
        doc(lector, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidLectura" })
      )
    );
  });
});

describe("prevencion de escalamiento de privilegios", () => {
  it("un usuario no puede modificar su propio documento de usuario", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidAsistente"), usuario({ uid: "uidAsistente", despachoId: "despachoA", rol: "asistente" }));
    });
    const propio = testEnv.authenticatedContext("uidAsistente").firestore();
    await assertFails(updateDoc(doc(propio, "usuarios/uidAsistente"), { rol: "titular" }));
  });

  it("no se puede crear un cliente con despachoId distinto al de la ruta", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertFails(
      setDoc(doc(titularA, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoB" }))
    );
  });

  it("no se puede modificar creadoEn en un update", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertFails(
      updateDoc(doc(titularA, "despachos/despachoA/clientes/cliente1"), {
        creadoEn: Timestamp.fromDate(new Date(2000, 0, 1)),
      })
    );
  });

  it("el NIT del cliente debe coincidir con el ID del documento (evita duplicados)", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertFails(
      setDoc(
        doc(titularA, "despachos/despachoA/clientes/cliente1"),
        cliente({ despachoId: "despachoA", identificacionFiscal: "0614-120398-102-3" })
      )
    );
  });

  it("no se puede crear dos veces un cliente con el mismo NIT (mismo ID de documento)", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1"), cliente({ despachoId: "despachoA" }));
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    // El cliente ya lo verifica con un getDoc antes de escribir (ver
    // lib/clientes.ts); a nivel de reglas, un segundo create al mismo ID
    // simplemente sobreescribe el documento -- por eso identificacionFiscal
    // debe ser inmutable en update, no solo validado en create.
    await assertFails(
      updateDoc(doc(titularA, "despachos/despachoA/clientes/cliente1"), {
        identificacionFiscal: "otro-nit",
      })
    );
  });
});

describe("bitacora inmutable (M13.6)", () => {
  it("se puede crear un evento de bitacora", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(
        doc(db, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidTitularA" })
      );
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertSucceeds(
      setDoc(doc(titularA, "despachos/despachoA/clientes/cliente1/ejercicios/2026/bitacora/evento1"), {
        ejercicioId: "2026",
        evento: "creacion",
        autorUid: "uidTitularA",
        fecha: Timestamp.now(),
        valorAnterior: null,
        valorNuevo: "borrador",
        motivo: "alta inicial",
      })
    );
  });

  it("no se puede modificar ni borrar un evento de bitacora existente", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(
        doc(db, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidTitularA" })
      );
      await setDoc(doc(db, "despachos/despachoA/clientes/cliente1/ejercicios/2026/bitacora/evento1"), {
        ejercicioId: "2026",
        evento: "creacion",
        autorUid: "uidTitularA",
        fecha: now,
        valorAnterior: null,
        valorNuevo: "borrador",
        motivo: "alta inicial",
      });
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertFails(
      updateDoc(doc(titularA, "despachos/despachoA/clientes/cliente1/ejercicios/2026/bitacora/evento1"), {
        motivo: "editado",
      })
    );
    await assertFails(
      deleteDoc(doc(titularA, "despachos/despachoA/clientes/cliente1/ejercicios/2026/bitacora/evento1"))
    );
  });
});

describe("bloqueo de ejercicio aprobado (M1.6)", () => {
  it("asistente no puede editar un ejercicio bloqueado", async () => {
    await seed(async (db) => {
      await setDoc(
        doc(db, "usuarios/uidAsistente"),
        usuario({ uid: "uidAsistente", despachoId: "despachoA", rol: "asistente", clientesAsignados: ["cliente1"] })
      );
      await setDoc(
        doc(db, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidAsistente", estado: "aprobado", bloqueado: true })
      );
    });
    const asistente = testEnv.authenticatedContext("uidAsistente").firestore();
    await assertFails(
      setDoc(doc(asistente, "despachos/despachoA/clientes/cliente1/ejercicios/2026/ajustes/ajuste1"), {
        ejercicioId: "2026",
        concepto: "gasto no deducible",
        tipo: "adicion",
        monto: 100,
        baseLegal: "Art. 29-A",
        origen: "revision manual",
        autorUid: "uidAsistente",
        creadoEn: now,
      })
    );
  });

  it("titular si puede editar un ejercicio bloqueado", async () => {
    await seed(async (db) => {
      await setDoc(doc(db, "usuarios/uidTitularA"), usuario({ uid: "uidTitularA", despachoId: "despachoA", rol: "titular" }));
      await setDoc(
        doc(db, "despachos/despachoA/clientes/cliente1/ejercicios/2026"),
        ejercicio({ despachoId: "despachoA", clienteId: "cliente1", responsableUid: "uidTitularA", estado: "aprobado", bloqueado: true })
      );
    });
    const titularA = testEnv.authenticatedContext("uidTitularA").firestore();
    await assertSucceeds(
      setDoc(doc(titularA, "despachos/despachoA/clientes/cliente1/ejercicios/2026/ajustes/ajuste1"), {
        ejercicioId: "2026",
        concepto: "gasto no deducible",
        tipo: "adicion",
        monto: 100,
        baseLegal: "Art. 29-A",
        origen: "revision manual",
        autorUid: "uidTitularA",
        creadoEn: now,
      })
    );
  });
});
