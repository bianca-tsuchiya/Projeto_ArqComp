// não altere!
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');
const sql = require('mssql');

// não altere!
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// configure a linha abaixo caso queira que os dados capturados sejam inseridos no banco de dados.
// false -> nao insere
// true -> insere
const HABILITAR_OPERACAO_INSERIR = true;

// altere o valor da variável AMBIENTE para o valor desejado:
// API conectada ao banco de dados remoto, SQL Server -> 'producao'
// API conectada ao banco de dados local, MySQL Workbench - 'desenvolvimento'
const AMBIENTE = 'desenvolvimento';

const serial = async (
    valoresprocesso1,
    valoresprocesso2,
    valoresprocesso3,
    valoresprocesso4,
    valoresprocesso5,
    valoresprocesso6,
    valoresprocesso7,
    valoresprocesso8,
    valoresprocesso9,
    valoresprocesso10,
    valoresprocesso11,
    valoresprocesso12,
    valoresprocesso13,
    valoresprocesso14,
    valoresprocesso15,
) => {
    let poolBancoDados = ''

    if (AMBIENTE == 'desenvolvimento') {
        poolBancoDados = mysql.createPool(
            {
                // altere!
                // CREDENCIAIS DO BANCO LOCAL - MYSQL WORKBENCH
                host: 'localhost',
                user: 'aluno',
                password: 'sptech',
                database: 'ale'
            }
        ).promise();
    } else if (AMBIENTE == 'producao') {
        console.log('Projeto rodando inserindo dados em nuvem. Configure as credenciais abaixo.');
    } else {
        throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
    }


    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        //console.log(data);
        const valores = data.split(';');
        const processo1 = parseFloat(valores[0]);
        const processo2= parseFloat(valores[1]);
        const processo3 = parseFloat(valores[2]);
        const processo4 = parseFloat(valores[3]);
        const processo5 = parseInt(valores[4]);
        const processo6 = parseFloat(valores[5]);
        const processo7= parseFloat(valores[6]);
        const processo8 = parseFloat(valores[7]);
        const processo9 = parseFloat(valores[8]);
        const processo10 = parseInt(valores[9]);
        const processo11 = parseFloat(valores[10]);
        const processo12= parseFloat(valores[11]);
        const processo13 = parseFloat(valores[12]);
        const processo14= parseFloat(valores[13]);
        const processo15 = parseInt(valores[14]);
        
        valoresprocesso1.push(processo1);
        valoresprocesso2.push(processo2);
        valoresprocesso3.push(processo3);
        valoresprocesso4.push(processo4);
        valoresprocesso5.push(processo5);
        valoresprocesso6.push(processo6);
        valoresprocesso7.push(processo7);
        valoresprocesso8.push(processo8);
        valoresprocesso9.push(processo9);
        valoresprocesso10.push(processo10);
        valoresprocesso11.push(processo11);
        valoresprocesso12.push(processo12);
        valoresprocesso13.push(processo13);
        valoresprocesso14.push(processo14);
        valoresprocesso15.push(processo15);
 

        if (HABILITAR_OPERACAO_INSERIR) {
            if (AMBIENTE == 'producao') {
                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> Importante! você deve ter o aquario de id 1 cadastrado.
                sqlquery = `INSERT INTO medida (dht11_umidade, dht11_temperatura, luminosidade, lm35_temperatura, chave, momento, fk_aquario) VALUES (${dht11Umidade}, ${dht11Temperatura}, ${luminosidade}, ${lm35Temperatura}, ${chave}, CURRENT_TIMESTAMP, 1)`;

                // CREDENCIAIS DO BANCO REMOTO - SQL SERVER
                // Importante! você deve ter criado o usuário abaixo com os comandos presentes no arquivo
                // "script-criacao-usuario-sqlserver.sql", presente neste diretório.
                const connStr = "Server=servidor-acquatec.database.windows.net;Database=bd-acquatec;User Id=usuarioParaAPIArduino_datawriter;Password=#Gf_senhaParaAPI;";

                function inserirComando(conn, sqlquery) {
                    conn.query(sqlquery);
                    console.log("valores inseridos no banco: ", dht11Umidade + ", " + dht11Temperatura + ", " + luminosidade + ", " + lm35Temperatura + ", " + chave)
                }

                sql.connect(connStr)
                    .then(conn => inserirComando(conn, sqlquery))
                    .catch(err => console.log("erro! " + err));

            } else if (AMBIENTE == 'desenvolvimento') {

                // altere!
                // Este insert irá inserir os dados na tabela "medida"
                // -> altere nome da tabela e colunas se necessário
                // Este insert irá inserir dados de fk_aquario id=1 (fixo no comando do insert abaixo)
                // >> você deve ter o aquario de id 1 cadastrado.
                await poolBancoDados.execute(
                    'INSERT INTO tab_ale (data_hora, lavar, secar, secar2, secar3, moer, resfriamento, resfriamento2,resfriamento3, fermentacao,colidir, colidir2, colidir3, maturacao,pasterizacao,producao  ) VALUES (now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',
                    [processo1,processo2, processo3, processo4, processo5, processo6,processo7,processo8, processo9, processo10, processo11, processo12, processo13, processo14, processo15 ]
                );
                console.log("valores inseridos no banco: "+ processo1 + ", " + processo2 + ", " + processo3+ ", " +processo4+ ", " + processo4+ ", "+processo5 + ", " + processo6 + ", " + processo7+ ", " +processo8+ ", " + processo9+ ", "+processo10 + ", " + processo11 + ", " + processo13+ ", " +processo14+ ", " + processo15)

            } else {
                throw new Error('Ambiente não configurado. Verifique o arquivo "main.js" e tente novamente.');
            }
        }
    });
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}


// não altere!
const servidor = (
    valoresDht11Umidade,
    valoresDht11Temperatura,
    valoresLuminosidade,
    valoresLm35Temperatura,
    valoresChave
) => {
    const app = express();
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });
    app.get('/sensores/dht11/umidade', (_, response) => {
        return response.json(valoresDht11Umidade);
    });
    app.get('/sensores/dht11/temperatura', (_, response) => {
        return response.json(valoresDht11Temperatura);
    });
    app.get('/sensores/luminosidade', (_, response) => {
        return response.json(valoresLuminosidade);
    });
    app.get('/sensores/lm35/temperatura', (_, response) => {
        return response.json(valoresLm35Temperatura);
    });
    app.get('/sensores/chave', (_, response) => {
        return response.json(valoresChave);
    });
}

(async () => {
    const valoresprocesso1 = [];
    const valoresprocesso2 = [];
    const valoresprocesso3 = [];
    const valoresprocesso4 = [];
    const valoresprocesso5 = [];
    const valoresprocesso6 = [];
    const valoresprocesso7 = [];
    const valoresprocesso8 = [];
    const valoresprocesso9 = [];
    const valoresprocesso10 = [];
    const valoresprocesso11= [];
    const valoresprocesso12= [];
    const valoresprocesso13= [];
    const valoresprocesso14= [];
    const valoresprocesso15= [];
    await serial(
        valoresprocesso1 ,
        valoresprocesso2 ,
        valoresprocesso3 ,
        valoresprocesso4 ,
        valoresprocesso5 ,
        valoresprocesso6 ,
        valoresprocesso7 ,
        valoresprocesso8 ,
        valoresprocesso9 ,
        valoresprocesso10,
        valoresprocesso11,
        valoresprocesso12,
        valoresprocesso13,
        valoresprocesso14,
        valoresprocesso15,
    );
    servidor(
        valoresprocesso1 ,
        valoresprocesso2 ,
        valoresprocesso3 ,
        valoresprocesso4 ,
        valoresprocesso5 ,
        valoresprocesso6 ,
        valoresprocesso7 ,
        valoresprocesso8 ,
        valoresprocesso9 ,
        valoresprocesso10,
        valoresprocesso11,
        valoresprocesso12,
        valoresprocesso13,
        valoresprocesso14,
        valoresprocesso15
    );
})();
