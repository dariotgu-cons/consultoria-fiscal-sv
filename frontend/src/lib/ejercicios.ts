import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import type { Ejercicio } from "shared";
import { getFirebaseDb } from "@/lib/firebase";

function ejerciciosRef(despachoId: string, clienteId: string) {
  return collection(getFirebaseDb(), "despachos", despachoId, "clientes", clienteId, "ejercicios");
}

export class EjercicioYaExisteError extends Error {}

/** M1.2/M1.3: abre un ejercicio nuevo para un cliente (un año = un documento). */
export async function crearEjercicio(
  despachoId: string,
  clienteId: string,
  anio: number,
  responsableUid: string
): Promise<string> {
  const ref = doc(ejerciciosRef(despachoId, clienteId), String(anio));
  if ((await getDoc(ref)).exists()) {
    throw new EjercicioYaExisteError(`Ya existe un ejercicio ${anio} para este cliente.`);
  }
  await setDoc(ref, {
    despachoId,
    clienteId,
    anio,
    estado: "borrador",
    responsableUid,
    bloqueado: false,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  return ref.id;
}

export async function listarEjercicios(despachoId: string, clienteId: string): Promise<Ejercicio[]> {
  const snap = await getDocs(ejerciciosRef(despachoId, clienteId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Ejercicio);
}
