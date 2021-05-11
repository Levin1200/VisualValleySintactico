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
            dataGridView2.ForeColor = Color.DodgerBlue;
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
            int tokens = dataGridView1.Rows.Count-1;
            int posicion = 0;
            string token = "";
            int fila=0;
            int nuevafila = 0;
            string cadena = "";
            //Escritura del archivo de texto
            string path = @"code.txt";
            if (!File.Exists(path))
            {
               
                // Si no existe crea el archivo
                MessageBox.Show("Antes del error");
                using (StreamWriter sw = File.CreateText(path))
                {
                    //Guardo la primera posicion de mi lectura
                    fila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());
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
            }
            else {
                File.Delete(@"code.txt");
                using (StreamWriter sw = File.CreateText(path))
                {
                    //Guardo la primera posicion de mi lectura
                    fila = int.Parse(dataGridView1.Rows[posicion].Cells[2].Value.ToString());
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
                            MessageBox.Show(cadena);
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
                        else {
                            cadena = string.Concat(cadena.Where(c => !char.IsWhiteSpace(c)));
                            sw.WriteLine(cadena);
                        }


                    }

                }
            }

          

            //Guardo la posicion de la fila
            //Si la fila es diferente termino de guardar en esa linea y asino la proxima linea
            //Vuelvo al while

        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            sintactico();
        }

        private void crear() {
            

            /*
            using (StreamReader sr = File.OpenText(path))
            {
                string s = "";
                while ((s = sr.ReadLine()) != null)
                {
                    Console.WriteLine(s);
                }
            }
            */
        }
    }
}
