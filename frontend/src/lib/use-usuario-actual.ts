"use client";

import { useEffect, useState } from "react";
import type { Usuario } from "shared";
import { useAuth } from "@/lib/auth-context";
import { obtenerUsuario } from "@/lib/usuario";

type Estado =
  | { estado: "cargando" }
  | { estado: "sin-perfil" }
  | { estado: "listo"; usuario: Usuario };

/**
 * Perfil de despacho/rol del usuario autenticado (coleccion `usuarios/{uid}`).
 * "sin-perfil" significa que el backend todavia no ha provisionado a este
 * uid -- no deberia pasar en operacion normal, pero es posible justo
 * despues de un primer login antes del alta manual.
 */
export function useUsuarioActual(): Estado {
  const { user } = useAuth();
  const [estado, setEstado] = useState<Estado>({ estado: "cargando" });

  useEffect(() => {
    if (!user) return;
    let cancelado = false;
    obtenerUsuario(user.uid).then((usuario) => {
      if (cancelado) return;
      setEstado(usuario ? { estado: "listo", usuario } : { estado: "sin-perfil" });
    });
    return () => {
      cancelado = true;
    };
  }, [user]);

  return estado;
}
