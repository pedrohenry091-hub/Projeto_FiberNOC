type OnuRecord = {
  id: number;
  nome: string;
  mac: string;
  status: string;
  sinal: number;
  regiao: string;
  olt: string;
  pon: string;
};

type LogRecord = {
  id: number;
  data: string;
  onu: string;
  evento: string;
  detalhe: string;
  tipo: string;
};

const initialOnus: OnuRecord[] = [
  {
    id: 1,
    nome: 'CLIENTE_01',
    mac: 'FHTT00A1B2C3',
    status: 'online',
    sinal: -19.5,
    regiao: 'Joao Pessoa',
    olt: 'OLT-MANAIRA-01',
    pon: 'PON 1'
  },
  {
    id: 2,
    nome: 'CLIENTE_02',
    mac: 'FHTT00C3D4E5',
    status: 'offline',
    sinal: -31.2,
    regiao: 'Cabedelo',
    olt: 'OLT-INTERMARES-02',
    pon: 'PON 3'
  },
  {
    id: 3,
    nome: 'CLIENTE_03',
    mac: 'FHTT00E5F6G7',
    status: 'online',
    sinal: -26.8,
    regiao: 'Joao Pessoa',
    olt: 'OLT-MANAIRA-01',
    pon: 'PON 2'
  },
  {
    id: 4,
    nome: 'CLIENTE_04',
    mac: 'FHTT00H8I9J0',
    status: 'warning',
    sinal: -27.4,
    regiao: 'Santa Rita',
    olt: 'OLT-LITORAL-03',
    pon: 'PON 4'
  }
];

const initialLogs: LogRecord[] = [
  {
    id: 1,
    data: '2026-05-06 10:15:30',
    onu: 'CLIENTE_02',
    evento: 'PON_LOSS',
    detalhe: 'Sinal caiu (LOS). Possível rompimento de fibra.',
    tipo: 'error'
  },
  {
    id: 2,
    data: '2026-05-06 09:40:12',
    onu: 'CLIENTE_01',
    evento: 'POWER_OFF',
    detalhe: 'Equipamento desligado (Dying Gasp).',
    tipo: 'warning'
  },
  {
    id: 3,
    data: '2026-05-06 08:20:05',
    onu: 'CLIENTE_03',
    evento: 'CONFIG_CHG',
    detalhe: 'Alteração de Profile de banda efetuada.',
    tipo: 'info'
  },
  {
    id: 4,
    data: '2026-05-06 11:00:00',
    onu: 'CLIENTE_04',
    evento: 'SINAL_BAIXO',
    detalhe: 'Sinal abaixo do limite recomendado.',
    tipo: 'warning'
  }
];

const fallbackStore = {
  onus: initialOnus.map((onu) => ({ ...onu })),
  logs: initialLogs.map((log) => ({ ...log }))
};

let nextId = fallbackStore.onus.length + 1;

export function resetFallbackStore() {
  fallbackStore.onus = initialOnus.map((onu) => ({ ...onu }));
  fallbackStore.logs = initialLogs.map((log) => ({ ...log }));
  nextId = fallbackStore.onus.length + 1;
}

export function getFallbackOnus() {
  return fallbackStore.onus.map((onu) => ({ ...onu }));
}

export function getFallbackOnuById(id: number) {
  return fallbackStore.onus.find((onu) => onu.id === id) ? { ...fallbackStore.onus.find((onu) => onu.id === id)! } : null;
}

export function createFallbackOnu(payload: Partial<OnuRecord>) {
  const created: OnuRecord = {
    id: nextId++,
    nome: payload.nome || 'ONU',
    mac: payload.mac || `FHTT${Date.now()}`,
    status: payload.status || 'offline',
    sinal: Number(payload.sinal ?? -30),
    regiao: payload.regiao || 'Sem região',
    olt: payload.olt || 'OLT-PADRÃO',
    pon: payload.pon || 'PON 1'
  };

  fallbackStore.onus.unshift(created);
  fallbackStore.logs.unshift({
    id: fallbackStore.logs.length + 1,
    data: new Date().toLocaleString('pt-BR'),
    onu: created.nome,
    evento: 'CADASTRO',
    detalhe: 'ONU cadastrada manualmente.',
    tipo: 'info'
  });

  return created;
}

export function updateFallbackOnu(id: number, payload: Partial<OnuRecord>) {
  const index = fallbackStore.onus.findIndex((onu) => onu.id === id);
  if (index === -1) {
    return null;
  }

  fallbackStore.onus[index] = {
    ...fallbackStore.onus[index],
    ...payload,
    sinal: payload.sinal !== undefined ? Number(payload.sinal) : fallbackStore.onus[index].sinal
  };

  return { ...fallbackStore.onus[index] };
}

export function deleteFallbackOnu(id: number) {
  const index = fallbackStore.onus.findIndex((onu) => onu.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = fallbackStore.onus.splice(index, 1);
  fallbackStore.logs.unshift({
    id: fallbackStore.logs.length + 1,
    data: new Date().toLocaleString('pt-BR'),
    onu: removed.nome,
    evento: 'DELETE',
    detalhe: 'ONU removida manualmente.',
    tipo: 'info'
  });

  return removed;
}

export function getFallbackLogs(limit = 10) {
  return fallbackStore.logs.slice(0, limit).map((log) => ({ ...log }));
}

export function getFallbackStats() {
  const onus = getFallbackOnus();
  const logs = getFallbackLogs(50);
  const online = onus.filter((onu) => onu.status === 'online').length;
  const offline = onus.filter((onu) => onu.status === 'offline').length;
  const alertCount = logs.filter((log) => log.tipo === 'error' || log.tipo === 'warning').length;

  return { onlineCount: online, offlineCount: offline, alertCount, totalOnus: onus.length };
}
