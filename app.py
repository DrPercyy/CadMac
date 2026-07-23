from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import pandas as pd
import pickle
import json
import os
import re
from datetime import datetime


# ==========================================================
# CONFIGURAÇÕES
# ==========================================================

BASE_FILE = "mac_database.pkl"
META_FILE = "metadata.json"

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================================================
# FASTAPI
# ==========================================================

app = FastAPI(
    title="CadMac",
    description="Gerenciador de MACs Huawei"
)


app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


templates = Jinja2Templates(
    directory="templates"
)


# ==========================================================
# MEMÓRIA DA APLICAÇÃO
# ==========================================================

mac_database = {}


# ==========================================================
# UTILITÁRIOS
# ==========================================================

def normalizar_mac(mac):

    """
    Aceita:

    40-1c-83-96-e0-dd
    40:1c:83:96:e0:dd
    401c8396e0dd

    Retorna:

    40-1C-83-96-E0-DD
    """

    mac = str(mac).upper()

    mac = re.sub(
        r"[^A-F0-9]",
        "",
        mac
    )

    if len(mac) != 12:
        return mac


    return "-".join(
        [
            mac[i:i+2]
            for i in range(0,12,2)
        ]
    )


def carregar_base():

    global mac_database


    if os.path.exists(BASE_FILE):

        with open(BASE_FILE,"rb") as f:
            mac_database = pickle.load(f)

        return True


    return False



def salvar_base():

    with open(BASE_FILE,"wb") as f:

        pickle.dump(
            mac_database,
            f
        )


def salvar_metadata(
    arquivo,
    total
):

    dados = {

        "arquivo": arquivo,

        "total_macs": total,

        "atualizado_em":
            datetime.now()
            .strftime(
                "%d/%m/%Y %H:%M:%S"
            )
    }


    with open(
        META_FILE,
        "w",
        encoding="utf8"
    ) as f:

        json.dump(
            dados,
            f,
            indent=4,
            ensure_ascii=False
        )



# ==========================================================
# CARREGA BASE AO INICIAR
# ==========================================================

carregar_base()



# ==========================================================
# PÁGINA PRINCIPAL
# ==========================================================


@app.get(
    "/",
    response_class=HTMLResponse
)
async def home(request: Request):

    metadata = {}

    if os.path.exists(META_FILE):

        with open(
            META_FILE,
            encoding="utf8"
        ) as f:

            metadata = json.load(f)


    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "metadata": metadata
        }
    )


# ==========================================================
# UPLOAD DA BASE HUAWEI
# ==========================================================


@app.post("/upload-base")
async def upload_base(
    file:UploadFile = File(...)
):

    global mac_database


    caminho = (
        f"{UPLOAD_DIR}/"
        f"{file.filename}"
    )


    with open(
        caminho,
        "wb"
    ) as f:

        f.write(
            await file.read()
        )



    df = pd.read_excel(
        caminho,
        skiprows=2
    )


    df[
        "*MAC Address List"
    ] = (

        df[
            "*MAC Address List"
        ]
        .fillna("")
        .astype(str)
        .str.split(",")

    )


    df=df.explode(
        "*MAC Address List"
    )


    nova_base={}


    for _,row in df.iterrows():

        mac = normalizar_mac(
            row["*MAC Address List"]
        )


        grupo = row[
            "*MAC Account Name"
        ]


        if mac:

            nova_base[mac]=grupo



    mac_database = nova_base


    salvar_base()


    salvar_metadata(
        file.filename,
        len(mac_database)
    )


    return {

        "status":"ok",

        "total":
            len(mac_database)

    }



# ==========================================================
# PESQUISA
# ==========================================================


@app.post("/search")
async def search(
    data:dict
):


    entrada=data.get(
        "macs",
        []
    )


    encontrados=[]

    nao_encontrados=[]


    for item in entrada:


        mac=normalizar_mac(item)


        grupo = mac_database.get(
            mac
        )


        if grupo:

            encontrados.append(
                {
                    "MAC":mac,
                    "Grupo":grupo
                }
            )

        else:

            nao_encontrados.append(
                mac
            )


    return {

        "total":
            len(entrada),

        "encontrados":
            encontrados,

        "nao_encontrados":
            nao_encontrados

    }



# ==========================================================
# STATUS
# ==========================================================


@app.get("/status")
async def status():

    return {

        "base_carregada":
            len(mac_database),

    }