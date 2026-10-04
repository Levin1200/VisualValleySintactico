# Entrenar Needle 3 con tus funciones

Kit para afinar [Needle 3](https://huggingface.co/Cactus-Compute/needle3), el modelo de 121M de Cactus Compute que convierte frases en llamadas a funciones, para que entienda **tus** funciones y el español de **tus** usuarios.

El ejemplo es un asistente bancario guatemalteco con 5 funciones: enviar dinero, ver saldo, pagar servicios, recargar saldo y bloquear tarjetas. Cámbialas por las tuyas.

## Cómo funciona

Afinar no reentrena el modelo completo. Se entrena un **adaptador LoRA** pequeño encima del modelo base, que queda congelado, y luego se mezcla con él en un solo archivo `.cact`. Corre en tu computadora: CPU, GPU NVIDIA o Mac con Apple Silicon.

```
herramientas.py ──► tools.json ──► generar_datos.py ──► datos/entrenamiento.jsonl
                                                            │
                                needle finetune ◄───────────┘
                                      │
                                      ▼
                     modelos/adaptador.safetensors ──► needle build ──► modelos/ajustado.cact
```

## Requisitos

```sh
pip install "cactus-needle[train]"          # CPU
pip install "cactus-needle[train,gpu]"      # GPU NVIDIA
pip install "cactus-needle[train,metal]"    # Mac con Apple Silicon
```

## Pasos

### 1. Define tus funciones (`herramientas.py`)

Reglas de Cactus que más importan:

- **Una función por acción.** `pay_bill(service)` y `block_card(card)` funcionan mejor que una sola `hacer_operacion(tipo, valor)`.
- **Cada argumento sale de lo que dijo el usuario.** Si un dato puede faltar, dale un valor por defecto (como la moneda, que por defecto es GTQ). Si es obligatorio y falta, el modelo no adivina: devuelve `[]` y tu app pregunta.
- **Needle no completa los valores por defecto en su respuesta.** Si el usuario no dice la moneda, la llamada llega sin `currency`; Python pone `"GTQ"` al ejecutar la función. Además, `@needle.tool` (versión 3.1.0) no copia esos valores al esquema; `herramientas.py` lo hace por ti.
- **Listas cerradas con `Literal`** y rangos con `Field(ge=..., le=...)`. El modelo no puede salirse de ellos.
- **Cinco funciones o menos por turno.** Con más, Needle solo ve las cinco más parecidas a la frase.
- Nombres y descripciones en inglés; los valores de las listas pueden estar en español (`"luz"`, `"agua"`).

```sh
python herramientas.py          # escribe tools.json
```

### 2. Crea los datos (`generar_datos.py`)

Cada ejemplo es una línea JSON:

```json
{"query": "pagá la luz, son 350", "tools": [...],
 "answers": [{"name": "pay_bill", "arguments": {"service": "luz", "amount": 350}}],
 "reasoning": "'350' -> amount 350; 'la luz' -> service luz"}
```

El script arma los ejemplos con plantillas de frases y valores (nombres, montos en «Q250», «250 varos», «cien quetzales», operadoras, servicios). **Cambia las plantillas por frases reales de tus usuarios**: es lo que más mejora el resultado.

```sh
python generar_datos.py                    # 900 de entrenamiento + 200 de prueba
python generar_datos.py --cantidad 2000    # más ejemplos
```

La prueba usa frases y nombres que no están en el entrenamiento, para medir si el modelo aprendió de verdad o solo memorizó.

### 3. Mide el modelo base

```sh
python evaluar.py
```

### 4. Entrena y construye

```sh
needle finetune datos/entrenamiento.jsonl --epochs 10 --out modelos/adaptador.safetensors
needle build --lora modelos/adaptador.safetensors --out modelos/ajustado.cact
```

O todo junto: `./entrenar.sh`.

**Si entrenas solo con procesador (sin tarjeta gráfica)**, lo aprendimos probándolo en un servidor de 4 núcleos y 15 GB:

- **Memoria:** con los valores por defecto (lotes de 16, secuencias de 1024) usó casi 14 GB y el sistema lo cerró. Con `--batch-size 8 --max-len 768` se quedó en ~7 GB. Antes de bajar `--max-len`, comprueba que tu ejemplo más largo quepa: con 5 funciones, los nuestros medían entre 518 y 689 tokens.
- **Tiempo:** cada paso tardó ~55 segundos, así que 10 épocas (1020 pasos) habrían tomado unas 15 horas. Una sola época con `--lr 3e-4` (107 pasos) tomó ~1 h 40 min. En una GPU NVIDIA o una Mac con chip M es mucho más rápido.
- **Usa `--val-split 0`.** Con validación, al terminar el paquete genera respuestas una por una para medir la precisión, y lo hace **antes** de guardar el adaptador. En procesador eso tardó más de 20 minutos. Mide después con `evaluar.py`, que es mucho más rápido.

```sh
needle finetune datos/entrenamiento.jsonl --epochs 1 --lr 3e-4 --batch-size 8 --max-len 768 \
  --val-split 0 --out modelos/adaptador.safetensors
```

### 5. Mide el modelo ajustado

```sh
python evaluar.py --pesos modelos/ajustado.cact --errores 20
```

### 6. Úsalo en tu app

```python
import needle
from herramientas import TOOLS

agente = needle.Needle(tools=TOOLS, weights="modelos/ajustado.cact")
respuesta = agente.complete("mandale 250 varos a mi mamá")
respuesta["function_calls"]
# [{'name': 'send_money', 'arguments': {'recipient': 'mi mamá', 'amount': 250.0, 'currency': 'GTQ'}}]
```

Si `function_calls` viene vacío pero `suppressed_calls` trae algo, el motor tenía una llamada pero no se atrevió a ejecutarla. En vez de descartarla, tu app puede **proponerla**: «¿Querés bloquear tu tarjeta de débito?».

Para un teléfono u otro dispositivo, `needle build` también recorta el modelo y descarga el motor de esa plataforma:

```sh
needle build --lora modelos/adaptador.safetensors --layers 8 --platform android-arm64 --out ./android
```

## Resultados de este ejemplo

Entrenado en un servidor sin tarjeta gráfica (4 núcleos, 15 GB): **una época** con los 900 ejemplos (113 pasos, ~1 h 40 min), lotes de 8 y `--lr 3e-4`. La pérdida bajó de 0.50 en los primeros pasos a 0.16 al final de la época (registro en `resultados/entrenamiento.txt`). Se midió con las 200 frases de prueba, que usan palabras y nombres que el modelo nunca vio.

| | Modelo base | Ajustado |
|---|---|---|
| **Directas** (el motor ejecuta la llamada) | 46.5 % | **61.0 %** |
| **Con confirmación** (más las retenidas correctas que la app propone) | 56.0 % | **70.0 %** |

| Categoría (directas) | Base | Ajustado |
|---|---|---|
| Recargas de saldo | 6 % | **52 %** |
| Pago de servicios | 21 % | **58 %** |
| Envíos de dinero | 57 % | **64 %** |
| Fuera de tema (no llamar nada) | 88 % | **92 %** |
| Varias acciones en una frase | 21 % | 26 % |
| Consultar saldo | 82 % | 82 % |
| Pedidos incompletos | 100 % | 100 % |
| Negaciones | 88 % | 62 % |
| Bloquear tarjeta | 0 % | 0 % |

Lo que aprendimos de los errores:

- **El motor exige que los valores de las listas aparezcan tal cual en la frase, tildes incluidas.** En «bloqueá mi tarjeta de débito» el modelo acierta `debito`, pero el motor la retiene porque la frase dice «débito». Pasa igual con «cheques» → `monetaria`, «wifi» → `internet` o «EEGSA» → `luz`. Entrenar no lo arregla; hay que diseñar las listas con las palabras que usa la gente.
- **Quitar las tildes de la frase** antes de enviarla sube «bloquear tarjeta» de 0 % a 100 %. Pero como este modelo se entrenó con tildes, los envíos bajan de 64 % a 43 %. Si vas a quitarlas, quítalas también en los datos: `python generar_datos.py --sin-tildes`. Esa combinación no la probé por el tiempo que toma entrenar en CPU.
- **Las negaciones empeoraron** (88 % → 62 %): solo había 24 de 900 ejemplos. Hacen falta más.
- Es **una sola época**. Con 10 épocas en GPU y frases reales de tus usuarios debería mejorar bastante más.

Las mediciones completas están en `resultados/`.

## Consejos para los datos

- **Incluye frases fuera de tema** con `"answers": []` (más o menos 1 de cada 8). Sin ellas, el modelo ajustado llama a una función por cualquier cosa.
- **Incluye negaciones e incompletas**: «no le mandés nada a Carlos», «bloqueá mi tarjeta» (sin decir cuál).
- **La línea `reasoning`** dice de dónde sale cada argumento. Enseña al modelo a copiar valores de la frase en vez de inventarlos.
- **Los argumentos solo llevan lo que el usuario dijo.** Si un dato opcional no aparece, no lo pongas.
- **Cuántos ejemplos:** unos cientos mejoran qué función elige; para que acierte bien los argumentos hacen falta miles, con valores y frases variadas. Si elige bien la función pero se equivoca en los valores, faltan datos o son muy parecidos entre sí; también puedes probar `--lora-rank 32`.
- **Cuántas épocas:** con pocos cientos de ejemplos, de 10 a 30. Mira la pérdida de validación al final de cada época: si sube mientras la de entrenamiento baja, el modelo está memorizando; detente ahí o agrega datos.
- Para generar más frases con un modelo grande, `needle generate-data` usa OpenRouter (necesita `OPENROUTER_API_KEY`).

## Limitaciones del entrenamiento local

- **Sin nivel de confianza.** El entrenamiento local no ajusta la «cabeza» de confianza, así que el modelo ajustado responde `confidence: None`. Para decidir cuándo pedir confirmación, usa tus propias reglas (por ejemplo, confirmar siempre antes de mover dinero).
- **4 bits en vez de 2.** El archivo ajustado pesa más que el original de 35 MB.
- **El español usa más tokens.** Cactus mide 1.7 veces más que en inglés, lo que gasta más contexto.
- La **plataforma de Cactus** (de pago, `needle platform finetune`, con `NEEDLE_API_KEY`) entrena el modelo completo con tus datos más los suyos, ajusta la confianza y devuelve el modelo a 2 bits.

## Archivos

| Archivo | Para qué |
|---|---|
| `herramientas.py` | Tus funciones. Escribe `tools.json`. |
| `generar_datos.py` | Plantillas de frases → `datos/entrenamiento.jsonl` y `datos/prueba.jsonl`. |
| `evaluar.py` | Mide aciertos por categoría y muestra errores. |
| `entrenar.sh` | Todos los pasos seguidos. |
| `resultados/` | Mediciones y registro del entrenamiento de este ejemplo. |

Fuentes: [ficha de Needle 3](https://huggingface.co/Cactus-Compute/needle3), [guía de fine-tuning](https://cactuscompute.com/blog/finetuning-needle), [cómo diseñar herramientas](https://cactuscompute.com/blog/designing-tools-for-needle).
