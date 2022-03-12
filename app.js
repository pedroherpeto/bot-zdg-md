const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const http = require('http');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});

client.initialize();

client.on('qr', (qr) => {
    console.log('zapdasgalaxias.com.br BOT-ZDG QRCode recebido', qr);
});

client.on('authenticated', () => {
    console.log('zapdasgalaxias.com.br BOT-ZDG Autenticado');
});

client.on('auth_failure', msg => {
    console.error('zapdasgalaxias.com.br BOT-ZDG Falha na autenticação', msg);
});

client.on('ready', () => {
    console.log('zapdasgalaxias.com.br BOT-ZDG Dispositivo pronto');
});

client.on('change_state', state => {
    console.log('zapdasgalaxias.com.br BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('zapdasgalaxias.com.br BOT-ZDG Cliente desconectado', reason);
});

app.post('/send-message', [
    body('number').notEmpty(),
    body('message').notEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(({
      msg
    }) => {
      return msg;
    });
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped()
      });
    }
  
    const number = req.body.number;
    const numberDDD = number.substr(0, 2);
    const numberUser = number.substr(-8, 8);
    const message = req.body.message;

    if (numberDDD <= 30) {
      const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
      res.status(200).json({
        status: true,
        message: 'BOT-ZDG Mensagem enviada',
        response: response
      });
      }).catch(err => {
      res.status(500).json({
        status: false,
        message: 'BOT-ZDG Mensagem não enviada',
        response: err.text
      });
      });
    }
    else if (numberDDD > 30) {
      const numberZDG = "55" + numberDDD + numberUser + "@c.us";
      client.sendMessage(numberZDG, message).then(response => {
      res.status(200).json({
        status: true,
        message: 'BOT-ZDG Mensagem enviada',
        response: response
      });
      }).catch(err => {
      res.status(500).json({
        status: false,
        message: 'BOT-ZDG Mensagem não enviada',
        response: err.text
      });
      });
    }
  });

server.listen(port, function() {
    console.log('Aplicação ZDG rodando na porta *: ' + port);
  });
