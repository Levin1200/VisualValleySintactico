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
        MENU,
        DOSPUNTOS

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
                    return "<operador>";
            case Tipo.S_POR:
                    return "<operador>";
            case Tipo.S_POW:
                    return "<potencia>";
            case Tipo.V_ENT:
                    return "<ventero>";
            case Tipo.PALABRA:
                    return "<Palabra>";



                //LIBERMAN
                case Tipo.S_SUMA:
                    return "<operador>";
                case Tipo.S_RESTA:
                    return "<operador>";
                case Tipo.S_MULTIPLICACION:
                    return "<operador>";
                case Tipo.S_DIVISION:
                    return "<operador>";
                case Tipo.S_IGUALDAD:
                    return "<comparador>";
                case Tipo.S_DISTINTO:
                    return "<distinto>";
                case Tipo.S_MAYOR:
                    return "<mayor>";
                case Tipo.S_MENOR:
                    return "<menor>";
                case Tipo.S_MENOR_O_IGUAL:
                    return "<comparador>";
                case Tipo.S_MAYOR_O_IGUAL:
                    return "<comparador>";
                case Tipo.Y_IZQUIERDA:
                    return "<iinstrucciones>";
                case Tipo.Y_DERECHA:
                    return "<finstrucciones>";
                case Tipo.S_CADENA:
                    return "<cadena>";
                case Tipo.S_TEXTO_SIMPLE:
                    return "<tsimple>";
                case Tipo.S_IGUAL:
                    return "<igual>";
                case Tipo.S_SUMAR:
                    return "<sumaigual>";
                case Tipo.S_RESTAR:
                    return "<restaigual>";
                case Tipo.S_RESTO_DE_DIVISION:
                    return "<rdivision>";
                case Tipo.S_O:
                    return "<compuerta>";
                case Tipo.S_Y:
                    return "<ompuerta>";
                case Tipo.S_NOT:
                    return "<ompuerta>";
                case Tipo.S_TERMINA_LINEA:
                    return "<finlinea>";
                case Tipo.S_COM:
                    return "<comilla>";
                case Tipo.S_COM_SIM:
                    return "<comillas>";
                case Tipo.AUMENTADOR:
                    return "<aumentador>";
                case Tipo.REDUCTOR:
                    return "<reductor>";
                case Tipo.ERROR:
                    return "<ERROR>";

                case Tipo.ES_SI:
                    return "<si>";//CHUN
                case Tipo.ES_SINO:
                    return "<sino> ";//CHUN
                case Tipo.ES_CAMB:
                    return "<cambio> ";//CHUN
                case Tipo.EC_HACER:
                    return "<hacer> ";//CHUN
                case Tipo.EC_MIENT:
                    return "<mientras> ";//CHUN
                case Tipo.EC_PARA:
                    return "<para> ";//CHUN
                case Tipo.ES_CASO:
                    return "<caso> ";//CHUN
                case Tipo.ES_DESCANSO:
                    return "<desc> ";//CHUN
                case Tipo.IDENTIFICADOR:
                    return "<ide>";//CHUn

                //milton inicio
                case Tipo.V_FLOAT:
                    return "<flotante>";
                case Tipo.V_DUPLO:
                    return "<duplo>";
                case Tipo.V_CARACTER:
                    return "<palabra>";
                case Tipo.V_CADENA:
                    return "<cadena>";
                case Tipo.V_BOLEANO:
                    return "<boleano>";
                //milton fin
                //EXTRA
                case Tipo.PUNTO:
                    return "<Punto>";
                case Tipo.COMA:
                    return "<Coma>";
                case Tipo.INICIO:
                    return "<inicio>";
                case Tipo.FIN:
                    return "<fin>";
                case Tipo.MENU:
                    return "<menu>";
                case Tipo.DOSPUNTOS:
                    return "<dospuntos>";

                default:
                    return "Desconocido";

            }
        }
    }
}
