using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VisualValley
{
    class lexicotoken
    {
        public enum Tipo
        { 
        N_ENTERO,
        N_REAL,
        S_MAS,
        S_MENOS,
        S_POR,
        S_DIV,
        S_POW,
        P_IZQ,
        P_DER,
        V_ENT,
        //LIBERMAN
        S_SUMA,
        S_RESTA,
        S_MULTIPLICACION,
        S_DIVISION,
        S_IGUALDAD,
        S_DISTINTO,
        S_MAYOR,
        S_MENOR,
        S_MENOR_O_IGUAL,
        S_MAYOR_O_IGUAL,
        Y_IZQUIERDA,
        Y_DERECHA,
        S_CADENA,
        S_TEXTO_SIMPLE,
        S_IGUAL,
        S_SUMAR,
        S_RESTAR,
        S_RESTO_DE_DIVISION,
        S_O,
        S_Y,
        S_NOT,
        S_TERMINA_LINEA,
        S_COM,
        S_COM_SIM,
        PALABRA,
        ERROR,
        AUMENTADOR,
        REDUCTOR,
        ES_SI,//Chun
        ES_SINO,//CHUN
        ES_CAMB,//CHUN
        EC_HACER,//CHUN
        EC_MIENT,//CHUN
        EC_PARA,//CHUN
        IDENTIFICADOR,//CHUN
        ES_CASO,//CHUN
        ES_DESCANSO, //asta aca XD CHUN
                     //MILTON
        V_FLOAT,
        V_DUPLO,
        V_CARACTER,
        V_CADENA,
        V_BOLEANO,
        PUNTO,
        COMA,
        INICIO,
        FIN,
        MENU

        }

        private Tipo tipotoken;
        private String valor;

        public lexicotoken(Tipo tipoDelToken, String val)
        {
            this.tipotoken = tipoDelToken;
            this.valor = val;
        }

        public String Obtenerval()
        {
            return valor;
        }

        public String ObtenerTipo()
        {
            switch (tipotoken)
            {
            case Tipo.N_ENTERO:
                    return "<nentero>";
            case Tipo.N_REAL:
                    return "<decimal>";
            case Tipo.P_DER:
                    return "<parectesisc>";
            case Tipo.P_IZQ:
                    return "<parentesisa>";
            case Tipo.S_DIV:
                    return "<operador>";
            case Tipo.S_MAS:
                    return "<operador>";
            case Tipo.S_MENOS:
                    return "operador";
            case Tipo.S_POR:
                    return "operador";
            case Tipo.S_POW:
                    return "potencia";
            case Tipo.V_ENT:
                    return "ventero";
            case Tipo.PALABRA:
                    return "Palabra";



                //LIBERMAN
                case Tipo.S_SUMA:
                    return "Suma cantidades";
                case Tipo.S_RESTA:
                    return "Resta cantidades ";
                case Tipo.S_MULTIPLICACION:
                    return "Multiplica cantidades";
                case Tipo.S_DIVISION:
                    return "Divide cantidades";
                case Tipo.S_IGUALDAD:
                    return "igualdad";
                case Tipo.S_DISTINTO:
                    return "Distinto ";
                case Tipo.S_MAYOR:
                    return "Numero mayor";
                case Tipo.S_MENOR:
                    return "Numero menor ";
                case Tipo.S_MENOR_O_IGUAL:
                    return "Menor o igual";
                case Tipo.S_MAYOR_O_IGUAL:
                    return "Mayor o igual";
                case Tipo.Y_IZQUIERDA:
                    return "Inicio de instrucciones";
                case Tipo.Y_DERECHA:
                    return "Fin de instrucciones";
                case Tipo.S_CADENA:
                    return "cadena de texto";
                case Tipo.S_TEXTO_SIMPLE:
                    return "texto simple";
                case Tipo.S_IGUAL:
                    return "Asigna valor a una variable";
                case Tipo.S_SUMAR:
                    return "Suma igual a ";
                case Tipo.S_RESTAR:
                    return "Restar igual a ";
                case Tipo.S_RESTO_DE_DIVISION:
                    return "Residuo de division";
                case Tipo.S_O:
                    return "Compuerta logica O";
                case Tipo.S_Y:
                    return "Compuerta logica Y";
                case Tipo.S_NOT:
                    return "Compuerta logica NOT";
                case Tipo.S_TERMINA_LINEA:
                    return "Fin de linea";
                case Tipo.S_COM:
                    return "Comilla";
                case Tipo.S_COM_SIM:
                    return "Comilla simple";
                case Tipo.AUMENTADOR:
                    return "Aumentador";
                case Tipo.REDUCTOR:
                    return "Reductor";
                case Tipo.ERROR:
                    return "ERROR";

                case Tipo.ES_SI:
                    return "Logica if ";//CHUN
                case Tipo.ES_SINO:
                    return "Logica else ";//CHUN
                case Tipo.ES_CAMB:
                    return "Seleccion Switch ";//CHUN
                case Tipo.EC_HACER:
                    return "Do ";//CHUN
                case Tipo.EC_MIENT:
                    return "While ";//CHUN
                case Tipo.EC_PARA:
                    return "For/Para ";//CHUN
                case Tipo.ES_CASO:
                    return "Casos ";//CHUN
                case Tipo.ES_DESCANSO:
                    return "Break ";//CHUN
                case Tipo.IDENTIFICADOR:
                    return "Palabra/Identificador";//CHUn

                //milton inicio
                case Tipo.V_FLOAT:
                    return "Variable flotante";
                case Tipo.V_DUPLO:
                    return "Variable duplo";
                case Tipo.V_CARACTER:
                    return "Variable caracter";
                case Tipo.V_CADENA:
                    return "Variable cadena";
                case Tipo.V_BOLEANO:
                    return "Variable boleana";
                //milton fin
                //EXTRA
                case Tipo.PUNTO:
                    return "Punto";
                case Tipo.COMA:
                    return "Coma";
                case Tipo.INICIO:
                    return "Inicio del programa";
                case Tipo.FIN:
                    return "Fin del programa";
                case Tipo.MENU:
                    return "Menu Main";


                default:
                    return "Desconocido";

            }
        }
    }
}
