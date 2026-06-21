const fs = require("fs");
const express = require("express");

module.exports = (app, config) => {

  app.use(express.json());

  app.get("/", (req, res) => {

    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Mostrinho Dashboard</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,sans-serif;
}

body{
background:#0f172a;
color:white;
display:flex;
min-height:100vh;
}

.sidebar{
width:230px;
background:#020617;
padding:20px;
}

.sidebar h2{
margin-bottom:20px;
}

.sidebar a{
display:block;
padding:12px;
margin-bottom:8px;
text-decoration:none;
color:white;
background:#1e293b;
border-radius:10px;
}

.sidebar a:hover{
background:#334155;
}

.content{
flex:1;
padding:30px;
}

.card{
background:#1e293b;
padding:20px;
border-radius:15px;
max-width:700px;
}

label{
display:block;
margin-top:15px;
margin-bottom:5px;
}

input,
textarea{
width:100%;
padding:12px;
border:none;
border-radius:10px;
}

textarea{
height:150px;
resize:none;
}

button{
margin-top:15px;
padding:12px;
width:100%;
border:none;
border-radius:10px;
cursor:pointer;
font-size:16px;
}

.stats{
display:flex;
gap:10px;
margin-bottom:20px;
}

.stat{
background:#1e293b;
padding:15px;
border-radius:10px;
flex:1;
text-align:center;
}

</style>
</head>

<body>

<div class="sidebar">

<h2>🤖 Mostrinho</h2>

<a href="/">🏠 Dashboard</a>

</div>

<div class="content">

<div class="stats">
<div class="stat">
<h3>🤖 Bot</h3>
<p>Online</p>
</div>

<div class="stat">
<h3>👋 Welcome</h3>
<p>Ativo</p>
</div>
</div>

<div class="card">

<h1>Configurações</h1>

<label>Canal de boas-vindas</label>

<input
id="canal"
value="${config.canal || ""}"
>

<label>Mensagem de boas-vindas</label>

<textarea id="mensagem">${config.mensagem || ""}</textarea>

<button onclick="salvar()">
💾 Salvar Configurações
</button>

</div>

</div>

<script>

async function salvar(){

await fetch('/salvar',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
canal:document.getElementById('canal').value,
mensagem:document.getElementById('mensagem').value
})
});

alert('Configurações salvas!');

}

</script>

</body>
</html>
`);

  });

  app.post("/salvar", (req, res) => {

    config.canal = req.body.canal;
    config.mensagem = req.body.mensagem;

    fs.writeFileSync(
      "./config.json",
      JSON.stringify(config, null, 2)
    );

    res.json({
      sucesso: true
    });

  });

};
