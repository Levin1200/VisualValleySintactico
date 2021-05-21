using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Collections;

namespace VisualValley
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            Dev.KeyPress += new KeyPressEventHandler(keypressed);
        }

        private void keypressed(Object o, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Enter)
            {

                e.Handled = true;
                // richTextBox1.Focus();
                //richTextBox1.Text = richTextBox1.Text + " BACKSPACE ";
                //richTextBox1_TextChanged(o,e);
                //publico();
                
                //palabrasreservadas();
                //variables();
                //Dev.Select(Dev.Text.Length, 0);
            }
        }
        int error = 0, indice =1;  //Variable que maneja errores
        Stack especiales = new Stack(); //Pila que contiene los especiales desde el ultimo hasta el primero
        Queue Sintactico = new Queue();
        bool si = false, sino = false, cambiar = false, mientras = false, para = false, caso = false, hacer = false,inicios = false,fines = false; //Verifica si estan activos los especiales
        int tsi = 0, tsino = 0, tcambiar = 0, tmientras = 0, tpara = 0, tcaso = 0, thacer = 0, ecadena=0;

        //especiales.push para add
        //especiales.pop para sacar
        //ALFABETO
        String[] alfabeto = {"a","b","c","d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
        , "A","B","C","D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
        String[] numeros = {"0","1","2","3","4","5","6","7","8","9"};
        //PALABRAS RESERVADAS
        String[] PR = {"publico","privado","regreso","hacer","mientras","para","si","no","cambiar","sino","nulo"};
        //VARIABLES
        String[] VR = { "entero", "duplo", "boleano", "cadena" };
        //SIGNOS
        String[] signos = {"-","+","*","/"};
        //CODIGO
        string codigo;


        private void palabrasreservadas() {
            foreach (string element in PR)
            {
                try
                {
                    int start = 0;
                    int end = Dev.Text.LastIndexOf(element);
                    while (start < end)
                    {
                        Dev.Find(element, start, Dev.TextLength, RichTextBoxFinds.WholeWord);
                        Dev.SelectionColor = Color.Blue;
                        start = Dev.Text.IndexOf(element, start) + 1;
                    }
                }
                catch
                {
                    MessageBox.Show("Hubo un problema");
                }
            }
        }

        private void variables()
        {
            foreach (string element in VR)
            {
                try
                {
                    int start = 0;
                    int end = Dev.Text.LastIndexOf(element);
                    while (start < end)
                    {
                        Dev.Find(element, start, Dev.TextLength, RichTextBoxFinds.WholeWord);
                        Dev.SelectionColor = Color.Green;
                        start = Dev.Text.IndexOf(element, start) + 1;
                    }
                }
                catch
                {
                    MessageBox.Show("Hubo un problema");
                }
            }
        }




        private void Form1_Load(object sender, EventArgs e)
        {
            modoOscuroToolStripMenuItem_Click(sender,e);
        }


        string entrada;

        private void button1_Click(object sender, EventArgs e)
        {
            button2.Enabled = true;
            //int lineas = textBox2.Lines.Count();
            int lineas = Dev.Lines.Count();
            entrada = null;
            //MessageBox.Show("Hay un total de " + lineas + " Lineas");
            for (int line = 0; line < lineas; line++)
            {
               // MessageBox.Show("Linea " + (line + 1) + " y contiene: " + textBox2.Lines.GetValue(line));
                //entrada = entrada + textBox2.Lines.GetValue(line) + " ~";
                entrada = entrada + Dev.Lines.GetValue(line) + " ~";
            }

            Analizador lexico = new Analizador();
            LinkedList<lexicotoken> ltoke = lexico.escaner(entrada);
            lexico.tokenencontrado(ltoke);
            textBox1.Text = lexico.devolver(ltoke);
            textBox3.Text = lexico.devolverp(entrada);
            string datostabla = textBox1.Text;
            char delimitador = '°';
            string[] datos = datostabla.Split(delimitador);
            int n = 0;
            int fila = 0;
            int filacontador = 1;
            dataGridView1.Rows.Clear();
            dataGridView1.Rows.Add();
            foreach (string element in datos)
            {
                if (n == 0)
                {
                    n = 1;
                }
                else {
                    if (filacontador == 1)
                    {
                        dataGridView1.Rows[fila].Cells[0].Value = element;
                        filacontador = 2;
                        //MessageBox.Show("Fila: " + fila + " Columna" + 1);
                    }
                    else if (filacontador == 2)
                    {
                        dataGridView1.Rows[fila].Cells[1].Value = element;
                        //MessageBox.Show("Fila: " + fila + " Columna" + 1);
                        filacontador = 1;
                        dataGridView1.Rows.Add();
                        fila += 1;
                    }
                    else
                    {


                    }
                    
                }

  
                   
            }
            posiciones();
        }

        private void mensajeerror(string dato, string mensaje) {
            MessageBox.Show(dato, mensaje, MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private void posiciones() {
            string datostabla = textBox3.Text;
            char delimitador = '°';
            string[] datos = datostabla.Split(delimitador);
            int n = 0;
            int fila = 0;
            int filacontador = 1;
            foreach (string element in datos)
            {
                if (n == 0)
                {
                    n = 1;
                }
                else
                {
                    if (filacontador == 1)
                    {
                        dataGridView1.Rows[fila].Cells[2].Value = element;
                        filacontador = 2;
                        //MessageBox.Show("Fila: " + fila + " Columna" + 1);
                    }
                    else if (filacontador == 2)
                    {
                        dataGridView1.Rows[fila].Cells[3].Value = element;
                        //MessageBox.Show("Fila: " + fila + " Columna" + 1);
                        filacontador = 1;
                        fila += 1;
                    }
                    else
                    {


                    }

                }



            }

        }

        private void button2_Click(object sender, EventArgs e)
        {
            
           
           
        }

        private void modoOscuroToolStripMenuItem_Click(object sender, EventArgs e)
        {
            BackColor = Color.FromArgb(31, 31, 31);
            Dev.BackColor = Color.FromArgb(54, 54, 54);
            Dev.ForeColor = Color.White;
            textBox1.Enabled = true;
            textBox1.BackColor= Color.FromArgb(54, 54, 54);
            textBox1.ForeColor = Color.White;
            textBox1.Enabled = false;
            label1.ForeColor = Color.White;
            label2.ForeColor = Color.White;
            label3.ForeColor = Color.White;
            dataGridView1.BackgroundColor=Color.FromArgb(54, 54, 54);
            dataGridView1.ForeColor = Color.DodgerBlue;
            dataGridView1.DefaultCellStyle.BackColor=Color.FromArgb(54, 54, 54);
            dataGridView2.BackgroundColor = Color.FromArgb(54, 54, 54);
            dataGridView2.ForeColor = Color.White;
            dataGridView2.DefaultCellStyle.BackColor = Color.FromArgb(54, 54, 54);
            menuStrip1.BackColor= Color.FromArgb(31, 31, 31);
            menuStrip1.ForeColor = Color.DodgerBlue;
        }

        private void modoNormalToolStripMenuItem_Click(object sender, EventArgs e)
        {
            BackColor = Color.White;
            Dev.BackColor = Color.White;
            Dev.ForeColor = Color.Black;
            textBox1.Enabled = true;
            textBox1.BackColor = Color.White;
            textBox1.ForeColor = Color.Black;
            textBox1.Enabled = false;
            label1.ForeColor = Color.Black;
            label2.ForeColor = Color.Black;
            label3.ForeColor = Color.Black;
            dataGridView1.BackgroundColor = Color.White;
            dataGridView1.ForeColor = Color.Black;
            dataGridView1.DefaultCellStyle.BackColor = Color.White;
            dataGridView2.BackgroundColor = Color.White;
            dataGridView2.ForeColor = Color.Black;
            dataGridView2.DefaultCellStyle.BackColor = Color.White;
            menuStrip1.BackColor = Color.White;
            menuStrip1.ForeColor = Color.Black;
        }

        private void sintactico() {
            try
            {
                int tokens = dataGridView1.Rows.Count - 1;
                int posicion = 0;
                string token = "";
                int fila = 0;
                int nuevafila = 0;
                string cadena = "";
                //Escritura del archivo de texto
                string path = @"code.txt";
                if (!File.Exists(path))
                {

                    // Si no existe crea el archivo
                    using (StreamWriter sw = File.CreateText(path))
                    {
                        //Guardo la primera posicion de mi lectura
                        try { fila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString()); } catch { }
                      
                        //Guardo tambien la nueva fila con el mismo valor
                        nuevafila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());
                        while (tokens > 0)
                        {
                            //Guardo el valor del token
                            token = "" + dataGridView1.Rows[posicion].Cells[0].Value;

                            //Verifico si la fila actual es igual a la nueva fila
                            if (fila == nuevafila)
                            {
                                //Si son las mismas guardo la cadena mas el token
                                cadena = cadena + token;
                            }
                            else
                            {
                                //Si no son iguales escribo en el archivo y guardo el nuevo token en la cadena
                                cadena = string.Concat(cadena.Where(c => !char.IsWhiteSpace(c)));
                                sw.WriteLine(cadena);
                                cadena = token;
                            }
                            //Ahora mi fila antigua guarda el valor de la nueva fila
                            fila = nuevafila;
                            //Aumento la posicion
                            posicion += 1;
                            //Le digo que ya utiliza un token y que debe disminuir uno de ellos
                            tokens -= 1;
                            //Inicio el nuevo valor de la fila
                            if (tokens > 0)
                            {
                                nuevafila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());
                            }
                            else
                            {
                                cadena = string.Concat(cadena.Where(c => !char.IsWhiteSpace(c)));
                                sw.WriteLine(cadena);
                            }


                        }

                    }
                    analizar();
                }
                else
                {
                    File.Delete(@"code.txt");
                    using (StreamWriter sw = File.CreateText(path))
                    {
                        //Guardo la primera posicion de mi lectura
                        try { fila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString()); } catch { }
                       
                        //Guardo tambien la nueva fila con el mismo valor
                        nuevafila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());
                        while (tokens > 0)
                        {
                            //Guardo el valor del token
                            token = "" + dataGridView1.Rows[posicion].Cells[0].Value;

                            //Verifico si la fila actual es igual a la nueva fila
                            if (fila == nuevafila)
                            {
                                //Si son las mismas guardo la cadena mas el token
                                cadena = cadena + token;

                            }
                            else
                            {
                                //Si no son iguales escribo en el archivo y guardo el nuevo token en la cadena
                                cadena = string.Concat(cadena.Where(c => !char.IsWhiteSpace(c)));
                                sw.WriteLine(cadena);
                                cadena = token;
                            }
                            //Ahora mi fila antigua guarda el valor de la nueva fila
                            fila = nuevafila;
                            //Aumento la posicion
                            posicion += 1;
                            //Le digo que ya utiliza un token y que debe disminuir uno de ellos
                            tokens -= 1;
                            //Inicio el nuevo valor de la fila
                            if (tokens > 0)
                            {
                                nuevafila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());

                            }
                            else
                            {
                                cadena = string.Concat(cadena.Where(c => !char.IsWhiteSpace(c)));
                                sw.WriteLine(cadena);
                            }


                        }

                    }
                    analizar();
                }
            }
            catch { MessageBox.Show("Aslgo ha sucedido"); }
           

          

            //Guardo la posicion de la fila
            //Si la fila es diferente termino de guardar en esa linea y asino la proxima linea
            //Vuelvo al while

        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            especiales.Clear();
            error = 0;
            si = false; sino = false; cambiar = false; mientras = false; para = false; caso = false; hacer = false; inicios = false; fines = false; //Verifica si estan activos los especiales
            tsi = 0; tsino = 0; tcambiar = 0; tmientras = 0; tpara = 0; tcaso = 0; thacer = 0; ecadena = 0;
            sintactico();
        }

        private void analizar() {
            int linea=0;
            dataGridView2.Rows.Clear();
            string path = @"code.txt";
            string cadena = "";
            if (!File.Exists(path))
            {
                //Si no existe
            }
            else {
                using (StreamReader ReaderObject = new StreamReader(path))
                {
                    while ((cadena = ReaderObject.ReadLine()) != null)
                    {
                        linea += 1;
                        //MessageBox.Show(cadena);
                        //Nuevo codigo
                        //Inicio
                        if (cadena.StartsWith("<inicio>"))
                        {
                            if (cadena.Equals("<inicio><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Inicio",linea);inicios = true; Sintactico.Enqueue("<inicio>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Se esperaba un fin de linea", linea); error = 1; break; }
                            }
                        }
                        if (inicios == true) { } else { dataGridView2.Rows.Add("Error", "Se debe iniciar"); error = 1;inicios = true; break; }





                        if (cadena.StartsWith("<ventero>"))
                        {
                            string pruebasintaxis="";
                            //Aqui encolamos
                            Queue entero = new Queue();
                            string[] varentero = cadena.Split('<');
                            foreach (var ve in varentero) {
                                entero.Enqueue(ve);
                                MessageBox.Show(ve);
                            }

                            string daux1 = (string)entero.Dequeue();//Recibimos el espacio en blanco
                            daux1 = (string)entero.Dequeue();// Recibimos entero pero ya no lo necesitamos
                            daux1 = (string)entero.Dequeue();// Recibimos el segundo dato
                            pruebasintaxis += daux1;//A;adimos a la cadena el identficador
                            if (daux1 == "ide>") // Verificamos si es un identificador
                            {
                                daux1 = (string)entero.Dequeue();// Recibimos el tercer dato
                                pruebasintaxis += daux1; //A;adirmos a la cadena el fin de linea o el igual
                                if (daux1 == "finlinea>") // Verificamos si es un fin de linea o un signo igual
                                {
                                    dataGridView2.Rows.Add("Correcto", "Estructura Entero", linea, indice); Sintactico.Enqueue("<ventero>");
                                }
                                else if (daux1=="igual>") {
                                    int primeravez = 0;
                                    bool factor = false, operador = false, pariz = false,parder=false ;
                                    while (entero.Count > 0)
                                    {
                                        string daux2 = (string)entero.Dequeue();
                                        pruebasintaxis += daux2; // a;adimos a la cadena el factor u operador
                                        //Verificamos si es un identifcador, un num entero o un operador
                                        if (daux2 == "ide>")
                                        {
                                            //Se verifica si es la primera vez
                                            if (primeravez == 0)
                                            {
                                                factor = true; //Si es primer avez se activa el factor para esperar un operador
                                                primeravez = 1; //Se activa primera vez
                                            }
                                            else
                                            {
                                                if (parder == true) { dataGridView2.Rows.Add("Error", "No se puede colocar despues de parder", linea); error = 1; break; } else {
                                                    if (factor == true)
                                                    { //Si no es primera vez, verifico si esta activo el factor y doy error
                                                        dataGridView2.Rows.Add("Error", "Se espera un operador", linea); error = 1; break;
                                                    }
                                                    else if (operador == true)
                                                    {
                                                        factor = true;
                                                        operador = false;
                                                    }
                                                }



                                            }
                                        }
                                        else if (daux2 == "nentero>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                factor = true; //Si es primer avez se activa el factor para esperar un operador
                                                primeravez = 1;//Se activa primera vez
                                            }
                                            else
                                            {
                                                if (parder == true) { dataGridView2.Rows.Add("Error", "No se puede colocar despues de parder", linea); error = 1; break; }
                                                else
                                                {
                                                    if (factor == true)
                                                    { //Si no es primera vez, verifico si esta activo el factor y doy error
                                                        dataGridView2.Rows.Add("Error", "Se espera un operador", linea); error = 1; break;
                                                    }
                                                    else if (operador == true)
                                                    {
                                                        factor = true;
                                                        operador = false;
                                                    }
                                                }

                                            }
                                        } else if (daux2 == "parentesisa>") {
                                            pariz = true;
                                        }
                                        else if (daux2 == "parentesisc>")
                                        {
                                            if (pariz == true) {
                                                parder = true;
                                                pariz = false;
                                            } else {
                                                dataGridView2.Rows.Add("Error", "Se espera una apertura", linea); error = 1; break;
                                            }
                                        }
                                        else if (daux2 == "operador>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                dataGridView2.Rows.Add("Error", "Se espera un numero o identificador", linea); error = 1; break;
                                            }
                                            else
                                            {
                                                if (parder == true)
                                                {
                                                    parder = false;
                                                    if (operador == true)
                                                    {
                                                        dataGridView2.Rows.Add("Error", "No puede colocar dos operadores juntos", linea); error = 1; break;
                                                    }
                                                    else if (factor == true)
                                                    {
                                                        factor = false;
                                                        operador = true;
                                                    }
                                                }


                                            }
                                        }
                                        else if (daux2 == "finlinea>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                dataGridView2.Rows.Add("Error", "No se puede cerrar despues de una igualdad", linea); error = 1; break;
                                            }
                                            else if (operador == true)
                                            {
                                                dataGridView2.Rows.Add("Error", "No se puede cerrar despues de un operador", linea); error = 1; break;
                                            }
                                            else if (factor == true)
                                            {
                                                dataGridView2.Rows.Add("Correcto", "Estructura Entero", linea, indice); Sintactico.Enqueue("<ventero>");
                                                Sintactico.Enqueue("<ventero>");
                                                break;
                                            }
                                        }
                                        else {
                                            dataGridView2.Rows.Add("Error", "Dato desconocido", linea); error = 1; break;
                                        }

                                    }

                                }
                            }
                            else {
                                 dataGridView2.Rows.Add("Error", "Ventero Se esperaba un identificador", linea); error = 1; break; 
                            }

                            if (error == 1)
                            {
                                MessageBox.Show("Hay un error en la sintaxis de entero");
                                break;
                            }

                        }


                        //Cadena
                         if (cadena.StartsWith("<cadena>"))
                        {
                            string pruebasintaxis = "";
                            //Aqui encolamos
                            Queue entero = new Queue();
                            string[] varentero = cadena.Split('<');
                            foreach (var ve in varentero)
                            {
                                entero.Enqueue(ve);
                                MessageBox.Show(ve);
                            }

                            string daux1 = (string)entero.Dequeue();//Recibimos el espacio en blanco
                            daux1 = (string)entero.Dequeue();// Recibimos entero pero ya no lo necesitamos
                            daux1 = (string)entero.Dequeue();// Recibimos el segundo dato
                            pruebasintaxis += daux1;//A;adimos a la cadena el identficador
                            if (daux1 == "ide>") // Verificamos si es un identificador
                            {
                                daux1 = (string)entero.Dequeue();// Recibimos el tercer dato
                                pruebasintaxis += daux1; //A;adirmos a la cadena el fin de linea o el igual
                                if (daux1 == "finlinea>") // Verificamos si es un fin de linea o un signo igual
                                {
                                    dataGridView2.Rows.Add("Correcto", "Estructura Entero", linea, indice); Sintactico.Enqueue("<ventero>");
                                }
                                else if (daux1 == "igual>")
                                {
                                    int primeravez = 0;
                                    bool factor = false, operador = false, pariz = false, parder = false;
                                    while (entero.Count > 0)
                                    {
                                        string daux2 = (string)entero.Dequeue();
                                        pruebasintaxis += daux2; // a;adimos a la cadena el factor u operador
                                        //Verificamos si es un identifcador, un num entero o un operador
                                        if (daux2 == "ide>")
                                        {
                                            //Se verifica si es la primera vez
                                            if (primeravez == 0)
                                            {
                                                factor = true; //Si es primer avez se activa el factor para esperar un operador
                                                primeravez = 1; //Se activa primera vez
                                            }
                                            else
                                            {
                                                if (parder == true) { dataGridView2.Rows.Add("Error", "No se puede colocar despues de parder", linea); error = 1; break; }
                                                else
                                                {
                                                    if (factor == true)
                                                    { //Si no es primera vez, verifico si esta activo el factor y doy error
                                                        dataGridView2.Rows.Add("Error", "Se espera un operador", linea); error = 1; break;
                                                    }
                                                    else if (operador == true)
                                                    {
                                                        factor = true;
                                                        operador = false;
                                                    }
                                                }



                                            }
                                        }
                                        else if (daux2 == "nentero>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                factor = true; //Si es primer avez se activa el factor para esperar un operador
                                                primeravez = 1;//Se activa primera vez
                                            }
                                            else
                                            {
                                                if (parder == true) { dataGridView2.Rows.Add("Error", "No se puede colocar despues de parder", linea); error = 1; break; }
                                                else
                                                {
                                                    if (factor == true)
                                                    { //Si no es primera vez, verifico si esta activo el factor y doy error
                                                        dataGridView2.Rows.Add("Error", "Se espera un operador", linea); error = 1; break;
                                                    }
                                                    else if (operador == true)
                                                    {
                                                        factor = true;
                                                        operador = false;
                                                    }
                                                }

                                            }
                                        }
                                        else if (daux2 == "parentesisa>")
                                        {
                                            pariz = true;
                                        }
                                        else if (daux2 == "parentesisc>")
                                        {
                                            if (pariz == true)
                                            {
                                                parder = true;
                                                pariz = false;
                                            }
                                            else
                                            {
                                                dataGridView2.Rows.Add("Error", "Se espera una apertura", linea); error = 1; break;
                                            }
                                        }
                                        else if (daux2 == "operador>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                dataGridView2.Rows.Add("Error", "Se espera un numero o identificador", linea); error = 1; break;
                                            }
                                            else
                                            {
                                                if (parder == true)
                                                {
                                                    parder = false;
                                                    if (operador == true)
                                                    {
                                                        dataGridView2.Rows.Add("Error", "No puede colocar dos operadores juntos", linea); error = 1; break;
                                                    }
                                                    else if (factor == true)
                                                    {
                                                        factor = false;
                                                        operador = true;
                                                    }
                                                }


                                            }
                                        }
                                        else if (daux2 == "finlinea>")
                                        {
                                            if (primeravez == 0)
                                            {
                                                dataGridView2.Rows.Add("Error", "No se puede cerrar despues de una igualdad", linea); error = 1; break;
                                            }
                                            else if (operador == true)
                                            {
                                                dataGridView2.Rows.Add("Error", "No se puede cerrar despues de un operador", linea); error = 1; break;
                                            }
                                            else if (factor == true)
                                            {
                                                dataGridView2.Rows.Add("Correcto", "Estructura Entero", linea, indice); Sintactico.Enqueue("<ventero>");
                                                Sintactico.Enqueue("<ventero>");
                                                break;
                                            }
                                        }
                                        else
                                        {
                                            dataGridView2.Rows.Add("Error", "Dato desconocido", linea); error = 1; break;
                                        }

                                    }

                                }
                            }
                            else
                            {
                                dataGridView2.Rows.Add("Error", "Ventero Se esperaba un identificador", linea); error = 1; break;
                            }

                            if (error == 1)
                            {
                                MessageBox.Show("Hay un error en la sintaxis de entero");
                                break;
                            }

                        }


                        //Duplo
                        if (cadena.StartsWith("<duplo>"))
                        {
                            if (cadena.Equals("<duplo><ide><finlinea>") || cadena.Equals("<duplo><ide><igual><decimal><finlinealinea>") || cadena.Equals("<duplo><ide><igual><nentero><finlinealinea>") || cadena.Equals("<duplo><ide><igual><nentero><operador><nentero><finlinea>") || cadena.Equals("<duplo><ide><igual><ide><operador><ide><finlinea>") || cadena.Equals("<duplo><ide><igual><decimal><finlinea>") || cadena.Equals("<duplo><ide><igual><ide><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura correcta en la linea", linea,indice); Sintactico.Enqueue("<duplo>"); }
                            else
                            {
                                error = 1;
                                if (cadena.StartsWith("<duplo><ide><igual>"))
                                {
                                    if (!cadena.Contains("<duplo>")) { dataGridView2.Rows.Add("Error", "Duplo Se esperaba un valor", linea); error = 0; break; }
                                    if (!cadena.Contains("<finliena>")) { dataGridView2.Rows.Add("Error", "Duplo Se esperaba fin de linea", linea); error = 0; break; }
                                }
                                else
                                {
                                    if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "Duplo Se esperaba un identificador", linea); error = 0; break; }
                                    if (!cadena.Contains("<igual>")) { dataGridView2.Rows.Add("Error", "DuploSe esperaba un igual", linea); error = 0; }
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "DuploSe esperaba fin de linea", linea); error = 0; break; }
                                }
                                if (error == 1) { dataGridView2.Rows.Add("Error", "Duplo Analisis detenido, se han especificado demasiados valores", linea); break; }
                            }
                        }

                        //Booleano
                        if (cadena.StartsWith("<boleano>"))
                        {
                            if (cadena.Equals("<boleano><ide><igual><verdadero><finlinea>") || cadena.Equals("<boleano><ide><igual><falso><finlinea>") || cadena.Equals("<boleano><ide><igual><nentero><finlinea>")|| cadena.Equals("<boleano><ide><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Booleana", linea,indice); Sintactico.Enqueue("<boleano>"); }
                            else
                            {
                                error = 1;
                                if (cadena.StartsWith("<bolneado><ide><igual>"))
                                {
                                    if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaban un identificador", linea); error = 0; break; }
                                    if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba un identificador", linea); error = 0; break; }
                                        if (!cadena.Contains("<nentero>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba un valor", linea); error = 0; break; }
                                    if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba fin de linea", linea); error = 0; break; }
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba un operador", linea); error = 0; break; }
                                }
                                else
                                {
                                    if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba un identificador", linea); error = 0; break; }
                                    if (!cadena.Contains("<igual>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba signo igual", linea); error = 0; break; }
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Boleano Se esperaba fin de linea", linea); error = 0; break; }
                                }
                                if (error == 1) { dataGridView2.Rows.Add("Error", "Boleano Analisis detenido, se han especificado demasiados valores", linea); break; }
                            }
                        }




                        //Identificador


                        if (cadena.StartsWith("<ide>"))
                        {
                            if (cadena.Equals("<ide><igual><nentero><finlinea>") 
                                || cadena.Equals("<ide><igual><verdadero><finlinea>") 
                                || cadena.Equals("<ide><igual><falso><finlinea>") 
                                || cadena.Equals("<ide><igual><decimal><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Correcta", linea,indice); Sintactico.Enqueue("<ide>"); }
                            else
                            {
                                error = 1;
                                if (cadena.StartsWith("<ide><igual>"))
                                {
                                    if (!cadena.Contains("<ide>")||!cadena.Contains("<nentero>")) { dataGridView2.Rows.Add("Error", "Ide Se esperaban un valor", linea); error = 0; break; }
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Ide Se esperaba un operador", linea); error = 0; break; }
                                }
                                else
                                {
                                    if (!cadena.Contains("<igual>")) { dataGridView2.Rows.Add("Error", "Ide Se esperaba signo igual", linea); error = 0; break; }
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Ide Se esperaba fin de linea", linea); error = 0; break; }
                                }
                                if (error == 1) { dataGridView2.Rows.Add("Error", "Ide Analisis detenido, se han especificado demasiados valores", linea); break; }
                            }
                        }

                        //Si


                        if (cadena.StartsWith("<si>"))
                        {
                            if (cadena.Equals("<si><parentesisa><ide><comparador><ide><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><ide><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><nentero><comparador><nentero><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><nentero><comparador><ide><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><nentero><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><decimal><comparador><decimal><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><decimal><comparador><ide><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><decimal><parentesisc><iinstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><ide><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><nentero><comparador><nentero><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><nentero><comparador><ide><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><nentero><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><decimal><comparador><decimal><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><decimal><comparador><ide><parentesisc><iinstrucciones><finstrucciones>")
                                || cadena.Equals("<si><parentesisa><ide><comparador><decimal><parentesisc><iinstrucciones><finstrucciones>"))
                            {
                                if (cadena.EndsWith("<finstrucciones>")) {  dataGridView2.Rows.Add("Correcto", "Estructura Si", linea,indice); indice += 1; Sintactico.Enqueue("<si>"); } else { dataGridView2.Rows.Add("Correcto", "Estructura Si", linea,indice); especiales.Push("<si>"); tsi += 1; si = true; indice += 1; }
                            }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "SI Debe abrir parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "SI Debe cerrar parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "SI Se esperaba un identificador", linea); error = 1; break; }
                                if (!cadena.Contains("<igualdad>")) { dataGridView2.Rows.Add("Error", "SI Se esperaba una igualdad", linea); error = 1; break; }
                                if (!cadena.Contains("<igual")) { dataGridView2.Rows.Add("Error", "SI se esperaba un signo igual", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "SI Debe cerrar el parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<iinstrucciones>")) { dataGridView2.Rows.Add("Error", "SI Debe iniciar las instrucciones", linea); error = 1; break; }
                                if (!cadena.Contains("<finstrucciones>")) { dataGridView2.Rows.Add("Error", "SI Debe finalizar las instrucciones", linea); error = 1; break; }
                                if (error == 0) { dataGridView2.Rows.Add("Error", "SI Se han especificado demasiados valores", linea); break; }
                            }
                        }
                        


                        //SINO
                        if (cadena.StartsWith("<sino>"))
                        {
                            if (cadena.Equals("<sino><iinstrucciones>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Sino", linea,indice); especiales.Push("<sino>"); tsino += 1; sino = true; Sintactico.Enqueue("<sino>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<iinstrucciones>")) {dataGridView2.Rows.Add("Error", "SINO Se esperaba que iniciara las instrucciones", linea); error = 1; break; }
                            }
                        }

                            //While

                            if (cadena.StartsWith("<mientras>"))
                            {

                                if (cadena.Equals("<mientras><parentesisa><ide><comparador><ide><parentesisc><iinstrucciones>") || cadena.Equals("<mientras><parentesisa><ide><comparador><nentero><parentesisc><iinstrucciones>") || cadena.Equals("<mientras><parentesisa><nentero><comparador><ide><parentesisc><iinstrucciones>"))
                                { dataGridView2.Rows.Add("Correcto", "Estructura Mientras", linea,indice); indice += 1; especiales.Push("<mientras>"); tmientras += 1;mientras = true; Sintactico.Enqueue("<mientras>"); }
                                else
                                {
                                    error = 0;
                                    if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "Mientras Debe abrir parentesis", linea); error = 1; break; }
                                    if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "Mientras Debe cerrar parentesis", linea); error = 1; break; }
                                    if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "Mientras Se esperaba un identificador", linea); error = 1; break; }
                                    if (!cadena.Contains("<igual>")) { dataGridView2.Rows.Add("Error", "Mientras Se esperaba una igualdad", linea); error = 1; break; }
                                    if (error == 0) { dataGridView2.Rows.Add("Error", "Mientras Se han especificado demasiados valores", linea); break; }
                                }
                            }

                        //Mensaje
                        if (cadena.StartsWith("<mensaje>"))
                        {

                            if (cadena.Equals("<mensaje><parentesisa><ide><parentesisc><finlinea>") 
                                || cadena.Equals("<mensaje><parentesisa><nentero><parentesisc><finlinea>") 
                                || cadena.Equals("<mensaje><parentesisa><decimal><parentesisc><finlinea>")
                                || cadena.Equals("<mensaje><parentesisa><comilla><ide><comilla><parentesisc><finlinea>")
                                || cadena.Equals("<mensaje><parentesisa><comilla><ide><comilla><coma><ide><parentesisc><finlinea>")
                                || cadena.Equals("<mensaje><parentesisa><comilla><ide><comilla><coma><nentero><parentesisc><finlinea>")
                                || cadena.Equals("<mensaje><parentesisa><comilla><ide><comilla><coma><decimal><parentesisc><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Mensaje", linea,indice); Sintactico.Enqueue("<mensaje>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "Mensaje Debe abrir parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "Mensaje Debe cerrar parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "Mensaje Falta cierre de linea", linea); error = 1; break; }
                                if (error == 0) { dataGridView2.Rows.Add("Error", "Mensaje Se han especificado demasiados valores", linea); break; }
                            }
                        }

                        //Do While

                        //For
                        if (cadena.StartsWith("<para>"))
                        {
                            if (cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><ide><comparador><ide><finlinea><ide><aumentador><parentesisc><iinstrucciones>")||
                            cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><ide><comparador><nentero><finlinea><ide><aumentador><parentesisc><iinstrucciones>")||
                            cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><nentero><comparador><ide><finlinea><ide><aumentador><parentesisc><iinstrucciones>")||/*Comienza nuevo*/
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><ide><comparador><ide><finlinea><ide><aumentador><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><ide><comparador><nentero><finlinea><ide><aumentador><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><nentero><comparador><ide><finlinea><ide><aumentador><parentesisc><iinstrucciones>")||
                            cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><ide><comparador><ide><finlinea><ide><reductor><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><ide><comparador><nentero><finlinea><ide><reductor><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ventero><ide><igual><nentero><finlinea><nentero><comparador><ide><finlinea><ide><reductor><parentesisc><iinstrucciones>") ||/*Comienza nuevo*/
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><ide><comparador><ide><finlinea><ide><reductor><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><ide><comparador><nentero><finlinea><ide><reductor><parentesisc><iinstrucciones>") ||
                            cadena.Equals("<para><parentesisa><ide><igual><nentero><finlinea><nentero><comparador><ide><finlinea><ide><reductor><parentesisc><iinstrucciones>"))
                            {dataGridView2.Rows.Add("Correcto", "Estructura Para", linea,indice); indice += 1; especiales.Push("<para>");tpara += 1;para = true; Sintactico.Enqueue("<para>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<aumentador>")||!cadena.Contains("<reductor>")) { dataGridView2.Rows.Add("Error", "Para Falta ++ o --", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "Para Debe cerrar el parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<ide><comparador><ide>")|| !cadena.Contains("<ide><comparador><nentero>") || !cadena.Contains("<nentero><comparador><ide>")) { dataGridView2.Rows.Add("Error", "Para Falta o no se ha declaro un comparador", linea); error = 1; break; }
                                if (!cadena.Contains("<entero><ide><igual><nentero>") || !cadena.Contains("<ide><igual><nentero>")) { dataGridView2.Rows.Add("Error", "Para No se ha inicializado para", linea); error = 1; break; }
                                if (error == 0) { dataGridView2.Rows.Add("Error", "Para Se han especificado demasiados valores", linea); break; }
                            }
                        }


                        //Switch
                        if (cadena.StartsWith("<cambio>"))
                        {
                            if (cadena.Equals("<cambio><parentesisa><ide><parentesisc><iinstrucciones>"))
                            {dataGridView2.Rows.Add("Correcto", "Estructura Cambiar", linea,indice); indice += 1; especiales.Push("<cambio>");tcambiar += 1;cambiar = true; Sintactico.Enqueue("<cambio>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<parentesisa>")) { dataGridView2.Rows.Add("Error", "Cambio Debe abrir parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<ide>")) { dataGridView2.Rows.Add("Error", "Cambio Se esperaba un identificador", linea); error = 1; break; }
                                if (!cadena.Contains("<parentesisc>")) { dataGridView2.Rows.Add("Error", "Cambio Debe cerrar el parentesis", linea); error = 1; break; }
                                if (!cadena.Contains("<iinstrucciones>")) { dataGridView2.Rows.Add("Error", "Cambio Debe iniciar las instrucciones", linea); error = 1; break; }
                                if (error == 0) { dataGridView2.Rows.Add("Error", "Cambio Se han especificado demasiados valores", linea); break; }
                            }
                        }

                        //Inicio y final
                       
                        //Final
                        if (cadena.StartsWith("<fin>"))
                        {
                            if (cadena.Equals("<fin><finlinea>"))
                            { dataGridView2.Rows.Add("Correcto", "Estructura Fin", linea,indice); fines = true; Sintactico.Enqueue("<fin>"); }
                            else
                            {
                                error = 0;
                                if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Se esperaba un fin de linea", linea); error = 1; break; }
                            }
                        }

                        //Case
                        if (cadena.StartsWith("<caso>"))
                        {
                            error = 0;
                            if (cadena.Equals("<caso><comilla><ide><comilla><dospuntos><iinstrucciones>") ||cadena.Equals("<caso><comilla><nentero><comilla><dospuntos><iinstrucciones>")||
                                cadena.Equals("<caso><comilla><ide><comilla><dospuntos><iinstrucciones><desc><finlinea><finstrucciones>") || 
                                cadena.Equals("<caso><comilla><nentero><comilla><dospuntos><iinstrucciones><desc><finlinea><finstrucciones>")||
                                cadena.Equals("<caso><comilla><ide><comilla><dospuntos><iinstrucciones><desc><finlinea>") ||
                                cadena.Equals("<caso><comilla><nentero><comilla><dospuntos><iinstrucciones><desc><finlinea>"))
                            { if (cadena.Equals("<caso><comilla><ide><comilla><dospuntos><iinstrucciones><desc><finlinea><finstrucciones>") || cadena.Equals("<caso><comilla><nentero><comilla><dospuntos><iinstrucciones><desc><finlinea><finstrucciones>"))
                                { } else { if (cambiar == true) { dataGridView2.Rows.Add("Correcto", "Estructura Caso", linea); indice += 1; especiales.Push("<caso>"); tcaso += 1; caso = true; } else { dataGridView2.Rows.Add("Error", "Antes debe haber una esctructura cambiar", linea); break; } }
                            }
                            else
                            {
                                if (cadena.Equals("<caso><comilla><Palabra><comilla><dospuntos><iinstrucciones><desc>") || cadena.Equals("<caso><comilla><nentero><comilla><dospuntos><iinstrucciones><desc>"))
                                {
                                    if (!cadena.Contains("<finlinea>")) { dataGridView2.Rows.Add("Error", "Caso Faltan fin linea", linea); error = 1; break; }
                                }
                                else {
                                    if (!cadena.Contains("<comilla>")) { dataGridView2.Rows.Add("Error", "Caso Faltan comillas", linea); error = 1; break; }
                                    if (!cadena.Contains("<ide>") || !cadena.Contains("<nentero>")) { dataGridView2.Rows.Add("Error", "Caso Se esperaba un valor", linea); error = 1; break; }
                                    if (!cadena.Contains("<dospuntos>")) { dataGridView2.Rows.Add("Error", "Caso Falta :", linea); error = 1; break; }
                                    if (!cadena.Contains("<iinstrucciones>")) { dataGridView2.Rows.Add("Error", "Caso Debe iniciar las instrucciones", linea); error = 1; break; }
                                }
                               
                                
                            }
                        }

                        //Cierre de instrucciones
                        if (cadena.Equals("<finstrucciones>"))
                        {
                            string espe="";
                            try {  espe = (string)especiales.Pop(); } catch { }
                            switch (espe) {
                                case "<cambio>": { indice -= 1; dataGridView2.Rows.Add("Correcto", " Cierre cambiar", linea);  tcambiar -= 1; if (tcambiar == 0) { cambiar = false; } break; }
                                case "<si>": { indice -= 1; dataGridView2.Rows.Add("Correcto", "Cierre si", linea); tsi -= 1; if (tsi == 0) { si = false; } break; }
                                case "<sino>": { dataGridView2.Rows.Add("Correcto", "Cierre sino", linea); tsino -= 1; if (tsino == 0) { sino = false; } break; }
                                case "<hacer>": { indice -= 1; dataGridView2.Rows.Add("Correcto", "Cierre hacer", linea); thacer -= 1; if (thacer == 0) { hacer = false; } break; }
                                case "<mientras>": { indice -= 1; dataGridView2.Rows.Add("Correcto", "Cierre mientras", linea); tmientras -= 1; if (tmientras == 0) { mientras = false; } break; }
                                case "<para>": { indice -= 1; dataGridView2.Rows.Add("Correcto", "Cierre para", linea); tpara -= 1; if (tpara == 0) { para = false; } break; }
                                case "<caso>": { indice -= 1; dataGridView2.Rows.Add("Correcto", "Cierre caso", linea); tcaso -= 1; if (tcaso == 0) { caso = false; } break; }
                                default: { dataGridView2.Rows.Add("Error", "Parentesis perdido", linea); error = 1; break; }
                            
                            }
                        }

                        //Si la cadena no se reconocio en el recorrido
                        if(ecadena==1) { dataGridView2.Rows.Add("Error", "Cadena no reconocida"); error = 1; }

                    }
                    if (tsi <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado ["+tsi+"] Condiciones"); error = 1;  }
                    if (tcaso <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + tcaso + "] Casos"); error = 1;  }
                    if (tpara <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + tpara + "] Para"); error = 1;  }
                    if (tsino <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + tsino + "] Sino"); error = 1; }
                    if (tcambiar <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + tcambiar + "] Cambiar"); error = 1;  }
                    if (tmientras <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + tmientras + "] Mientras"); error = 1;  }
                    if (thacer <= 0) { } else { dataGridView2.Rows.Add("Error", "No se han cerrado [" + thacer + "] Hacer"); error = 1;  }
                    if (fines==true) { } else { dataGridView2.Rows.Add("Error", "Se debe finalizar"); error = 1;fines = true;  }
                }
            }
                
        }
    }
}
