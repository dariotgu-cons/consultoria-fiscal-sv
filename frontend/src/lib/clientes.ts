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

/** M1.1: alta de cliente. */
export async function crearCliente(despachoId: string, datos: NuevoCliente): Promise<string> {
  const ref = doc(clientesRef(despachoId));
  await setDoc(ref, {
    despachoId,
    ...datos,
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
