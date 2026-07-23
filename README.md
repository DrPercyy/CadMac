# 📦 CADMAC

Protótipo de sistema web desenvolvido em **FastAPI** para pesquisa e validação de endereços MAC utilizando arquivos de exportação gerados pelo **iMaster Huawei**.

Este repositório foi criado com objetivo de avaliar a viabilidade de uma futura implementação desta funcionalidade como uma **feature integrada ao sistema oficial da empresa**.

> ⚠️ Este projeto é apenas um protótipo. Podem existir bugs ou funcionalidades incompletas.

---

## 📌 Funcionamento

Para utilizar o sistema é necessário possuir acesso ao **iMaster Huawei** e realizar previamente o export da lista de MACs pelo próprio sistema.

Após obter o arquivo de exportação, ele deve ser utilizado no CADMAC para realizar as consultas e análises necessárias.

---

## 🚀 Tecnologias Utilizadas

- **Python 3.13.1**
- **FastAPI** — Framework web de alta performance
- **Uvicorn** — Servidor ASGI para execução da aplicação
- **Jinja2** — Renderização das páginas HTML
- **Pandas** — Processamento e análise de dados
- **OpenPyXL / XLRD** — Leitura de arquivos Excel (`.xls` e `.xlsx`)
- **Python-Multipart** — Suporte para upload de arquivos e formulários

---

## 🛠️ Como Executar Localmente

### Pré-requisitos

- Python **3.13.1** instalado
- Acesso ao **iMaster Huawei** para gerar os arquivos de exportação
- Git instalado

---

### 1. Clone o repositório

```bash
git clone https://github.com/DrPercyy/CadMac.git
cd CadMac
```

---

### 2. Crie o ambiente virtual

No terminal, dentro da pasta do projeto:

```bash
python -m venv venv
```

---

### 3. Ative a ambiente virtual

#### Windows (PowerShell)

```powershell
.\venv\Scripts\Activate.ps1
```

#### Linux / Mac

```bash
source venv/bin/activate
```

---

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

---

### 5. Inicie a aplicação

```bash
uvicorn app:app --reload
```

O servidor será iniciado em:

```
http://127.0.0.1:8000
```

---

## 📁 Estrutura do Projeto

```plaintext
CADMAC/
├── static/              # Arquivos estáticos (CSS, JS e imagens)
├── templates/           # Templates HTML utilizando Jinja2
├── uploads/             # Arquivos enviados para processamento
├── app.py               # Aplicação principal FastAPI
├── requirements.txt     # Dependências do projeto
└── .gitignore           # Arquivos ignorados pelo Git
```

---

## 🤖 Observações sobre o Desenvolvimento

A interface web e algumas funcionalidades foram desenvolvidas utilizando Inteligência Artificial como apoio, tendo como base um notebook Jupyter desenvolvido previamente.

O processamento e a lógica inicial do projeto foram estruturados a partir desse estudo.

---

## 📝 Licença

Este projeto está sob a licença MIT.
