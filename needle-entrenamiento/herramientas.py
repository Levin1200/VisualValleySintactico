"""
Las funciones de tu app que Needle debe aprender a llamar.

Cámbialas por las tuyas siguiendo las reglas de Cactus:
- Una función por acción, con nombres en inglés y una descripción corta de lo que hace.
- Cada argumento sale de algo que el usuario dijo. Si puede faltar, dale un valor por defecto.
- Las listas cerradas van como Literal y los rangos como Field(ge=..., le=...): el modelo no
  puede salirse de ellos.
- Cinco funciones o menos por turno. Con más, Needle solo ve las cinco más parecidas a la frase.

Ejecuta `python herramientas.py` para escribir tools.json, el formato que usan los datos de
entrenamiento.
"""
import inspect
import json
from pathlib import Path
from typing import Annotated, Literal

import needle
from needle import Field


@needle.tool
def send_money(
    amount: Annotated[float, Field(gt=0, le=100000, description="the amount of money to send")],
    recipient: Annotated[str, Field(description="the person who receives the money, as the user said it")],
    currency: Literal["GTQ", "USD"] = "GTQ",
):
    "Send money to a person. GTQ is quetzales (Q, pisto, varos); USD is dollars."
    return {"ok": True}


@needle.tool
def check_balance(account: Literal["ahorro", "monetaria"]):
    "Show the balance of a bank account: ahorro (savings) or monetaria (checking)."
    return {"balance": 1250.50}


@needle.tool
def pay_bill(
    service: Literal["luz", "agua", "telefono", "internet"],
    amount: Annotated[float | None, Field(gt=0, le=100000, description="the amount to pay, only if the user says it")] = None,
):
    "Pay a utility bill: luz (electricity, EEGSA, Energuate), agua (water, Empagua), telefono or internet."
    return {"ok": True}


@needle.tool
def buy_airtime(
    amount: Annotated[float, Field(gt=0, le=1000, description="the top-up amount")],
    carrier: Literal["tigo", "claro"],
    phone: Annotated[str | None, Field(description="the phone number, e.g. 5555-1234, only if the user says it")] = None,
):
    "Top up prepaid phone credit (recarga, saldo) on Tigo or Claro."
    return {"ok": True}


@needle.tool
def block_card(card: Literal["debito", "credito"]):
    "Block a lost or stolen card: debito (debit) or credito (credit)."
    return {"ok": True}


TOOLS = [send_money, check_balance, pay_bill, buy_airtime, block_card]


def _copiar_defaults(fn):
    """@needle.tool (3.1.0) no escribe los valores por defecto en el esquema; sin ellos el motor
    no puede completar, por ejemplo, la moneda cuando el usuario no la dice."""
    props = fn._needle_tool["parameters"]["properties"]
    for nombre, p in inspect.signature(fn).parameters.items():
        if p.default is not p.empty and p.default is not None and nombre in props:
            props[nombre].setdefault("default", p.default)


for _fn in TOOLS:
    _copiar_defaults(_fn)


def schemas():
    """Esquemas JSON de las funciones, tal como Needle los ve al usarlas."""
    return [fn._needle_tool for fn in TOOLS]


if __name__ == "__main__":
    out = Path(__file__).with_name("tools.json")
    out.write_text(json.dumps(schemas(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(TOOLS)} funciones → {out.name}")
