"""
Genera los datos de entrenamiento y de prueba a partir de plantillas de frases.

Cada ejemplo es una línea JSON con:
  query      lo que dice el usuario
  tools      los esquemas de tus funciones (salen de herramientas.py)
  answers    las llamadas exactas que el modelo debe producir ([] si no aplica ninguna)
  reasoning  una línea que dice de qué parte de la frase sale cada argumento

La prueba usa frases y nombres que NO aparecen en el entrenamiento, para medir si el
modelo generaliza en vez de memorizar.

    python generar_datos.py                  # escribe datos/entrenamiento.jsonl y datos/prueba.jsonl
    python generar_datos.py --cantidad 1500  # más ejemplos de entrenamiento
"""
import argparse
import json
import random
from pathlib import Path

from herramientas import schemas

# ---------------------------------------------------------------------------
# Valores que llenan las plantillas. Separados en entrenamiento / prueba.
# ---------------------------------------------------------------------------

NOMBRES = {
    "train": ["María", "Carlos", "José Luis", "Ana Lucía", "Don Pedro", "mi mamá", "mi hermano", "Kevin",
              "Andrea", "Byron", "Wendy", "la seño Rosa", "mi primo Juan", "Fernando", "Lucky", "Sofía",
              "mi papá", "Doña Marta", "Javier", "Gabriela", "mi hermana", "el licenciado Pérez"],
    "test": ["Mynor", "Heidy", "Luis Fernando", "mi tía Carmen", "Don Chepe", "Estuardo", "Ingrid",
             "mi abuelita", "Brenda", "Rudy"],
}

# texto en la frase → valor numérico (las palabras sirven de evidencia igual que los dígitos)
PALABRAS_NUMERO = {"diez": 10, "veinte": 20, "veinticinco": 25, "cincuenta": 50, "cien": 100,
                   "doscientos": 200, "trescientos": 300, "quinientos": 500, "mil": 1000}


def monto(rng, maximo=5000, divisa=True):
    """Devuelve (texto, valor, código de moneda o None)."""
    if rng.random() < 0.15:
        palabra = rng.choice([p for p, v in PALABRAS_NUMERO.items() if v <= maximo])
        valor = PALABRAS_NUMERO[palabra]
        texto, moneda = rng.choice([(f"{palabra} quetzales", "GTQ"), (f"{palabra} varos", "GTQ"),
                                    (f"{palabra} dólares", "USD"), (palabra, None)])
        return texto, valor, (moneda if divisa else None)
    valor = rng.choice([5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 350,
                        400, 450, 500, 600, 750, 800, 1000, 1200, 1500, 2000, 2500, 3000])
    if rng.random() < 0.1:
        valor = valor + rng.choice([0.5, 0.25, 0.75])
    valor = min(valor, maximo)
    n = f"{valor:g}" if valor != int(valor) else str(int(valor))
    if not divisa:
        return rng.choice([n, f"Q{n}", f"{n} quetzales"]), valor, None
    texto, moneda = rng.choice([
        (f"Q{n}", "GTQ"), (f"Q {n}", "GTQ"), (f"{n} quetzales", "GTQ"), (f"{n} quetzalitos", "GTQ"),
        (f"{n} varos", "GTQ"), (f"{n} de pisto", "GTQ"), (f"${n}", "USD"), (f"{n} dólares", "USD"),
        (f"{n} dólares americanos", "USD"), (n, None), (n, None),
    ])
    return texto, valor, moneda


CUENTAS = {
    "train": {"ahorro": ["ahorro", "ahorros", "la de ahorro", "mi cuenta de ahorro"],
              "monetaria": ["monetaria", "la monetaria", "mi cuenta monetaria", "la de cheques"]},
    "test": {"ahorro": ["la cuenta de ahorros", "mis ahorros"],
             "monetaria": ["la cuenta monetaria", "cheques"]},
}
SERVICIOS = {
    "train": {"luz": ["la luz", "el recibo de la luz", "la EEGSA", "Energuate", "la energía"],
              "agua": ["el agua", "Empagua", "el recibo del agua"],
              "telefono": ["el teléfono", "la línea fija", "el recibo del teléfono"],
              "internet": ["el internet", "el recibo del internet"]},
    "test": {"luz": ["la factura de luz", "lo de la EEGSA"], "agua": ["la factura del agua", "lo del agua"],
             "telefono": ["la factura del teléfono"], "internet": ["la factura de internet", "el wifi"]},
}
OPERADORAS = {
    "train": {"tigo": ["Tigo", "tigo", "mi Tigo", "el Tigo"], "claro": ["Claro", "claro", "mi Claro", "el Claro"]},
    "test": {"tigo": ["mi número Tigo", "TIGO"], "claro": ["mi número Claro", "CLARO"]},
}
TARJETAS = {
    "train": {"debito": ["débito", "debito"], "credito": ["crédito", "credito"]},
    "test": {"debito": ["débito"], "credito": ["crédito"]},
}

# ---------------------------------------------------------------------------
# Plantillas por función. {m} = monto, {q} = persona, {c} = cuenta, {s} = servicio, ...
# ---------------------------------------------------------------------------

PLANTILLAS = {
    "send_money": {
        "train": ["mandale {m} a {q}", "enviá {m} a {q}", "transferile {m} a {q}", "pasale {m} a {q}",
                  "quiero enviar {m} a {q}", "necesito mandar {m} a {q}", "haceme una transferencia de {m} a {q}",
                  "mándale {m} a {q} porfa", "envía {m} a {q}", "deposítale {m} a {q}", "transfiere {m} para {q}",
                  "mandá {m} a {q}", "envíale {m} a {q} por favor", "quiero transferir {m} a {q}",
                  "pásale {m} a {q}", "hacé un depósito de {m} a {q}", "send {m} to {q}"],
        "test": ["podés mandarle {m} a {q}?", "le quiero pasar {m} a {q}", "manda {m} para {q} por favor",
                 "hacé un envío de {m} a {q}", "ayudame a transferir {m} a {q}"],
    },
    "check_balance": {
        "train": ["¿cuánto tengo en {c}?", "ver saldo de {c}", "decime mi saldo de {c}", "¿cuánto pisto tengo en {c}?",
                  "consultar saldo {c}", "saldo de {c}", "quiero ver cuánto hay en {c}", "¿cuánto me queda en {c}?",
                  "revisá el saldo de {c}", "mostrame el saldo de {c}", "check the balance of {c}"],
        "test": ["¿me podés decir cuánto hay en {c}?", "necesito saber el saldo de {c}", "¿qué saldo tiene {c}?"],
    },
    "pay_bill": {
        "train": ["pagá {s}", "quiero pagar {s}", "pagame {s} porfa", "cancelá {s}", "pagar {s}",
                  "hay que pagar {s}", "pagá {s}, son {m}", "pagá {m} de {s}", "quiero pagar {m} de {s}",
                  "cancelá {s} que son {m}", "pay {s}"],
        "test": ["ayudame a pagar {s}", "ya vino {s}, pagalo", "pagá {s} por {m}"],
    },
    "buy_airtime": {
        "train": ["recargá {m} a {o}", "haceme una recarga de {m} a {o}", "quiero saldo de {m} para {o}",
                  "comprá {m} de saldo {o}", "poneme {m} de crédito en {o}", "recarga de {m} {o}",
                  "recargá {m} a {o} al {t}", "haceme una recarga {o} de {m} al número {t}",
                  "recargale {m} al {t} que es {o}"],
        "test": ["necesito una recarga de {m} para {o}", "me echás {m} de saldo a {o}?",
                 "recarga {o} de {m} para el {t}"],
    },
    "block_card": {
        "train": ["bloqueá mi tarjeta de {k}", "perdí mi tarjeta de {k}", "me robaron la tarjeta de {k}, bloqueala",
                  "quiero bloquear la tarjeta de {k}", "congelá mi tarjeta de {k}", "se me perdió la de {k}",
                  "bloquear tarjeta {k}", "block my {k} card"],
        "test": ["urgente, bloqueen mi tarjeta de {k}", "creo que me clonaron la tarjeta de {k}, bloqueala",
                 "no encuentro mi tarjeta de {k}"],
    },
}

# Frases sin función que aplique: la respuesta correcta es [] (no inventar llamadas)
FUERA_DE_TEMA = {
    "train": ["hola", "buenos días", "gracias", "muchas gracias, muy amable", "cuéntame un chiste",
              "¿qué hora es?", "¿a qué hora abre la agencia?", "¿cómo está el clima en Xela?",
              "¿quién ganó el clásico?", "quiero hablar con un asesor", "¿cuál es el tipo de cambio?",
              "¿dónde hay un cajero cerca?", "quiero abrir una cuenta nueva", "¿me pueden dar un préstamo?",
              "¿cuánto cobran de comisión?", "olvidé mi contraseña", "¿qué es la EEGSA?", "adiós",
              "¿cómo saco una tarjeta de crédito?", "¿a cuánto está el dólar?", "¿hasta qué hora atienden?",
              "dame una receta de pepián", "¿qué día es hoy?", "quiero cambiar mi PIN",
              "¿cómo activo la banca en línea?", "¿cuánto es el mínimo para abrir una cuenta?",
              "¿tienen seguro de vida?", "explicame qué es un CDP", "¿cómo me afilio a la app?",
              "¿me mandan el estado de cuenta por correo?", "quiero poner una queja", "¿qué número tienen de servicio al cliente?",
              "¿cómo cambio mi correo?", "¿es seguro usar la app?", "¿cuál es el límite de retiro en cajero?",
              "¿qué pasa si me atraso en la tarjeta?", "recomendame un restaurante en Antigua", "¿va a llover hoy?",
              "¿cuánto cuesta el pasaje a Cobán?", "traducime hello al español", "¿quién eres?", "ok", "sí", "no gracias",
              "perfecto", "¿me ayudás con una tarea de matemática?", "¿dónde queda la agencia de zona 10?",
              "¿cómo genero un token?", "¿aceptan cheques de otros bancos?"],
    "test": ["buenas tardes", "¿me contás algo interesante?", "¿cuál es la agencia más cercana?",
             "¿qué requisitos piden para un préstamo?", "va, gracias", "¿cómo descargo la app?",
             "¿trabajan los domingos?", "¿qué tasa de interés tiene la cuenta de ahorro?",
             "¿cómo actualizo mis datos?", "¿qué tal el tráfico en la Roosevelt?", "¿me explicás qué es el IVA?",
             "chilero, gracias", "¿cuánto tarda en llegar la tarjeta nueva?", "¿atienden en Huehue?"],
}
# Saludos o muletillas al inicio, para variar las frases fuera de tema
PREFIJOS = ["", "", "hola, ", "oye, ", "disculpá, ", "buenas, ", "mire, "]
# Negaciones y peticiones incompletas: tampoco se llama nada
NEGADAS = {
    "train": ["no le mandés nada a {q}", "no pagués {s} todavía", "no bloqueés la tarjeta de {k}",
              "todavía no recargués {o}", "no le transfieras a {q}"],
    "test": ["mejor no le mandés a {q}", "esperá, no pagués {s}"],
}
INCOMPLETAS = {  # falta un dato obligatorio: la app debe preguntar, el modelo no adivina
    "train": ["mandale pisto a {q}", "quiero hacer una transferencia", "¿cuánto tengo?", "ver mi saldo",
              "recargá {m} a mi cel", "bloqueá mi tarjeta", "me robaron la tarjeta", "quiero pagar un recibo"],
    "test": ["necesito enviar dinero", "¿cuánto dinero me queda?", "perdí mi tarjeta",
             "recargame el teléfono", "pagá el recibo"],
}


# ---------------------------------------------------------------------------
# Construcción de ejemplos
# ---------------------------------------------------------------------------

def opcion(rng, tabla, split):
    valor = rng.choice(list(tabla[split]))
    return valor, rng.choice(tabla[split][valor])


def ejemplo(rng, split, funcion):
    plantilla = rng.choice(PLANTILLAS[funcion][split])
    huecos, args, razones = {}, {}, []

    if "{q}" in plantilla:
        huecos["q"] = rng.choice(NOMBRES[split])
        args["recipient"] = huecos["q"]
        razones.append(f"'{huecos['q']}' -> recipient")
    if "{c}" in plantilla:
        args["account"], huecos["c"] = opcion(rng, CUENTAS, split)
        razones.append(f"'{huecos['c']}' -> account {args['account']}")
    if "{s}" in plantilla:
        args["service"], huecos["s"] = opcion(rng, SERVICIOS, split)
        razones.append(f"'{huecos['s']}' -> service {args['service']}")
    if "{o}" in plantilla:
        args["carrier"], huecos["o"] = opcion(rng, OPERADORAS, split)
        razones.append(f"'{huecos['o']}' -> carrier {args['carrier']}")
    if "{k}" in plantilla:
        args["card"], huecos["k"] = opcion(rng, TARJETAS, split)
        razones.append(f"'{huecos['k']}' -> card {args['card']}")
    if "{t}" in plantilla:
        num = f"{rng.randint(3000, 5999)}{rng.randint(0, 9999):04d}"
        huecos["t"] = rng.choice([f"{num[:4]}-{num[4:]}", num, f"{num[:4]} {num[4:]}"])
        args["phone"] = huecos["t"]
        razones.append(f"'{huecos['t']}' -> phone")
    if "{m}" in plantilla:
        divisa = funcion == "send_money"
        maximo = 1000 if funcion == "buy_airtime" else 5000
        huecos["m"], valor, moneda = monto(rng, maximo, divisa)
        args["amount"] = valor
        razon = f"'{huecos['m']}' -> amount {valor:g}"
        if moneda:
            args["currency"] = moneda
            razon += f", currency {moneda}"
        razones.insert(0, razon)

    query, razon = contraer(plantilla.format(**huecos), "; ".join(razones))
    return query, [{"name": funcion, "arguments": args}], razon


def contraer(query, razon):
    """«de el agua» → «del agua» y «a el Tigo» → «al Tigo», también en la línea de razonamiento."""
    for largo, corto in ((" de el ", " del "), (" a el ", " al ")):
        if largo in query:
            query = query.replace(largo, corto)
            razon = razon.replace("'el ", "'")
    return query, razon


def rellenar(rng, split, plantilla):
    huecos = {"q": rng.choice(NOMBRES[split]), "s": opcion(rng, SERVICIOS, split)[1],
              "k": opcion(rng, TARJETAS, split)[1], "o": opcion(rng, OPERADORAS, split)[1],
              "m": monto(rng, 1000, False)[0]}
    return contraer(plantilla.format(**huecos), "")[0]


def fila(query, answers, reasoning, tools, rng, con_fecha):
    out = {"query": query, "tools": tools, "answers": answers, "reasoning": reasoning}
    if con_fecha and rng.random() < 0.5:   # la app agrega la fecha como dato del sistema
        out["system"] = f"date: 2026-{rng.randint(1, 12):02d}-{rng.randint(1, 28):02d} Mon {rng.randint(7, 21):02d}:00"
    return out


def generar(n, split, seed):
    rng = random.Random(seed)
    tools = schemas()
    pesos = {"send_money": 0.27, "check_balance": 0.11, "pay_bill": 0.14, "buy_airtime": 0.14, "block_card": 0.09,
             "multiple": 0.08, "fuera": 0.11, "negada": 0.03, "incompleta": 0.03}
    filas, vistos = [], set()
    intentos = 0
    while len(filas) < n and intentos < n * 50:
        intentos += 1
        tipo = rng.choices(list(pesos), weights=list(pesos.values()))[0]
        if tipo in PLANTILLAS:
            query, answers, reasoning = ejemplo(rng, split, tipo)
        elif tipo == "multiple":
            a, b = rng.sample(list(PLANTILLAS), 2)
            q1, ans1, r1 = ejemplo(rng, split, a)
            q2, ans2, r2 = ejemplo(rng, split, b)
            query, answers, reasoning = f"{q1.strip('¿?')} y {q2.strip('¿?')}", ans1 + ans2, f"{r1}; {r2}"
        else:
            tabla = {"fuera": FUERA_DE_TEMA, "negada": NEGADAS, "incompleta": INCOMPLETAS}[tipo]
            query, answers = rellenar(rng, split, rng.choice(tabla[split])), []
            if tipo == "fuera":
                query = rng.choice(PREFIJOS) + query
            reasoning = {"fuera": "no tool covers this request",
                         "negada": "the request is negated, nothing to do",
                         "incompleta": "a required value is missing, nothing to call"}[tipo]
        if query.lower() in vistos:
            continue
        vistos.add(query.lower())
        f = fila(query, answers, reasoning, tools, rng, split == "train")
        f["categoria"] = tipo
        filas.append(f)
    return filas


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cantidad", type=int, default=900, help="ejemplos de entrenamiento")
    ap.add_argument("--prueba", type=int, default=200, help="ejemplos de prueba")
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    carpeta = Path(__file__).with_name("datos")
    carpeta.mkdir(exist_ok=True)
    for split, n, nombre in [("train", args.cantidad, "entrenamiento"), ("test", args.prueba, "prueba")]:
        filas = generar(n, split, args.seed + (0 if split == "train" else 1000))
        ruta = carpeta / f"{nombre}.jsonl"
        with ruta.open("w", encoding="utf-8") as f:
            for r in filas:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        cuenta = {}
        for r in filas:
            cuenta[r["categoria"]] = cuenta.get(r["categoria"], 0) + 1
        print(f"{ruta.relative_to(Path.cwd()) if ruta.is_relative_to(Path.cwd()) else ruta}: {len(filas)} ejemplos · "
              + ", ".join(f"{k} {v}" for k, v in sorted(cuenta.items())))


if __name__ == "__main__":
    main()
