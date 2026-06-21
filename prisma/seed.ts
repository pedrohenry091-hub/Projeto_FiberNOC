import prisma from '../src/lib/prisma';

const main = async () => {
  await prisma.log.deleteMany();
  await prisma.onu.deleteMany();

  await prisma.onu.createMany({
    data: [
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
      }
    ]
  });

  await prisma.log.createMany({
    data: [
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
      }
    ]
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
