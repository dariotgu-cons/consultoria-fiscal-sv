"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Cliente } from "shared";
import AppShell from "@/components/AppShell";
import ClienteFormModal from "@/components/ClienteFormModal";
import { crearCliente, listarClientes, type NuevoCliente } from "@/lib/clientes";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useUsuarioActual } from "@/lib/use-usuario-actual";

export default function CarteraPage() {
  const { user, loading } = useRequireAuth();
  const perfil = useUsuarioActual();
  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = useCallback((despachoId: string) => {
    listarClientes(despachoId)
      .then(setClientes)
      .catch(() => setError("No se pudo cargar la cartera de clientes."));
  }, []);

  useEffect(() => {
    if (perfil.estado === "listo") cargarClientes(perfil.usuario.despachoId);
  }, [perfil, cargarClientes]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      </div>
    );
  }

  async function handleCrearCliente(datos: NuevoCliente) {
    if (perfil.estado !== "listo") return;
    await crearCliente(perfil.usuario.despachoId, datos);
    cargarClientes(perfil.usuario.despachoId);
    setMostrarFormulario(false);
  }

  return (
    <AppShell user={user}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Cartera</h1>
        {perfil.estado === "listo" && (
          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Nuevo cliente
          </button>
        )}
      </div>

      {perfil.estado === "sin-perfil" && (
        <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Tu cuenta todavía no tiene un perfil de despacho asignado. Pide al administrador que te dé de alta.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {perfil.estado === "listo" && clientes !== null && (
        <div className="mt-6 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          {clientes.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Todavía no hay clientes. Da de alta el primero con &quot;Nuevo cliente&quot;.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-black/[.03] text-xs uppercase text-zinc-500 dark:bg-white/[.03] dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Razón social</th>
                  <th className="px-4 py-2 font-medium">Identificación fiscal</th>
                  <th className="px-4 py-2 font-medium">Sector</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-t border-black/10 dark:border-white/10"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/clientes?id=${cliente.id}`}
                        className="font-medium text-black hover:underline dark:text-zinc-50"
                      >
                        {cliente.razonSocial}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{cliente.identificacionFiscal}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{cliente.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {mostrarFormulario && (
        <ClienteFormModal onCancelar={() => setMostrarFormulario(false)} onCrear={handleCrearCliente} />
      )}
    </AppShell>
  );
}
