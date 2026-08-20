"use client";

import { useState } from "react";
import { DIVISION_TERRITORIAL, SECTORES } from "shared";
import type { NuevoCliente } from "@/lib/clientes";

export default function ClienteFormModal({
  onCancelar,
  onCrear,
}: {
  onCancelar: () => void;
  onCrear: (datos: NuevoCliente) => Promise<void>;
}) {
  const [identificacionFiscal, setIdentificacionFiscal] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [giro, setGiro] = useState("");
  const [sector, setSector] = useState("");
  const [regimenEspecial, setRegimenEspecial] = useState("");
  const [departamento, setDepartamento] = useState(DIVISION_TERRITORIAL[0].departamento);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const municipiosDelDepartamento =
    DIVISION_TERRITORIAL.find((d) => d.departamento === departamento)?.municipios ?? [];

  function agregarMunicipio(nombre: string) {
    if (!nombre || municipios.includes(nombre)) return;
    setMunicipios([...municipios, nombre]);
  }

  function quitarMunicipio(nombre: string) {
    setMunicipios(municipios.filter((m) => m !== nombre));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onCrear({
        identificacionFiscal,
        razonSocial,
        giro,
        sector,
        regimenEspecial: regimenEspecial.trim() || null,
        municipios,
      });
    } catch {
      setError("No se pudo guardar el cliente. Intenta de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-lg border border-black/10 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-zinc-900"
      >
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Nuevo cliente</h2>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <Campo label="Identificación fiscal (NIT/NRC)">
          <input
            required
            value={identificacionFiscal}
            onChange={(e) => setIdentificacionFiscal(e.target.value)}
            className={inputClase}
          />
        </Campo>
        <Campo label="Razón social">
          <input
            required
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            className={inputClase}
          />
        </Campo>
        <Campo label="Giro">
          <input required value={giro} onChange={(e) => setGiro(e.target.value)} className={inputClase} />
        </Campo>
        <Campo label="Sector">
          <select required value={sector} onChange={(e) => setSector(e.target.value)} className={inputClase}>
            <option value="" disabled>
              Selecciona un sector
            </option>
            {SECTORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Régimen especial (opcional)">
          <input
            value={regimenEspecial}
            onChange={(e) => setRegimenEspecial(e.target.value)}
            className={inputClase}
          />
        </Campo>

        <Campo label="Municipios">
          <div className="flex gap-2">
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className={`${inputClase} flex-1`}
            >
              {DIVISION_TERRITORIAL.map((d) => (
                <option key={d.departamento} value={d.departamento}>
                  {d.departamento}
                </option>
              ))}
            </select>
            <select
              defaultValue=""
              onChange={(e) => {
                agregarMunicipio(e.target.value);
                e.target.value = "";
              }}
              className={`${inputClase} flex-1`}
            >
              <option value="" disabled>
                Agregar municipio…
              </option>
              {municipiosDelDepartamento.map((m) => (
                <option key={m.nombre} value={m.nombre}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {municipios.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {municipios.map((m) => (
                <span
                  key={m}
                  className="flex items-center gap-1 rounded-full bg-black/[.05] px-2.5 py-1 text-xs text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => quitarMunicipio(m)}
                    aria-label={`Quitar ${m}`}
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </Campo>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/[.04]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClase =
  "rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:focus:border-white/30";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      {children}
    </div>
  );
}
