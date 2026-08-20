/**
 * Catalogos de referencia para El Salvador.
 *
 * Sectores: PRD M4.6 (plantillas sectoriales).
 *
 * Division territorial: nueva estructura de 14 departamentos / 44 municipios
 * / 262 distritos, vigente desde el 1 de mayo de 2024 (Decreto Legislativo
 * No. 762, "Ley Especial para la Reestructuracion Municipal", Diario
 * Oficial No. 110, Tomo 439, 14 jun 2023). Los "distritos" son los antiguos
 * 262 municipios, agrupados ahora bajo los 44 municipios nuevos -- utiles
 * para resolver el nombre historico que el cliente todavia use.
 */

export const SECTORES = ["Comercio", "Construcción", "Servicios", "Manufactura", "Otro"] as const;

export type Sector = (typeof SECTORES)[number];

export interface MunicipioNuevo {
  nombre: string;
  distritos: string[];
}

export interface DepartamentoEntry {
  departamento: string;
  municipios: MunicipioNuevo[];
}

export const DIVISION_TERRITORIAL: DepartamentoEntry[] = [
  {
    departamento: "Ahuachapán",
    municipios: [
      { nombre: "Ahuachapán Norte", distritos: ["Atiquizaya", "El Refugio", "San Lorenzo", "Turín"] },
      { nombre: "Ahuachapán Centro", distritos: ["Ahuachapán", "Apaneca", "Concepción de Ataco", "Tacuba"] },
      { nombre: "Ahuachapán Sur", distritos: ["Guaymango", "Jujutla", "San Francisco Menéndez", "San Pedro Puxtla"] },
    ],
  },
  {
    departamento: "San Salvador",
    municipios: [
      { nombre: "San Salvador Norte", distritos: ["Aguilares", "El Paisnal", "Guazapa"] },
      { nombre: "San Salvador Oeste", distritos: ["Apopa", "Nejapa"] },
      { nombre: "San Salvador Este", distritos: ["Ilopango", "San Martín", "Soyapango", "Tonacatepeque"] },
      {
        nombre: "San Salvador Centro",
        distritos: ["Ayutuxtepeque", "Mejicanos", "San Salvador", "Cuscatancingo", "Ciudad Delgado"],
      },
      {
        nombre: "San Salvador Sur",
        distritos: ["Panchimalco", "Rosario de Mora", "San Marcos", "Santo Tomás", "Santiago Texacuangos"],
      },
    ],
  },
  {
    departamento: "La Libertad",
    municipios: [
      { nombre: "La Libertad Norte", distritos: ["Quezaltepeque", "San Matías", "San Pablo Tacachico"] },
      { nombre: "La Libertad Centro", distritos: ["San Juan Opico", "Ciudad Arce"] },
      { nombre: "La Libertad Oeste", distritos: ["Colón", "Jayaque", "Sacacoyo", "Tepecoyo", "Talnique"] },
      {
        nombre: "La Libertad Este",
        distritos: ["Antiguo Cuscatlán", "Huizúcar", "Nuevo Cuscatlán", "San José Villanueva", "Zaragoza"],
      },
      {
        nombre: "La Libertad Costa",
        distritos: ["Chiltiupán", "Jicalapa", "La Libertad", "Tamanique", "Teotepeque"],
      },
      { nombre: "La Libertad Sur", distritos: ["Comasagua", "Santa Tecla"] },
    ],
  },
  {
    departamento: "Chalatenango",
    municipios: [
      { nombre: "Chalatenango Norte", distritos: ["La Palma", "Citalá", "San Ignacio"] },
      {
        nombre: "Chalatenango Centro",
        distritos: [
          "Nueva Concepción",
          "Tejutla",
          "La Reina",
          "Agua Caliente",
          "Dulce Nombre de María",
          "El Paraíso",
          "San Fernando",
          "San Francisco Morazán",
          "San Rafael",
          "Santa Rita",
        ],
      },
      {
        nombre: "Chalatenango Sur",
        distritos: [
          "Chalatenango",
          "Arcatao",
          "Azacualpa",
          "Comalapa",
          "Concepción Quezaltepeque",
          "El Carrizal",
          "La Laguna",
          "Las Vueltas",
          "Nombre de Jesús",
          "Nueva Trinidad",
          "Ojos de Agua",
          "Potonico",
          "San Antonio de La Cruz",
          "San Antonio Los Ranchos",
          "San Francisco Lempa",
          "San Isidro Labrador",
          "San José Cancasque",
          "San Miguel de Mercedes",
          "San José Las Flores",
          "San Luis del Carmen",
        ],
      },
    ],
  },
  {
    departamento: "Cuscatlán",
    municipios: [
      {
        nombre: "Cuscatlán Norte",
        distritos: ["Suchitoto", "San José Guayabal", "Oratorio de Concepción", "San Bartolomé Perulapía", "San Pedro Perulapán"],
      },
      {
        nombre: "Cuscatlán Sur",
        distritos: [
          "Cojutepeque",
          "San Rafael Cedros",
          "Candelaria",
          "Monte San Juan",
          "El Carmen",
          "San Cristóbal",
          "Santa Cruz Michapa",
          "San Ramón",
          "El Rosario",
          "Santa Cruz Analquito",
          "Tenancingo",
        ],
      },
    ],
  },
  {
    departamento: "Cabañas",
    municipios: [
      { nombre: "Cabañas Este", distritos: ["Sensuntepeque", "Victoria", "Dolores", "Guacotecti", "San Isidro"] },
      { nombre: "Cabañas Oeste", distritos: ["Ilobasco", "Tejutepeque", "Jutiapa", "Cinquera"] },
    ],
  },
  {
    departamento: "La Paz",
    municipios: [
      {
        nombre: "La Paz Oeste",
        distritos: [
          "Cuyultitán",
          "Olocuilta",
          "San Juan Talpa",
          "San Luis Talpa",
          "San Pedro Masahuat",
          "Tapalhuaca",
          "San Francisco Chinameca",
        ],
      },
      {
        nombre: "La Paz Centro",
        distritos: [
          "El Rosario",
          "Jerusalén",
          "Mercedes La Ceiba",
          "Paraíso de Osorio",
          "San Antonio Masahuat",
          "San Emigdio",
          "San Juan Tepezontes",
          "San Luis La Herradura",
          "San Miguel Tepezontes",
          "San Pedro Nonualco",
          "Santa María Ostuma",
          "Santiago Nonualco",
        ],
      },
      { nombre: "La Paz Este", distritos: ["San Juan Nonualco", "San Rafael Obrajuelo", "Zacatecoluca"] },
    ],
  },
  {
    departamento: "La Unión",
    municipios: [
      {
        nombre: "La Unión Norte",
        distritos: [
          "Anamorós",
          "Bolívar",
          "Concepción de Oriente",
          "El Sauce",
          "Lislique",
          "Nueva Esparta",
          "Pasaquina",
          "Polorós",
          "San José La Fuente",
          "Santa Rosa de Lima",
        ],
      },
      {
        nombre: "La Unión Sur",
        distritos: ["Conchagua", "El Carmen", "Intipucá", "La Unión", "Meanguera del Golfo", "San Alejo", "Yayantique", "Yucuaiquín"],
      },
    ],
  },
  {
    departamento: "Usulután",
    municipios: [
      {
        nombre: "Usulután Norte",
        distritos: [
          "Santiago de María",
          "Alegría",
          "Berlín",
          "Mercedes Umaña",
          "Jucuapa",
          "El Triunfo",
          "Estanzuelas",
          "San Buenaventura",
          "Nueva Granada",
        ],
      },
      {
        nombre: "Usulután Este",
        distritos: [
          "Usulután",
          "Jucuarán",
          "San Dionisio",
          "Concepción Batres",
          "Santa María",
          "Ozatlán",
          "Tecapán",
          "Santa Elena",
          "California",
          "Ereguayquín",
        ],
      },
      { nombre: "Usulután Oeste", distritos: ["Jiquilisco", "Puerto El Triunfo", "San Agustín", "San Francisco Javier"] },
    ],
  },
  {
    departamento: "Sonsonate",
    municipios: [
      { nombre: "Sonsonate Norte", distritos: ["Juayúa", "Nahuizalco", "Salcoatitán", "Santa Catarina Masahuat"] },
      { nombre: "Sonsonate Centro", distritos: ["Sonsonate", "Sonzacate", "Nahulingo", "San Antonio del Monte", "Santo Domingo de Guzmán"] },
      { nombre: "Sonsonate Este", distritos: ["Izalco", "Armenia", "Caluco", "San Julián", "Cuisnahuat", "Santa Isabel Ishuatán"] },
      { nombre: "Sonsonate Oeste", distritos: ["Acajutla"] },
    ],
  },
  {
    departamento: "Santa Ana",
    municipios: [
      { nombre: "Santa Ana Norte", distritos: ["Masahuat", "Metapán", "Santa Rosa Guachipilín", "Texistepeque"] },
      { nombre: "Santa Ana Centro", distritos: ["Santa Ana"] },
      { nombre: "Santa Ana Este", distritos: ["Coatepeque", "El Congo"] },
      {
        nombre: "Santa Ana Oeste",
        distritos: ["Candelaria de la Frontera", "Chalchuapa", "El Porvenir", "San Antonio Pajonal", "San Sebastián Salitrillo", "Santiago de la Frontera"],
      },
    ],
  },
  {
    departamento: "San Vicente",
    municipios: [
      {
        nombre: "San Vicente Norte",
        distritos: ["Apastepeque", "Santa Clara", "San Ildefonso", "San Esteban Catarina", "San Sebastián", "San Lorenzo", "Santo Domingo"],
      },
      {
        nombre: "San Vicente Sur",
        distritos: ["San Vicente", "Guadalupe", "Verapaz", "Tepetitán", "Tecoluca", "San Cayetano Istepeque"],
      },
    ],
  },
  {
    departamento: "San Miguel",
    municipios: [
      {
        nombre: "San Miguel Norte",
        distritos: [
          "Ciudad Barrios",
          "Sesori",
          "Nuevo Edén de San Juan",
          "San Gerardo",
          "San Luis de La Reina",
          "Carolina",
          "San Antonio del Mosco",
          "Chapeltique",
        ],
      },
      { nombre: "San Miguel Centro", distritos: ["San Miguel", "Comacarán", "Uluazapa", "Moncagua", "Quelepa", "Chirilagua"] },
      { nombre: "San Miguel Oeste", distritos: ["Chinameca", "Nueva Guadalupe", "Lolotique", "San Jorge", "San Rafael Oriente", "El Tránsito"] },
    ],
  },
  {
    departamento: "Morazán",
    municipios: [
      {
        nombre: "Morazán Norte",
        distritos: [
          "Arambala",
          "Cacaopera",
          "Corinto",
          "El Rosario",
          "Joateca",
          "Jocoaitique",
          "Meanguera",
          "Perquín",
          "San Fernando",
          "San Isidro",
          "Torola",
        ],
      },
      {
        nombre: "Morazán Sur",
        distritos: [
          "Chilanga",
          "Delicias de Concepción",
          "El Divisadero",
          "Gualococti",
          "Guatajiagua",
          "Jocoro",
          "Lolotiquillo",
          "Osicala",
          "San Carlos",
          "San Francisco Gotera",
          "San Simón",
          "Sensembra",
          "Sociedad",
          "Yamabal",
          "Yoloaiquín",
        ],
      },
    ],
  },
];

/** Los 44 municipios nuevos, aplanados con su departamento. */
export const MUNICIPIOS_NUEVOS: { departamento: string; nombre: string }[] = DIVISION_TERRITORIAL.flatMap((d) =>
  d.municipios.map((m) => ({ departamento: d.departamento, nombre: m.nombre }))
);

/** Resuelve el municipio nuevo al que pertenece un distrito (municipio antiguo). */
export function municipioPorDistrito(nombreDistrito: string): MunicipioNuevo | null {
  const buscado = nombreDistrito.trim().toLowerCase();
  for (const d of DIVISION_TERRITORIAL) {
    for (const m of d.municipios) {
      if (m.distritos.some((dist) => dist.toLowerCase() === buscado)) return m;
    }
  }
  return null;
}
