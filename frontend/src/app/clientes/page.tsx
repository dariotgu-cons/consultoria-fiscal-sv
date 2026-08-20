"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import type { Cliente, Ejercicio } from "shared";
import AppShell from "@/components/AppShell";
import { obtenerCliente } from "@/lib/clientes";
import { crearEjercicio, EjercicioYaExisteError, listarEjercicios } from "@/lib/ejercicios";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useUsuarioActual } from "@/lib/use-usuario-actual";

const ESTADO_LABEL: Record<Ejercicio["estado"], string> = {
  borrador: "Borrador",
  esperando_insumos: "Esperando insumos",
  mapeado: "Mapeado",
  procesado: "Procesado",
  revisado: "Revisado",
  aprobado: "Aprobado",
  presentado: "Presentado",
  archivado: "Archivado",
};

function ClienteDetalle() {
  const { user, loading } = useRequireAuth();
  const perfil = useUsuarioActual();
  const clienteId = useSearchParams().get("id");

  const [cliente, setCliente] = useState<Cliente | null | undefined>(undefined);
  const [ejercicios, setEjercicios] = useState<Ejercicio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback((despachoId: string, id: string) => {
    obtenerCliente(despachoId, id).then(setCliente);
    listarEjercicios(despachoId, id)
      .then(setEjercicios)
      .catch(() => setError("No se pudieron cargar los ejercicios."));
  }, []);

  useEffect(() => {
    if (perfil.estado === "listo" && clienteId) cargar(perfil.usuario.despachoId, clienteId);
  }, [perfil, clienteId, cargar]);

  async function handleAbrirEjercicio() {
    if (perfil.estado !== "listo" || !clienteId) return;
    setError(null);
    try {
      await crearEjercicio(perfil.usuario.despachoId, clienteId, new Date().getFullYear(), perfil.usuario.uid);
      cargar(perfil.usuario.despachoId, clienteId);
    } catch (err) {
      setError(
        err instanceof EjercicioYaExisteError
          ? err.message
          : "No se pudo abrir el ejercicio. Intenta de nuevo."
      );
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      </div>
    );
  }

  if (!clienteId) {
    return (
      <AppShell user={user}>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Falta especificar el cliente.</p>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <Link href="/cartera" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
        ← Cartera
      </Link>

      {cliente === undefined && <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>}
      {cliente === null && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No se encontró el cliente.</p>
      )}

      {cliente && (
        <>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-black dark:text-zinc-50">{cliente.razonSocial}</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {cliente.identificacionFiscal} · {cliente.giro} · {cliente.sector}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAbrirEjercicio}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Abrir ejercicio {new Date().getFullYear()}
            </button>
          </div>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          <h2 className="mt-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">Ejercicios</h2>
          <div className="mt-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
            {ejercicios === null ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
            ) : ejercicios.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Todavía no hay ejercicios para este cliente.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-black/[.03] text-xs uppercase text-zinc-500 dark:bg-white/[.03] dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Año</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ejercicios
                    .sort((a, b) => b.anio - a.anio)
                    .map((ejercicio) => (
                      <tr key={ejercicio.id} className="border-t border-black/10 dark:border-white/10">
                        <td className="px-4 py-3 font-medium text-black dark:text-zinc-50">{ejercicio.anio}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {ESTADO_LABEL[ejercicio.estado]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}

export default function ClientePage() {
  return (
    <Suspense fallback={null}>
      <ClienteDetalle />
    </Suspense>
  );
}
