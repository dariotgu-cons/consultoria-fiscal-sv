import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import type { Cliente } from "shared";
import { getFirebaseDb } from "@/lib/firebase";

function clientesRef(despachoId: string) {
  return collection(getFirebaseDb(), "despachos", despachoId, "clientes");
}

export type NuevoCliente = Pick<
  Cliente,
  "identificacionFiscal" | "razonSocial" | "giro" | "sector" | "regimenEspecial" | "municipios"
>;

export class ClienteYaExisteError extends Error {}
export class IdentificacionFiscalInvalidaError extends Error {}

/** Firestore no permite "/" en un ID de documento; el resto de simbolos se
 * restringen ademas para mantener el NIT/NRC como llave estable. */
const FORMATO_IDENTIFICACION_FISCAL = /^[0-9A-Za-z-]+$/;

/**
 * M1.1: alta de cliente.
 *
 * La identificacion fiscal (NIT/NRC) es el ID del documento: es la llave
 * natural del cliente, y usarla como ID hace que un duplicado sea
 * estructuralmente imposible (create falla si ya existe), reforzado ademas
 * en firestore.rules.
 */
export async function crearCliente(despachoId: string, datos: NuevoCliente): Promise<string> {
  const identificacionFiscal = datos.identificacionFiscal.trim();
  if (!FORMATO_IDENTIFICACION_FISCAL.test(identificacionFiscal)) {
    throw new IdentificacionFiscalInvalidaError(
      "La identificación fiscal solo puede tener números, letras y guiones."
    );
  }

  const ref = doc(clientesRef(despachoId), identificacionFiscal);
  if ((await getDoc(ref)).exists()) {
    throw new ClienteYaExisteError(`Ya existe un cliente con la identificación fiscal ${identificacionFiscal}.`);
  }

  await setDoc(ref, {
    ...datos,
    identificacionFiscal,
    despachoId,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  return ref.id;
}

/** M1.4: vista de cartera -- lista de clientes del despacho. */
export async function listarClientes(despachoId: string): Promise<Cliente[]> {
  const snap = await getDocs(clientesRef(despachoId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Cliente);
}

export async function obtenerCliente(despachoId: string, clienteId: string): Promise<Cliente | null> {
  const snap = await getDoc(doc(clientesRef(despachoId), clienteId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Cliente) : null;
}
