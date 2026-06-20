# FiberNOC - Integração Front-end com Back-end

## 🚀 Configuração do Back-end

### Pré-requisitos
- Node.js v14+ instalado
- npm ou yarn

### Instalação

1. **Navegue até a pasta do back-end:**
```bash
cd back-end
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

O servidor estará rodando em: **http://localhost:3000**

### Verificar se está funcionando

Abra no navegador ou faça uma requisição:
```
http://localhost:3000/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "FiberNOC API está funcionando",
  "timestamp": "2026-06-20T18:00:00.000Z"
}
```

---

## 🔌 Endpoints Disponíveis

### ONUs
- `GET /api/onus` - Lista todas as ONUs
- `GET /api/onus/:id` - Busca ONU específica
- `PUT /api/onus/:id` - Atualiza ONU
- `DELETE /api/onus/:id` - Remove ONU

### Logs
- `GET /api/logs` - Lista todos os logs
- `GET /api/logs?onu=CLIENTE_01` - Filtra logs por ONU
- `POST /api/logs` - Cria novo log

### Alertas
- `GET /api/alerts?limit=6` - Lista alertas recentes

### Estatísticas
- `GET /api/stats` - Retorna estatísticas do dashboard

---

## 🔧 Configurar Front-end para Usar a API

O front-end está configurado para se conectar a `http://localhost:3000/api` por padrão.

Se quiser mudar a URL, execute no console do navegador:
```javascript
setApiBaseUrl('http://seu-servidor.com/api');
```

---

## 📝 Exemplo de Requisição

### Criar um novo log
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "onu": "CLIENTE_01",
    "evento": "SIGNAL_LOW",
    "detalhe": "Sinal abaixo de -25 dBm",
    "tipo": "warning"
  }'
```

### Atualizar status de ONU
```bash
curl -X PUT http://localhost:3000/api/onus/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "offline",
    "sinal": -32.5
  }'
```

---

## 🔄 Desenvolvimento com Nodemon

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

---

## 📦 Estrutura do Projeto

```
Projeto_FiberNOC/
├── back-end/
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependências
│   └── README.md         # Instruções
├── html/
│   ├── index.html        # Dashboard
│   ├── onu.html
│   ├── logs.html
│   └── ...
├── js/
│   ├── api.js            # Cliente API
│   ├── main.js           # Dashboard
│   ├── onus.js           # Página ONUs
│   ├── logs.js           # Página Logs
│   └── ...
└── css/
    └── style.css
```

---

## ⚠️ Notas Importantes

- Este back-end armazena dados **em memória**. Dados são perdidos quando o servidor reinicia.
- Para produção, integre com um banco de dados real (MongoDB, PostgreSQL, MySQL, etc).
- Adicione autenticação (JWT, OAuth2) antes de usar em produção.
- Implemente validação de dados mais robusta.

---

## 🆘 Troubleshooting

### Porta 3000 já está em uso?
```bash
# Linux/Mac - Encontre e mate o processo
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Error?
O back-end já tem CORS habilitado. Se ainda tiver problemas, verifique se:
1. O servidor está rodando em `http://localhost:3000`
2. O front-end está acessando `http://localhost:3000/api`

### Front-end não conecta?
1. Verifique se o servidor está rodando: `http://localhost:3000/api/health`
2. Abra o DevTools (F12) e veja os erros na aba Console
3. Verifique a URL configurada com: `localStorage.getItem('API_BASE_URL')`

---

## 📚 Próximos Passos

1. **Banco de Dados**: Integre MongoDB ou PostgreSQL
2. **Autenticação**: Implemente JWT ou OAuth2
3. **Validação**: Use bibliotecas como `joi` ou `yup`
4. **Testes**: Adicione testes com `jest` ou `mocha`
5. **Deploy**: Implante em Heroku, AWS, DigitalOcean, etc.

---

**Desenvolvido com ❤️ para FiberNOC**
