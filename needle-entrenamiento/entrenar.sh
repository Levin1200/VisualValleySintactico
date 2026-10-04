#!/usr/bin/env bash
# Entrena Needle 3 con tus funciones, de principio a fin.
#   ./entrenar.sh                 # 10 épocas (GPU NVIDIA o Mac con chip M)
#   EPOCAS=20 ./entrenar.sh       # más épocas si la pérdida todavía baja
#   CPU=1 ./entrenar.sh           # solo procesador: 1 época, menos memoria, sin validación
set -euo pipefail
cd "$(dirname "$0")"
export NEEDLE_TELEMETRY=${NEEDLE_TELEMETRY:-0}
if [ -n "${CPU:-}" ]; then
  EPOCAS=${EPOCAS:-1}
  OPCIONES=${OPCIONES:-"--lr 3e-4 --batch-size 8 --max-len 768 --val-split 0"}
else
  EPOCAS=${EPOCAS:-10}
  OPCIONES=${OPCIONES:-}
fi
mkdir -p modelos resultados

echo "1/5  Esquemas de tus funciones"
python herramientas.py

echo "2/5  Datos de entrenamiento y de prueba"
python generar_datos.py

echo "3/5  Modelo base, para comparar"
python evaluar.py --errores 0 --json resultados/base.json

echo "4/5  Entrenamiento ($EPOCAS épocas)"
needle finetune datos/entrenamiento.jsonl --epochs "$EPOCAS" $OPCIONES --out modelos/adaptador.safetensors | tee resultados/entrenamiento.log
needle build --lora modelos/adaptador.safetensors --out modelos/ajustado.cact

echo "5/5  Modelo ajustado"
python evaluar.py --pesos modelos/ajustado.cact --json resultados/ajustado.json
