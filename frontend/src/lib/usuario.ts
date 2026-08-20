import { doc, getDoc } from "firebase/firestore";
import type { Usuario } from "shared";
import { getFirebaseDb } from "@/lib/firebase";

/**
 * Perfil de la coleccion top-level `usuarios/{uid}` (ver firestore.rules).
 * Devuelve null si el uid todavia no tiene perfil provisionado -- pasa
 * mientras el backend no haya dado de alta al usuario.
 */
export async function obtenerUsuario(uid: string): Promise<Usuario | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "usuarios", uid));
  return snap.exists() ? (snap.data() as Usuario) : null;
}
