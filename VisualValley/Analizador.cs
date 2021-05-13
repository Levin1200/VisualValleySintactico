using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VisualValley
{
    class Analizador
    {
        private LinkedList<lexicotoken> Salida;
        private int estado;
        private string lexaux;
        public int columna=0;
        private int fila=1;
        string posiciones;
        int aux2;
        int comprobadorletra=0;

        public LinkedList<lexicotoken> escaner(String entrada){
            entrada = entrada + "#";
            //Creamos una nueva lista donde guardaremos todos los tokens que encontremos
            Salida = new LinkedList<lexicotoken>();
            estado = 0;
            lexaux = "";
            Char c;
            for (int i = 0; i <= entrada.Length-1; i++)
            {
                //5.6
                //HOLA+
                //01234
                c = entrada.ElementAt(i);
                switch (estado)
                {
                    case 0:
                        if (c.CompareTo('~')==0)
                        {
                            fila = fila + 1;
                            columna = 0;
                        }
                        else if (char.IsWhiteSpace(c))
                        {
                            columna += 1;
                        }
                        else if(char.IsDigit(c))
                        {
                            estado = 1;
                            lexaux += c;
                            columna += 1;
                        }
                        else if (char.IsLetter(c))
                        {
                            estado = 4;
                            lexaux += c;
                            columna += 1;
                        }
                        else if (c.CompareTo('+') == 0)
                        {
                            //QUITE LA PARTE QUE DA DIRECTO A DECIR SUMA 
                            //YA QUE TENEMOS += ASI QUE VA AL ESTADO 10 A VERFICAR
                            //LIBERMAN
                            lexaux += c;
                            estado = 15;
                            columna += 1;
                            //LIBERMAN
                        }
                        else if (c.CompareTo('-') == 0)
                        {
                            //QUITE LA PARTE QUE DA DIRECTO A DECIR RESTA 
                            //YA QUE TENEMOS += ASI QUE VA AL ESTADO 10 A VERFICAR
                            //LIBERMAN
                            lexaux += c;
                            estado = 16;
                            columna += 1;
                            //LIBERMAN
                        }
                        else if (c.CompareTo('*') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_POR);
                            
                        }
                        else if (c.CompareTo(':') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.DOSPUNTOS);

                        }
                        else if (c.CompareTo('/') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_DIV);
                           
                        }
                        else if (c.CompareTo('^') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_POW);
                            
                        }
                        else if (c.CompareTo('.') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.PUNTO);
                        }
                        else if (c.CompareTo('(') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.P_IZQ);
                            
                        }
                        else if (c.CompareTo(')') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.P_DER);
                           
                        }
                        //LIBERMAN
                        //LIBERMAN
                        else if (c.CompareTo('%') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            estado = 17;
                            
                        }
                        else if (c.CompareTo('!') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            estado = 14;

                           
                        }
                        else if (c.CompareTo('<') == 0)
                        {
                            lexaux += c;
                            estado = 12;
                            columna += 1;
                        }
                        else if (c.CompareTo('>') == 0)
                        {
                            lexaux += c;
                            estado = 13;
                            columna += 1;
                        }
                        else if (c.CompareTo('=') == 0)
                        {
                            lexaux += c;
                            estado = 11;
                            columna += 1;
                        }

                        else if (c.CompareTo('|') == 0)
                        {
                            lexaux += c;
                            estado = 18;
                            columna += 1;
                        }

                        else if (c.CompareTo('{') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.Y_IZQUIERDA);
                          
                        }
                        else if (c.CompareTo('}') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.Y_DERECHA);
                            
                        }


                        else if (c.CompareTo(';') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_TERMINA_LINEA);
                           
                        }
                        else if (c.CompareTo('&') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_Y);
                           
                        }
                        else if (c.CompareTo('\"') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_COM);
                           
                        }
                        else if (c.CompareTo('\'') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.S_COM_SIM);
                           
                        }
                        else if (c.CompareTo(',') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.COMA);

                        }
                        //LIBERMAN
                        //LIBERMAN
                        else
                        {
                            if (c.CompareTo('#') == 0 && i == entrada.Length - 1)
                            {
                                Console.WriteLine("Hemos concluido el analis lexico");
                            }
                            else {
                                Console.WriteLine("Error lexico con:"+c);
                                estado = 0;
                            }

                        }
                        break;
                    case 1:
                        if (char.IsDigit(c))
                        {
                            estado = 1;
                            lexaux +=c;
                            columna += 1;

                        }
                        else if (c.CompareTo('.') == 0)
                        {
                            estado = 2;
                            lexaux += c;
                            columna += 1;

                        }
                        else {
                            int aux = lexaux.Length;
                            columna -= (aux-1);
                            agregarToken(lexicotoken.Tipo.N_ENTERO);
                            columna += (aux-1);
                            i -= 1;
                            ;

                        }

                        break;

                    case 2:
                        if (char.IsDigit(c))
                        {
                            estado = 3;
                            lexaux += c;
                            columna += 1;
                            //5.6+
                        }
                        else
                        {
                            
                            lexaux += c;
                            Console.WriteLine("Error lexico en:" + c + "despues del punto se esperaba mas numeros");
                            string nuevoaux="";
                            estado = 0;
                            for (int x=0;x<lexaux.Length-2;x++) {
                                nuevoaux=nuevoaux+lexaux.ElementAt(x);
                            }
                            lexaux = nuevoaux;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.N_ENTERO);
                            columna += (aux - 1);
                            i -= 2;
                            columna -= 1;

                        }
                        break;

                    case 3:
                        if (char.IsDigit(c))
                        {
                            estado = 3;
                            lexaux += c;
                            columna += 1;

                        }
                        else
                        {
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.N_REAL);
                            columna += (aux - 1);
                            i -= 1;
                            columna -= 1;
                        }
                        break;
                        //OBTENGO UNA PALABRA
                    case 4:
                        if (char.IsLetterOrDigit(c))
                        {
                            estado = 4;
                            lexaux += c;
                            columna += 1;

                        }
                        else if (char.IsWhiteSpace(c)|| i == entrada.Length - 1)
                        {
                            
                            goto case 5;
                            //columna += 1;
                            //agregarToken(lexicotoken.Tipo.PALABRA);
                        }
                          else
                        {
                            comprobadorletra = 1;
                            goto case 5;
                            //columna += 1;
                        }
                        break;
                    //PARTE DE CHUN
                    // CASE QUE VERIFICA LAS PALABRAS Y DEPENDIENDO CUAL SEA LO ENVIA A SU CASE CORRESPONDIENTE
                    case 5:

                            if (lexaux == "si")
                            {
                                goto case 31;
                            }
                            else if (lexaux == "sino")
                            {
                                goto case 32;

                            }
                            else if (lexaux == "cambiar")
                            {
                                goto case 33;
                            }
                            else if (lexaux == "hacer")
                            {
                                goto case 34;
                            }
                            else if (lexaux == "mientras")
                            {
                                goto case 35;
                            }
                            else if (lexaux == "para")
                            {
                                goto case 36;
                            }
                            else if (lexaux == "caso")
                            {
                                goto case 37;
                            }
                            else if (lexaux == "descanso")
                            {
                                goto case 38;
                            }
                            else if (lexaux == "entero")
                            {
                                goto case 51;
                            }
                            else if (lexaux == "flotante")
                            {
                                goto case 52;
                            }
                            else if (lexaux == "duplo")
                            {
                                goto case 53;
                            }
                            else if (lexaux == "caracter")
                            {
                                goto case 54;
                            }
                            else if (lexaux == "cadena")
                            {
                                goto case 55;
                            }
                            else if (lexaux == "boleano")
                            {
                                goto case 56;
                            }
                            else if (lexaux == "inicio")
                            {
                                goto case 57;
                            }
                            else if (lexaux == "fin")
                            {
                                goto case 58;
                            }
                            else if (lexaux == "menu")
                            {
                                goto case 59;
                            }
                            else if (lexaux == "verdadero")
                            {
                                goto case 61;
                            }
                            else if (lexaux == "falso")
                            {
                                goto case 62;
                            }
                        else if (lexaux == "mensaje")
                        {
                            goto case 63;
                        }
                        else
                            {
                                goto case 60;
                            }

                        
                        break;


                    //LIBERMAN
                    //LIBERMAN
                    case 11:

                        //VERIFICA SI ES IGUALDAD O UN SIGNO IGUAL
                        if (c.CompareTo('=') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_IGUALDAD);
                            columna += (aux - 1);
                            break;
                        }
                        else
                        {
                            agregarToken(lexicotoken.Tipo.S_IGUAL);
                            i -= 1;
                            //columna -= 1;
                            break;
                        }

                        //VERIFICA SI SEGUIDO DEL SIGNO < HAY UN SIGNO =
                    case 12:
                        if (c.CompareTo('=') == 0)
                        {
                            lexaux += c;
                            columna += 1;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_MENOR_O_IGUAL);
                            columna += (aux - 1);
                            
                            break;
                        }
                        else
                        {
                            agregarToken(lexicotoken.Tipo.S_MENOR);
                            i -= 1;
                            //columna -= 1;
                            break;
                        }

                        //VERIFICA SI DESPUES DEL SIGNO >HAY UN IGUAL
                    case 13:
                        if (c.CompareTo('=') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_MAYOR_O_IGUAL);
                            columna += (aux - 1);
                           
                            break;
                        }
                        else
                        {
                            agregarToken(lexicotoken.Tipo.S_MAYOR);
                            //columna -= 1;
                            i -= 1;
                            break;
                        }

                        //VERIFICA SI DESPUES DEL SIGO ! HAY UN IGUAL
                    case 14:
                        if (c.CompareTo('=') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_DISTINTO);
                            columna += (aux - 1);
                            
                            break;
                        }
                        else
                        {

                            agregarToken(lexicotoken.Tipo.S_NOT);
                            //columna -= 1;
                            i -= 1;
                            break;
                        }

                        //VERIFICA SI DESPUES DEL SIGNO + HAY UN IGUAL
                    case 15:
                        if (c.CompareTo('=') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_SUMAR);
                            columna += (aux - 1);
                          
                            break;
                        }
                        else if (c.CompareTo('+') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.AUMENTADOR);
                            columna += (aux - 1);
                           
                            break;
                        }
                        else
                        {
                            agregarToken(lexicotoken.Tipo.S_SUMA);
                            i -= 1;
                            //columna -= 1;
                            break;
                        }
                        //VERIFICA SI DESPUES DEL SIGO - HAY UN =
                    case 16:
                        if (c.CompareTo('=') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_RESTAR);
                            columna += (aux - 1);
                           
                            break;
                        }
                        else if (c.CompareTo('-') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.REDUCTOR);
                            columna += (aux - 1);
                            
                            break;
                        }
                        else
                        {
                            agregarToken(lexicotoken.Tipo.S_RESTA);
                            i -= 1;
                            //columna -= 1;
                            break;
                        }

                        //VERIFICA SI DESPUES DEL SIGNO % HAY UN IGUAL
                    case 17:
                        if (c.CompareTo('=') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_RESTO_DE_DIVISION);
                            columna += (aux - 1);
                           
                            break;
                        }
                        else
                        {
                            i -= 1;
                            //columna -= 1;
                            break;
                        }

                        //VERIFICA SI DESPUES DEL SIGNO | HAY OTRO |
                    case 18:
                        if (c.CompareTo('|') == 0)
                        {
                            columna += 1;
                            lexaux += c;
                            int aux = lexaux.Length;
                            columna -= (aux - 1);
                            agregarToken(lexicotoken.Tipo.S_O);
                            columna += (aux - 1);
                           
                            break;
                        }
                        else
                        {
                            Console.WriteLine("Error lexico en:" + c + "Se esperaba ||");
                            estado = 0;
                            columna += 1;
                            agregarToken(lexicotoken.Tipo.ERROR);
                            break;
                        }
                    //FIN LIBERMAN
                    //INICIO CHUN
                    // CASES CON LA FUNCION DE AGREGAR LOS TOKEN A DONDE VA CADA UNO Xd
                    case 31:
                        int aux1 = lexaux.Length;
                        columna -= (aux1 - 1);
                        agregarToken(lexicotoken.Tipo.ES_SI);
                        columna += (aux1 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1;columna -= 1; }
                        break;

                    case 32:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.ES_SINO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 33:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.ES_CAMB);
                        columna += (aux2 - 1);
                        columna += 1;

                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 34:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.EC_HACER);
                        columna += (aux2 - 1);
                       columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 35:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.EC_MIENT);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 36:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.EC_PARA);
                        columna += (aux2 - 1);
                       columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 37:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.ES_CASO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 38:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.ES_DESCANSO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 39:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.IDENTIFICADOR);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    ///MILTONER
                    ///codigo parte de milton
                    case 51:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_ENT);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 52:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_FLOAT);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 53:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_DUPLO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 54:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_CARACTER);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 55:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_CADENA);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 56:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.V_BOLEANO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 57:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.INICIO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 58:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.FIN);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 59:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.MENU);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;

                    case 60:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.IDENTIFICADOR);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 61:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.VERDADERO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 62:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.FALSO);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    case 63:
                        aux2 = 0;
                        aux2 = lexaux.Length;
                        columna -= (aux2 - 1);
                        agregarToken(lexicotoken.Tipo.MENSAJE);
                        columna += (aux2 - 1);
                        columna += 1;
                        if (comprobadorletra == 0) { }
                        else { comprobadorletra = 0; estado = 0; i -= 1; columna -= 1; }
                        break;
                    // milton fin
                    default:
                        break;
                }
            }
            return Salida;
        }

        public void agregarToken(lexicotoken.Tipo tipo)
        {
            //Aqui usamos la lista creada y le añadimos los tokens
            Salida.AddLast(new lexicotoken(tipo, lexaux));
            lexaux = "";
            posiciones += (" ° " + fila + " ° " + columna + Environment.NewLine);
            estado = 0;
            
        }

        public void tokenencontrado(LinkedList<lexicotoken> lista)
        {
            foreach (lexicotoken item in lista)
            {
                Console.WriteLine(item.ObtenerTipo() + " <--> " + item.Obtenerval());
                
            }
        }

        public string devolver(LinkedList<lexicotoken> lista)
        {
            string texto="";
            foreach (lexicotoken item in lista)
            {
                Console.WriteLine(item.ObtenerTipo() + " ° " + item.Obtenerval());
                texto += (" ° "+ item.ObtenerTipo() + " ° " + item.Obtenerval())+ Environment.NewLine;

            }
            return texto;
        }

        public string devolverp(string p)
        {
            return posiciones;
        }


    }
}
