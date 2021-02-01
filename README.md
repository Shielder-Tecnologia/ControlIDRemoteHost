#  Servidor em Node.Js utilizando Express

## Instale o Node.Js no sistema
Siga as orientações de instalação do seu sistema operacional.

## Instale o **Package**:
npm install na raiz da pasta, para instalar o package.json com todas dependências.

## Estabeleça o ambiente, ambiente sem ser cloud = development, cloud=production
$env:NODE_ENV="development" para windows powershell
set NODE_ENV=development para cmd

## Execução Rápida
npm run

## Execução com API Forever
npm run forever
forever faz com que a aplicação sempre esteja rodando, além de providenciar um gerenciamento melhor de logs.

## Erro Jenkins #1
Versão do java 
Solução 1:
In this xml file saw execution line how our service starts. In my case was wrong java version. Need to check if java have the same version in C:\Program Files\Java\ . Also in task manager can running Java Update Manager, that can update java version. I had java version jre1.8.0_191not jre1.8.0_171. I manually changed version in jenkins-slave.xml file and saved it. After that just restart service. Now should works fine

Solução 2: Trocar o nome da pasta
## Erro Jenkins #2
Erro Git
ERROR: Workspace has a .git repository, but it appears to be corrupt.

Solução: Reiniciar o Servidor.