# assets/

Coloque aqui sua foto de perfil (ex.: `photo.jpg`).

Depois, em `js/app.js`, defina:

```js
photoUrl: 'assets/photo.jpg',
```

Se `photoUrl` ficar vazio, o site usa automaticamente o avatar do seu GitHub
(`https://github.com/<usuario>.png`). Se o arquivo apontado não existir, o
componente também cai de volta para o avatar do GitHub — não quebra o layout.
